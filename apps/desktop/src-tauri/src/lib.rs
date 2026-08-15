use std::net::TcpStream;
use std::process::Child;
#[cfg(not(debug_assertions))]
use std::process::Command;
use std::sync::Mutex;
use std::thread;
use std::time::Duration;

use tauri::{AppHandle, Manager, RunEvent, WebviewWindow};
#[cfg(not(debug_assertions))]
use tauri_plugin_updater::UpdaterExt;

const WEB_URL: &str = "http://127.0.0.1:3080";
#[cfg(not(debug_assertions))]
const UPDATE_CHECK_DELAY: Duration = Duration::from_secs(30);
#[cfg(not(debug_assertions))]
const UPDATE_CHECK_INTERVAL: Duration = Duration::from_secs(6 * 60 * 60);

struct HostProcess(Mutex<Option<Child>>);

#[cfg(not(debug_assertions))]
fn spawn_host() -> Result<Child, String> {
    let executable = std::env::var_os("DSH_DESKTOP_DSH").unwrap_or_else(|| "dsh".into());
    Command::new(executable)
        .args(["web", "--host", "127.0.0.1", "--port", "3080"])
        .spawn()
        .map_err(|error| format!("failed to start dsh web host: {error}"))
}

fn wait_for_host(window: WebviewWindow) {
    thread::spawn(move || {
        for _ in 0..120 {
            if TcpStream::connect("127.0.0.1:3080").is_ok() {
                let _ = window.navigate(WEB_URL.parse().expect("WEB_URL is a valid URL"));
                return;
            }
            thread::sleep(Duration::from_millis(250));
        }
        eprintln!("dsh desktop: web host did not become ready at {WEB_URL}");
    });
}

fn close_host(app: &AppHandle) {
    if let Some(state) = app.try_state::<HostProcess>() {
        if let Ok(mut process) = state.0.lock() {
            if let Some(mut child) = process.take() {
                let _ = child.kill();
                let _ = child.wait();
            }
        }
    }
}

#[cfg(not(debug_assertions))]
async fn check_and_install_update(app: AppHandle) -> Result<(), String> {
    let updater = app
        .updater()
        .map_err(|error| format!("failed to initialize updater: {error}"))?;
    let Some(update) = updater
        .check()
        .await
        .map_err(|error| format!("failed to check for updates: {error}"))?
    else {
        return Ok(());
    };

    eprintln!("dsh desktop: installing update {}", update.version);
    update
        .download_and_install(|_, _| {}, || {})
        .await
        .map_err(|error| format!("failed to install update: {error}"))?;
    app.restart();
}

#[cfg(not(debug_assertions))]
fn schedule_updates(app: AppHandle) {
    thread::spawn(move || {
        thread::sleep(UPDATE_CHECK_DELAY);
        loop {
            if let Err(error) =
                tauri::async_runtime::block_on(check_and_install_update(app.clone()))
            {
                eprintln!("dsh desktop: {error}");
            }
            thread::sleep(UPDATE_CHECK_INTERVAL);
        }
    });
}

/// Build the Tauri application and preserve the existing dsh web runtime.
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            let window = app
                .get_webview_window("main")
                .ok_or_else(|| "Tauri configuration did not create the main window".to_string())?;

            // `tauri dev` runs the host through beforeDevCommand. Release builds
            // start the configured dsh executable from the user's installation;
            // the platform-specific sidecar will replace this lookup for release.
            #[cfg(not(debug_assertions))]
            {
                let host = spawn_host()?;
                app.manage(HostProcess(Mutex::new(Some(host))));
                schedule_updates(app.handle().clone());
            }

            wait_for_host(window);
            Ok(())
        });

    builder
        .build(tauri::generate_context!())
        .expect("error while building Tauri application")
        .run(|app, event| {
            if matches!(event, RunEvent::Exit | RunEvent::ExitRequested { .. }) {
                close_host(app);
            }
        });
}

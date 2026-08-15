/* DeepSeek Harness Desktop — landing page effects */
(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    initScrollProgress();
    initReveal();
    if (finePointer) {
      initCursorGlow();
      if (!reduced) initTilt();
    }
    if (!reduced) initTerminalTyping();
  });

  /* gradient scroll progress bar */
  function initScrollProgress() {
    var bar = document.querySelector(".scroll-progress");
    if (!bar) return;
    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* scroll reveal */
  function initReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("revealed");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add("revealed");
          io.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    for (var j = 0; j < nodes.length; j++) io.observe(nodes[j]);
  }

  /* cursor spotlight */
  function initCursorGlow() {
    var glow = document.querySelector(".cursor-glow");
    if (!glow) return;
    document.documentElement.classList.add("has-cursor");
    var ticking = false;
    window.addEventListener("mousemove", function (e) {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          glow.style.setProperty("--x", e.clientX + "px");
          glow.style.setProperty("--y", e.clientY + "px");
          ticking = false;
        });
      }
    }, { passive: true });
  }

  /* 3D tilt on feature cards */
  function initTilt() {
    var cards = document.querySelectorAll(".card");
    for (var i = 0; i < cards.length; i++) (function (card) {
      var max = 8;
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = "transform .08s ease";
        card.style.transform =
          "perspective(900px) rotateX(" + (-y * max * 2).toFixed(2) + "deg) rotateY(" +
          (x * max * 2).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transition = "transform .45s cubic-bezier(.16,1,.3,1)";
        card.style.transform = "";
      });
    })(cards[i]);
  }

  /* terminal typing animation */
  function initTerminalTyping() {
    var body = document.querySelector(".term-body");
    if (!body) return;

    var queue = [];
    var lines = body.querySelectorAll(".t-line");
    for (var i = 0; i < lines.length; i++) {
      var cmd = lines[i].querySelector(".t-cmd");
      if (cmd) queue.push({ line: lines[i], cmd: cmd, text: cmd.textContent });
    }
    if (!queue.length) return;

    body.classList.add("typing");
    var cursor = document.createElement("span");
    cursor.className = "t-cursor";
    cursor.setAttribute("aria-hidden", "true");

    var idx = 0;
    function finish() {
      var last = queue[queue.length - 1];
      if (last) last.line.appendChild(cursor);
      var out = body.querySelector(".t-out");
      if (out) out.classList.add("t-out-in");
    }
    function typeLine(item, pos) {
      if (pos > item.text.length) {
        item.line.classList.remove("t-line-active");
        idx++;
        if (idx >= queue.length) { finish(); return; }
        setTimeout(step, 240);
        return;
      }
      item.cmd.textContent = item.text.slice(0, pos);
      setTimeout(function () { typeLine(item, pos + 1); }, 18 + Math.random() * 36);
    }
    function step() {
      var item = queue[idx];
      item.cmd.textContent = "";
      item.line.classList.add("t-line-active");
      item.line.appendChild(cursor);
      typeLine(item, 1);
    }
    setTimeout(step, 900);
  }
})();

(function () {
  "use strict";

  var AI_ASSET_MSG = "해당 애셋은 AI를 통해 생성/편집 되었습니다.";

  function initAiAssetCredits() {
    var nodes = document.querySelectorAll("#main img, #main video");
    var i;
    var el;
    var toWrap;
    var wrap;
    var cap;
    var parent;

    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (el.closest(".ai-asset-credit-wrap")) {
        continue;
      }

      toWrap = el;
      parent = el.parentElement;
      if (el.tagName === "IMG" && parent && parent.tagName === "PICTURE") {
        toWrap = parent;
      }

      if (toWrap.parentElement && toWrap.parentElement.classList.contains("ai-asset-credit-wrap")) {
        continue;
      }

      wrap = document.createElement("div");
      wrap.className = "ai-asset-credit-wrap";
      toWrap.parentNode.insertBefore(wrap, toWrap);
      wrap.appendChild(toWrap);

      cap = document.createElement("span");
      cap.className = "ai-asset-credit";
      cap.textContent = AI_ASSET_MSG;
      wrap.appendChild(cap);
    }
  }

  function initCaseShowcase() {
    var root = document.querySelector("[data-case-showcase]");
    if (!root) return;

    var imgBefore = document.getElementById("case-showcase-img-before");
    var imgAfter = document.getElementById("case-showcase-img-after");
    var titleEl = document.getElementById("case-showcase-title");
    var thumbs = root.querySelectorAll(".case-showcase__thumb");

    if (!imgBefore || !imgAfter || !titleEl || !thumbs.length) return;

    function activate(btn) {
      var b = btn.getAttribute("data-before-src");
      var a = btn.getAttribute("data-after-src");
      var t = btn.getAttribute("data-title");
      if (b) imgBefore.setAttribute("src", b);
      if (a) imgAfter.setAttribute("src", a);
      if (t) titleEl.textContent = t;

      thumbs.forEach(function (th) {
        var on = th === btn;
        th.classList.toggle("is-active", on);
        th.setAttribute("aria-selected", on ? "true" : "false");
      });
    }

    thumbs.forEach(function (th) {
      th.addEventListener("click", function () {
        activate(th);
      });
    });
  }

  function bootDom() {
    initAiAssetCredits();
    initCaseShowcase();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootDom);
  } else {
    bootDom();
  }

  var header = document.querySelector(".site-header");
  var AT_TOP_THRESHOLD = 24;

  function updateHeaderTheme() {
    if (!header) return;
    var nav = document.getElementById("site-nav");
    var menuOpen = nav && nav.classList.contains("is-open");
    var y = window.scrollY || window.pageYOffset || 0;
    var atTop = y <= AT_TOP_THRESHOLD && !menuOpen;
    header.classList.toggle("is-at-top", atTop);
  }

  if (header) {
    window.addEventListener("scroll", updateHeaderTheme, { passive: true });
    window.addEventListener("resize", updateHeaderTheme);
    updateHeaderTheme();
  }

  var nav = document.getElementById("site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var navClose = document.querySelector(".nav-close");
  var mqMobileNav = window.matchMedia("(max-width: 860px)");

  function syncNavAriaHidden() {
    if (!nav) return;
    if (mqMobileNav.matches) {
      nav.setAttribute("aria-hidden", nav.classList.contains("is-open") ? "false" : "true");
    } else {
      nav.removeAttribute("aria-hidden");
    }
  }

  function onMobileNavMqChange() {
    if (!nav || !toggle) return;
    if (!mqMobileNav.matches) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "메뉴 열기");
    }
    syncNavAriaHidden();
    updateHeaderTheme();
  }

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    syncNavAriaHidden();
    updateHeaderTheme();
  }

  if (toggle && nav) {
    syncNavAriaHidden();
    if (typeof mqMobileNav.addEventListener === "function") {
      mqMobileNav.addEventListener("change", onMobileNavMqChange);
    } else if (typeof mqMobileNav.addListener === "function") {
      mqMobileNav.addListener(onMobileNavMqChange);
    }

    toggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    if (navClose) {
      navClose.addEventListener("click", function () {
        setNavOpen(false);
      });
    }

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setNavOpen(false);
      }
    });
  }
})();

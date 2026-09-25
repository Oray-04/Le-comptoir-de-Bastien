/* Le Comptoir de Bastien — interactions du site */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Tiroir de navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.getElementById("nav-drawer");
  var veil = document.querySelector(".drawer-veil");
  var closeBtn = document.querySelector(".drawer-close");
  var topbar = document.querySelector(".topbar");

  if (toggle && drawer) {
    var lastFocus = null;

    var setDrawer = function (open) {
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.classList.toggle("drawer-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      if (topbar) { topbar.classList.toggle("is-open", open); }

      if (veil) {
        if (open) {
          veil.hidden = false;
          window.requestAnimationFrame(function () { veil.classList.add("is-open"); });
        } else {
          veil.classList.remove("is-open");
          window.setTimeout(function () { veil.hidden = true; }, 400);
        }
      }

      if (open) {
        lastFocus = document.activeElement;
        var first = drawer.querySelector(".drawer-close");
        if (first) { first.focus(); }
      } else if (lastFocus) {
        lastFocus.focus();
        lastFocus = null;
      }
    };

    toggle.addEventListener("click", function () {
      setDrawer(!drawer.classList.contains("is-open"));
    });

    if (closeBtn) { closeBtn.addEventListener("click", function () { setDrawer(false); }); }
    if (veil) { veil.addEventListener("click", function () { setDrawer(false); }); }

    drawer.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { setDrawer(false); }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) { setDrawer(false); }
    });

    // Maintenir le focus à l'intérieur du tiroir ouvert
    drawer.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !drawer.classList.contains("is-open")) { return; }
      var items = drawer.querySelectorAll("button, a[href]");
      if (!items.length) { return; }
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- En-tête transparent qui devient opaque au défilement ---------- */
  var header = document.querySelector(".topbar");

  if (header) {
    var stick = function () {
      var overlay = header.classList.contains("is-overlay");
      var trigger = overlay ? Math.max(120, window.innerHeight * 0.6) : 60;
      header.classList.toggle("is-stuck", window.scrollY > trigger);
    };
    stick();
    window.addEventListener("scroll", stick, { passive: true });
  }

  /* ---------- Carrousel de la page d'accueil ---------- */
  var slider = document.querySelector(".slider");

  if (slider) {
    var slides = slider.querySelectorAll(".slide");
    var total = slides.length;
    var current = 0;
    var timer = null;

    var curLabel = slider.querySelector(".slider-count .cur");
    var totLabel = slider.querySelector(".slider-count .tot");
    var progress = slider.querySelector(".slider-count .bar span");

    var pad = function (n) { return (n < 10 ? "0" : "") + n; };

    var show = function (index) {
      current = (index + total) % total;
      for (var i = 0; i < total; i++) {
        var active = i === current;
        slides[i].classList.toggle("is-active", active);
        slides[i].setAttribute("aria-hidden", active ? "false" : "true");
      }
      if (curLabel) { curLabel.textContent = pad(current + 1); }
      if (progress) { progress.style.width = ((current + 1) / total * 100) + "%"; }
      var marks = slider.querySelectorAll(".slider-dots button");
      for (var d = 0; d < marks.length; d++) {
        marks[d].setAttribute("aria-selected", d === current ? "true" : "false");
      }
    };

    var stop = function () {
      if (timer) { window.clearInterval(timer); timer = null; }
    };
    var start = function () {
      if (reduced || total < 2) { return; }
      stop();
      timer = window.setInterval(function () { show(current + 1); }, 6500);
    };

    if (totLabel) { totLabel.textContent = pad(total); }
    show(0);
    start();

    var dots = slider.querySelectorAll(".slider-dots button");
    for (var d = 0; d < dots.length; d++) {
      (function (i) {
        dots[i].addEventListener("click", function () { show(i); start(); });
      })(d);
    }

    var prev = slider.querySelector(".slider-btn.prev");
    var next = slider.querySelector(".slider-btn.next");
    if (prev) { prev.addEventListener("click", function () { show(current - 1); start(); }); }
    if (next) { next.addEventListener("click", function () { show(current + 1); start(); }); }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);

    // Inutile de faire tourner le carrousel quand il n'est pas à l'écran
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { start(); } else { stop(); } });
      }, { threshold: 0.15 }).observe(slider);
    }

    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { show(current - 1); start(); }
      if (e.key === "ArrowRight") { show(current + 1); start(); }
    });

    var startX = null;
    slider.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (startX === null) { return; }
      var delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 50) { show(delta < 0 ? current + 1 : current - 1); start(); }
      startX = null;
    }, { passive: true });
  }

  /* ---------- Bandeau de réassurance rotatif ---------- */
  var reassure = document.querySelector(".reassure");

  if (reassure) {
    var items = reassure.querySelectorAll(".reassure-item");
    var dots = reassure.querySelectorAll(".reassure-dots button");
    var index = 0;

    var display = function (i) {
      index = (i + items.length) % items.length;
      for (var k = 0; k < items.length; k++) {
        items[k].classList.toggle("is-active", k === index);
        if (dots[k]) {
          dots[k].classList.toggle("is-active", k === index);
          dots[k].setAttribute("aria-current", k === index ? "true" : "false");
        }
      }
    };

    display(0);

    for (var d = 0; d < dots.length; d++) {
      (function (i) {
        dots[i].addEventListener("click", function () { display(i); });
      })(d);
    }

    if (!reduced && items.length > 1) {
      window.setInterval(function () { display(index + 1); }, 4200);
    }
  }


  /* ---------- Vidéo d'arrière-plan ---------- */
  var bg = document.querySelector(".site-video");

  if (bg) {
    var vid = bg.querySelector("video");
    if (!vid || reduced) {
      // En mouvement réduit, on garde l'image d'attente
      if (vid) { vid.remove(); }
    } else {
      var play = function () {
        var attempt = vid.play();
        if (attempt && attempt.then) {
          attempt.then(function () { bg.classList.add("has-video"); })
                 .catch(function () { /* lecture refusée : le poster reste */ });
        } else {
          bg.classList.add("has-video");
        }
      };

      // Attributs posés aussi en JS : certains navigateurs mobiles (iOS)
      // ne lancent une vidéo automatique que si elle est muette et en ligne
      vid.muted = true;
      vid.setAttribute("muted", "");
      vid.setAttribute("playsinline", "");

      vid.addEventListener("playing", function () { bg.classList.add("has-video"); });
      if (vid.readyState >= 2) { play(); } else { vid.addEventListener("canplay", play, { once: true }); }
      vid.load();
      play();

      // Si la lecture automatique est bloquée (mode économie d'énergie sur
      // iPhone par exemple), on relance au premier toucher ou défilement
      var retry = function () {
        if (vid.paused) { play(); }
        window.removeEventListener("touchstart", retry);
        window.removeEventListener("scroll", retry);
      };
      window.addEventListener("touchstart", retry, { passive: true });
      window.addEventListener("scroll", retry, { passive: true });

      // Mettre en pause quand l'onglet passe en arrière-plan
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) { vid.pause(); } else { play(); }
      });
    }
  }


  /* ---------- Retour en haut de page ---------- */
  var toTop = document.querySelector(".to-top");

  if (toTop) {
    var watch = function () {
      toTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.9);
    };
    watch();
    window.addEventListener("scroll", watch, { passive: true });

    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* ---------- Invitation à faire défiler ---------- */
  var cue = document.querySelector(".scroll-cue");

  if (cue) {
    cue.addEventListener("click", function (e) {
      var target = document.querySelector(cue.getAttribute("href"));
      if (!target) { return; }
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    });

    // L'invitation s'efface dès que l'on commence à descendre
    window.addEventListener("scroll", function () {
      cue.style.opacity = window.scrollY > 120 ? "0" : "";
      cue.style.pointerEvents = window.scrollY > 120 ? "none" : "";
    }, { passive: true });
  }


  /* ---------- Indicateur d'ouverture en direct ---------- */
  var slots = {
    1: [["08:00", "12:00"], ["15:00", "18:00"]],
    2: [["08:00", "12:00"], ["15:00", "18:00"]],
    3: [["07:30", "12:30"], ["15:00", "18:00"]],
    4: [["08:00", "12:00"], ["15:00", "18:00"]],
    5: [["08:00", "12:00"], ["15:00", "18:00"]],
    6: [["07:30", "12:30"], ["15:00", "18:00"]],
    0: []
  };
  var dayNames = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  var toMinutes = function (hhmm) {
    var parts = hhmm.split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };
  var format = function (minutes) {
    var h = Math.floor(minutes / 60), m = minutes % 60;
    return h + "h" + (m < 10 ? "0" + m : m);
  };

  var openState = function () {
    var now = new Date();
    var day = now.getDay();
    var minutes = now.getHours() * 60 + now.getMinutes();

    var today = slots[day] || [];
    for (var i = 0; i < today.length; i++) {
      var from = toMinutes(today[i][0]), to = toMinutes(today[i][1]);
      if (minutes >= from && minutes < to) {
        return { open: true, detail: "jusqu'à " + format(to) };
      }
      if (minutes < from) {
        return { open: false, detail: "ouvre à " + format(from) };
      }
    }
    // Rien d'autre aujourd'hui : on cherche le prochain jour ouvré
    for (var step = 1; step <= 7; step++) {
      var next = (day + step) % 7;
      var list = slots[next] || [];
      if (list.length) {
        var label = step === 1 ? "demain" : dayNames[next];
        return { open: false, detail: "ouvre " + label + " à " + format(toMinutes(list[0][0])) };
      }
    }
    return { open: false, detail: "" };
  };

  var badges = document.querySelectorAll(".open-state");

  if (badges.length) {
    var refresh = function () {
      var state = openState();
      Array.prototype.forEach.call(badges, function (el) {
        el.classList.toggle("is-open", state.open);
        el.classList.toggle("is-closed", !state.open);
        var label = el.querySelector(".label");
        var detail = el.querySelector(".detail");
        if (label) { label.textContent = state.open ? "Ouvert" : "Fermé"; }
        if (detail) { detail.textContent = state.detail; }
      });
    };
    refresh();
    window.setInterval(refresh, 60000);
  }

  /* ---------- Barre d'action mobile ---------- */
  var actionBar = document.querySelector(".action-bar");

  if (actionBar) {
    var showBar = function () {
      actionBar.classList.toggle("is-visible", window.scrollY > 220);
    };
    showBar();
    window.addEventListener("scroll", showBar, { passive: true });
  }

  /* ---------- Apparition progressive des blocs au défilement ---------- */
  var reveals = document.querySelectorAll(".reveal");

  if (reveals.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-visible"); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

      Array.prototype.forEach.call(reveals, function (el) { observer.observe(el); });
    }
  }

  /* ---------- Mise en avant du jour courant dans les horaires ---------- */
  var hoursTable = document.querySelector(".hours");
  if (hoursTable) {
    var today = new Date().getDay(); // 0 = dimanche
    var row = hoursTable.querySelector('tr[data-day="' + today + '"]');
    if (row) { row.classList.add("is-today"); }
  }

  /* ---------- Année automatique dans le pied de page ---------- */
  var yearSlot = document.getElementById("year");
  if (yearSlot) { yearSlot.textContent = new Date().getFullYear(); }
})();

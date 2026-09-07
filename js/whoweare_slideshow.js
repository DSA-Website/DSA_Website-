/**
 * "Who We Are" slideshow.
 *
 * Same behaviour as the events page: photos cross-fade on their own, with a
 * pair of understated arrows underneath for stepping through by hand.
 */
(function () {
  "use strict";

  var SLIDE_DURATION = 5000;

  var CHEVRON = {
    prev: "M14.5 5.5 8 12l6.5 6.5",
    next: "M9.5 5.5 16 12l-6.5 6.5"
  };

  var wrapper = document.querySelector(".slideshow-wrapper");
  var slides = [].slice.call(document.getElementsByClassName("mySlides"));
  if (!wrapper || !slides.length) return;

  var index = 0;
  var timer = null;
  var visible = true;

  slides[0].classList.add("active");

  function goTo(i) {
    slides[index].classList.remove("active");
    index = i;
    slides[index].classList.add("active");
  }

  function advance() {
    goTo((index + 1) % slides.length);
  }

  function play(delay) {
    if (timer || slides.length < 2) return;
    timer = window.setTimeout(function tick() {
      advance();
      timer = window.setTimeout(tick, SLIDE_DURATION);
    }, delay);
  }

  function pause() {
    window.clearTimeout(timer);
    timer = null;
  }

  // Manual pick: move one photo, then restart the countdown so the
  // auto-advance doesn't yank it away a moment later.
  function step(dir) {
    goTo((index + dir + slides.length) % slides.length);
    pause();
    play(SLIDE_DURATION);
  }

  function makeArrow(dir, label, onClick) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "slideshow-arrow";
    btn.setAttribute("aria-label", label);
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
      '<path d="' + CHEVRON[dir] + '" fill="none" stroke="currentColor" stroke-width="1.5" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
    btn.addEventListener("click", onClick);
    return btn;
  }

  if (slides.length > 1) {
    var nav = document.createElement("div");
    nav.className = "slideshow-nav";
    nav.appendChild(makeArrow("prev", "Previous photo", function () { step(-1); }));
    nav.appendChild(makeArrow("next", "Next photo", function () { step(1); }));
    wrapper.appendChild(nav);
  }

  // Only run while the slideshow is actually on screen.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible = entry.isIntersecting;
          if (visible) {
            play(SLIDE_DURATION);
          } else {
            pause();
          }
        });
      },
      { rootMargin: "100px", threshold: 0.15 }
    ).observe(wrapper);
  } else {
    play(SLIDE_DURATION);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      pause();
    } else if (visible) {
      play(SLIDE_DURATION);
    }
  });
})();

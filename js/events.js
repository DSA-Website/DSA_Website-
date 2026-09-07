// Each slideshow maps a container id in events.html to its photos, in display order.
// Filenames are URL-encoded, so spaces become %20 and the .JPG / .jpg casing is
// preserved exactly (GitHub Pages serves paths case-sensitively).
const slideshows = {
  "dinner-slideshow": [
    "images/events/AnnualDinners/ad1.jpg",
    "images/events/AnnualDinners/ad2.jpg",
    "images/events/AnnualDinners/ad3.jpg",
    "images/events/AnnualDinners/ad4.jpg",
    "images/events/AnnualDinners/ad5.jpg",
    "images/events/AnnualDinners/ad6.jpg",
    "images/events/AnnualDinners/ad7.jpg",
    "images/events/AnnualDinners/ad8.jpg"
  ],
  "bakesale-slideshow": [
    "images/events/BakeSales/bakesale1.jpg",
    "images/events/BakeSales/bakesale4.jpg",
    "images/events/BakeSales/bakesale5.jpg",
    "images/events/BakeSales/bakesale6.jpg"
  ],
  "picnic-slideshow": [
    "images/events/Picnic/Copy%20of%20DSC09486.jpg",
    "images/events/Picnic/Copy%20of%20DSC09526.jpg",
    "images/events/Picnic/Copy%20of%20DSC09538.jpg",
    "images/events/Picnic/Copy%20of%20DSC09547.jpg",
    "images/events/Picnic/Copy%20of%20DSC09564.jpg",
    "images/events/Picnic/Copy%20of%20DSC09569.jpg",
    "images/events/Picnic/DSC09597.jpg",
    "images/events/Picnic/IMG_0795.jpg"
  ],
  "thanksgiving-slideshow": [
    "images/events/ThanksgivingDinner/td1.jpg",
    "images/events/ThanksgivingDinner/td2.jpg",
    "images/events/ThanksgivingDinner/td3.jpg",
    "images/events/ThanksgivingDinner/td4.jpg",
    "images/events/ThanksgivingDinner/td5.jpg",
    "images/events/ThanksgivingDinner/td6.jpg",
    "images/events/ThanksgivingDinner/td7.jpg",
    "images/events/ThanksgivingDinner/td8.jpg"
  ],
  "umr-slideshow": [
    "images/events/UMR/DSC09180.JPG",
    "images/events/UMR/DSC_0158.JPG",
    "images/events/UMR/DSC_0165.JPG",
    "images/events/UMR/DSC_0173.JPG",
    "images/events/UMR/DSC_0193.JPG",
    "images/events/UMR/DSC_0204.JPG"
  ],
  "iftar-slideshow": [
    "images/events/InterfaithIftar/DSC_0344.JPG",
    "images/events/InterfaithIftar/DSC_0348.JPG",
    "images/events/InterfaithIftar/DSC_0349.JPG",
    "images/events/InterfaithIftar/DSC_0362.JPG",
    "images/events/InterfaithIftar/DSC_0390.JPG",
    "images/events/InterfaithIftar/DSC_0400.JPG",
    "images/events/InterfaithIftar/DSC_0415.JPG",
    "images/events/InterfaithIftar/DSC_0465.JPG",
    "images/events/InterfaithIftar/DSC_0473.JPG",
    "images/events/InterfaithIftar/DSC_0478.JPG"
  ],
  "teanights-slideshow": [
    "images/events/TeaNights/DSC09368.JPG",
    "images/events/TeaNights/DSC09372.JPG",
    "images/events/TeaNights/DSC09400.JPG",
    "images/events/TeaNights/DSC_0009.JPG",
    "images/events/TeaNights/DSC_0014.JPG",
    "images/events/TeaNights/DSC_0034.JPG",
    "images/events/TeaNights/DSC_0046.JPG",
    "images/events/TeaNights/DSC_0226.JPG",
    "images/events/TeaNights/DSC_0265.JPG",
    "images/events/TeaNights/DSC_0271.JPG",
    "images/events/TeaNights/DSC_0304.JPG"
  ]
};

// How long each photo is held before it cross-fades into the next one.
const SLIDE_DURATION = 5000;

const CHEVRON = {
  prev: "M14.5 5.5 8 12l6.5 6.5",
  next: "M9.5 5.5 16 12l-6.5 6.5"
};

function makeArrow(dir, label) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "slideshow-arrow";
  btn.setAttribute("aria-label", label);
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
    '<path d="' + CHEVRON[dir] + '" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';
  return btn;
}

function buildSlideshow(container, images) {
  const wrapper = document.createElement("div");
  wrapper.className = "slideshow-wrapper";

  const slides = images.map((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.loading = i === 0 ? "eager" : "lazy";
    img.decoding = "async";
    if (i === 0) img.classList.add("is-active");
    wrapper.appendChild(img);
    return img;
  });

  const nav = document.createElement("div");
  nav.className = "slideshow-nav";
  const prev = makeArrow("prev", "Previous photo");
  const next = makeArrow("next", "Next photo");
  nav.append(prev, next);

  container.append(wrapper, nav);
  return { wrapper, slides, nav, prev, next };
}

document.addEventListener("DOMContentLoaded", () => {
  // The page scrolls natively now, so .scroll-container only works as an
  // observer root while it is actually the thing scrolling.
  const scrollBox = document.querySelector(".scroll-container");
  const scroller =
    scrollBox && getComputedStyle(scrollBox).overflowY !== "visible" ? scrollBox : null;
  const shows = [];

  for (const id in slideshows) {
    const container = document.getElementById(id);
    if (!container) {
      console.warn(`Slideshow container with ID '${id}' not found.`);
      continue;
    }

    const images = slideshows[id];
    if (!images.length) continue;

    const { wrapper, slides, nav, prev, next } = buildSlideshow(container, images);
    const show = { wrapper, slides, index: 0, timer: null, visible: true };
    shows.push(show);

    if (slides.length < 2) {
      nav.hidden = true;
    } else {
      prev.addEventListener("click", () => step(show, -1));
      next.addEventListener("click", () => step(show, 1));
    }
  }

  function goTo(show, i) {
    show.slides[show.index].classList.remove("is-active");
    show.index = i;
    show.slides[i].classList.add("is-active");
  }

  function advance(show) {
    goTo(show, (show.index + 1) % show.slides.length);
  }

  // Manual pick: move one photo, then restart the countdown so the
  // auto-advance doesn't yank it away a moment later.
  function step(show, dir) {
    goTo(show, (show.index + dir + show.slides.length) % show.slides.length);
    pause(show);
    play(show, SLIDE_DURATION);
  }

  function play(show, delay) {
    if (show.timer || show.slides.length < 2) return;
    // Stagger the first tick so the slideshows don't all flip in lockstep.
    show.timer = window.setTimeout(function tick() {
      advance(show);
      show.timer = window.setTimeout(tick, SLIDE_DURATION);
    }, delay);
  }

  function pause(show) {
    window.clearTimeout(show.timer);
    show.timer = null;
  }

  // Only animate the slideshows the visitor can actually see.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const show = shows.find((s) => s.wrapper === entry.target);
          if (!show) return;
          show.visible = entry.isIntersecting;
          if (show.visible) {
            play(show, SLIDE_DURATION + Math.random() * 1200);
          } else {
            pause(show);
          }
        });
      },
      { root: scroller || null, rootMargin: "100px", threshold: 0.15 }
    );
    shows.forEach((show) => observer.observe(show.wrapper));
  } else {
    shows.forEach((show, i) => play(show, SLIDE_DURATION + i * 400));
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      shows.forEach((show) => pause(show));
    } else {
      shows.forEach((show, i) => {
        if (show.visible) play(show, SLIDE_DURATION + i * 400);
      });
    }
  });
});

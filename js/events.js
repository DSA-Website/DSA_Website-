const slideshows = {
  "meetings-slideshow": [
    ...Array.from({ length: 5 }, (_, i) => `images/events/General Meetings/gm${i + 1}.jpg`)
  ],
  "bakesale-slideshow": [
    ...Array.from({ length: 8 }, (_, i) => `images/events/Bake Sales/bakesale${i + 1}.jpg`)
  ],
  "profitshare-slideshow": [
    ...Array.from({ length: 5 }, (_, i) => `images/events/Profit Shares/share${i + 1}.jpg`)
  ],
  "picnic-slideshow": [
    ...Array.from({ length: 5 }, (_, i) => `images/events/Picnic/picnic${i + 1}.jpg`)
  ],
  "dinner-slideshow": [
    ...Array.from({ length: 8 }, (_, i) => `images/events/Annual Dinners/ad${i + 1}.jpg`)
  ],
  "gamenight-slideshow": [
    ...Array.from({ length: 6 }, (_, i) => `images/events/Game Night/gn${i + 1}.jpg`)
  ],
  "thanksgiving-slideshow": [
    ...Array.from({ length: 8 }, (_, i) => `images/events/Thanksgiving Dinner/td${i + 1}.jpg`)
  ],
  "iftar-slideshow": [
    ...Array.from({ length: 11 }, (_, i) => `images/events/Iftar/if${i + 1}.jpg`)
  ],
  "bsateacoffee-slideshow": [
    ...Array.from({ length: 9 }, (_, i) => `images/events/BSA Tea-Coffee/t${i + 1}.jpg`)
  ]
};


document.addEventListener("DOMContentLoaded", () => {
  for (const id in slideshows) {
    const container = document.getElementById(id);
    if (!container) {
      console.warn(`Slideshow container with ID '${id}' not found.`);
      continue;
    }

    const images = slideshows[id];
    let index = 0;

    const wrapper = document.createElement("div");
    wrapper.className = "slideshow-wrapper";

    const img = document.createElement("img");
    img.src = images[index];
    img.alt = `${id}-image`;
    wrapper.appendChild(img);

    const controls = document.createElement("div");
    controls.className = "slideshow-controls";

    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = "&#10094;";
    prevBtn.className = "slideshow-btn prev-btn";
    prevBtn.onclick = () => {
      index = (index - 1 + images.length) % images.length;
      img.src = images[index];
    };

    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = "&#10095;";
    nextBtn.className = "slideshow-btn next-btn";
    nextBtn.onclick = () => {
      index = (index + 1) % images.length;
      img.src = images[index];
    };

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);

    container.appendChild(wrapper);
    container.appendChild(controls);
  }
});
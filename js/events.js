// events.js
const slideshows = {
  "meetings-slideshow": [
    "images/events/General Meetings/gm1.jpg",
    "images/events/General Meetings/gm2.jpg",
    "images/events/General Meetings/gm3.jpg",
    "images/events/General Meetings/gm4.jpg",
    "images/events/General Meetings/gm5.jpg",
    "images/events/General Meetings/gm6.jpg",
    "images/events/General Meetings/gm7.jpg"
  ],
  "bakesale-slideshow": [
    "images/events/Bake Sales/bakesale1.jpg",
    "images/events/Bake Sales/bakesale2.jpg",
    "images/events/Bake Sales/bakesale3.jpg",
    "images/events/Bake Sales/bakesale5.jpg",
    "images/events/Bake Sales/bakesale6.jpg",
    "images/events/Bake Sales/bakesale7.jpg",
    "images/events/Bake Sales/bakesale8.jpg",
    "images/events/Bake Sales/bakesale9.jpg",
    "images/events/Bake Sales/bakesale10.jpg",
    "images/events/Bake Sales/bakesale12.jpg",
    "images/events/Bake Sales/bakesale13.jpg",
    "images/events/Bake Sales/bakesale14.jpg",
    "images/events/Bake Sales/bakesale16.jpg",
    "images/events/Bake Sales/bakesale17.jpg"
  ],
  "profitshare-slideshow": [
    "images/events/Profit Shares/share2.jpg",
    "images/events/Profit Shares/share3.jpg",
    "images/events/Profit Shares/share4.jpg",
    "images/events/Profit Shares/share5.jpg",
    "images/events/Profit Shares/share6.jpg",
    "images/events/Profit Shares/share7.jpg"
  ],
  "picnic-slideshow": [
    "images/events/Picnic/picnic1.jpg",
    "images/events/Picnic/picnic2.jpg",
    "images/events/Picnic/picnic3.jpg",
    "images/events/Picnic/picnic4.jpg"
  ],
  "dinner-slideshow": [
    ...Array.from({ length: 108 }, (_, i) => `images/events/Annual Dinners/ad${i + 1}.jpg`)
	
  ],
  "gamenight-slideshow": [
    ...[1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 19].map(i => `images/events/Game Night/gn${i}.jpg`)
  ],
  "thanksgiving-slideshow": [
    ...Array.from({ length: 73 }, (_, i) => `images/events/Thanksgiving Dinner/td${i + 1}.jpg`)
  ],
  "iftar-slideshow": [
    ...Array.from({ length: 128 }, (_, i) => i + 1) // update the leng
      .filter(i => ![52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 68].includes(i))
      .map(i => `images/events/Iftar/if${i}.jpg`)
  ],
  "bsateacoffee-slideshow": [
    ...Array.from({ length: 81 }, (_, i) => `images/events/BSA Tea-Coffee/t${i + 1}.jpg`)
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

let slideIndex = 0;
const slides = document.getElementsByClassName("mySlides");

function showSlides() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }

  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }

  slides[slideIndex - 1].classList.add("active");

  setTimeout(showSlides, 2500); // ⏱️ 4 seconds per photo
}

// Show the first image instantly
if (slides.length > 0) {
  slides[0].classList.add("active");
  setTimeout(showSlides, 2500);
}

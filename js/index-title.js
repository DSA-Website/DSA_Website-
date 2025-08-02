const line1 = document.getElementById('line1');

function updateText() {
  if (window.matchMedia("(max-width: 768px)").matches) {
    line1.textContent = "DSA";
  } else {
    line1.textContent = "Dialogue Student Association";
  }
}

window.addEventListener("resize", updateText);

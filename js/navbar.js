document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-navigation");

  if (!header || !toggle || !nav) return;

  function setMenu(open) {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  }

  toggle.addEventListener("click", () => {
    setMenu(!header.classList.contains("nav-open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    // Only claim Escape while the menu is actually open, so pressing it to
    // dismiss something else on the page (a dialog, say) does not yank focus
    // back to the toggle.
    if (event.key === "Escape" && header.classList.contains("nav-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      setMenu(false);
    }
  });
});

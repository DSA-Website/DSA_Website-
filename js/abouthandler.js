(function () {
  let secretMode = false;
  let inputSequence = '';
  let timeoutId = null;

  // Base64("/assets/xh3s9p4k/r42q8.html")
  const secretPathB64 = "L2Fzc2V0cy94aDNzOXA0ay9yNDJxOC5odG1s";

  function go(url) {
    try {
      sessionStorage.setItem('secretOK', '1');
      sessionStorage.setItem('secretTS', String(Date.now()));
    } catch (e) {}
    window.location.href = url;
  }

  function startWindow() {
    secretMode = true;
    inputSequence = '';
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      secretMode = false;
      inputSequence = '';
    }, 3000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.querySelector('.about-handler');
    if (!trigger) return;

    trigger.addEventListener('click', startWindow);

    document.addEventListener('keydown', (e) => {
      if (!secretMode) return;
      inputSequence += e.key;

      if (inputSequence === '1453') {
        const path = atob(secretPathB64);
        go(path);
      } else if (!'1453'.startsWith(inputSequence)) {
        inputSequence = ''; // wrong key resets within window
      }
    }, { passive: true });
  });
})();

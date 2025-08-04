let secretMode = false;
let inputSequence = '';
let timeoutId = null;

document.querySelector('.about-handler').addEventListener('click', () => {
  secretMode = true;
  inputSequence = '';
  if (timeoutId) clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    secretMode = false;
    inputSequence = '';
  }, 3000); 
});

document.addEventListener('keydown', (e) => {
  if (secretMode) {
    inputSequence += e.key;
    if (inputSequence === '1453') {
      window.location.href = 'index2.html';
    }
  }
});

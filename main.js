// import keywords
import dictionaryMocks from './mocks/dictionary.json';
import targetWordsMocks from './mocks/targetWord.json';

// variables
const dictionary = dictionaryMocks;
const targetWords = targetWordsMocks;

const guessGrid = document.querySelector('[data-guess-grid]');
const alertContainer = document.querySelector('[data-alert-container]');
const targetWord = targetWords[Math.floor(Math.random() * 85)].toLocaleLowerCase('tr');

// trick :/
console.log(targetWord);

// play game
play();

function play() {
  document.addEventListener('click', handleMouseClick);
  document.addEventListener('keydown', handleKeyPress);
}

// stop game
function stopPlay() {
  document.removeEventListener('click', handleMouseClick);
  document.removeEventListener('keydown', handleKeyPress);
}

// mouse click
function handleMouseClick(e) {
  if(e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key);
    return;
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess();
    return;
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey();
    return;
  }
}

// keydown
function handleKeyPress(e) {
  console.log(e.key);
  if (e.key === "Enter") {
    submitGuess();
    return;
  }

  if(e.key === "Backspace" || e.key === "Delete") {
    deleteKey();
    return;
  }

  if (e.key.match(/^[a-zA-Z]$/)) {
    pressKey(e.key);
    return;
  }
}

// press keydown
function pressKey(key) {
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= 5) { return; }
  const nextTile = guessGrid.querySelector(':not([data-letter])');
  nextTile.dataset.letter = key.toLocaleLowerCase('tr');
  nextTile.innerHTML = key;
  nextTile.dataset.state = "active";
}

// delete key
function deleteKey() {
  const activeTiles = getActiveTiles();
  // find last tile
  const lastTile = activeTiles[activeTiles.length - 1];
  if (lastTile === undefined) { return; }
  // delete last tile
  lastTile.innerHTML = "";
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

// submit guess
function submitGuess() {
  // nodeList to Array with spread operator
  const activeTiles = [...getActiveTiles()];

  // guess length is short 
  if (activeTiles.length !== 5) {
    showAlert('Tahmin ettiğin kelime çok kısa');
    shakeTiles(activeTiles);
    return;
  }

  // guess
  const guess = activeTiles.reduce((word,tile) => {
    return word + tile.dataset.letter;
  }, "");
  console.log(guess);

  // guess is wrong
  if (!dictionary.includes(guess.toLocaleUpperCase('tr'))) {
    showAlert(`Tahmin ettiğin kelime listede yok: '${guess}'`);
    shakeTiles(activeTiles);
    return;
  }

}

// get has data-state="active" tiles
function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]');
}

// show alert 
function showAlert(message, duration = 1300) {
  const alert = document.createElement("div");
  alert.innerHTML = message
  alert.classList.add("alert");
  alertContainer.prepend(alert);

  if (duration === null) { return; }

  setTimeout(() => {
    alert.classList.add("hide");
    alert.addEventListener("transitionend", () => {
      alert.remove();
    })
  }, duration);
}

// animations
function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake");
    tile.addEventListener('animationend', () => {
      tile.classList.remove("shake")
    }, { once: true })
  });
}
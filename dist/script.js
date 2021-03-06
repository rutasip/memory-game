// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAHgNkXP4_FPSMCv13sJTYVTb2_e7CVHAw",
  authDomain: "memory-game-ea563.firebaseapp.com",
  databaseURL: "https://memory-game-ea563.firebaseio.com",
  projectId: "memory-game-ea563",
  storageBucket: "memory-game-ea563.appspot.com",
  messagingSenderId: "511905861263",
  appId: "1:511905861263:web:7a7c63b4d13266e9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference scores collection
var scoresRef = firebase.database().ref("scores");

class AudioController {
  constructor() {
    this.flipSound = new Audio("Assets/Audio/flip.wav");
    this.matchSound = new Audio("Assets/Audio/match.wav");
    this.victorySound = new Audio("Assets/Audio/victory.wav");
    this.gameOverSound = new Audio("Assets/Audio/gameover.wav");
  }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  victory() {
    this.victorySound.play();
  }
  gameOver() {
    this.gameOverSound.play();
  }
}

class MixOrMatch {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById("time-remaining");
    this.ticker = document.getElementById("flips");
    this.score = document.getElementById("score");
    this.audioController = new AudioController();
  }
  startGame() {
    this.cardToCheck = null;
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.counter = 0;
    this.matchedCards = [];
    this.busy = true;
    setTimeout(() => {
      this.shuffleCards();
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.timer.innerText = this.timeRemaining / 10;
    this.ticker.innerText = this.totalClicks;
  }
  hideCards() {
    this.cardsArray.forEach(card => {
      card.classList.remove("visible");
      card.classList.remove("matched");
    });
  }
  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add("visible");

      if (this.cardToCheck) this.checkForCardMatch(card);
      else this.cardToCheck = card;
    }
  }
  checkForCardMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck))
      this.cardMatch(card, this.cardToCheck);
    else this.cardMisMatch(card, this.cardToCheck);

    this.cardToCheck = null;
  }
  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add("matched");
    card2.classList.add("matched");
    this.audioController.match();
    if (this.matchedCards.length === this.cardsArray.length) this.victory();
  }
  cardMisMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      this.busy = false;
    }, 1000);
  }
  getCardType(card) {
    return card.getElementsByClassName("card-value")[0].src;
  }
  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining / 10;
      if (this.timeRemaining === 0) this.gameOver();
    }, 100);
  }
  gameOver() {
    clearInterval(this.countDown);
    this.audioController.gameOver();
    document.getElementById("game-over-text").classList.add("visible");
  }
  victory() {
    clearInterval(this.countDown);
    this.audioController.victory();
    document.getElementById("victory-text").classList.add("visible");
    this.counter = 100 - this.totalClicks + this.timeRemaining;
    this.score.innerText = this.counter;
  }

  shuffleCards() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randIndex].style.order = i;
      this.cardsArray[i].style.order = randIndex;
    }
  }

  canFlipCard(card) {
    return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      card !== this.cardToCheck
    );
  }
}

function ready() {
  let overlays = Array.from(document.getElementsByClassName("overlay-text"));
  let cards = Array.from(document.getElementsByClassName("card"));
  let game = new MixOrMatch(300, cards);

  overlays.forEach(overlay => {
    overlay.addEventListener("click", () => {
      overlay.classList.remove("visible");
      game.startGame();
    });
  });
  cards.forEach(card => {
    card.addEventListener("click", () => {
      game.flipCard(card);
    });
  });

  // Gets data from database
  var el = document.getElementById("leaderboard");
  el.addEventListener("click", getData);

  function getData() {
    document.getElementById("victory-text").classList.remove("visible");
    document.getElementById("leaderboard-text").classList.add("visible");
    var scoresArr = [];
    const leaderboardRef = firebase
      .database()
      .ref("scores")
      .orderByChild("Score")
      .limitToLast(15);
    leaderboardRef.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        scoresArr.push(item);
      });
      scoresArr.reverse();
      scoresArr.forEach(function(item) {
        $("tbody").append(
          "<tr><td>" + item["Name"] + "</td><td>" + item["Score"] + "</td></tr>"
        );
      });
    });
  }

  // Listen to form submit
  document
    .getElementById("users-score-submit")
    .addEventListener("submit", submitForm);

  // Submit form
  function submitForm(e) {
    e.preventDefault();

    // Get values
    // userName is a global var
    var userScore = Number(score.innerText);

    // Save score
    saveMessage(userName, userScore);
  }

  // Save score to firebase
  function saveMessage(userName, userScore) {
    var newScoreRef = scoresRef.push();
    newScoreRef.set({
      Name: userName,
      Score: userScore
    });
    document.getElementById("victory-text").classList.remove("visible");
    document.getElementById("start-text").classList.add("visible");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready());
} else {
  ready();
}

const suits = ["spades", "diamonds", "clubs", "hearts"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function createDeck() {
    let deck = new Array();

    for (let suit = 0; suit < suits.length; suit++) {
        for (let value = 0; value < values.length; value++) {
            let card = { Suit: suits[suit], Value: values[value] };
            deck.push(card);
        }
    }
    return deck;
}

function deckShuffle(deck) {
    for (let i = 0; i < 1000; i++) {
        let card1_index = Math.floor(Math.random() * deck.length);
        let card2_index = Math.floor(Math.random() * deck.length);
        let temp = deck[card1_index];

        deck[card1_index] = deck[card2_index];
        deck[card2_index] = temp;
    }
}

function cardValue(card) {
    let value = 0;
    switch (card.Value) {
        case "A":
            value = 14;
            break;
        case "J":
            value = 11;
            break;
        case "Q":
            value = 12;
            break;
        case "K":
            value = 13;
            break;
        default:
            value = parseInt(card.Value);
    }
    return value;
}

// create the deck
let deck = createDeck();

// Randomize the deck
deckShuffle(deck);

// Split the deck in half, one for each player
let player_deck = deck.slice(0, 26);
let opponent_deck = deck.slice(26);

// TEST VALUES
// let player_deck = [{ Value: '1' }, { Value: '1' }];
// let opponent_deck = [{ Value: '2' }, { Value: '3' }, { Value: '2' }];

// Let the player always start first
let playerTurn = true;
let activeCardIndex = 0;

const opponentPlayedCard = document.getElementById('opponent');
const playerPlayedCard = document.getElementById('player');
const gameConsole = document.getElementById('game-console');

const playButton = document.getElementById('play-button');
const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', function () {
    resetGame();
});

playButton.addEventListener('click', function () {
    playButton.disabled = true;
    if (playerTurn) {
        updateGUI(0);
        let winner = compareCards(0);
        if (winner || checkWin()) {
            resetButton.style.display = 'block';
            return;
        }
    }
    setTimeout(() => {
        playButton.disabled = false;
    }, 1000);

    console.log(player_deck.length);
    console.log(opponent_deck.length);

}, false);

function compareCards(cardIndex) {
    let player_cardValue = cardValue(player_deck[cardIndex]);
    let opponent_cardValue = cardValue(opponent_deck[cardIndex]);

    if (player_cardValue > opponent_cardValue) {
        roundWinner(1);
    } else if (opponent_cardValue > player_cardValue) {
        roundWinner(2);
    } else {
        if (war()) {
            return true;
        }
    }
}

function roundWinner(winner) {
    if (winner === 1) {
        updateDeck(player_deck);
    } else {
        updateDeck(opponent_deck);
    }
    activeCardIndex = 0;
    updateMessage(winner);
}

function updateDeck(playerDeck) {
    let cardsPlayedArray = [];

    for (let i = 0; i <= activeCardIndex; i++) {
        cardsPlayedArray.push(player_deck[0]);
        player_deck.shift();
        cardsPlayedArray.push(opponent_deck[0]);
        opponent_deck.shift();
    }
    playerDeck.push(...cardsPlayedArray);
}

function checkWin() {
    if (player_deck.length === 0) {
        gameConsole.innerText = "You have zero cards left. You Lost!";
        return true;
    } else if (opponent_deck.length === 0) {
        gameConsole.innerText = "Your opponent has no cards left. You Won!";
        return true;
    } else {
        return false;
    }
}

function war() {
    activeCardIndex += 4;
    if (checkWarWin(activeCardIndex)) {
        return true;
    }
    updateGUI(activeCardIndex);
    gameConsole.innerText = "War!";
    console.log("war");
    compareCards(activeCardIndex);
}

function checkWarWin(cardIndex) {
    if (player_deck.length < (cardIndex + 1)) {
        gameConsole.innerText = "You have zero cards left. You Lost!";
        return true;
    } else if (opponent_deck.length < (cardIndex + 1)) {
        gameConsole.innerText = "Your opponent has no cards left. You Won!";
        return true;
    } else {
        return false;

    }
}

function updateGUI(cardIndex) {
    if (opponentPlayedCard.children.length != 0 || playerPlayedCard.children.length != 0) {
        opponentPlayedCard.innerHTML = "";
        playerPlayedCard.innerHTML = "";
    }
    let player_card = createCardElement(player_deck[cardIndex]);
    let opponent_card = createCardElement(opponent_deck[cardIndex]);
    playerPlayedCard.appendChild(player_card);
    opponentPlayedCard.appendChild(opponent_card);
}

const opponentDeckNum = document.getElementById('opponent-deck-num');
const playerDeckNum = document.getElementById('player-deck-num');

function updateMessage(winner) {
    if (winner === 1) {
        gameConsole.innerText = "You won that round!";
    } else if (winner === 2) {
        gameConsole.innerText = "Your opponent won that round!";
    }

    opponentDeckNum.innerText = opponent_deck.length;
    playerDeckNum.innerText = player_deck.length;

}

function createCardElement(card) {
    let cardElement = document.createElement("div");
    cardElement.classList.add('card', 'fade-in');
    let cardValue = document.createTextNode(card.Value);
    cardElement.appendChild(cardValue);
    let br = document.createElement("br");
    cardElement.appendChild(br);
    switch (card.Suit) {
        case "spades":
            cardElement.insertAdjacentHTML('beforeend', "&#x02660;");
            break;
        case "diamonds":
            cardElement.insertAdjacentHTML('beforeend', "&#x02666;");
            break;
        case "clubs":
            cardElement.insertAdjacentHTML('beforeend', "&#x02663;");
            break;
        case "hearts":
            cardElement.insertAdjacentHTML('beforeend', "&#x02665;");
            break;
        default:
            console.log("ERROR on suits");
    }
    return cardElement;
}

function resetGame() {
    deck = createDeck();
    deckShuffle(deck);
    player_deck = deck.slice(0, 26);
    opponent_deck = deck.slice(26);
    playerTurn = true;
    activeCardIndex = 0;

    gameConsole.innerText = "The game has been reset";
    opponentPlayedCard.innerHTML = "";
    playerPlayedCard.innerHTML = "";
    playButton.disabled = false;
    resetButton.style.display = 'none';
}
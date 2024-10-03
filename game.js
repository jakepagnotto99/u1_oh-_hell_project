let deckId = '';
let player1Deck = [];
let player2Deck = [];
let p1Score = 0;
let p2Score = 0;

// Fetch deck and shuffle
async function shuffleDeck() {
    let response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    let data = await response.json();
    deckId = data.deck_id;

    // Draw all cards and split between players
    dealCards();
}

// Dealing Cards (splitting deck)
async function dealCards() {
    let response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`);
    let data = await response.json();

    // Split deck into two hands
    player1Deck = data.cards.slice(0, 26);
    player2Deck = data.cards.slice(26, 52);
}

// Flipping Cards
function flipCards() {
    let p1Card = player1Deck.shift();
    let p2Card = player2Deck.shift();

    // Display card images
    document.querySelector('#p1-hand').innerHTML = `<div class="card"><img src="${p1Card.image}" alt="${p1Card.code}"></div>`;
    document.querySelector('#p2-hand').innerHTML = `<div class="card"><img src="${p2Card.image}" alt="${p2Card.code}"></div>`;

    // Compare cards and update score
    let p1Value = convertCardValue(p1Card.value);
    let p2Value = convertCardValue(p2Card.value);

    if (p1Value > p2Value) {
        p1Score += 2;
    } else if (p2Value > p1Value) {
        p2Score += 2;
    }

    // Update scoreboard
    document.getElementById('p1-score').textContent = p1Score;
    document.getElementById('p2-score').textContent = p2Score;

    function triggerWar() {
        alert("War! Both players place three cards face down and reveal the next one.");
        if (player1Deck.length >= 4 && player2Deck.length >= 4) {
            let p1WarCards = player1Deck.splice(0, 4);
            let p2WarCards = player2Deck.splice(0, 4);
            let p1FinalCard = p1WarCards[3];
            let p2FinalCard = p2WarCards[3];
    
            document.querySelector('#p1-hand').innerHTML = `<div class="card"><img src="${p1FinalCard.image}" alt="${p1FinalCard.code}"></div>`;
            document.querySelector('#p2-hand').innerHTML = `<div class="card"><img src="${p2FinalCard.image}" alt="${p2FinalCard.code}"></div>`;
    
            let p1FinalValue = convertCardValue(p1FinalCard.value);
            let p2FinalValue = convertCardValue(p2FinalCard.value);
    
            if (p1FinalValue > p2FinalValue) {
                p1Score += p1WarCards.length + p2WarCards.length;
            } else if (p2FinalValue > p1FinalValue) {
                p2Score += p1WarCards.length + p2WarCards.length;
            } else {
                // Repeat war if there's another tie
                triggerWar();
            }
        } else {
            // End the game if someone doesn't have enough cards for war
            declareWinner();
        }
    }

    // Play background music when the game starts
document.getElementById('backgroundMusic').play();

// Play flip sound on each card flip
function flipCards() {
    document.getElementById('cardFlipSound').play();  // Card flip sound
    
    // Flip card logic...
}

// Play war sound during war scenario
function triggerWar() {
    document.getElementById('warSound').play();  // Play war sound
    alert("War! Both players place three cards face down and reveal the next one.");
    // War logic...
}


    // Update cards remaining
    document.getElementById('cards-left').textContent = player1Deck.length;
}

// Convert face cards to numeric values
function convertCardValue(value) {
    if (value === "ACE") return 14;
    if (value === "KING") return 13;
    if (value === "QUEEN") return 12;
    if (value === "JACK") return 11;
    return parseInt(value);
}

// Event listener for round start
document.getElementById('flip-btn').addEventListener('click', flipCards);

// Initial setup
shuffleDeck();



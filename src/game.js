const DECK_SIZE = 6;
let deckId;
let playerCards = [];
let pcCards = [];
let playerTurn = true;
let hitMeDisabled = false;
async function initializeGame() {
    playerCards = [];
    pcCards = [];
    playerTurn = true;
    hitMeDisabled = false;
    /*document.getElementById("playerBusted").style.display = "none";
    document.getElementById("pcBusted").style.display = "none";
    document.getElementById("playerWon").style.display = "none";
    document.getElementById("pcWon").style.display = "none";*/
    document.getElementById("playerTurn").style.display = playerTurn ? "block" : "none";
    await shuffleDeck();
    await deal();
}
async function shuffleDeck() {
    let response = await fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${DECK_SIZE}`);
    let data = await response.json();
    deckId = data.deck_id;
}
async function deal() {
    playerCards.push(await drawCard());
    pcCards.push(await drawCard());
    playerCards.push(await drawCard());
    updateUI();
}
async function drawCard() {
    let response = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    let data = await response.json();
    return data.cards[0];
}

function updateUI() {
    document.getElementById("pcArea").innerHTML = `
					<h3>Dealer</h3>${pcCards.map(card => `
					<img src="${card.image}" title="${card.value} of ${card.suit}">`).join("")}`;
    document.getElementById("playerArea").innerHTML = `
						<h3>Player</h3>${playerCards.map(card => `
						<img src="${card.image}" title="${card.value} of ${card.suit}">`).join("")}`;
    document.getElementById("playerTurn").style.display = playerTurn ? "block" : "none";
}
async function hitMe() {
    if (!hitMeDisabled) {
        hitMeDisabled = true;
        playerCards.push(await drawCard());
        updateUI();
        if (calculateTotal(playerCards) > 21) {
            playerTurn = false;
            document.getElementById("playerTurn").style.display = "none";
            document.getElementById("playerBusted").style.display = "block";
            await delay(3000);
            playerTotal=0;
            pcTotal=0;
            //initializeGame();
            location.reload();
        }
        updateUI();
        hitMeDisabled = false;
    }
}

function stay() {
    playerTurn = false;
    document.getElementById("playerTurn").style.display = "none";
    document.getElementById("pcTurn").style.display = "block";
    startDealer();
}
async function startDealer() {
    while (calculateTotal(pcCards) < 17) {
        pcCards.push(await drawCard());
        updateUI();
        await delay(1000);
    }
    endGame();
}

async function endGame() {
    let playerTotal = calculateTotal(playerCards);
    let pcTotal = calculateTotal(pcCards);
    if (pcTotal <= 21 && (playerTotal < pcTotal)) {
        document.getElementById("pcWon").style.display = "block";
    }else if (pcTotal <= 21 && (playerTotal > pcTotal)) {
        document.getElementById("playerWon").style.display = "block";
    } else if (pcTotal <= 21 && (playerTotal === pcTotal)) {
        document.getElementById("tie").style.display = "block";
    } else if (pcTotal > 21) {
        document.getElementById("pcBusted").style.display = "block";
    }
    await delay(3000);
    //playerTotal=0;
    //pcTotal=0;
    location.reload();
    //initializeGame();
}

function calculateTotal(cards) {
    let total = 0;
    let aceCount = 0;
    for (let card of cards) {
        if (card.value === "ACE") {
            aceCount++;
            total += 11;
        } else if (["JACK", "QUEEN", "KING"].includes(card.value)) {
            total += 10;
        } else {
            total += parseInt(card.value);
        }
    }
    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }
    return total;
}

function volver(){
    window.location.href = "index.html";
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
initializeGame();
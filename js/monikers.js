// Array consisting of the point values for each card.
const DECK = [
	3,2,2,4,2,
	2,3,1,2,3,
	2,2,3,4,1,
	3,2,2,4,2,
	4,2,2,2,2,
	3,2,3,2,4,
	2,2,2,2,2,
	3,2,4,2,2,
	2,2,1,2,4,
	2,3,2,2,2,
	1,1,2,3,2,
	1,2,2,1,1,
	1,4,1,3,1,
	1,1,1,1,4,
	1,2,3,1,1,
	1,1,3,1,1,
	1,1,2,1,1,
	2,1,2,2,2,
	2,2,2,2,3,
	2,1,1,2,2,
	2,3,2,2,2,
	1,2,2,2,2,
	2,3,2,2,2,
	2,3,2,2,2,
	2,2,2,3,2,
	4,2,1,3,4,
	2,2,3,2,2,
	3,2,2,1,2,
	2,1,4,3,1,
	3,4,1,1,2,
	1,1,4,1,1,
	3,2,1,1,2,
	2,1,3,3,1,
	1,1,4,2,1,
	2,1,2,1,3,
	2,2,1,1,2,
	1,1,3,1,1,
	3,1,1,1,1,
	1,1,1,2,2,
	1,1,2,2,4,
	4,2,3,2,2,
	4,4,2,3,2,
	2,4,4,3,4,
	4,4,4,2,4,
	4,3,4,4,4,
	1,4,3,1,4,
	4,4,4,2,4,
	2,2,2,4,2,
	1,2,2,3,4,
	4,4,4,4,4,
	4,2,2,2,4,
	2,3,2,2,2,
	2,2,2,2,2,
	2,2,2,4,2,
	2,2,2,2,2,
	2,2,2,2,1,
	2,2,2,2,2,
	2,3,2,4,2,
	1,2,2,1,2,
	3,2,3,2,3,
	3,3,3,3,3,
	3,4,2,3,3,
	3,2,1,3,3,
	3,2,3,3,3,
	2,3,3,3,3,
	3,3,3,3,4,
	3,3,3,2,3,
	3,3,4,2,3,
	2,3,1,2,2,
	3,3,2,2,3,
	3,4,2,3,3,
	3,3,3,3,3,
	3,3,4,3,3,
	3,3,3,3,3,
	3,3,1,3,4,
	3,3,3,3,4,
	3,2,3,3,3,
	3,3,3,3,3,
	3,3,3,2,3,
	4,2,3,3,3,
	3,3,3,2,3,
	3,3,3,3,3,
	3,1,1,3,3,
	3,1,4,3,3,
	4,3,3,3,3,
	3,3,3,3,3,
	3,2,2,4,3,
	3,3,3,3,1,
	4,2,2,1,4,
	2,4,3,2,1,
	2,1,2,1,4,
	3,3,2,2,3,
	3,4,4,3,4,
	4,1,3,3,2,
	2,2,2,3,4,
	3,3,3,2,2,
	2,2,3,4

];
var TOTAL_CARD_NUM = DECK.length;

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function Game(cardNum, numRounds, team1Name, team2Name) {
	this.deck = [];
	this.previousCards = [];
	this.bluePile = [];
	this.redPile = [];
	this.blueName = team1Name;
	this.redName = team2Name;
	this.passedPile = []
	this.undoInfo = null
	this.currentCard = -1
	this.bluePoints = 0
	this.redPoints = 0
	this.currentRound = 1
	this.numRounds = numRounds
	this.cardNum = parseInt(cardNum);
	this.cardsJustGotten = 0
	this.cardsJustPassed = 0
	this.cardsInPileAtStartOfTurn
	//currentTurn = 1 corresponds to blue, -1 corresponds to red
	this.currentTurn
	this.init = function() {
		var deck = []
		this.previousCards = this.restoreStateFromSplitString("previousCards");

		// Determine if we have enough unique cards to play with. If not,
		// clear out the previousCards list and start over.
		if (TOTAL_CARD_NUM < this.previousCards.length + this.cardNum) {
			console.log("Resetting Previous Cards!");
			this.previousCards = [];
		}

		while (deck.length < this.cardNum) {
			var random = Math.floor(Math.random() * TOTAL_CARD_NUM);
			if(deck.indexOf(random) == -1 && this.previousCards.indexOf(random + "") == -1)
				deck.push(random)
		}
		this.deck = shuffleArray(deck)

		if(Math.random() < 0.5)
			this.currentTurn = -1
		else
			this.currentTurn = 1

		console.log("PREVIOUS CARDS: " + this.previousCards.toString());
		console.log("DECK CARDS: " + this.deck.toString());
	}
	this.getNextTeam = function() {
		if(this.currentTurn == 1)
			return this.blueName
		else
			return this.redName
	}
	this.getGameStatus = function() {
		if(this.redPoints > this.bluePoints)
			return this.redName + " is winning!"
		else if(this.bluePoints > this.redPoints)
			return this.blueName + "is winning!"
		else
			return "The game is tied!"
	}
	this.getFinalGameStatus = function() {
		// Store the previous cards and old deck to ensure that we don't see those again.
		localStorage.setItem("previousCards", this.deck.concat(this.previousCards));

		if(this.redPoints > this.bluePoints)
			return this.redName + " won!"
		else if(this.bluePoints > this.redPoints)
			return this.blueName + " won!"
		else
			return "It's a tie!"
	}
	this.getCardValue = function(card) {
		if (card === "") {
			return 0;
		}
		return DECK[card];
	}
	//Whenever a card is passed, it is added to the passed pile
	this.pass = function() {
		if(this.currentCard == -1)
			return false
		this.passedPile.push(this.currentCard)
		this.undoInfo = [this.currentCard]
		return true
	}
	//When a card is gussed, it is added to the pile for the corresponding team
	this.correct = function() {
		if(this.currentCard == -1)
			return false
		if(this.currentTurn == 1) {
			this.bluePile.push(this.currentCard)
			this.undoInfo = [this.currentCard]
		}
		else {
			this.redPile.push(this.currentCard)
			this.undoInfo = [this.currentCard]
		}
		return true
	}
	this.nextCard = function() {
		//If the deck is empty, then the passed pile becomes the deck. If there is no passed pile, the round is over
		if(this.deck.length == 0) {
			if(this.passedPile.length == 0) {
				return -1
			}
			else {
				this.deck = this.passedPile.reverse().slice()
				this.passedPile = []
			}
		}
		this.currentCard = this.deck.pop()
		if(this.undoInfo != null)
			this.undoInfo.push(this.currentCard)
		return this.currentCard
	}
	//The undo button allows you to undo the last action taken. If you click undo, clicking undo again will do nothing
	//undoInfo is an array with two values. The first value is the value of the card that was put into the wrong pile. 
	//The second value is the value of the card that came after the misclicked card
	//Clicking undo restores the first value as currentCard and puts the second value on top of the deck
	this.undo = function() {
		if(this.undoInfo == null)
			return false
		this.deck.push(this.undoInfo[1])
		this.currentCard = this.undoInfo[0]
		this.undoInfo = null;
		return true;
	}
	//At the start of the turn, the number of cards in the current teams pile is noted so that the change can be calculated at the end of the turn
	this.startTurn = function() {
		if(this.currentTurn == 1)
			this.cardsInPileAtStartOfTurn = this.bluePile.length
		else
			this.cardsInPileAtStartOfTurn = this.redPile.length
	}
	this.endTurn = function() {
		if(this.currentCard == -1)
			return false
		//The number of cards guessed and passed are noted so they can be reported
		this.cardsJustPassed = this.passedPile.length
		if(this.currentTurn == 1)
			this.cardsJustGotten = this.bluePile.length - this.cardsInPileAtStartOfTurn
		else
			this.cardsJustGotten = this.redPile.length - this.cardsInPileAtStartOfTurn

		//The last card is put in the passed pile, and then the passed pile is merged with the deck for the next turn
		this.passedPile.push(this.currentCard)
		this.deck = this.passedPile.concat(this.deck)
		this.passedPile = []
		this.undoInfo = null
		this.currentCard = -1
		this.currentTurn = this.currentTurn * -1;
		return true
	}
	//Point totals are calculated at the end of the round
	//The deck is restored by combining the blue and red piles
	this.nextRound = function() {
		this.currentRound += 1
		for(var i = 0; i < this.redPile.length; i++) 
			this.redPoints += this.getCardValue(this.redPile[i])
		for(var i = 0; i < this.bluePile.length; i++) 
			this.bluePoints += this.getCardValue(this.bluePile[i])

		this.deck = shuffleArray(this.redPile.concat(this.bluePile))
		this.redPile = []
		this.bluePile = []
		if(this.redPoints > this.bluePoints)
			this.currentTurn = 1
		else if(this.bluePoints > this.redPoints)
			this.currentTurn = -1
		else
			this.currentTurn = (Math.random() < 0.5) ? 1 : -1
	}
	this.storeState = function(currentPhase) {
		localStorage.setItem("deck", this.deck.toString());
		localStorage.setItem("previousCards", this.previousCards.toString());
		localStorage.setItem("bluePile", this.bluePile.toString());
		localStorage.setItem("redPile", this.redPile.toString());
		localStorage.setItem("blueName", this.blueName);
		localStorage.setItem("redName", this.redName);
		localStorage.setItem("bluePoints", this.bluePoints.toString());
		localStorage.setItem("redPoints", this.redPoints.toString());
		localStorage.setItem("currentRound", this.currentRound.toString());
		localStorage.setItem("currentTurn", this.currentTurn.toString());
		localStorage.setItem("cardNum", this.cardNum.toString());
		localStorage.setItem("cardsJustGotten", this.cardsJustGotten.toString());
		localStorage.setItem("cardsJustPassed", this.cardsJustPassed.toString());
		localStorage.setItem("currentPhase", currentPhase);
	}
	this.restoreState = function() {
		this.deck = this.restoreStateFromSplitString("deck");
		this.previousCards = this.restoreStateFromSplitString("previousCards");
		this.bluePile = this.restoreStateFromSplitString("bluePile");
		this.redPile = this.restoreStateFromSplitString("redPile");
		this.blueName = localStorage.getItem("blueName");
		this.redName = localStorage.getItem("redName");
		this.bluePoints = parseInt(localStorage.getItem("bluePoints"));
		this.redPoints = parseInt(localStorage.getItem("redPoints"));
		this.currentRound = parseInt(localStorage.getItem("currentRound"));
		this.currentTurn = parseInt(localStorage.getItem("currentTurn"));
		this.cardNum = parseInt(localStorage.getItem("cardNum"));
		this.cardsJustGotten = parseInt(localStorage.getItem("cardsJustGotten"));
		this.cardsJustPassed = parseInt(localStorage.getItem("cardsJustPassed"));
	}
	this.clearState = function() {
		// Purposely ignore clearing "previousCards"
		localStorage.removeItem("deck");
		localStorage.removeItem("bluePile");
		localStorage.removeItem("redPile");
		localStorage.removeItem("blueName");
		localStorage.removeItem("redName");
		localStorage.removeItem("bluePoints");
		localStorage.removeItem("redPoints");
		localStorage.removeItem("currentRound");
		localStorage.removeItem("currentTurn");
		localStorage.removeItem("cardNum");
		localStorage.removeItem("cardsJustGotten");
		localStorage.removeItem("cardsJustPassed");
		localStorage.removeItem("currentPhase");
	}

	this.restoreStateFromSplitString = function(name) {
		if (localStorage.getItem(name) && localStorage.getItem(name) !== "") {
			return localStorage.getItem(name).split(",");
		} else {
			return [];
		}
	}
} 

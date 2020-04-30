const _ = require('underscore');
const constants = require('../constants');
const Hand = require('./hand');
const Deck = require('./deck');
const Card = require('./cards');

class BidRound {
    constructor(deck, players, trumpValue, trumpSuit, roundNumber) {
        this._roundNumber = roundNumber;
        this._deck = deck;
        this._players = players;
        this._hands = {};
        for (let i = 0; i < this._players.length; i ++) {
            this._hands[this._players[i]] = new Hand(trumpValue, trumpSuit);
        }
        this._trumpValue = trumpValue;
        this._trumpSuit = trumpSuit;
        this._declarer = this._players[0];
        this._bottom = new Deck();
        this._ready = 0;
    }

    get deck() {
        return this._deck;
    }

    deal() {
        // console.log("original player order", this._players);
        this._deck.shuffle();
        let i = 0;
        constants.interval = setInterval(() => {
            let card = this._deck.deal();
            // TODO: CHANGE mod back to 4, i === 100
            constants.su.emitDealCard(this._players[i % constants.numPlayers], [card.value, card.suit]);
            this._hands[this._players[i % constants.numPlayers]].pushCard(card);
            i++;
            if (this._deck.cards.length === constants.numBottom) {
                clearInterval(constants.interval);
            }
        }, 20);
    }

    receiveBid(bid, socketId) {
        this._trumpSuit = bid[1] === 'J' ? 'NT' : bid[1];

        this._declarer = this._roundNumber === 0 ? socketId : this._players[0];
        console.log('bidRound:receiveBid - Received bid', `bidder: ${constants.su._sockets[this._bidWinner]}, trumpSuit: ${this._trumpSuit}`);
    }

    doneBid() {
        this._ready += 1;
        if (this._ready === this._players.length) {
            console.log('bidRound:doneBid - Done bidding', `bidWinner: ${constants.su._sockets[this._bidWinner]}, trumpSuit: ${this._trumpSuit}`);
            // console.log('bidRound:doneBid - Bottom cards:', this._deck);
            for (let i = 0; i < this._players.length; i ++) {
                this._hands[this._players[i]].trumpSuit = this._trumpSuit;
            }
            this.sendBottom();
            if (this._roundNumber === 0) {
                this.rotatePlayers();
            }
        }
    }

    sendBottom() {
        let bottom = [];
        for (let i = 0; i < constants.numBottom; i++) {
            let card = this._deck.deal();
            bottom.push([card.value, card.suit]);
            this._hands[this._declarer].pushCard(card);
        }
        constants.su.emitBottom(this._declarer, bottom);
        constants.su.subNewBottom(this._declarer, this);
        this.sortHands();
    }

    rotatePlayers() {
        const i = _.indexOf(this._players, this._declarer);
        let temp = [];
        for (let j = 0; j < this._players.length; j++) {
            temp[j] = this._players[(j + i) % this._players.length];
        }
        for (let j = 0; j < this._players.length; j++) {
            this._players[j] = temp[j];
        }
        // console.log('Rotated Player Order', this._players);
    }

    set bottom(cards) {
        for (let i = 0; i < cards.length; i++) {
            // let card = new Card(cards[i][0], cards[i][1]);
            this._hands[this._declarer].removeCard(new Card(cards[i][0], cards[i][1]));
            this._bottom.pushCard(new Card(cards[i][0], cards[i][1]));
        }
        console.log('after sort after returning bottom', this._hands[this._declarer]);
        console.log('bidRound:setBottom - Bottom sent by declarer:', this._bottom);
    }

    get bottom() {
        return this._bottom;
    }

    sortHands() {
        for (let i = 0; i < this._players.length; i ++) {
            this._hands[this._players[i]].sortHand(this._trumpSuit);
            // console.log('Highest Single:', this._hands[this._players[i]].highestSingle('T'));
            // console.log('Highest Double:', this._hands[this._players[i]].highestDouble('T'));
        }
    }

    get hands() {
        return this._hands;
    }

}

module.exports = BidRound;

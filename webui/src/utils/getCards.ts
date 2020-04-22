export class Card {
  suits: Array<string>;
  jokers: Array<string>;
  cards: Array<any>;

  constructor() {
    this.suits = ['H', 'C', 'S', 'D']; //hearts, clubs, spades, diamonds
    this.jokers = ['S', 'B']; // Small, big
    this.cards = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
  }

  isValidCard(arr: any[]) {
    if (arr[1] === 'T') {
      // if it is a joker,
      return this.jokers.includes(arr[0]);
    }
    
    let valid_card: boolean = this.cards.includes(arr[0]);
    let valid_suit: boolean = this.suits.includes(arr[1]);

    return valid_card && valid_suit;
  }

  getSvg(arr: any[]) {
    if (!this.isValidCard(arr)) {
      throw new Error(`Invalid cards: ${arr}`);
    }

    return `${arr[0]}${arr[1]}`
  }
};
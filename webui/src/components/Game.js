import React, { Component } from "react";
import { connect } from 'react-redux';
import styled from 'styled-components';

import PlayingCards from '../utils/Cards';
import {
  getCardsIO,
  getNewBidIO,
  getTrumpValueIO,
  getBottomIO
} from "../socket/connect";

import {
  getMyCards,
  updateState,
  getExistingClients,
  getCurrentBid,
  getTrumpValue,
  getTrumpTracker,
  getCanSelectCards,
  getNumCardsSelected,
  getScreenSize,
  getValidBids
} from '../redux/selectors';

import {
  updateCardsInHand,
  setCurrentBid,
  setTrumpValue,
  updateNumCardsSelected,
  toggleCardSelector,
  toggleBidButtons,
  setValidBids
} from '../redux/actions';

const Cards = new PlayingCards('/cardsSVG/');

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardWidth: 120,
      cardHeight: 168,
      cardSelectedHeight: -30,
      cardHoveredHeight: -50,
      numCardsForBottom: 0
    };
  }
  // all listeners required pre-game goes here
  componentDidMount() {
    getTrumpValueIO(this.props.setTrumpValue.bind(this));
    getCardsIO(this.setCards.bind(this));
    getNewBidIO(this.updateBidStatus.bind(this));
    getBottomIO(this.receiveBottomCards.bind(this));
    this.setCardSize();
  }

  setCardSize() {
    const {
      appWidth
    } = this.props;
    let cardWidth, cardHeight, cardHoveredHeight, cardSelectedHeight;

    if (appWidth === 2560) {
      cardWidth = 204;
      cardHeight = 286;
      cardSelectedHeight = -70;
      cardHoveredHeight = -90;
    } 
    if (appWidth === 1920) {
      cardWidth = 120;
      cardHeight = 168;
      cardSelectedHeight = -30;
      cardHoveredHeight = -50;
    }
    if (appWidth === 1280) {
      cardWidth = 110;
      cardHeight = 148;
      cardSelectedHeight = -50;
      cardHoveredHeight = -30;
    }

    this.setState({
      cardWidth,
      cardHeight,
      cardHoveredHeight,
      cardSelectedHeight
    })
  }

  setCards(newCard) {
    if (!newCard || newCard.length !== 2) {
      return;
    }

    const {
      trumpValue,
      trumpTracker,
      validBids,
      currentBid,
      cards
    } = this.props;

    Cards.insertCard(cards, newCard, trumpValue, currentBid);
    Cards.newTrump(trumpTracker, validBids, newCard, currentBid, trumpValue);
    this.props.setValidBids(validBids);
    this.props.updateCardsInHand(cards, trumpTracker);
  }

  receiveBottomCards(bottomCards) {
    bottomCards.forEach(bottomCard => {
      this.setCards(bottomCard);
    });
    this.props.toggleCardSelector(true);
    this.props.toggleBidButtons(false);
  }

  toggleSingleCard(cardIndex) {
    const {
      cards,
      numCardsSelected
    } = this.props;
    let isSelected = cards[cardIndex].isSelected;

    if (!isSelected) {
      this.props.updateNumCardsSelected(numCardsSelected + 1);
    } else {
      this.props.updateNumCardsSelected(numCardsSelected - 1);
    }
    cards[cardIndex].isSelected = !isSelected;
  }

  toggleCards(cardIndex) {
    const {
      cards,
      trumpTracker,
      canSelectCards,
      numCardsSelected
    } = this.props;
    let isSelected = cards[cardIndex].isSelected;
    console.log('cantoggleCards', canSelectCards);
    
    if (!canSelectCards) {
      return;
    }

    if (cards.length > 25 && !isSelected && numCardsSelected === 4) {
        window.alert('Maximum cards for bottom selected');
        return;
    }

    this.toggleSingleCard(cardIndex);
    this.props.updateCardsInHand(cards, trumpTracker);
  }

  updateBidStatus(socketId, bid) {
    const {
      trumpTracker,
      validBids,
    } = this.props;
    Cards.receiveBid(bid, trumpTracker, validBids);
    this.props.setCurrentBid(socketId, bid);
  }

  render() {
    const {
      cards,
      numCards
    } = this.props;
    const {
      cardWidth,
      cardHeight,
      cardSelectedHeight,
      cardHoveredHeight
    } = this.state;
    return (
      <Container
        height={cardHeight}
      >
        {cards.map((card, i) => {
          return (
            <CardImgContainer
              height={cardHeight}
              onClick={() => { this.toggleCards(i) }}
              numCards={numCards}
              cardWidth={cardWidth}
              cardHoveredHeight={cardHoveredHeight}
              zIndex={i}
            >
              <CardImg
                // TODO: enable drag and drop custom sorting later?
                draggable={false}
                width={cardWidth}
                height={cardHeight}
                isSelected={card.isSelected}
                cardSelectedHeight={cardSelectedHeight}
                src={card.svg}
                key={i}
              />
            </CardImgContainer>
            // change the key prop to the name of card
          )
        })}
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  const cards = getMyCards(state);
  const connectedClients = getExistingClients(state);
  const currentBid = getCurrentBid(state);
  const trumpValue = getTrumpValue(state);
  const trumpTracker = getTrumpTracker(state);
  const validBids = getValidBids(state);
  const canSelectCards = getCanSelectCards(state);
  const numCardsSelected = getNumCardsSelected(state);
  const { appWidth, appHeight } = getScreenSize(state);
  const numCards = cards.length;
  
  const changeState = updateState(state);
  return {
    cards,
    numCards,
    connectedClients,
    appWidth,
    appHeight,
    canSelectCards,
    numCardsSelected,
    currentBid,
    trumpValue,
    trumpTracker,
    validBids,
    changeState,
  }
}

const Container = styled.div`
  position: fixed;
  display: flex;
  bottom: 25px;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  /* width: 1800px; */
  height: ${prop => `${prop.height * 1.6}px`};
  overflow-y: hidden;
`;

const CardImg = styled.img`
  flex-shrink: 0;
  width: ${prop => `${prop.width}px`};
  height: ${prop => `${prop.height}px`};
  transform: ${prop => prop.isSelected && `translateY(${prop.cardSelectedHeight}px);`};
`;

const CardImgContainer = styled.span`
  z-index: ${prop => prop.zIndex};
  display: flex;
  align-items: flex-end;
  height: ${prop => `${prop.height * 1.6}px`};

  &:not(:first-child) {
    /* margin-left: ${prop => `-${prop.numCards * 2.3}px`}; */
    margin-left: ${prop => `-${prop.cardWidth * 0.65}px`};
  }

  &:hover ${CardImg} {
    z-index: 100;
    transform: ${prop => `translateY(${prop.cardHoveredHeight}px);`}
  }
`;

export default connect(mapStateToProps, {
  updateCardsInHand,
  setValidBids,
  setTrumpValue,
  updateNumCardsSelected,
  toggleCardSelector,
  toggleBidButtons,
  setCurrentBid
})(Game);


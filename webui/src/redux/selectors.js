export const getScreenSize = store => ({
  appWidth: store.appWidth,
  appHeight: store.appHeight
});

export const getRoom = store => store.room;

export const getExistingClients = store => store.clients;

export const getExistingClientIds = store => store.clientIds;

export const updateState = store => store.numStateUpdated;

export const getName = store => store.name;

export const getId = store => store.id;

export const getBottomClient = store => store.currentBottomClient;

export const getMyCards = store => store.cards;

export const getValidBids = store => store.validBids;

export const getCurrentBid = store => store.currentBid;

export const getTrumpValue = store => store.trump;

export const getTrumpTracker = store => store.trumpTracker;

export const getCanSelectCards = store => store.canSelectCards;

export const getNumCardsSelected = store => store.numCardsSelected;

export const getCanBidForBottom = store => store.canBidForBottom;

export const getExistingTricks = store => store.existingTricks;

export const getClientTurn = store => store.currentClientTurn;

export const getPoints = store => store.points;

export const getCurrentTrickWinner = store => store.currentTrickWinner;

export const getCanStartNewRound = store => store.canStartNewRound;
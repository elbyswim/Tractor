import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8000";
const JUSTINS_NETWORK = "http://192.168.0.126:8000";

var socket = null;

export function connectToSocketIO(getStatusCb, name) {
  socket = io(ENDPOINT);
  if (socket.connected === false) {
    socket = io(JUSTINS_NETWORK);
  }
  getConnectionStatus(getStatusCb, name);
  setSocketID(name);
}

// ------------------ EVENT EMITTERS ------------------
export function makeBidIO(bid) {
  socket.emit('newBid', bid);
}

export function setDoneBidIO() {
  socket.emit('doneBid');
}

// returning the 8 cards you don't want
export function returnBottomIO(bottom) {
  socket.emit('newBottom', bottom);
}

function setSocketID(id) {
  socket.emit('setSocketId', id);
}

// ------------------ EVENT LISTENERS ------------------
export function getBottom(setBottomCardsCb) {
  socket.on('originalBottom', (cards) => setBottomCardsCb(cards));
}

export function getConnectedClientsIO(setClientsCb) {
  socket.on('newClientConnection', setClientsCb);
}

export function getCardsIO(setCardsCb) {
  socket.on('dealCard', setCardsCb);
}

export function getNewBidIO(setNewBidCb) {
  socket.on('setNewBid', (socketId, bid) => setNewBidCb(socketId, bid));
}

export function getTrumpValueIO(setTrumpValueCb) {
  socket.on('setTrumpValue', trump => setTrumpValueCb(trump));
}

function getConnectionStatus(setStatusCb, name) {
  socket.on('connectionStatus', status => setStatusCb(status, socket.id, name));
}

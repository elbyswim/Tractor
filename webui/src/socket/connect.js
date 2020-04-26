import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8000";

var socket = null;

export function connectToSocketIO(getStatusCb, name) {
  socket = io(ENDPOINT);
  getConnectionStatus(getStatusCb, name);
  setSocketID(name);
}

export function getConnectedClientsIO(setClientsCb) {
  socket.on('newClientConnection', setClientsCb);
}

export function getCardsIO(setCardsCb) {
  socket.on('dealCard', setCardsCb);
}

export function makeBidIO(suit) {
  console.log(socket);
  socket.emit('newBid', suit);
}

export function getNewBidIO(setNewBidCb) {
  socket.on('setNewBid', id => setNewBidCb(id));
}

function setSocketID(id) {
  socket.emit('setSocketId', id);
}

function getConnectionStatus(setStatusCb, name) {
  socket.on('connectionStatus', status => setStatusCb(status, socket.id, name));
}

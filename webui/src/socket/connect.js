import io from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:8000";

var socket = null;

export function connectToSocket(getStatusCb, id) {
  socket = io(ENDPOINT);
  getConnectionStatus(getStatusCb);
  setSocketID(id);
}

function setSocketID(id) {
  socket.emit('setSocketID', id);
}

function getConnectionStatus(setStatusCb) {
  socket.on('connectionStatus', status => setStatusCb(status));
}
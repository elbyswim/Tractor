const _ = require('underscore');
const Game = require('../game/game');
const app = require('../app');
const constants = require('../constants');

class SocketUtil {
    constructor(io) {
        this._sockets = {};
    }

    // ------------ HELPERS ------------

    get sockets() {
        return this._sockets;
    }

    clearNullSockets() {
        this._sockets = _.omit(this._sockets, (value) => {
            return value === null;
        });
    }

    getNumClients() {
        return Object.keys(this._sockets).length;
    }

    getSocket(socketId) {
        return constants.io.to(socketId);
    }

    start() {
        console.log('start:', Object.keys(this._sockets).length)
        // TODO: CHANGE SOCKET LENGTH BACK TO 4
        if (Object.keys(this._sockets).length === 2) {
            const game = new Game(Object.keys(this._sockets));
            game.new_round()
        }
    }

    // ------------ SOCKET EMITTERS ------------
    emitConnectedClients() {
        this.clearNullSockets();
        console.log('Total clients:', Object.values(this._sockets));
        constants.io.emit('newClientConnection', this._sockets);
    }

    emitDealCard(socketId, card) {
        constants.io.to(socketId).emit('dealCard', card)
    }

    emitConnectionStatus(socketId, socketStatus = false) {
        constants.io.to(socketId).emit('connectionStatus', socketStatus);
    }

    emitTrumpValue(trumpValue) {
        console.log(`A new round has started. ${trumpValue}'s are trump.`)
        constants.io.emit('trumpValue', trumpValue)
    }

    // emitNewBid(socket, id, suit) {
    //     console.log(`${id} has made a bid of ${suit}.`);
    //     socket.broadcast.emit('setNewBid', id, suit);
    emitNewBid(socketId, suit) {
        console.log(`${this._sockets[socketId]} has made a bid of ${suit}.`);
        constants.io.to(socketId).broadcast.emit('setNewBid', socketId, suit);
    }



    // ------------ SOCKET SUBS ------------

    // setBottomListener(socket) {
    //     socket.on('newBid', (socketId, suit) => {
    //         this.emitNewBid(socket, id, suit);
    subSetBid(socketId) {
        console.log('subsetbid')
        constants.io.to(socketId).on('fucking magic', (suit) => {
            console.log('su listener')
            this.emitNewBid(socketId, suit);
        })
    }

    addSocket(socket) {
        // once clientId is received:
        // 1. send back connection status
        // 2. send all connect clients
        socket.on('setSocketId', (clientID) => {
            console.log(`Client ${clientID} has connected`);
            this._sockets[socket.id] = clientID;
            this.emitConnectionStatus(socket.id, socket.connected);
            this.emitConnectedClients();
            this.start();
        });
    }

    removeSocket(socket) {
        socket.on('disconnect', () => {
            clearInterval(global.interval);
            console.log(`Client ${this._sockets[socket.id]} has disconnected`);
            this._sockets[socket.id] = null;
            this.emitConnectedClients();
        });
    }
}

module.exports = SocketUtil;
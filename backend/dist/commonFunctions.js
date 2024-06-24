"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleRequests = void 0;
const HandleRequests = (socket, MessageType, games) => {
    const game = games.find((game) => game.player1 === socket || game.player2 === socket);
    if ((game === null || game === void 0 ? void 0 : game.player1) === socket) {
        game === null || game === void 0 ? void 0 : game.player2.send(JSON.stringify({ type: MessageType }));
    }
    else {
        game === null || game === void 0 ? void 0 : game.player1.send(JSON.stringify({ type: MessageType }));
    }
};
exports.HandleRequests = HandleRequests;

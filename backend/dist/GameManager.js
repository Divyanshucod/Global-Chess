"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const messages_1 = require("./messages");
const messages_2 = require("./messages");
const db_1 = require("./db");
const commonFunctions_1 = require("./commonFunctions");
const interval = 2 * 60 * 1000;
let intervalId;
class GameManager {
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter((user) => user !== socket);
        let checkplayer = this.games.find((data) => data.player1 === socket || data.player2 === socket);
        if ((checkplayer === null || checkplayer === void 0 ? void 0 : checkplayer.player1) === socket) {
            checkplayer === null || checkplayer === void 0 ? void 0 : checkplayer.player2.send(JSON.stringify({
                type: messages_1.DISCONNECTED,
                payload: {
                    type: "White",
                },
            }));
        }
        else {
            checkplayer === null || checkplayer === void 0 ? void 0 : checkplayer.player1.send(JSON.stringify({ type: messages_1.DISCONNECTED, payload: { type: "Black" } }));
        }
        //stop the game here user left
    }
    addHandler(socket) {
        socket.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    // start the game
                    let con = yield (0, db_1.createDatabaseconnection)();
                    yield (0, db_1.useDatabase)(con, "chess");
                    let id = yield (0, db_1.createNewGameInstance)(con);
                    yield (0, db_1.dataBaseDisconnection)(con);
                    const game = new Game_1.Game(this.pendingUser, socket, id, []);
                    this.games.push(game);
                    intervalId = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                        (0, db_1.StoreMovesInDatabase)(game.move, game.id);
                    }), interval);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            else if (message.type === messages_2.MOVE) {
                const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.payload.move, message.payload.id, game);
                }
            }
            else if (message.type === messages_1.Game_Over) {
                console.log("inside the winner");
                clearInterval(intervalId);
                const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                //remove game from you storage
                game === null || game === void 0 ? void 0 : game.player2.send(JSON.stringify({ type: messages_1.Game_Over }));
                game === null || game === void 0 ? void 0 : game.player1.send(JSON.stringify({ type: messages_1.Game_Over }));
            }
            else if (message.type === messages_1.NEW_GAME) {
                console.log("new game section");
                (0, commonFunctions_1.HandleRequests)(socket, messages_1.NEW_GAME, this.games);
            }
            else if (message.type === messages_1.NEW_GAMEACC) {
                console.log("new game accept section");
                (0, commonFunctions_1.HandleRequests)(socket, messages_1.NEW_GAMEACC, this.games);
            }
            else if (message.type === messages_1.NEW_GAMEDENI) {
                console.log("new game decline section");
                (0, commonFunctions_1.HandleRequests)(socket, messages_1.NEW_GAMEDENI, this.games);
            }
            else if (message.type === messages_1.REFRESHED) {
            }
        }));
    }
}
exports.GameManager = GameManager;

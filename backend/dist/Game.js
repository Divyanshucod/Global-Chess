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
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2, id, move) {
        this.player1 = player1;
        this.player2 = player2;
        this.id = id;
        this.move = move;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.MoveCnt = 0;
        this.player1.send(JSON.stringify({ type: messages_1.INIT_GAME, payload: { color: 'white', Chess_id: id } }));
        this.player2.send(JSON.stringify({ type: messages_1.INIT_GAME, payload: { color: 'black', Chess_id: id } }));
    }
    makeMove(socket, Move, id, games) {
        return __awaiter(this, void 0, void 0, function* () {
            // validation check 
            //validate the type of movein
            console.log('came');
            if (this.MoveCnt % 2 === 0 && socket !== this.player1) {
                console.log('return from 1');
                2;
                return;
            }
            if (this.MoveCnt % 2 === 1 && socket !== this.player2) {
                console.log('return from 2');
                return 1;
            }
            // update the board 
            try {
                this.board.move(Move);
            }
            catch (err) { // when piece movement is not right
                return;
            }
            // check if the game ends 
            if (this.board.isGameOver()) {
                this.player1.send(JSON.stringify({ type: messages_1.Game_Over, payload: { winner: this.board.turn() === 'w' ? 'black' : 'white' } }));
                this.player2.send(JSON.stringify({ type: messages_1.Game_Over, payload: { winner: this.board.turn() === 'w' ? 'black' : 'white' } }));
                return;
            }
            console.log('move reached in make move');
            games.move.push(Move);
            console.log('move reached after move');
            // send the updated move to both player
            if (this.MoveCnt % 2 === 0) {
                this.player2.send(JSON.stringify({ type: messages_1.MOVE, payload: Move }));
            }
            else {
                console.log('send1');
                this.player1.send(JSON.stringify({ type: messages_1.MOVE, payload: Move }));
            }
            this.MoveCnt++;
        });
    }
}
exports.Game = Game;

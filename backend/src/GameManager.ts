import WebSocket from "ws";
import { Game } from "./Game";
import {
  INIT_GAME,
  NEW_GAME,
  NEW_GAMEACC,
  NEW_GAMEDENI,
  Game_Over,
  REFRESHED,
  DISCONNECTED,
} from "./messages";
import { MOVE } from "./messages";
import {
  StoreMovesInDatabase,
  createDatabaseconnection,
  createNewGameInstance,
  dataBaseDisconnection,
  useDatabase,
} from "./db";
import { HandleRequests } from "./commonFunctions";
const interval = 2 * 60 * 1000;
let intervalId: any;
export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];
  constructor() {
    this.games = [];
    this.users = [];
    this.pendingUser = null;
  }

  addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }
  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);
    let checkplayer = this.games.find(
      (data) => data.player1 === socket || data.player2 === socket
    );
    
    if (checkplayer?.player1 === socket){
      
      checkplayer?.player2.send(
        JSON.stringify({
          type: DISCONNECTED,
          payload: {
            type: "White",
          },
        })
      );
    }
    else{
      checkplayer?.player1.send(
        JSON.stringify({ type: DISCONNECTED, payload: { type: "Black" } })
      );
    }
    //stop the game here user left
  }
  private addHandler(socket: WebSocket) {
    socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          // start the game
          let con = await createDatabaseconnection();
          await useDatabase(con, "chess");
          let id = await createNewGameInstance(con);
          await dataBaseDisconnection(con);
          const game = new Game(this.pendingUser, socket, id, []);
          this.games.push(game);
          intervalId = setInterval(async () => {
            StoreMovesInDatabase(game.move, game.id);
          }, interval);
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      } else if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          game.makeMove(socket, message.payload.move, message.payload.id, game);
        }
      } else if (message.type === Game_Over) {
        console.log("inside the winner");
        clearInterval(intervalId);
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        //remove game from you storage
        game?.player2.send(JSON.stringify({ type: Game_Over }));
        game?.player1.send(JSON.stringify({ type: Game_Over }));
      } else if (message.type === NEW_GAME) {
        console.log("new game section");

        HandleRequests(socket, NEW_GAME, this.games);
      } else if (message.type === NEW_GAMEACC) {
        console.log("new game accept section");
        HandleRequests(socket, NEW_GAMEACC, this.games);
      } else if (message.type === NEW_GAMEDENI) {
        console.log("new game decline section");

        HandleRequests(socket, NEW_GAMEDENI, this.games);
      } else if (message.type === REFRESHED) {
      }
    });
  }
}

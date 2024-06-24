import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { Game_Over, INIT_GAME, MOVE } from "./messages";
export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    public move:any;
    public id:any;
    public board:  Chess;
    private startTime: Date;
    private MoveCnt :number;
    constructor(player1:WebSocket,player2:WebSocket,id:any,move:any){
        this.player1 = player1;
        this.player2 = player2;
        this.id = id;
        this.move = move;
        this.board = new Chess();
        this.startTime = new Date();
        this.MoveCnt = 0;
        this.player1.send(JSON.stringify({type:INIT_GAME,payload:{color:'white',Chess_id:id}}));
        this.player2.send(JSON.stringify({type:INIT_GAME,payload:{color:'black',Chess_id:id}}));
    }
   async makeMove(socket:WebSocket,Move:{from:string,to:string},id:String,games:any){
        // validation check 
            //validate the type of movein
            console.log('came');
            
        if(this.MoveCnt % 2 === 0 && socket !== this.player1){
            console.log('return from 1');
            2
            return;
        }
        if(this.MoveCnt % 2 === 1 && socket !== this.player2){
            console.log('return from 2');
            
            return 1;
        }
           // update the board 
        try{
            this.board.move(Move);
        }
        catch(err){ // when piece movement is not right
             return;
        }
          // check if the game ends 
        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({type:Game_Over,payload:{winner: this.board.turn() === 'w' ? 'black' :  'white'}}))
            this.player2.send(JSON.stringify({type:Game_Over,payload:{winner: this.board.turn() === 'w' ? 'black' : 'white'}}))
            return;
        }
        console.log('move reached in make move');
        
        games.move.push(Move);
        console.log('move reached after move');
        
        // send the updated move to both player
        if(this.MoveCnt % 2 === 0){
            this.player2.send(JSON.stringify({type:MOVE,payload:Move}))
        }
        else{
            console.log('send1');
            this.player1.send(JSON.stringify({type:MOVE,payload:Move}))
        }
        this.MoveCnt++;
    }
}

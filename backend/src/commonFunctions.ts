import WebSocket from "ws";

export const HandleRequests = (socket: WebSocket, MessageType:String, games:any)=>{
    const game = games.find((game:any) => game.player1 === socket || game.player2 === socket);
    if(game?.player1 === socket){
       game?.player2.send(JSON.stringify({type:MessageType}));
    }
    else{
       game?.player1.send(JSON.stringify({type:MessageType}));
    }
}


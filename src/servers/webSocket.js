import { WebSocketServer } from "ws";

export const initializedWebSocketServre = (server) =>{

    const wss = new WebSocketServer({server})

    wss.on('Connection', (message)=>{
        consle.log(`Received ${message}`)
    })
}
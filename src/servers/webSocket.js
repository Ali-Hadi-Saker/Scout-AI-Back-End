import { WebSocketServer } from "ws";

export const initializedWebSocketServre = (server) =>{

    const wss = new WebSocketServer({server})

    let esp32Socket = null
    let flutterSocket = null

    wss.on('Connection', (ws)=>{
        ws.on('message', (message)=>{

        consle.log(`Received ${message}`)

        if (message === 'ESP32_CONNECTED'){
            esp32Socket = ws
            console.log('ESP32 connected !!');
            
        }
        if (message === 'FLUTTER_CONNECTED'){
            flutterSocket = ws
            console.log('Flutter connected !!');
            
        }
        })
    })
}
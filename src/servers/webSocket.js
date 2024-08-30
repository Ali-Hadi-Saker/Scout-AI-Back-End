import { WebSocketServer } from "ws";

export const initializedWebSocketServre = (server) =>{

    const wss = new WebSocketServer({server})

    let esp32Socket = null
    let flutterSocket = null

    wss.on('connection', (ws)=>{
        ws.on('message', (message)=>{

        consle.log(`Received ${message}`)

        if (message === 'ESP32_CONNECTED'){
            esp32Socket = ws
            console.log('ESP32 connected !!');
            
        }if (message === 'FLUTTER_CONNECTED'){
            flutterSocket = ws
            console.log('Flutter connected !!');            
        }

        if (ws === flutterSocket && esp32Socket) {
            esp32Socket.send(message);
        }
        if (ws === esp32Socket && flutterSocket) {
            flutterSocket.send(message);
        }
        })
        ws.on('close', ()=>{
            if(ws === esp32Socket){
                esp32Socket = null
                console.log('Esp32 disconnected!!')
            }
            if(ws === flutterSocket){
                flutterSocket = null
                console.log('Flutter disconnected!!');
                
            }
        })
    })
}
import { WebSocketServer } from "ws";

export const initializedWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });

    let esp32Socket = null;
    let flutterSocket = null;

    wss.on('connection', (ws) => {
        console.log('New client connected');

        ws.on('message', (message) => {
            let messageString = '';

            if (message instanceof Buffer) {
                // If the message is a Buffer, convert it to a string
                messageString = message.toString('utf8');
                console.log(`Received binary: ${message.length}`);
                if(flutterSocket){
                    flutterSocket.send(message)
                }

            } else if (typeof message === 'string') {
                // If the message is already a string, use it directly
                messageString = message;
                console.log(`Received text: ${messageString}`);
                if(esp32Socket){
                    esp32Socket.send(message)
                }
    
            }
            
            if (messageString === 'ESP32_CONNECTED') {
                esp32Socket = ws;
                console.log('ESP32 connected !!');

            } else if (messageString === 'FLUTTER_CONNECTED') {
                flutterSocket = ws;
                console.log('Flutter connected !!');
            }

        });

        ws.on('close', () => {
            if (ws === esp32Socket) {
                esp32Socket = null;
                console.log('ESP32 disconnected!!');
            }
            if (ws === flutterSocket) {
                flutterSocket = null;
                console.log('Flutter disconnected!!');
            }
        });
    });
};

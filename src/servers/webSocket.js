import { WebSocketServer } from "ws";

export const initializedWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });

    let esp32Socket = null;
    let flutterSocket = null;

    wss.on('connection', (ws) => {
        console.log('New client connected');

        ws.on('message', (message) => {
            // if (message instanceof Buffer) {
            //     // Handle binary data (e.g., video frames)
            //     console.log('Received binary data of length:', message.length);
            //     if (flutterSocket) {
            //         flutterSocket.send(message);
            //     }
            // } else {
            //     // Handle text messages
            //     console.log(`Received text: ${message}`);
                if (message === 'ESP32_CONNECTED') {
                    esp32Socket = ws;
                    console.log('ESP32 connected !!');
                } else if (message === 'FLUTTER_CONNECTED') {
                    flutterSocket = ws;
                    console.log('Flutter connected !!');
                }

                if (ws === flutterSocket && esp32Socket) {
                    esp32Socket.send(message);
                }
                if (ws === esp32Socket && flutterSocket) {
                    flutterSocket.send(message);
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

import { WebSocketServer } from "ws";

export const initializedWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });

    let esp32Socket = null;
    let flutterSocket = null;
    let detectionSocket = null;

    wss.on('connection', (ws) => {
        console.log('New client connected');

        ws.on('message', (message) => {
            let messageString = '';

            if (message instanceof Buffer) {
                // Convert Buffer to string to check if it's a command
                messageString = message.toString('utf8');

                const commands = ['UP', 'LEFT', 'DOWN', 'RIGHT', 'STOP'];

                if (messageString === 'ESP32_CONNECTED') {
                    esp32Socket = ws;
                    console.log('ESP32 connected !!');
                } else if (messageString === 'FLUTTER_CONNECTED') {
                    flutterSocket = ws;
                    console.log('Flutter connected !!');
                } else if (messageString === 'DETECTION_CONNECTED') {
                    detectionSocket = ws;
                    console.log('Object detection server connected !!');
                }

                if (commands.includes(messageString)) {
                    // This is a command, so it should go to the ESP32
                    if (esp32Socket) {
                        console.log(`Forwarding command to ESP32: ${messageString}`);
                        esp32Socket.send(messageString);
                    } else {
                        console.log('ESP32 is not connected to receive commands');
                    }
                } else {
                    // Otherwise, it's binary data (likely a video frame), so send it to Flutter
                    console.log(`Forwarding binary data to Flutter: ${message.length} bytes`);
                    if (detectionSocket) {
                        detectionSocket.send(message);
                    } else {
                        console.log('Flutter is not connected to receive video data');
                    }
                }

                
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

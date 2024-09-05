import { WebSocketServer } from "ws";

export const initializedWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });

    let esp32Socket = null;
    let flutterSocket = null;
    let detectionSocket = null;

    wss.on('connection', (ws) => {
        console.log('New client connected');
    
        ws.on('message', (message, isBinary) => {
            if (isBinary) {
                console.log(`Received binary message of length: ${message.length} bytes`);
    
                // Handle the binary message here (for example, forward it to the detection server)
                if (detectionSocket) {
                    detectionSocket.send(message);
                } else {
                    console.log('Detection server is not connected to receive video data');
                }
            } else {
                // Convert message to string and process commands
                const messageString = message.toString('utf8');
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
                    if (esp32Socket) {
                        esp32Socket.send(messageString);
                    } else {
                        console.log('ESP32 is not connected to receive commands');
                    }
                }
            }
        });
    
        if (ws == detectionSocket) {
            detectionSocket.on('message', (processedFrame, isBinary) => {
                if (isBinary) {
                    // Forward processed frames to Flutter
                    if (flutterSocket) {
                        console.log(`Forwarding processed data to Flutter: ${processedFrame.length} bytes`);
                        flutterSocket.send(processedFrame);
                    } else {
                        console.log('Flutter is not connected to receive processed video');
                    }
                }
            });
        }
    
        ws.on('close', () => {
            if (ws === esp32Socket) {
                esp32Socket = null;
                console.log('ESP32 disconnected!!');
            }
            if (ws === flutterSocket) {
                flutterSocket = null;
                console.log('Flutter disconnected!!');
            }
            if (ws === detectionSocket) {
                detectionSocket = null;
                console.log('Detection server disconnected!!');
            }
        });
    
        ws.on('error', (error) => {
            console.log(`WebSocket error: ${error.message}`);
        });
    });
}    
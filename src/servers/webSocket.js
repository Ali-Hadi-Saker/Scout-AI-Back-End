import { WebSocketServer } from "ws";

export const initializedWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });

    let esp32Socket = null;
    let flutterSocket = null;
    let detectionSocket = null;
    let lastFrame = null; // Variable to store the last received frame
    let detectionInterval = null; // Timer for sending frames to the detection server


    wss.on('connection', (ws) => {
        console.log('New client connected');

        ws.on('message', (message, isBinary) => {
            if (isBinary) {
                // Handle binary messages (likely video frames)
                console.log(`Received binary message of length: ${message.length} bytes`);

                if (ws === esp32Socket) {
                    console.log('Binary data received from esp32 camera.');
                    // This is processed frame data from the detection server, forward to Flutter
                    if (flutterSocket) {
                        lastFrame = message; // Store the last received frame
                        console.log('Forwarding processed video data to Flutter');
                        console.log(message)
                        flutterSocket.send(message);
                        if (!detectionInterval) {
                        detectionInterval = setInterval(() => {
                            if (lastFrame && detectionSocket) {
                                console.log('Sending frame to detection server');
                                detectionSocket.send(lastFrame);
                            }
                        }, 2000);
                    }
                 } else {
                        console.log('Flutter is not connected to receive processed video');
                    }
                } if (detectionSocket) {
                    // Forward binary video frame to the detection server
                    console.log('Forwarding binary data to detection server');
                    detectionSocket.send(message);
                } else if(flutterSocket) {
                    console.log('Detection server is not connected to receive video data');
                    // flutterSocket.send(message);
                }
            } else {
                // Handle text messages (commands and connection identifiers)
                const messageString = message.toString('utf8');
                console.log(`Received text message: ${messageString}`);
                
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
                } else if (commands.includes(messageString)) {
                    // Forward command to the ESP32
                    if (esp32Socket) {
                        console.log(`Forwarding command to ESP32: ${messageString}`);
                        esp32Socket.send(messageString);
                    } else {
                        console.log('ESP32 is not connected to receive commands');
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
            if (ws === detectionSocket) {
                detectionSocket = null;
                console.log('Detection server disconnected!!');
            }
        });

        ws.on('error', (error) => {
            console.log(`WebSocket error: ${error.message}`);
        });
    });
};


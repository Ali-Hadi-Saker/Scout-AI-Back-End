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
                    lastFrame = message; // Store the last received frame

                    // Forward frame to Flutter if connected
                    if (flutterSocket) {
                        console.log('Forwarding processed video data to Flutter');
                        flutterSocket.send(message);
                    } else {
                        console.log('Flutter is not connected to receive processed video');
                    }

                    // Start sending frames to the detection server if not already started
                    if (!detectionInterval && detectionSocket) {
                        detectionInterval = setInterval(() => {
                            if (lastFrame) {
                                console.log('Sending frame to detection server');
                                detectionSocket.send(lastFrame);
                            }
                        }, 2000);
                    }
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

                    // Set up detection message handling
                    ws.on('message', (message) => {
                        const msgString = message.toString('utf8');
                        try {                         
                            // Forward detection results to Flutter if connected
                            if (flutterSocket) {
                                flutterSocket.send(msgString);
                                console.log(`Forwarding detection results to Flutter ${msgString}`);

                            } else {
                                console.log('Flutter is not connected to receive detection results');
                            }
                        } catch (error) {
                            // Log error and exact message for debugging
                            console.log(`Error parsing detection server response: ${error.message}`);
                            console.log(`Raw response from detection server: ${msgString}`);
                        }
                    });
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
                
                // Stop sending frames if the detection server disconnects
                if (detectionInterval) {
                    clearInterval(detectionInterval);
                    detectionInterval = null;
                }
            }
        });

        ws.on('error', (error) => {
            console.log(`WebSocket error: ${error.message}`);
        });
    });
};

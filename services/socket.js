
import { io } from "socket.io-client";

const SOCKET_URL = "http://127.0.0.1:9876";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

// Connect the socket using the logged-in user's JWT
export function connectSocket(token) {
  socket.auth = {
    token: token,
  };

  socket.connect();
}

// Disconnect this device from Socket.IO
export function disconnectSocket() {
  socket.disconnect();
}

// Connection successful
socket.on("connect", () => {
  console.log("Connected to ORBIT Socket.IO server:", socket.id);
});

// Connection closed
socket.on("disconnect", (reason) => {
  console.log("Disconnected from ORBIT Socket.IO server:", reason);
});

// Connection error
socket.on("connect_error", (error) => {
  console.log("Socket connection error:", error.message);
});

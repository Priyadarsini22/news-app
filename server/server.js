// Load environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const http = require("http");

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import routes
const AuthRouter = require("./routes/AuthRouter");
const newsRoutes = require("./routes/SaveNews");

// Use routes
app.use("/auth", AuthRouter);
app.use("/", newsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("pong");
});

// Chat Schema + Model
const chatSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const Chat = mongoose.model("Chat", chatSchema);

// Serve React build (optional for deployment)
app.use(express.static("client/build"));

// Create HTTP + WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket handling
wss.on("connection", (ws) => {
  console.log("🔌 New WebSocket connection");

  // Send previous messages
  Chat.find({})
    .then((chats) => {
      ws.send(JSON.stringify({ type: "previousMessages", data: chats }));
    })
    .catch((err) => console.error("Error fetching messages:", err));

  // Handle new messages
  ws.on("message", (message) => {
    console.log("📩 Received:", message);

    try {
      const parsedMessage = JSON.parse(message);

      const chatMessage = new Chat({
        username: parsedMessage.username,
        message: parsedMessage.message,
      });

      chatMessage
        .save()
        .then(() => {
          console.log("✅ Message saved to MongoDB");

          // Broadcast to all clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({ type: "newMessage", data: chatMessage })
              );
            }
          });
        })
        .catch((err) => console.error("❌ Error saving message:", err));
    } catch (err) {
      console.error("❌ Error parsing message:", err);
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

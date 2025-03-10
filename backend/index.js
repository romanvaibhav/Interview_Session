const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketIo = require('socket.io');
const http = require('http'); // Import the 'http' module
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userLoginCred = require("./routes/user");
const assignmentCred = require("./routes/assignment");
const sessionCrud = require("./routes/session");
const challengeSession = require("./routes/challenge");

// Initialize express
const app = express();
dotenv.config();

// Create HTTP server with the Express app
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = socketIo(server);

const PORT = 8001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.mongooseString).then(() => {
  console.log("MongoDb is Connected Successfully");
}).catch((error) => {
  console.log("MongoDb connection error:", error);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected: ', socket.id);

  // When the candidate sends a code update
  socket.on('codeUpdate', (data) => {
    // Broadcast the code to the interviewer
    socket.broadcast.emit('codeUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Enable CORS for frontend (Angular app)
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));

// Routes
app.use("/", userLoginCred);
app.use("/user", assignmentCred);
app.use("/session", sessionCrud);
app.use("/challenge", challengeSession);

// Start the server
server.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});

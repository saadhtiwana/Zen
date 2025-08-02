import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


app.use(cors());
app.use(express.json());

const rooms = new Map();
const users = new Map();

app.get('/', (req, res) => {
  res.send('Chatroom Server Running!');
});




//This handles socket connections; JOINING
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (data) => {
    const { username, roomName } = data;
    users.set(socket.id, { username, currentRoom: roomName });
    if (!rooms.has(roomName)) {
      rooms.set(roomName, { users: new Set(), messages: [] });
    }
    const room = rooms.get(roomName);
    room.users.add(socket.id);
    socket.join(roomName);
    socket.emit('room-joined', {
      roomName,
      message: `Welcome to ${roomName}!`,
      userCount: room.users.size
    });
    socket.to(roomName).emit('user-joined', {
      username,
      message: `${username} joined the room`
    });
    console.log(`${username} joined room: ${roomName}`);
  });



  //This handles sending messages in the chatroom
  socket.on('send-message', (data) => {
    const user = users.get(socket.id);
    if (!user) return;
    const { message } = data;
    const { username, currentRoom } = user;
    const messageData = {
      id: Date.now(),
      username,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    const room = rooms.get(currentRoom);
    if (room) {
      room.messages.push(messageData);
    }
    io.to(currentRoom).emit('receive-message', messageData);
    console.log(`Message in ${currentRoom} by ${username}: ${message}`);
  });

  //This handles leaving the chatroom
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const { username, currentRoom } = user;
      const room = rooms.get(currentRoom);
      if (room) {
        room.users.delete(socket.id);
        if (room.users.size === 0) {
          rooms.delete(currentRoom);
        } else {
          socket.to(currentRoom).emit('user-left', {
            username,
            message: `${username} left the room`
          });
        }
      }
      users.delete(socket.id);
      console.log(`${username} disconnected`);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

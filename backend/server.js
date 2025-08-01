import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'
import authRoutes from './routes/auth.route.js';
import connectToMongoDb from './db/connectToMongoDb.js';
import messageRoutes from './routes/message.route.js';
import userRoutes from './routes/user.route.js';
import Message from './models/message.model.js';
import Conversation from './models/conversation.model.js';

//variables
dotenv.config()
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    credentials: true
  }
})
const PORT = process.env.PORT

// Store online users
const onlineUsers = new Map() // userId -> socketId
const userSockets = new Map() // socketId -> userId 

app.use(express.json()) // Middleware to parse JSON bodies (req.body)
app.use(cookieParser()) // Middleware to parse cookies (req.cookies)

//Defining the use of appRoutes
app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);
app.use('/api/users',userRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  const userId = socket.handshake.query.userId
  if (userId && userId !== 'undefined') {
    onlineUsers.set(userId, socket.id)
    userSockets.set(socket.id, userId)
    
    // Broadcast updated online users list
    io.emit('getOnlineUsers', Array.from(onlineUsers.keys()))
  }
  
  // Handle sending messages
  socket.on('sendMessage', async ({ receiverId, message }) => {
    try {
      console.log('Socket message received:', { senderId: userId, receiverId, message })
      
      // Save message to database
      let conversation = await Conversation.findOne({
        participants: { $all: [userId, receiverId] }
      })
      
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [userId, receiverId]
        })
      }
      
      const newMessage = new Message({
        senderId: userId,
        receiverId,
        message
      })
      
      await newMessage.save()
      
      if (newMessage) {
        conversation.messages.push(newMessage._id)
        await conversation.save()
        
        const messageData = {
          _id: newMessage._id,
          senderId: userId,
          receiverId,
          message,
          createdAt: newMessage.createdAt
        }
        
        // Send to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId)
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newMessage', messageData)
        }
        
        // Send back to sender for confirmation
        socket.emit('messageConfirmed', messageData)
      }
    } catch (error) {
      console.error('Error handling socket message:', error)
      socket.emit('messageError', { error: 'Failed to send message' })
    }
  })
  
  // Handle typing indicators
  socket.on('typing', ({ receiverId, isTyping, username }) => {
    const receiverSocketId = onlineUsers.get(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userTyping', {
        userId,
        username,
        isTyping
      })
    }
  })
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    const userId = userSockets.get(socket.id)
    if (userId) {
      onlineUsers.delete(userId)
      userSockets.delete(socket.id)
      
      // Broadcast updated online users list
      io.emit('getOnlineUsers', Array.from(onlineUsers.keys()))
    }
  })
})

// Starting the server and connecting to MongoDB
server.listen(PORT, () => {
  connectToMongoDb();
  console.log("MONGO_URI:", process.env.MONGO_URI);
  console.log(`Server is running at http://localhost:${PORT}`)
})
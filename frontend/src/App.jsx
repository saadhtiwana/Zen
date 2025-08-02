import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import { Send as SendIcon, Chat as ChatIcon, Logout as LogoutIcon } from '@mui/icons-material';

// Join/Create Room Component
const RoomForm = ({ onJoinRoom }) => {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim() && roomName.trim()) {
      onJoinRoom(username.trim(), roomName.trim());
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (username.trim() && roomName.trim()) {
      onJoinRoom(username.trim(), roomName.trim());
    }
  };

  return (
    <Container maxWidth="sm" sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Box sx={{ width: '100%' }}>
  <Paper elevation={3} sx={{ p: 4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
      <ChatIcon sx={{ fontSize: 40, color: 'primary.main' }} />
      <Typography variant="h4" gutterBottom>
        Zen
      </Typography>
    </Box>

    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Enter your name and choose a room
    </Typography>

    <TextField
      fullWidth
      label="Your Name"
      variant="outlined"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      sx={{ mb: 2 }}
      required
    />

    <TextField
      fullWidth
      label="Room Name"
      variant="outlined"
      value={roomName}
      onChange={(e) => setRoomName(e.target.value)}
      sx={{ mb: 3 }}
      required
    />

    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button
          onClick={handleJoin}
          fullWidth
          variant="contained"
          size="large"
        >
          Join Room
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          onClick={handleCreate}
          fullWidth
          variant="outlined"
          size="large"
        >
          Create Room
        </Button>
      </Grid>
    </Grid>
  </Paper>
</Box>

    </Container>
  );
};

// Main App
function App() {
  const [socket, setSocket] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userCount, setUserCount] = useState(0);

  // Initialize socket
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  // Listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('room-joined', (data) => {
      setIsJoined(true);
      setUserCount(data.userCount);
      setMessages([{
        id: Date.now(),
        username: 'System',
        message: data.message,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      }]);
    });

    socket.on('receive-message', (messageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    socket.on('user-joined', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        username: 'System',
        message: data.message,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      }]);
    });

    socket.on('user-left', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        username: 'System',
        message: data.message,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      }]);
    });

    return () => {
      socket.off('room-joined');
      socket.off('receive-message');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, [socket]);

  const handleJoinRoom = (user, room) => {
    if (socket) {
      setUsername(user);
      setRoomName(room);
      socket.emit('join-room', { username: user, roomName: room });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.emit('send-message', { message: newMessage.trim() });
      setNewMessage('');
    }
  };

  const handleLogout = () => {
    setIsJoined(false);
    setMessages([]);
    setUsername('');
    setRoomName('');
    setUserCount(0);
  };

  if (!isJoined) {
    return <RoomForm onJoinRoom={handleJoinRoom} />;
  }

  return (
    <Container maxWidth="md" sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Box sx={{ py: 3, width: '100%' }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs>
              <Typography variant="h5" component="h1">
                Zen
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome, {username}!
              </Typography>
            </Grid>
            <Grid item>
              <Chip
                label={`${userCount} users online`}
                color="primary"
                variant="outlined"
                sx={{ mr: 2 }}
              />
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Messages */}
        <Paper elevation={2} sx={{ mb: 3, height: 400, overflow: 'hidden' }}>
          <List sx={{ height: '100%', overflow: 'auto', p: 0 }}>
            {messages.map((msg, index) => (
              <div key={msg.id || index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="subtitle2"
                          color={msg.isSystem ? 'text.secondary' : 'primary'}
                          component="span"
                        >
                          {msg.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {msg.timestamp}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontStyle: msg.isSystem ? 'italic' : 'normal',
                          color: msg.isSystem ? 'text.secondary' : 'text.primary'
                        }}
                      >
                        {msg.message}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Paper>

        {/* Input */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <form onSubmit={handleSendMessage}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={!newMessage.trim()}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default App;

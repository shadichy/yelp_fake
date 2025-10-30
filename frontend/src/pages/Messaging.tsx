
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import api from '../api';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography } from '@mui/material';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  sent_at: string;
}

const Messaging = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // This is a simplified approach. A real app would have an endpoint
    // to get all conversations for the current user.
    // For now, we'll just let the user enter a user ID to talk to.
  }, []);

  const handleStartConversation = (userId: number) => {
    setSelectedConversation(userId);
    api.get(`/messages/${userId}`).then((response) => {
      setMessages(response.data);
    });
  };

  const handleSendMessage = () => {
    if (selectedConversation) {
      api.post('/messages/', { receiver_id: selectedConversation, content: newMessage })
        .then((response) => {
          setMessages([...messages, response.data]);
          setNewMessage('');
        });
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
      <Box sx={{ width: '30%', borderRight: '1px solid #ccc' }}>
        <Typography variant="h6" sx={{ p: 2 }}>Conversations</Typography>
        {/* In a real app, this would be a list of conversations */}
        <TextField
          label="User ID to message"
          variant="outlined"
          size="small"
          sx={{ m: 2, width: 'calc(100% - 32px)' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleStartConversation(parseInt((e.target as HTMLInputElement).value));
            }
          }}
        />
      </Box>
      <Box sx={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {selectedConversation ? (
            <List>
              {messages.map((msg) => (
                <ListItem key={msg.id} sx={{ textAlign: msg.sender_id === auth.user?.id ? 'right' : 'left' }}>
                  <ListItemText
                    primary={msg.content}
                    secondary={new Date(msg.sent_at).toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ p: 2 }}>Select a conversation to start messaging.</Typography>
          )}
        </Box>
        {selectedConversation && (
          <Box sx={{ p: 2, borderTop: '1px solid #ccc' }}>
            <TextField
              label="Type a message"
              variant="outlined"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button variant="contained" onClick={handleSendMessage} sx={{ mt: 1 }}>Send</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Messaging;


import { useState, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';
import type { FC } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import api from '../api';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import type { Message } from '../types/message';

const Messaging: FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // This is a simplified approach. A real app would have an endpoint
    // to get all conversations for the current user.
    // For now, we'll just let the user enter a user ID to talk to.
  }, []);

  const handleStartConversation = async (userId: number) => {
    try {
      setSelectedConversation(userId);
      const response = await api.get<Message[]>(`/messages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (selectedConversation) {
      try {
        const response = await api.post<Message>('/messages/', { receiver_id: selectedConversation, content: newMessage });
        setMessages([...messages, response.data]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleStartConversation(parseInt((e.target as HTMLInputElement).value));
    }
  };

  const handleMessageKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
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
          onKeyDown={handleKeyDown}
        />
      </Box>
      <Box sx={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {selectedConversation ? (
            <List>
              {messages.map((msg) => (
                <ListItem key={msg.id} sx={{ textAlign: msg.sender_id === user?.id ? 'right' : 'left' }}>
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
              onKeyDown={handleMessageKeyDown}
            />
            <Button variant="contained" onClick={handleSendMessage} sx={{ mt: 1 }}>Send</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Messaging;

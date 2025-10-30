
import { useState, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';
import type { FC } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import api from '../api';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import type { Message } from '../types/message';
import type { UserProfile } from '../types/profile';

const Messaging: FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [connectedUsers, setConnectedUsers] = useState<UserProfile[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        const response = await api.get<UserProfile[]>('/messages/connected_users');
        setConnectedUsers(response.data);
      } catch (error) {
        console.error('Error fetching connected users:', error);
      }
    };

    fetchConnectedUsers();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const response = await api.get<Message[]>(`/messages/${selectedConversation}`);
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();
    }
  }, [selectedConversation]);

  const handleSelectConversation = (userId: number) => {
    setSelectedConversation(userId);
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

  const handleMessageKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
      <Box sx={{ width: '30%', borderRight: '1px solid #ccc' }}>
        <Typography variant="h6" sx={{ p: 2 }}>Conversations</Typography>
        <Divider />
        <List>
          {connectedUsers.map((connectedUser) => (
            <ListItem
              button
              key={connectedUser.id}
              onClick={() => handleSelectConversation(connectedUser.id)}
              selected={selectedConversation === connectedUser.id}
            >
              <ListItemText primary={connectedUser.full_name} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {selectedConversation ? (
            <List>
              {messages.map((msg: Message) => (
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

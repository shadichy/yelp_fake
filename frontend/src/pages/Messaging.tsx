
import { useState, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';
import type { FC } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import api from '../api';
import webSocketService from '../api/websocket';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, Divider, ListItemButton } from '@mui/material';
import type { Message } from '../types/message';
import type { UserProfile } from '../types/profile';
import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from '../types/jwt';

const Messaging: FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [connectedUsers, setConnectedUsers] = useState<UserProfile[]>([]);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setUserId(decodedToken.sub);
    }
  }, [token]);

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      if (user) {
        try {
          const response = await api.get<UserProfile[]>('/messages/connected_users');
          setConnectedUsers(response.data);
        } catch (error) {
          console.error('Error fetching connected users:', error);
        }
      }
    };

    fetchConnectedUsers();

    const storedMessagingTargetId = sessionStorage.getItem('messagingTargetId');
    if (storedMessagingTargetId) {
      setSelectedConversation(parseInt(storedMessagingTargetId));
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      webSocketService.connect(`ws://localhost:8000/ws/${userId}`);
      webSocketService.addMessageListener((message: Message) => {
        if (message.sender_id === selectedConversation || message.receiver_id === selectedConversation) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }

    return () => {
      webSocketService.disconnect();
    };
  }, [userId, selectedConversation]);

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
    sessionStorage.setItem('messagingTargetId', String(userId));
  };

  const handleSendMessage = () => {
    if (selectedConversation && newMessage.trim()) {
      const message = {
        receiver_id: selectedConversation,
        content: newMessage,
      };
      webSocketService.sendMessage(message);
      setNewMessage('');
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
            <ListItemButton
              key={connectedUser.id}
              onClick={() => handleSelectConversation(connectedUser.id)}
              selected={selectedConversation === connectedUser.id}
            >
              <ListItemText primary={connectedUser.full_name} />
            </ListItemButton>
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

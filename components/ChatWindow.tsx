"use client";

import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Message = {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    sent_at: string;
};

export default function ChatWindow({ selectedUserId, selectedUserName }: { selectedUserId: number, selectedUserName: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();
    const ws = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!selectedUserId || !user) return;

        // Fetch history
        const fetchHistory = async () => {
            try {
                const res = await api.get<Message[]>(`/messages/${selectedUserId}`);
                setMessages(res.data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };
        fetchHistory();

        // Connect WS
        const token = localStorage.getItem('token');
        const wsUrl = `ws://localhost:8000/messages/ws?token=${token}`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("Connected to WS");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Check if message belongs to current conversation
            if ((data.sender_id === selectedUserId && data.receiver_id === user.id) ||
                (data.sender_id === user.id && data.receiver_id === selectedUserId)) {
                setMessages((prev) => [...prev, data]);
            }
        };

        socket.onclose = () => {
            console.log("Disconnected from WS");
        };

        ws.current = socket;

        return () => {
            socket.close();
        };

    }, [selectedUserId, user]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !ws.current) return;

        const msg = {
            receiver_id: selectedUserId,
            content: newMessage
        };

        ws.current.send(JSON.stringify(msg));
        setNewMessage('');
        // Note: The WS server echoes the message back to sender, so we don't strictly need to optimistic add, 
        // but the echo logic in backend/routers/message.py line 49 sends to both.
        // So onmessage will handle adding it to the list.
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h3 className="font-semibold text-gray-800">Chat with {selectedUserName}</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[500px]">
                {messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-4 py-2 rounded-lg ${isMe ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                <p>{msg.content}</p>
                                <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 flex gap-2">
                <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold">Send</button>
            </form>
        </div>
    );
}
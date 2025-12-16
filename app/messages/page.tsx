"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import ChatWindow from '@/components/ChatWindow';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type ConnectedUser = {
    id: number;
    email: string;
};

export default function MessagesPage() {
    const [connectedUsers, setConnectedUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchUsers = async () => {
            try {
                const res = await api.get<any[]>('/messages/connected_users');
                setConnectedUsers(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [user, authLoading, router]);

    if (authLoading || loading) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="font-semibold text-gray-700">Conversations</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {connectedUsers.length === 0 ? (
                            <p className="p-4 text-gray-500 text-sm">No conversations yet.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {connectedUsers.map((u) => (
                                    <li key={u.id}>
                                        <button 
                                            onClick={() => setSelectedUser(u)}
                                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selectedUser?.id === u.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                                        >
                                            <p className="font-medium text-gray-900 truncate">{u.email}</p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="md:col-span-3 h-full">
                    {selectedUser ? (
                        <ChatWindow selectedUserId={selectedUser.id} selectedUserName={selectedUser.email} />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                            Select a conversation to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

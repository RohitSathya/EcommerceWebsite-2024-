import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import link from './link';

export default function AdminChatPanel() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [n, sn] = useState('');

  useEffect(() => {
    fetchUsersWithChats();
  }, []);

  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatMessages]);

  const fetchUsersWithChats = async () => {
    try {
      const response = await axios.get(`${link}/product/getUniqueChats`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchChatMessages = async (userId, na) => {
    sn(na);
    try {
      const response = await axios.get(`${link}/product/getMessages/${userId}`);
      setChatMessages(response.data);
      setSelectedUser(userId);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messagePayload = {
      userId: selectedUser,
      message: newMessage,
      sender: 'admin',
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(`${link}/product/sendMessage`, messagePayload);
      setChatMessages([...chatMessages, messagePayload]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderMessagesWithDate = () => {
    let lastDate = null;

    return chatMessages.map((msg, index) => {
      const messageDate = new Date(msg.createdAt).toDateString();

      const showDateHeader = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <React.Fragment key={index}>
          {showDateHeader && (
            <div className="text-center text-gray-500 text-sm my-4">
              {formatDate(msg.createdAt)}
            </div>
          )}
          <div className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] break-words ${msg.sender === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-2 shadow-sm`}
            >
              <p>{msg.message}</p>
              <div className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'}`}>
                <Clock className="w-3 h-3 inline mr-1" />
                {formatTimestamp(msg.createdAt)}
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl font-bold text-gray-800">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            Admin Chat Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users List Panel */}
            <Card className="lg:col-span-1 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Users className="w-5 h-5 text-blue-600" />
                  Active Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {users.length > 0 ? (
                    <div className="space-y-2">
                      {users.map((user, index) => (
                        <div
                          key={index}
                          onClick={() => fetchChatMessages(user._id, user.name)}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedUser === user._id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'hover:bg-gray-50 border-transparent'} border-2`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{user.name}</p>
                              <p className="text-sm text-gray-500">Click to view chat</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No active conversations</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Panel */}
            <Card className="lg:col-span-2 bg-white">
              <CardHeader>
                <CardTitle className="text-xl">
                  {selectedUser ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                        {n.charAt(0).toUpperCase()}
                      </div>
                      <span>Chat with {n}</span>
                    </div>
                  ) : (
                    'Select a conversation'
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedUser ? (
                  <>
                    <ScrollArea className="h-[500px] mb-4 p-4" id="chat-messages">
                      {chatMessages.length > 0 ? (
                        <div className="space-y-4">
                          {renderMessagesWithDate()}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      )}
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="h-[600px] flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Select a user to start chatting</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

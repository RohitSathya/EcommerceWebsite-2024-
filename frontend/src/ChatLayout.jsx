import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Send, MessageCircle } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import link from './link';

export default function ChatLayout({ currentUsername, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchMessages = async () => {
    try {
      const userDetail = localStorage.getItem('userdetail');
      const parse = JSON.parse(userDetail);
      const userId = parse.uid || parse._id;
      const response = await axios.get(`${link}/product/getMessages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const userDetail = localStorage.getItem('userdetail');
    const parse = JSON.parse(userDetail);
    const userId = parse.uid || parse._id;

    const messagePayload = {
      userId,
      message: newMessage,
      sender: 'user',
      username: currentUsername,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(`${link}/product/sendMessage`, messagePayload);
      setMessages([...messages, messagePayload]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const isToday = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isYesterday = (timestamp) => {
    const date = new Date(timestamp);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    if (isToday(timestamp)) {
      return 'Today';
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    }
    
    const date = new Date(timestamp);
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  };

  const renderMessagesWithDate = () => {
    let lastDate = null;

    return (
      <div className="space-y-4">
        {messages.map((msg, index) => {
          const messageDate = formatDate(msg.createdAt);
          const showDateHeader = messageDate !== lastDate;
          lastDate = messageDate;

          return (
            <React.Fragment key={index}>
              {showDateHeader && (
                <div className="flex items-center justify-center space-x-2 my-4">
                  <div className="h-px flex-grow bg-gray-200" />
                  <span className="bg-white px-3 py-1 text-xs font-medium text-gray-500 rounded-full shadow-sm border">
                    {messageDate}
                  </span>
                  <div className="h-px flex-grow bg-gray-200" />
                </div>
              )}
              <div
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                } group`}
              >
                <div
                  className={`
                    relative max-w-[80%] rounded-2xl px-4 py-2 
                    ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }
                    shadow-sm hover:shadow-md transition-shadow duration-200
                  `}
                >
                  <p className="break-words text-sm">{msg.message}</p>
                  <span
                    className={`
                      text-[10px] mt-1 inline-block
                      ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}
                    `}
                  >
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={scrollRef} />
      </div>
    );
  };

  return (
    <Card className="fixed bottom-0 right-4 w-80 sm:w-96 rounded-t-lg shadow-xl z-50 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Support Chat</h2>
              <p className="text-xs text-blue-100">We typically reply within minutes</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:text-white/80 hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="h-[400px] p-4 bg-white">
        {messages.length > 0 ? (
          renderMessagesWithDate()
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs text-gray-400">Start your conversation with us!</p>
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 focus-visible:ring-blue-500"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-9 w-9 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
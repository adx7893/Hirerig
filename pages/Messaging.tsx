
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { generateSmartReplies } from '../services/geminiService';
import { User, Message } from '../types';

const Messaging: React.FC = () => {
  const { user } = useAuth();
  const { messages, users, sendMessage } = useApp();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversations = users.filter(u => u.id !== user?.id);

  const chatMessages = messages.filter(m => 
    (m.senderId === user?.id && m.receiverId === selectedUser?.id) ||
    (m.senderId === selectedUser?.id && m.receiverId === user?.id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].senderId !== user?.id) {
      handleGetSmartReplies(chatMessages[chatMessages.length - 1].content);
    } else {
      setSmartReplies([]);
    }
  }, [selectedUser, chatMessages.length]);

  const handleGetSmartReplies = async (text: string) => {
    setIsAiLoading(true);
    const replies = await generateSmartReplies(text);
    setSmartReplies(replies);
    setIsAiLoading(false);
  };

  const handleSendMessage = (content?: string) => {
    const text = content || newMessage;
    if (!text.trim() || !user || !selectedUser) return;
    sendMessage(user.id, selectedUser.id, text);
    setNewMessage('');
    setSmartReplies([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-0 md:px-4 py-0 md:py-6 h-[calc(100vh-120px)] md:h-[calc(100vh-64px)]">
      <div className="bg-white dark:bg-gray-900 md:rounded-lg border-x md:border border-gray-200 dark:border-gray-800 flex h-full overflow-hidden transition-colors">
        
        {/* Conversations List - Hidden on mobile if chat is open */}
        <div className={`w-full md:w-80 border-r border-gray-200 dark:border-gray-800 flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900 dark:text-white">Messaging</h2>
            <button className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full">
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeConversations.map(u => {
              const lastMsg = messages.filter(m => 
                (m.senderId === user?.id && m.receiverId === u.id) ||
                (m.senderId === u.id && m.receiverId === user?.id)
              ).pop();

              return (
                <div 
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedUser?.id === u.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600' : ''}`}
                >
                  <div className="relative shrink-0">
                    <img src={u.avatar} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">{u.name}</h4>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{lastMsg ? lastMsg.content : 'Start a conversation'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Window - Hidden on mobile if no chat selected */}
        <div className={`flex-1 flex-col bg-gray-50 dark:bg-gray-950 transition-colors ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-3 md:p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button onClick={() => setSelectedUser(null)} className="md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400">
                    <i className="fa-solid fa-arrow-left text-lg"></i>
                  </button>
                  <img src={selectedUser.avatar} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{selectedUser.name}</h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">{selectedUser.headline}</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      msg.senderId === user?.id 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700'
                    }`}>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 md:p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                {smartReplies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {smartReplies.map((reply, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSendMessage(reply)}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-full px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex items-end space-x-2">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <textarea 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      placeholder="Write a message..."
                      className="w-full p-3 bg-transparent border-none focus:ring-0 resize-none h-14 md:h-20 text-sm dark:text-white"
                    />
                  </div>
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white p-3 rounded-full hover:bg-blue-700 transition-all shadow-md"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10">
              <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <i className="fa-solid fa-comments text-4xl text-gray-200 dark:text-gray-700"></i>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Messages</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mt-2 font-medium">Connect and message recruiters directly on HireRig.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messaging;

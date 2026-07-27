import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Search, Plus, Users, MessageCircle, Smile, Paperclip } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ChatPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      const convs = Array.isArray(res.data.data) ? res.data.data : [];
      setConversations(convs);
    } catch {
      // Demo conversations
      setConversations([
        { id: 'demo-1', name: 'General Discussion', type: 'group', lastMessage: 'Welcome to UMS Chat!', updatedAt: new Date().toISOString(), unread: 2 },
        { id: 'demo-2', name: 'Faculty Room', type: 'group', lastMessage: 'Meeting at 3 PM', updatedAt: new Date().toISOString(), unread: 0 },
        { id: 'demo-3', name: 'Admissions Team', type: 'group', lastMessage: 'New enquiry received', updatedAt: new Date().toISOString(), unread: 5 },
      ]);
    }
  };

  const openConversation = async (conv) => {
    setActiveConv(conv);
    setLoadingMessages(true);
    try {
      const res = await api.get(`/chat/conversations/${conv.id}/messages`);
      setMessages(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      setMessages([
        { id: '1', content: 'Welcome to the chat!', senderId: 'system', senderName: 'System', createdAt: new Date().toISOString() },
        { id: '2', content: 'Feel free to start a conversation.', senderId: 'system', senderName: 'System', createdAt: new Date().toISOString() },
      ]);
    } finally { setLoadingMessages(false); }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConv) return;
    const msg = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: user?.id || 'me',
      senderName: `${user?.firstName || 'You'} ${user?.lastName || ''}`,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    try {
      await api.post(`/chat/conversations/${activeConv.id}/messages`, { content: msg.content });
    } catch { /* message sent optimistically */ }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-md overflow-hidden border border-border bg-surface animate-fade-in">
      {/* Sidebar */}
      <div className="w-80 flex flex-col border-r border-border bg-bg/50">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-text-primary">Chat</h2>
            <button className="p-2 rounded-md hover:bg-bg text-text-disabled hover:text-brand-600">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled" />
            <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conv => (
            <button key={conv.id} onClick={() => openConversation(conv)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-bg transition-colors ${activeConv?.id === conv.id ? 'bg-brand-100 border-r-2 border-primary-500' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                {conv.type === 'group' ? <Users className="w-5 h-5" /> : conv.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-medium text-text-primary truncate">{conv.name}</p>
                  <span className="text-[10px] text-text-disabled ml-2 flex-shrink-0">{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-text-secondary truncate mt-0.5">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{conv.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConv ? (
          <>
            {/* Header */}
            <div className="h-16 px-5 flex items-center justify-between border-b border-border bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium text-sm">
                  {activeConv.type === 'group' ? <Users className="w-4 h-4" /> : activeConv.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{activeConv.name}</h3>
                  <p className="text-xs text-text-disabled">{activeConv.type === 'group' ? 'Group Chat' : 'Direct Message'}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-bg/30">
              {messages.map(msg => {
                const isMe = msg.senderId === user?.id || msg.senderId === 'me';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${isMe ? 'order-2' : ''}`}>
                      {!isMe && <p className="text-[10px] font-medium text-text-secondary mb-1 ml-1">{msg.senderName}</p>}
                      <div className={`px-4 py-2.5 rounded-md text-sm ${
                        isMe ? 'bg-brand-600 text-white rounded-br-md' : 'bg-surface border border-border text-text-primary rounded-bl-md'
                      }`}>
                        {msg.content}
                      </div>
                      <p className={`text-[10px] text-text-disabled mt-1 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-surface">
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-md hover:bg-bg text-text-disabled"><Paperclip className="w-5 h-5" /></button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  className="flex-1 px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500"
                />
                <button className="p-2 rounded-md hover:bg-bg text-text-disabled"><Smile className="w-5 h-5" /></button>
                <button onClick={sendMessage}
                  className="p-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-md transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-md bg-bg flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-text-disabled" />
            </div>
            <h3 className="text-lg font-semibold text-text-secondary">Select a conversation</h3>
            <p className="text-sm text-text-disabled mt-1">Choose from the left panel or start a new chat</p>
          </div>
        )}
      </div>
    </div>
  );
}

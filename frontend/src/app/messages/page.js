"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../components/AuthGuard";
import { getToken } from "../Services/auth";
import styles from './Messages.module.css';

// Funkcja do generowania UUID - używa wbudowanego crypto.randomUUID()
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback dla starszych przeglądarek
  return `uuid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

function MessagesContent() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const router = useRouter();

  // Auto-scroll do najnowszej wiadomości
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pobierz listę użytkowników
  const fetchUsers = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:8000/api/users/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Pobierz konwersację z konkretnym użytkownikiem
  const fetchConversation = async (userId) => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`http://localhost:8000/api/messages/conversation/${userId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Wyślij wiadomość
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const token = getToken();
      const response = await fetch('http://localhost:8000/api/messages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver: selectedUser.id,
          content: newMessage
        })
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage("");
        fetchUnreadCount();
      } else {
        alert('Błąd podczas wysyłania wiadomości');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Błąd podczas wysyłania wiadomości');
    }
  };

  // Pobierz liczbę nieprzeczytanych wiadomości
  const fetchUnreadCount = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:8000/api/messages/unread-count/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUnreadCount();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchConversation(user.id);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  // Filtruj użytkowników na podstawie wyszukiwania
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Formatuj czas wiadomości
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // mniej niż minuta
      return 'teraz';
    } else if (diff < 3600000) { // mniej niż godzina
      return `${Math.floor(diff / 60000)} min`;
    } else if (diff < 86400000) { // mniej niż dzień
      return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.chatApp}>
        {/* Panel konwersacji */}
        <div className={styles.conversationsPanel}>
          <div className={styles.conversationsHeader}>
            <div className={styles.userProfile}>
          
              <div className={styles.userInfo}>
                <h3>GaraZero Chat</h3>
              </div>
            </div>
            
            <div className={styles.searchBox}>
              <div className={styles.searchIcon}>🔍</div>
              <input
                type="text"
                placeholder="Szukaj w wiadomościach"
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.conversationsList}>
            {filteredUsers.map((user) => (
              <div
                key={generateUUID()} 
                className={`${styles.conversationItem} ${
                  selectedUser?.id === user.id ? styles.active : ''
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className={styles.conversationAvatar}>
                  <img
                    src={selectedUser?.avatar ? selectedUser.avatar : '/images/default-avatar.png'}
                    alt={selectedUser?.username || 'Avatar'}
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                  />
                  <div className={styles.onlineStatus}></div>
                </div>
                
                <div className={styles.conversationContent}>
                  <div className={styles.conversationHeader}>
                    <span className={styles.conversationName}>
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user.username || 'Unknown User'
                      }
                    </span>
                    <span className={styles.conversationTime}>
                      {user.last_message && formatMessageTime(user.last_message.timestamp)}
                    </span>
                  </div>
                  
                  <div className={styles.conversationPreview}>
                    {user.last_message?.content || 'Rozpocznij konwersację...'}
                  </div>
                </div>
                
                {(user.unread_count > 0) && (
                  <div className={styles.unreadBadge}>
                    {user.unread_count}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Główne okno czatu */}
        <div className={styles.chatWindow}>
          {selectedUser ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.chatPartner}>
                  <button className={styles.mobileBackButton}>
                    ←
                  </button>
                  <div className={styles.conversationAvatar}>
                    <img
                      src={selectedUser?.avatar ? selectedUser.avatar : '/images/default-avatar.png'}
                      alt={selectedUser?.username || 'Avatar'}
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                    <div className={styles.onlineStatus}></div>
                  </div>
                  <div className={styles.chatPartnerInfo}>
                    <h3>
                      {selectedUser.first_name && selectedUser.last_name 
                        ? `${selectedUser.first_name} ${selectedUser.last_name}`
                        : selectedUser.username || 'Unknown User'
                      }
                    </h3>
                    <p>Online</p>
                  </div>
                </div>
              </div>

              <div className={styles.messagesArea}>
                {loading ? (
                  <div className={styles.loadingState}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Ładowanie wiadomości...</p>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={generateUUID()} 
                      className={`${styles.message} ${
                        message.sender === selectedUser.id ? styles.received : styles.sent
                      }`}
                    >
                      <div className={styles.messageBubble}>
                        <p>{message.content || '...'}</p>
                        <div className={styles.messageTime}>
                          {formatMessageTime(message.timestamp)}
                          {message.sender !== selectedUser.id && (
                            <div className={styles.messageStatus}>
                              <span className={`${styles.statusIcon} ${message.is_read ? styles.read : ''}`}>
                                ✓
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyChat}>
                    <div className={styles.emptyChatIcon}>💬</div>
                    <h3>Brak wiadomości</h3>
                    <p>Wyślij pierwszą wiadomość, aby rozpocząć konwersację</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.messageInputArea}>
                <div className={styles.inputContainer}>
                  
                  
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Aa"
                    rows={1}
                    className={styles.messageInput}
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className={styles.sendButton}
                    title="Wyślij"
                  >
                    ↑
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyChat}>
              <div className={styles.emptyChatIcon}>💬</div>
              <h3>Wybierz konwersację</h3>
              <p>Wybierz użytkownika z listy, aby rozpocząć czat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <AuthGuard>
      <MessagesContent />
    </AuthGuard>
  );
}
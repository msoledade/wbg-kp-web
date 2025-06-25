import { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {/* Head of the robot */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2z" />
    {/* Neck connecting head and body */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2" />
    {/* Body of the robot */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17h14v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2z" />
    {/* Eyes, represented as simple dots */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 11h.01M14 11h.01" />
  </svg>
);
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>


export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState('my country');
  const [countryLoading, setCountryLoading] = useState(true);
  const [showStarters, setShowStarters] = useState(true);
  
  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const LOCAL_STORAGE_KEY = 'wbgkp-assistant-messages';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from localStorage on mount, or set default greeting if none
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          if (parsed.length > 0) {
            setMessages(parsed);
            return;
          }
          // If parsed is an empty array, do not setMessages yet
          // Wait for user to send a message
          return;
        }
      } catch (e) {
      }
    }
    // Only set default greeting if nothing in storage (null)
    if (!saved) {
      setMessages([
        { id: Date.now(), role: 'assistant', content: "Hello! I'm your Digital Skills Assistant. Ask me anything about digital skills policies, projects or implementations and I'll do my best to answer." }
      ]);
    }
  }, []);

  // Save chat history to localStorage on every update, but only if there are messages to save
  useEffect(() => {
    const messagesToStore = messages.filter(m => !m.isStreaming);
    if (messagesToStore.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messagesToStore));
    }
  }, [messages]);

  useEffect(() => {
    // Fetch user's country for the third conversation starter
    fetch('https://ipinfo.io/json')
      .then(res => res.json())
      .then(data => {
        if (data && data.country) setCountry(data.country);
        if (data && data.country && data.country !== 'my country' && data.country.length === 2 && data.country !== 'ZZ') {
          // Try to get country name from code
          fetch(`https://restcountries.com/v3.1/alpha/${data.country}`)
            .then(res => res.json())
            .then(arr => {
              if (Array.isArray(arr) && arr[0]?.name?.common) setCountry(arr[0].name.common);
            })
            .catch(() => {});
        }
      })
      .catch(() => setCountry('my country'))
      .finally(() => setCountryLoading(false));
  }, []);

  const handleStarter = (starterText) => {
    setShowStarters(false);
    setQuery(starterText);
    setTimeout(() => {
      document.getElementById('chat-input')?.focus();
    }, 0);
    // Immediately send the message
    handleSubmit({ preventDefault: () => {} }, starterText);
  };

  // Helper to strip local-only fields before sending to backend
  const getBackendMessages = (msgs) =>
    msgs
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(({ role, content }) => ({ role, content }));

  const handleSubmit = async (e, overrideQuery) => {
    e.preventDefault();
    const sendQuery = overrideQuery !== undefined ? overrideQuery : query;
    if (!sendQuery.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: sendQuery };

    setMessages(prev => [...prev, userMessage, { id: Date.now() + 1, role: 'assistant', content: '', isStreaming: true }]);
    setQuery('');
    setIsLoading(true);

    try {
      // Prepare conversation history for backend
      const backendMessages = getBackendMessages([
        ...messages,
        userMessage
      ]);
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: backendMessages }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: !done });
        
        if (chunk) {
          setMessages(currentMessages => {
            const updatedMessages = [...currentMessages];
            const lastMessageIndex = updatedMessages.length - 1;
            const lastMessage = updatedMessages[lastMessageIndex];

            if (lastMessage && lastMessage.role === 'assistant') {
              // Create a new object for the last message to ensure immutability
              updatedMessages[lastMessageIndex] = {
                ...lastMessage,
                content: lastMessage.content + chunk,
              };
            }
            
            return updatedMessages;
          });
        }
      }
    } catch (error) {
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.content = "Error: Could not connect to the backend. Please ensure it's running.";
            }
            return newMessages;
        });
        console.error("Streaming error:", error);
    } finally {
      setIsLoading(false);
      // After streaming is done, remove isStreaming from the last assistant message
      setMessages(currentMessages => {
        const updatedMessages = [...currentMessages];
        const lastMessageIndex = updatedMessages.length - 1;
        if (updatedMessages[lastMessageIndex] && updatedMessages[lastMessageIndex].role === 'assistant') {
          delete updatedMessages[lastMessageIndex].isStreaming;
        }
        return updatedMessages;
      });
    }
  };

  // Optional: Clear chat button
  const handleClearChat = () => {
    setMessages([
      { id: Date.now(), role: 'assistant', content: "Hello! I'm your Digital Skills. Ask me anything about digital skills policies, projects or implementations and I'll do my best to answer." }
    ]);
    setShowStarters(true);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden mx-auto">
        {/* Main Chat Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
            {messages.map((msg, index) => {
                if (isLoading && index === messages.length - 1 && msg.role === 'assistant' && msg.content === '') {
                    return null;
                }
                
                return (
                    <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && <div className="p-2 rounded-full bg-indigo-500 text-white"><BotIcon /></div>}
                    
                    <div className={`relative prose dark:prose-invert max-w-2xl px-5 py-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none speech-bubble-user' : 'bg-white dark:bg-gray-800 rounded-bl-none speech-bubble-assistant'}`}>
                        {msg.role === 'assistant' ? (
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.content) }} />
                        ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        )}
                    </div>
    
                    {msg.role === 'user' && <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"><UserIcon /></div>}
                    </div>
                );
                })}
    
            {isLoading && messages[messages.length - 1]?.role === 'assistant' && messages[messages.length - 1]?.content === '' && (
                <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-indigo-500 text-white"><BotIcon /></div>
                <div className="px-5 py-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm rounded-bl-none">
                    <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </main>

        {/* Footer Input Area */}
        <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-2">
            {showStarters && (
              <div className="flex flex-wrap gap-3">
                <button
                  className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                  disabled={isLoading}
                  onClick={() => handleStarter('Help me draft a digital skills policy for my country')}
                >
                  Help me draft a digital skills policy for my country
                </button>
                <button
                  className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                  disabled={isLoading}
                  onClick={() => handleStarter('Give me an overview on what are the available resources')}
                >
                  Give me an overview on what are the available resources
                </button>
                <button
                  className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                  disabled={isLoading || countryLoading}
                  onClick={() => handleStarter(`Tell me a bit about digital skills in ${country}`)}
                >
                  {countryLoading ? 'Loading country…' : `Tell me a bit about digital skills in ${country}`}
                </button>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="relative">
            <input
              id="chat-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
              className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading || !query.trim()}
            >
              <SendIcon />
            </button>
          </form>
          <div className="flex justify-center mt-4">
            <button
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs"
              onClick={handleClearChat}
              disabled={isLoading}
            >
              Clear Chat
            </button>
          </div>
        </footer>
      </div>
  );
} 
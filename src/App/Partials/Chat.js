
// import React, {useEffect, useState, useRef, useCallback} from 'react'
// import ChatHeader from "./ChatHeader"
// import ChatFooter from "./ChatFooter"
// import PerfectScrollbar from "react-perfect-scrollbar"
// import UnselectedChat from '../../assets/img/unselected-chat.svg'
// import {useSelector} from "react-redux"

// function Chat() {
//     const {selectedChat} = useSelector(state => state);
//     const [inputMsg, setInputMsg] = useState('');
//     const [scrollEl, setScrollEl] = useState();
//     const [conversationHistory, setConversationHistory] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [connected, setConnected] = useState(false);
//     const websocketRef = useRef(null);
    
//     console.log('Selected chat:', selectedChat);

//     // WebSocket connection for conversation history
// // Somewhere at the top of your component (outside the callback):
// const manualCloseRef = useRef(false);

// const connectConversationWebSocket = useCallback((chatId) => {
//   if (!chatId) return;

//   // If there's already a socket OPEN or CONNECTING, bail out
//   const existing = websocketRef.current;
//   if (
//     existing &&
//     (existing.readyState === WebSocket.OPEN ||
//       existing.readyState === WebSocket.CONNECTING)
//   ) {
//     return;
//   }

//   // mark this as a “fresh” connect (not our own cleanup)
//   manualCloseRef.current = false;

//   // close any leftover socket
//   if (existing) existing.close();

//   const ws = new WebSocket(`ws://127.0.0.1:8000/users/${chatId}/conversations`);
//   websocketRef.current = ws;

//   ws.onopen = () => {
//     console.log("Conversation WS connected");
//     setConnected(true);
//     setError(null);
//     setLoading(true);
//   };

//   ws.onmessage = (event) => {
//     try {
//       const data = JSON.parse(event.data);
//       console.log("Received conversation update:", data);
//       const msgs = transformBackendData(data);
//       setConversationHistory(msgs);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error parsing WS message:", err);
//       setError("Failed to parse server response");
//     }
//   };

//   ws.onerror = (err) => {
//     console.error("Conversation WS error:", err);
//     setError("WebSocket connection error");
//     setConnected(false);
//   };

//   ws.onclose = () => {
//     console.log("Conversation WS disconnected");
//     setConnected(false);
//     // only auto-reconnect if we didn’t manually close
//     if (!manualCloseRef.current) {
//       setTimeout(() => {
//         if (selectedChat?.id) {
//           connectConversationWebSocket(selectedChat.id);
//         }
//       }, 3000);
//     }
//   };
// }, [selectedChat]);

// // in your effect that drives connect/cleanup:
// useEffect(() => {
//   if (selectedChat?.id) {
//     connectConversationWebSocket(selectedChat.id);
//   }
//   return () => {
//     // flag that this close is “intentional”
//     manualCloseRef.current = true;
//     websocketRef.current?.close();
//   };
// }, [selectedChat, connectConversationWebSocket]);


//     // Connect to WebSocket when selectedChat changes
//     useEffect(() => {
//         if (selectedChat && selectedChat.id) {
//             setLoading(true);
//             connectConversationWebSocket(selectedChat.id);
//         } else {
//             // Close WebSocket if no chat is selected
//             if (websocketRef.current) {
//                 websocketRef.current.close();
//                 websocketRef.current = null;
//             }
//             setConversationHistory([]);
//             setConnected(false);
//         }

//         // Cleanup on unmount
//         return () => {
//             if (websocketRef.current) {
//                 websocketRef.current.close();
//             }
//         };
//     }, [selectedChat, connectConversationWebSocket]);

//     // Legacy fetch function (for backward compatibility)
//     const fetchConversationHistory = async (chatId) => {
//         setLoading(true);
//         setError(null);
        
//         try {
//             const response = await fetch(`https://ovbot.omnivoltaic.com/users/${chatId}/conversations`);
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
            
//             const data = await response.json();
//             console.log('Fetching conversation history for chat ID:', data);
//             const transformedMessages = transformBackendData(data);
//             setConversationHistory(transformedMessages);
            
//         } catch (error) {
//             console.error('Error fetching conversation history:', error);
//             setError('Failed to load conversation history');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Transform backend Q&A format to your message format
//     const transformBackendData = (backendData) => {
//         console.log('Transforming backend data:', backendData);
//         const messages = [];
        
//         backendData.history.forEach((item, index) => {
//             // Add user question message (outgoing - appears on right)
//             messages.push({
//                 id: `q-${index}`,
//                 type: '', // This will make it appear on the right with double-check
//                 name: 'Customer',
//                 text: item.question,
//                 date: item.created_at,
//                 avatar: <div className="avatar avatar-sm">
//                     <span className="avatar-title rounded-circle bg-primary">U</span>
//                 </div>
//             });
            
//             // Add AI response message (no type - appears on left)  
//             messages.push({
//                 id: `a-${index}`,
//                 type: 'outgoing-message', // Empty type means incoming/left side (no double-check)
//                 name: 'AI Assistant', 
//                 text: item.answer,
//                 date: item.created_at,
//                 avatar: <div className="avatar avatar-sm">
//                     <span className="avatar-title rounded-circle bg-success">AI</span>
//                 </div>
//             });
//         });
//         console.log('Transformed messages:', messages);
//         return messages;
//     };

//     const handleSubmit = async (newValue) => {
//         if (!selectedChat || !selectedChat.id) return;
        
//         // Add user message to local state immediately for better UX
//         const userMessage = {
//             id: `temp-${Date.now()}`,
//             type: 'outgoing', // This makes it appear on the right with double-check
//             name: 'You',
//             text: newValue,
//             date: new Date().toLocaleTimeString(),
//             avatar: <div className="avatar avatar-sm">
//                 <span className="avatar-title rounded-circle bg-primary">U</span>
//             </div>
//         };
        
//         setConversationHistory(prev => [...prev, userMessage]);
//         setInputMsg("");
        
//         // WebSocket will automatically update the conversation history
//         // No need to manually refresh as the WebSocket will push updates
//     };

//     const handleChange = (newValue) => {
//         setInputMsg(newValue);
//     };

//     const refreshConversation = () => {
//         if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
//             websocketRef.current.send(JSON.stringify({ action: 'refresh' }));
//         } else if (selectedChat && selectedChat.id) {
//             // Fallback to HTTP if WebSocket is not connected
//             fetchConversationHistory(selectedChat.id);
//         }
//     };

//     useEffect(() => {
//         if (scrollEl) {
//             setTimeout(() => {
//                 scrollEl.scrollTop = scrollEl.scrollHeight;
//             }, 100)
//         }
//     }, [conversationHistory]); // Also trigger when conversation history changes

//     const MessagesView = (props) => {
//         const {message} = props;

//         if (message.type === 'divider') {
//             return <div className="message-item messages-divider sticky-top" data-label={message.text}></div>
//         } else {
//             return <div className={"message-item " + message.type}>
//                 <div className="message-avatar">
//                     {message.avatar}
//                     <div>
//                         <h5>{message.name}</h5>
//                         <div className="time">
//                             {message.date}
//                             {message.type === 'outgoing' ? <i className="ti-double-check text-info"></i> : null}
//                         </div>
//                     </div>
//                 </div>
//                 {
//                     message.media
//                         ?
//                         message.media
//                         :
//                         <div className="message-content">
//                             {message.text}
//                         </div>
//                 }
//             </div>
//         }
//     };

//     // Loading component
//     const LoadingView = () => (
//         <div className="chat-body d-flex justify-content-center align-items-center">
//             <div className="spinner-border text-primary" role="status">
//                 <span className="sr-only">Loading conversation...</span>
//             </div>
//         </div>
//     );

//     // Error component
//     const ErrorView = () => (
//         <div className="chat-body d-flex justify-content-center align-items-center">
//             <div className="alert alert-danger" role="alert">
//                 <h6>Error loading conversation</h6>
//                 <p className="mb-2">{error}</p>
//                 <div className="d-flex gap-2">
//                     <button 
//                         className="btn btn-sm btn-outline-danger" 
//                         onClick={refreshConversation}
//                     >
//                         Retry
//                     </button>
//                     <span className={`badge ${connected ? 'badge-success' : 'badge-danger'}`}>
//                         {connected ? 'Connected' : 'Disconnected'}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <div className="chat">
//             {
//                 selectedChat && selectedChat.name
//                     ?
//                     <React.Fragment>
//                         <ChatHeader selectedChat={selectedChat}/>
                        
//                         {loading ? (
//                             <LoadingView />
//                         ) : error ? (
//                             <ErrorView />
//                         ) : (
//                             <PerfectScrollbar containerRef={ref => setScrollEl(ref)}>
//                                 <div className="chat-body">
//                                     <div className="messages">
//                                         {
//                                             conversationHistory.length > 0
//                                                 ?
//                                                 conversationHistory.map((message, i) => {
//                                                     return <MessagesView message={message} key={message.id || i}/>
//                                                 })
//                                                 :
//                                                 <div className="text-center text-muted p-4">
//                                                     <p>No messages in this conversation yet.</p>
//                                                     <p>Start a conversation by typing a message below!</p>
//                                                 </div>
//                                         }
//                                     </div>
//                                 </div>
//                             </PerfectScrollbar>
//                         )}
                        
//                         <ChatFooter 
//                             onSubmit={handleSubmit} 
//                             onChange={handleChange} 
//                             inputMsg={inputMsg}
//                             disabled={loading}
//                         />
//                     </React.Fragment>
//                     :
//                     <div className="chat-body no-message">
//                         <div className="no-message-container">
//                             <div className="mb-5">
//                                 <img src={UnselectedChat} width={200} className="img-fluid" alt="unselected"/>
//                             </div>
//                             <p className="lead">Select a chat to read messages</p>
//                         </div>
//                     </div>
//             }
//         </div>
//     )
// }

// export default Chat



import React, {useEffect, useState, useRef, useCallback} from 'react'
import ChatHeader from "./ChatHeader"
import ChatFooter from "./ChatFooter"
import PerfectScrollbar from "react-perfect-scrollbar"
import UnselectedChat from '../../assets/img/unselected-chat.svg'
import {useSelector} from "react-redux"

function Chat() {
    const {selectedChat} = useSelector(state => state);
    const [inputMsg, setInputMsg] = useState('');
    const [scrollEl, setScrollEl] = useState();
    const [conversationHistory, setConversationHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [connected, setConnected] = useState(false);
    const [conversationStatus, setConversationStatus] = useState('idle');
    const [typingIndicator, setTypingIndicator] = useState(false);
    const [lastActivity, setLastActivity] = useState(null);
    const websocketRef = useRef(null);
    const manualCloseRef = useRef(false);
    const heartbeatIntervalRef = useRef(null);
    
    console.log('Selected chat:', selectedChat);

    // WebSocket connection for monitoring customer-AI conversations
    const connectConversationMonitor = useCallback((userId) => {
        if (!userId) return;

        // If there's already a socket OPEN or CONNECTING, bail out
        const existing = websocketRef.current;
        if (
            existing &&
            (existing.readyState === WebSocket.OPEN ||
             existing.readyState === WebSocket.CONNECTING)
        ) {
            return;
        }

        manualCloseRef.current = false;

        // Close any leftover socket
        if (existing) existing.close();

        // Connect to monitoring endpoint
        const ws = new WebSocket(`ws://127.0.0.1:8000/users/${userId}/conversations`);
        websocketRef.current = ws;

        ws.onopen = () => {
            console.log("Conversation monitoring connected for user:", userId);
            setConnected(true);
            setError(null);
            setLoading(true);
            
            // Start heartbeat
            heartbeatIntervalRef.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: "heartbeat" }));
                }
            }, 30000);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Received monitoring update:", data);
                
                switch (data.type) {
                    case "initial_history":
                        // Load initial conversation history
                        const msgs = transformBackendData(data);
                        setConversationHistory(msgs);
                        setLoading(false);
                        break;
                        
                    case "customer_message":
                        // Customer sent a message to AI
                        const customerMessage = {
                            id: data.message.id,
                            type: 'outgoing', // Customer messages appear on right
                            name: 'Customer',
                            text: data.message.content,
                            date: new Date(data.message.timestamp).toLocaleTimeString(),
                            avatar: <div className="avatar avatar-sm">
                                <span className="avatar-title rounded-circle bg-primary">C</span>
                            </div>
                        };
                        
                        setConversationHistory(prev => [...prev, customerMessage]);
                        scrollToBottom();
                        break;
                        
                    case "ai_response":
                        // AI responded to customer
                        const aiMessage = {
                            id: data.message.id,
                            type: '', // AI messages appear on left (no type)
                            name: 'AI Assistant',
                            text: data.message.content,
                            date: new Date(data.message.timestamp).toLocaleTimeString(),
                            avatar: <div className="avatar avatar-sm">
                                <span className="avatar-title rounded-circle bg-success">AI</span>
                            </div>
                        };
                        
                        setConversationHistory(prev => [...prev, aiMessage]);
                        scrollToBottom();
                        break;
                        
                    case "status_update":
                        // Status updates like typing, online, offline
                        setConversationStatus(data.status);
                        
                        if (data.status === "ai_typing") {
                            setTypingIndicator(true);
                        } else {
                            setTypingIndicator(false);
                        }
                        
                        // Update last activity time
                        setLastActivity(data.timestamp);
                        break;
                        
                    case "heartbeat_ack":
                        // Heartbeat acknowledged
                        break;
                        
                    default:
                        console.log("Unknown message type:", data.type);
                }
                
            } catch (err) {
                console.error("Error parsing monitoring message:", err);
                setError("Failed to parse server response");
            }
        };

        ws.onerror = (err) => {
            console.error("Monitoring WebSocket error:", err);
            setError("WebSocket connection error");
            setConnected(false);
        };

        ws.onclose = () => {
            console.log("Monitoring WebSocket disconnected");
            setConnected(false);
            
            // Clear heartbeat
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
                heartbeatIntervalRef.current = null;
            }
            
            // Auto-reconnect if not manually closed
            if (!manualCloseRef.current) {
                setTimeout(() => {
                    if (selectedChat?.id) {
                        connectConversationMonitor(selectedChat.id);
                    }
                }, 3000);
            }
        };
    }, [selectedChat]);

    // Helper function to scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        if (scrollEl) {
            setTimeout(() => {
                scrollEl.scrollTop = scrollEl.scrollHeight;
            }, 100);
        }
    };

    // Connect to monitor when chat is selected
    useEffect(() => {
        if (selectedChat?.id) {
            connectConversationMonitor(selectedChat.id);
        } else {
            // Close WebSocket if no chat is selected
            disconnectWebSocket();
            setConversationHistory([]);
        }
        
        return () => {
            disconnectWebSocket();
        };
    }, [selectedChat?.id, connectConversationMonitor]);

    // Disconnect function
    const disconnectWebSocket = useCallback(() => {
        manualCloseRef.current = true;
        
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
        }
        
        if (websocketRef.current) {
            websocketRef.current.close();
            websocketRef.current = null;
        }
        
        setConnected(false);
        setTypingIndicator(false);
        setConversationStatus('idle');
    }, []);

    // Legacy fetch function (for backward compatibility)
    const fetchConversationHistory = async (chatId) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`https://ovbot.omnivoltaic.com/users/${chatId}/conversations`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fetching conversation history for chat ID:', data);
            const transformedMessages = transformBackendData(data);
            setConversationHistory(transformedMessages);
            
        } catch (error) {
            console.error('Error fetching conversation history:', error);
            setError('Failed to load conversation history');
        } finally {
            setLoading(false);
        }
    };

    // Transform backend Q&A format to your message format
    const transformBackendData = (backendData) => {
        console.log('Transforming backend data:', backendData);
        const messages = [];
        
        const historyData = backendData.history || backendData;
        
        historyData.forEach((item, index) => {
            // Add user question message (outgoing - appears on right)
            messages.push({
                id: `q-${index}`,
                type: 'outgoing', // This will make it appear on the right with double-check
                name: 'Customer',
                text: item.question,
                date: item.created_at,
                avatar: <div className="avatar avatar-sm">
                    <span className="avatar-title rounded-circle bg-primary">C</span>
                </div>
            });
            
            // Add AI response message (no type - appears on left)  
            messages.push({
                id: `a-${index}`,
                type: '', // Empty type means incoming/left side (no double-check)
                name: 'AI Assistant', 
                text: item.answer,
                date: item.created_at,
                avatar: <div className="avatar avatar-sm">
                    <span className="avatar-title rounded-circle bg-success">AI</span>
                </div>
            });
        });
        console.log('Transformed messages:', messages);
        return messages;
    };

    // This function is now just for display purposes since we're monitoring, not sending
    const handleSubmit = async (newValue) => {
        // In monitoring mode, we don't send messages
        // This is just here to maintain the interface
        console.log("Monitoring mode - messages are sent by customers directly to AI");
        setInputMsg("");
    };

    const handleChange = (newValue) => {
        setInputMsg(newValue);
    };

    const refreshConversation = () => {
        if (selectedChat && selectedChat.id) {
            // Reconnect WebSocket to refresh
            disconnectWebSocket();
            setTimeout(() => {
                connectConversationMonitor(selectedChat.id);
            }, 500);
        }
    };

    useEffect(() => {
        if (scrollEl) {
            setTimeout(() => {
                scrollEl.scrollTop = scrollEl.scrollHeight;
            }, 100)
        }
    }, [conversationHistory]); // Also trigger when conversation history changes

    // Component to show typing indicator
    const TypingIndicator = () => {
        if (!typingIndicator) return null;
        
        return (
            <div className="message-item">
                <div className="message-avatar">
                    <div className="avatar avatar-sm">
                        <span className="avatar-title rounded-circle bg-success">AI</span>
                    </div>
                    <div>
                        <h5>AI Assistant</h5>
                        <div className="time">typing...</div>
                    </div>
                </div>
                <div className="message-content">
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        );
    };

    // Component to show connection status
    const ConnectionStatus = () => {
        return (
            <div className="d-flex align-items-center mb-2">
                <div className={`badge ${connected ? 'badge-success' : 'badge-danger'} me-2`}>
                    {connected ? 'Live Monitoring' : 'Disconnected'}
                </div>
                {lastActivity && (
                    <small className="text-muted">
                        Last activity: {new Date(lastActivity).toLocaleTimeString()}
                    </small>
                )}
            </div>
        );
    };

    const MessagesView = (props) => {
        const {message} = props;

        if (message.type === 'divider') {
            return <div className="message-item messages-divider sticky-top" data-label={message.text}></div>
        } else {
            return <div className={"message-item " + message.type}>
                <div className="message-avatar">
                    {message.avatar}
                    <div>
                        <h5>{message.name}</h5>
                        <div className="time">
                            {message.date}
                            {message.type === 'outgoing' ? <i className="ti-double-check text-info"></i> : null}
                        </div>
                    </div>
                </div>
                {
                    message.media
                        ?
                        message.media
                        :
                        <div className="message-content">
                            {message.text}
                        </div>
                }
            </div>
        }
    };

    // Loading component
    const LoadingView = () => (
        <div className="chat-body d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading conversation...</span>
            </div>
        </div>
    );

    // Error component
    const ErrorView = () => (
        <div className="chat-body d-flex justify-content-center align-items-center">
            <div className="alert alert-danger" role="alert">
                <h6>Error loading conversation</h6>
                <p className="mb-2">{error}</p>
                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={refreshConversation}
                    >
                        Retry
                    </button>
                    <span className={`badge ${connected ? 'badge-success' : 'badge-danger'}`}>
                        {connected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="chat">
            {
                selectedChat && selectedChat.name
                    ?
                    <React.Fragment>
                        <ChatHeader selectedChat={selectedChat}/>
                        
                        {loading ? (
                            <LoadingView />
                        ) : error ? (
                            <ErrorView />
                        ) : (
                            <React.Fragment>
                                <ConnectionStatus />
                                <PerfectScrollbar containerRef={ref => setScrollEl(ref)}>
                                    <div className="chat-body">
                                        <div className="messages">
                                            {
                                                conversationHistory.length > 0
                                                    ?
                                                    conversationHistory.map((message, i) => {
                                                        return <MessagesView message={message} key={message.id || i}/>
                                                    })
                                                    :
                                                    <div className="text-center text-muted p-4">
                                                        <p>No messages in this conversation yet.</p>
                                                        <p>Waiting for customer to start conversation...</p>
                                                    </div>
                                            }
                                            <TypingIndicator />
                                        </div>
                                    </div>
                                </PerfectScrollbar>
                            </React.Fragment>
                        )}
                        
                        <ChatFooter 
                            onSubmit={handleSubmit} 
                            onChange={handleChange} 
                            inputMsg={inputMsg}
                            disabled={true}
                            placeholder="Monitoring mode - view only"
                        />
                    </React.Fragment>
                    :
                    <div className="chat-body no-message">
                        <div className="no-message-container">
                            <div className="mb-5">
                                <img src={UnselectedChat} width={200} className="img-fluid" alt="unselected"/>
                            </div>
                            <p className="lead">Select a chat to monitor messages</p>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Chat
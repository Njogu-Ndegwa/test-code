// import React, {useEffect, useState} from 'react'
// import ChatHeader from "./ChatHeader"
// import ChatFooter from "./ChatFooter"
// import PerfectScrollbar from "react-perfect-scrollbar"
// import UnselectedChat from '../../assets/img/unselected-chat.svg'
// import {useSelector} from "react-redux"

// function Chat() {

//     const {selectedChat} = useSelector(state => state);

//     const [inputMsg, setInputMsg] = useState('');

//     const [scrollEl, setScrollEl] = useState();

//     const handleSubmit = (newValue) => {
//         selectedChat.messages.push(newValue);
//         setInputMsg("");
//     };

//     const handleChange = (newValue) => {
//         setInputMsg(newValue);
//     };

//     useEffect(() => {
//         if (scrollEl) {
//             setTimeout(() => {
//                 scrollEl.scrollTop = scrollEl.scrollHeight;
//             }, 100)
//         }
//     });

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
//                             {message.type ? <i className="ti-double-check text-info"></i> : null}
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

//     return (
//         <div className="chat">
//             {
//                 selectedChat.name
//                     ?
//                     <React.Fragment>
//                         <ChatHeader selectedChat={selectedChat}/>
//                         <PerfectScrollbar containerRef={ref => setScrollEl(ref)}>
//                             <div className="chat-body">
//                                 <div className="messages">
//                                     {
//                                         selectedChat.messages
//                                             ?
//                                             selectedChat.messages.map((message, i) => {
//                                                 return <MessagesView message={message} key={i}/>
//                                             })
//                                             :
//                                             null
//                                     }
//                                 </div>
//                             </div>
//                         </PerfectScrollbar>
//                         <ChatFooter onSubmit={handleSubmit} onChange={handleChange} inputMsg={inputMsg}/>
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



// import React, {useEffect, useState} from 'react'
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
    
//     console.log('Selected chat:', selectedChat);

//     // Fetch conversation history when selectedChat changes
//     useEffect(() => {
//         if (selectedChat && selectedChat.id) {
//             fetchConversationHistory(selectedChat.id);
//         }
//     }, [selectedChat]);

//     const fetchConversationHistory = async (chatId) => {
//         setLoading(true);
//         setError(null);
        
//         try {
//             // Replace 123 with actual user ID if you have it in your state/context
//             const userId = 123; // You might want to get this from user context or props
//             const response = await fetch(`http://127.0.0.1:8000/users/${userId}/conversations`);
            
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
            
//             const data = await response.json();
            
//             // Transform backend data to match your frontend message format
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
//         const messages = [];
        
//         backendData.forEach((item, index) => {
//             // Add user question message
//             messages.push({
//                 id: `q-${index}`,
//                 type: 'outgoing', // Assuming user messages are outgoing
//                 name: 'You',
//                 text: item.question,
//                 date: new Date().toLocaleTimeString(), // You might want to use actual timestamps from backend
//                 avatar: <div className="avatar avatar-sm">
//                     <span className="avatar-title rounded-circle bg-primary">U</span>
//                 </div>
//             });
            
//             // Add AI response message
//             messages.push({
//                 id: `a-${index}`,
//                 type: 'incoming', // Assuming AI responses are incoming
//                 name: 'AI Assistant',
//                 text: item.answer,
//                 date: new Date().toLocaleTimeString(),
//                 avatar: <div className="avatar avatar-sm">
//                     <span className="avatar-title rounded-circle bg-success">AI</span>
//                 </div>
//             });
//         });
        
//         return messages;
//     };

//     const handleSubmit = async (newValue) => {
//         if (!selectedChat || !selectedChat.id) return;
        
//         // Add user message to local state immediately for better UX
//         const userMessage = {
//             id: `temp-${Date.now()}`,
//             type: 'outgoing',
//             name: 'You',
//             text: newValue,
//             date: new Date().toLocaleTimeString(),
//             avatar: <div className="avatar avatar-sm">
//                 <span className="avatar-title rounded-circle bg-primary">U</span>
//             </div>
//         };
        
//         setConversationHistory(prev => [...prev, userMessage]);
//         setInputMsg("");
        
//         // Here you would typically send the message to your backend
//         // and then refresh the conversation history
//         // For now, just refresh the conversation
//         setTimeout(() => {
//             fetchConversationHistory(selectedChat.id);
//         }, 1000);
//     };

//     const handleChange = (newValue) => {
//         setInputMsg(newValue);
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
//                 <button 
//                     className="btn btn-sm btn-outline-danger" 
//                     onClick={() => fetchConversationHistory(selectedChat.id)}
//                 >
//                     Retry
//                 </button>
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


import React, {useEffect, useState} from 'react'
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
    
    console.log('Selected chat:', selectedChat);

    // Fetch conversation history when selectedChat changes
    useEffect(() => {
        if (selectedChat && selectedChat.id) {
            fetchConversationHistory(selectedChat.id);
        }
    }, [selectedChat]);

    const fetchConversationHistory = async (chatId) => {
        setLoading(true);
        setError(null);
        
        try {
            // Replace 123 with actual user ID if you have it in your state/context
            const userId = 123; // You might want to get this from user context or props
            const response = await fetch(`http://127.0.0.1:8000/users/${chatId}/conversations`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fetching conversation history for chat ID:', data);
            // Transform backend data to match your frontend message format
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
        const messages = [];
        
        backendData.forEach((item, index) => {
            // Add user question message (outgoing - appears on right)
            messages.push({
                id: `q-${index}`,
                type: '', // This will make it appear on the right with double-check
                name: 'Customer',
                text: item.question,
                date: item.created_at,
                avatar: <div className="avatar avatar-sm">
                    <span className="avatar-title rounded-circle bg-primary">U</span>
                </div>
            });
            
            // Add AI response message (no type - appears on left)  
            messages.push({
                id: `a-${index}`,
                type: 'outgoing-message', // Empty type means incoming/left side (no double-check)
                name: 'AI Assistant', 
                text: item.answer,
                date: item.created_at,
                avatar: <div className="avatar avatar-sm">
                    <span className="avatar-title rounded-circle bg-success">AI</span>
                </div>
            });
        });
        
        return messages;
    };

    const handleSubmit = async (newValue) => {
        if (!selectedChat || !selectedChat.id) return;
        
        // Add user message to local state immediately for better UX
        const userMessage = {
            id: `temp-${Date.now()}`,
            type: 'outgoing', // This makes it appear on the right with double-check
            name: 'You',
            text: newValue,
            date: new Date().toLocaleTimeString(),
            avatar: <div className="avatar avatar-sm">
                <span className="avatar-title rounded-circle bg-primary">U</span>
            </div>
        };
        
        setConversationHistory(prev => [...prev, userMessage]);
        setInputMsg("");
        
        // Here you would typically send the message to your backend
        // and then refresh the conversation history
        // For now, just refresh the conversation
        setTimeout(() => {
            fetchConversationHistory(selectedChat.id);
        }, 1000);
    };

    const handleChange = (newValue) => {
        setInputMsg(newValue);
    };

    useEffect(() => {
        if (scrollEl) {
            setTimeout(() => {
                scrollEl.scrollTop = scrollEl.scrollHeight;
            }, 100)
        }
    }, [conversationHistory]); // Also trigger when conversation history changes

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
                <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => fetchConversationHistory(selectedChat.id)}
                >
                    Retry
                </button>
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
                                                    <p>Start a conversation by typing a message below!</p>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </PerfectScrollbar>
                        )}
                        
                        <ChatFooter 
                            onSubmit={handleSubmit} 
                            onChange={handleChange} 
                            inputMsg={inputMsg}
                            disabled={loading}
                        />
                    </React.Fragment>
                    :
                    <div className="chat-body no-message">
                        <div className="no-message-container">
                            <div className="mb-5">
                                <img src={UnselectedChat} width={200} className="img-fluid" alt="unselected"/>
                            </div>
                            <p className="lead">Select a chat to read messages</p>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Chat
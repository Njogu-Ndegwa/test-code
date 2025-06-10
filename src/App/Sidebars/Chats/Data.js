
// import React, { useState, useEffect } from 'react';
// import ManAvatar1 from "../../../assets/img/man_avatar1.jpg" // Update with your actual avatar import path

// // Function to fetch and map chat data
// export const fetchChatLists = async () => {
//   try {
//     const response = await fetch('https://ovbot.omnivoltaic.com/users');
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     // Map backend data to frontend structure
//     const chatLists = data.users.map(user => ({
//       id: user.user_id, 
//       name: user.user_id, // You mentioned this should be mapped from backend - update as needed
//       avatar: (
//         <figure className="avatar avatar-state-success">
//           <img src={ManAvatar1} className="rounded-circle" alt="avatar"/>
//         </figure>
//       ),
//       text: <p>{user.latest_text}</p>,
//       created_at: user.created_at
//     }));
    
//     return chatLists;
//   } catch (error) {
//     console.error('Error fetching chat lists:', error);
//     throw error;
//   }
// };


import React, { useState, useEffect, useRef, useCallback } from 'react';
import ManAvatar1 from "../../../assets/img/man_avatar1.jpg"

// WebSocket-based chat list component
export const useChatLists = () => {
  const [chatLists, setChatLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const websocketRef = useRef(null);

  const transformUserData = (data) => {
    console.log('Transforming user data:', data);
    return data.users.map(user => ({
      id: user.user_id,
      name: user.user_id,
      avatar: (
        <figure className="avatar avatar-state-success">
          <img src={ManAvatar1} className="rounded-circle" alt="avatar"/>
        </figure>
      ),
      text: <p>{user.latest_text}</p>,
      created_at: user.created_at
    }));
  };

  const connectWebSocket = useCallback(() => {
    const wsUrl = 'ws://ovbot.omnivoltaic.com/users';
    websocketRef.current = new WebSocket(wsUrl);

    websocketRef.current.onopen = () => {
      console.log('User list WebSocket connected');
      setConnected(true);
      setError(null);
    };

    websocketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received user list update:', data);
          const transformedChatLists = transformUserData(data);
            console.log('Transformed chat lists:', transformedChatLists);
            setChatLists(transformedChatLists);
            setLoading(false);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
    };
  };

    websocketRef.current.onerror = (error) => {
      console.error('User list WebSocket error:', error);
      setError('WebSocket connection error');
      setConnected(false);
    };

    websocketRef.current.onclose = () => {
      console.log('User list WebSocket disconnected');
      setConnected(false);
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };
  }, []);

  const refreshUserList = useCallback(() => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({ action: 'refresh' }));
    }
  }, []);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  return {
    chatLists,
    loading,
    error,
    connected,
    refreshUserList
  };
};

// // Legacy function to fetch and map chat data (for backward compatibility)
// export const fetchChatLists = async () => {
//   console.warn('fetchChatLists is deprecated. Use useChatLists hook instead.');
//   try {
//     const response = await fetch('https://ovbot.omnivoltaic.com/users');
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     // Map backend data to frontend structure
//     const chatLists = data.users.map(user => ({
//       id: user.user_id, 
//       name: user.user_id, // You mentioned this should be mapped from backend - update as needed
//       avatar: (
//         <figure className="avatar avatar-state-success">
//           <img src={ManAvatar1} className="rounded-circle" alt="avatar"/>
//         </figure>
//       ),
//       text: <p>{user.latest_text}</p>,
//       created_at: user.created_at
//     }));
    
//     return chatLists;
//   } catch (error) {
//     console.error('Error fetching chat lists:', error);
//     throw error;
//   }
// };
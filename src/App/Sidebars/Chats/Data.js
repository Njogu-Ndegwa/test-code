// import React from 'react';

// // Avatars
// import ManAvatar1 from "../../../assets/img/man_avatar1.jpg"

// export const chatLists = [
//     {
//         id: 1,
//         name: 'Townsend Seary',
//         avatar: <figure className="avatar avatar-state-success">
//             <img src={ManAvatar1} className="rounded-circle" alt="avatar"/>
//         </figure>,
//         text: <p>What's up, how are you?</p>,
//     }
// ];


import React, { useState, useEffect } from 'react';
import ManAvatar1 from "../../../assets/img/man_avatar1.jpg" // Update with your actual avatar import path

// Function to fetch and map chat data
export const fetchChatLists = async () => {
  try {
    const response = await fetch('https://ovbot.omnivoltaic.com/users');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map backend data to frontend structure
    const chatLists = data.users.map(user => ({
      id: user.user_id, 
      name: user.user_id, // You mentioned this should be mapped from backend - update as needed
      avatar: (
        <figure className="avatar avatar-state-success">
          <img src={ManAvatar1} className="rounded-circle" alt="avatar"/>
        </figure>
      ),
      text: <p>{user.latest_text}</p>,
      created_at: user.created_at
    }));
    
    return chatLists;
  } catch (error) {
    console.error('Error fetching chat lists:', error);
    throw error;
  }
};

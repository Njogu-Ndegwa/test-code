import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import * as FeatherIcon from 'react-feather'
import {Tooltip} from 'reactstrap'
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'
import AddGroupModal from "../../Modals/AddGroupModal"
import ChatsDropdown from "./ChatsDropdown"
import {sidebarAction} from "../../../Store/Actions/sidebarAction"
import {fetchChatLists, useChatLists} from "./Data";
import {selectedChatAction} from "../../../Store/Actions/selectedChatAction";

function Index() {

    const dispatch = useDispatch();
    const { chatLists, loading, error, connected, refreshUserList } = useChatLists();
    const {selectedChat} = useSelector(state => state);

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

    console.log(chatLists, "The Chat Lists------23----");
//   if (loading) return <div>Loading chat lists...</div>;
//   if (error) return <div>Error: {error}</div>;
    const chatSelectHandle = (chat) => {
        console.log('Selected chat:', chat);
        chat.unread_messages = 0;
        dispatch(selectedChatAction(chat));
        document.querySelector('.chat').classList.add('open');
    };

    const mobileMenuBtn = () => document.body.classList.toggle('navigation-open');

    const ChatListView = (props) => {
        const {chat} = props;

        return <li className={"list-group-item " + (chat.id === selectedChat.id ? 'open-chat' : '')}
                   onClick={() => chatSelectHandle(chat)}>
            {chat.avatar}
            <div className="users-list-body">
                <div>
                    <h5 className={chat.unread_messages ? 'text-primary' : ''}>{chat.name}</h5>
                    {chat.text}
                </div>
                <div className="users-list-action">
                    {chat.unread_messages ? <div className="new-message-count">{chat.unread_messages}</div> : ''}
                    <small className={chat.unread_messages ? 'text-primary' : 'text-muted'}>{chat.date}</small>
                    <div className="action-toggle">
                        <ChatsDropdown/>
                    </div>
                </div>
            </div>
        </li>
    };
    console.log('chatLists', chatLists.users);
    return (
        <div className="sidebar active">
            <header>
                <div className="d-flex align-items-center">
                    <button onClick={mobileMenuBtn} className="btn btn-outline-light mobile-navigation-button mr-3 d-xl-none d-inline">
                        <FeatherIcon.Menu/>
                    </button>
                    <span className="sidebar-title">Chats</span>
                </div>
                <ul className="list-inline">
                    <li className="list-inline-item">
                        <AddGroupModal/>
                    </li>
                    <li className="list-inline-item">
                        <button onClick={() => dispatch(sidebarAction('Friends'))} className="btn btn-outline-light"
                                id="Tooltip-New-Chat">
                            <FeatherIcon.PlusCircle/>
                        </button>
                        <Tooltip
                            placement="bottom"
                            isOpen={tooltipOpen}
                            target={"Tooltip-New-Chat"}
                            toggle={toggle}>
                            New chat
                        </Tooltip>
                    </li>
                </ul>
            </header>
            <form>
                <input type="text" className="form-control" placeholder="Search chats"/>
            </form>
            <div className="sidebar-body">
                <PerfectScrollbar>
                    <ul className="list-group list-group-flush">
                        {
                            chatLists.map((chat, i) => <ChatListView chat={chat} key={i}/>)
                        }
                    </ul>
                </PerfectScrollbar>
            </div>
        </div>
    )
}

export default Index


// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import * as FeatherIcon from 'react-feather';
// import { Tooltip } from 'reactstrap';
// import 'react-perfect-scrollbar/dist/css/styles.css';
// import PerfectScrollbar from 'react-perfect-scrollbar';
// import AddGroupModal from '../../Modals/AddGroupModal';
// import ChatsDropdown from './ChatsDropdown';
// import { sidebarAction } from '../../../Store/Actions/sidebarAction';
// import { selectedChatAction } from '../../../Store/Actions/selectedChatAction';
// import { useChatLists } from './Data';

// function Index() {
//   const dispatch = useDispatch();
//   const { selectedChat } = useSelector(state => state);
//   const { chatLists, loading, error, connected, refreshUserList } = useChatLists();

//   const [tooltipOpen, setTooltipOpen] = useState(false);
//   const toggle = () => setTooltipOpen(!tooltipOpen);

//   const chatSelectHandle = (chat) => {
//     console.log('Selected chat:', chat);
//     chat.unread_messages = 0;
//     dispatch(selectedChatAction(chat));
//     document.querySelector('.chat').classList.add('open');
//   };

//   const mobileMenuBtn = () => document.body.classList.toggle('navigation-open');

//   const ChatListView = ({ chat }) => (
//     <li
//       className={`list-group-item ${chat.id === selectedChat.id ? 'open-chat' : ''}`}
//       onClick={() => chatSelectHandle(chat)}
//     >
//       {chat.avatar}
//       <div className="users-list-body">
//         <div>
//           <h5 className={chat.unread_messages ? 'text-primary' : ''}>{chat.name}</h5>
//           {chat.text}
//         </div>
//         <div className="users-list-action">
//           {chat.unread_messages ? <div className="new-message-count">{chat.unread_messages}</div> : null}
//           <small className={chat.unread_messages ? 'text-primary' : 'text-muted'}>
//             {chat.created_at}
//           </small>
//           <div className="action-toggle">
//             <ChatsDropdown />
//           </div>
//         </div>
//       </div>
//     </li>
//   );

//   return (
//     <div className="sidebar active">
//       <header>
//         <div className="d-flex align-items-center">
//           <button
//             onClick={mobileMenuBtn}
//             className="btn btn-outline-light mobile-navigation-button mr-3 d-xl-none d-inline"
//           >
//             <FeatherIcon.Menu />
//           </button>
//           <span className="sidebar-title">Chats</span>
//         </div>
//         <ul className="list-inline">
//           <li className="list-inline-item">
//             <AddGroupModal />
//           </li>
//           <li className="list-inline-item">
//             <button
//               onClick={() => dispatch(sidebarAction('Friends'))}
//               className="btn btn-outline-light"
//               id="Tooltip-New-Chat"
//             >
//               <FeatherIcon.PlusCircle />
//             </button>
//             <Tooltip placement="bottom" isOpen={tooltipOpen} target="Tooltip-New-Chat" toggle={toggle}>
//               New chat
//             </Tooltip>
//           </li>
//           <li className="list-inline-item">
//             <button className="btn btn-outline-light" onClick={refreshUserList} disabled={!connected}>
//               <FeatherIcon.RefreshCcw />
//             </button>
//           </li>
//         </ul>
//         {!connected && <small className="text-warning">Reconnecting...</small>}
//       </header>

//       <form>
//         <input type="text" className="form-control" placeholder="Search chats" />
//       </form>

//       <div className="sidebar-body">
//         <PerfectScrollbar>
//           <ul className="list-group list-group-flush">
//             {chatLists.map((chat, i) => (
//               <ChatListView chat={chat} key={i} />
//             ))}
//           </ul>
//         </PerfectScrollbar>
//       </div>
//     </div>
//   );
// }

// export default Index;

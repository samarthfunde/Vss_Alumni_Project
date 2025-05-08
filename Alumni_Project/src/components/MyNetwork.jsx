import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Container,
  Button,
  Dialog,
  DialogContent,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  Badge,
  Menu,
  MenuItem,
  Snackbar,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import CircleIcon from '@mui/icons-material/Circle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import avatarImage from "../assets/uploads/gallery/avtar.png";
import crossIcon from '../assets/cross_icon.png';
import checkTick from '../assets/check_tick.png';
import myChatIcon from '../assets/mychat.png';

import { baseUrl } from '../utils/globalurl';

const MyNetwork = () => {
  const [invitations, setInvitations] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  // Edit message state
  const [isEditing, setIsEditing] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  
  // Deleted messages state
  const [deletedMessages, setDeletedMessages] = useState({
    forMe: [],
    forEveryone: []
  });
  
  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  
  // Message menu position
  const [menuPosition, setMenuPosition] = useState({
    left: 0,
    top: 0
  });
  
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchPendingRequests();
    fetchAcceptedConnections();
    fetchUnreadMessageCounts();
    
    // Set up interval to check for new messages and update unread counts
    const intervalId = setInterval(() => {
      fetchUnreadMessageCounts();
      // If chat is open, refresh messages for the selected user
      if (chatOpen && selectedUser) {
        fetchMessages(selectedUser.user_id);
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [chatOpen, selectedUser]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get(`${baseUrl}auth/connection/requests`, {
        params: { receiver_id: userId }
      });
      setInvitations(res.data.requests || []); 
      console.log(res.data.requests);
    } catch (error) {
      console.error("Error fetching pending invitations:", error);
    }
  };

  const fetchAcceptedConnections = async () => {
    try {
      const res = await axios.get(`${baseUrl}auth/connection`, {
        params: { user_id: userId }
      }); 
      console.log(res.data.connections);
      setAcceptedConnections(res.data.connections || []); 
    } catch (error) {
      console.error("Error fetching accepted connections:", error);
    }
  };

  const fetchUnreadMessageCounts = async () => {
    try {
      const res = await axios.get(`${baseUrl}auth/messages/unread/count`, {
        params: { receiver_id: userId }
      });
      
      // Convert array of { sender_id, count } to object map for easier access
      const countsMap = {};
      res.data.counts.forEach(item => {
        countsMap[item.sender_id] = item.count;
      });
      
      setUnreadCounts(countsMap);
    } catch (error) {
      console.error("Error fetching unread message counts:", error);
    }
  };

  const handleRespond = async (senderId, status) => {
    try {
      await axios.post(`${baseUrl}auth/connection/respond`, {
        sender_id: senderId,
        receiver_id: userId,
        status,
      });
      fetchPendingRequests();
      fetchAcceptedConnections();
    } catch (error) {
      console.error(`Error updating connection status: ${status}`, error);
    }
  };

  const handleAccept = (senderId) => {
    handleRespond(senderId, "accepted");
  };

  const handleDecline = (senderId) => {
    handleRespond(senderId, "rejected");
  };

  // Chat related functions
  const fetchMessages = async (receiverId) => {
    try {
      const res = await axios.get(`${baseUrl}auth/messages`, {
        params: {
          sender_id: userId,
          receiver_id: receiverId
        }
      });
      
      // Filter out messages that are deleted for the current user
      const filteredMessages = res.data.messages.filter(msg => {
        const isDeletedForCurrentUser = 
          (msg.sender_id === userId && msg.deleted_for_sender === 1) ||
          (msg.receiver_id === userId && msg.deleted_for_receiver === 1);
        
        // Update the deletedMessages state for UI representation
        if (isDeletedForCurrentUser) {
          setDeletedMessages(prev => ({
            ...prev,
            forMe: [...prev.forMe, msg.id]
          }));
        }
        
        return !isDeletedForCurrentUser;
      });
      
      setChatMessages(filteredMessages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const markMessagesAsRead = async (senderId) => {
    try {
      await axios.put(`${baseUrl}auth/messages/read`, {
        sender_id: senderId,
        receiver_id: userId
      });
      
      // Update unread counts locally
      setUnreadCounts(prev => ({
        ...prev,
        [senderId]: 0
      }));
      
      // Update read status in chatMessages
      setChatMessages(prev => 
        prev.map(msg => 
          msg.sender_id === senderId ? { ...msg, read_status: 'read' } : msg
        )
      );
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    }
  };

  const handleOpenChat = async (user) => {
    setSelectedUser(user);
    setChatOpen(true);
    
    // Cancel any ongoing edit if switching chats
    if (isEditing) {
      handleCancelEdit();
    }
    
    // Fetch messages
    await fetchMessages(user.user_id);
    
    // Mark all messages from this user as read
    markMessagesAsRead(user.user_id);
  };

  const handleCloseChat = () => {
    // Cancel any ongoing edit before closing chat
    if (isEditing) {
      handleCancelEdit();
    }
    setChatOpen(false);
    setChatMessages([]);
    setMessage("");
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      // Check if we're editing a message or sending a new one
      if (isEditing && editMessageId) {
        await handleSaveEdit();
      } else {
        // Send a new message
        const newMessage = {
          sender_id: userId,
          receiver_id: selectedUser.user_id,
          message_text: message
        };

        try {
          const response = await axios.post(`${baseUrl}auth/messages/send`, newMessage);
          const sentMessageWithId = {
            ...newMessage,
            id: response.data.messageId,
            created_at: new Date().toISOString(),
            read_status: 'unread'
          }; 
          
          setChatMessages(prev => [...prev, sentMessageWithId]);
          setMessage("");
        } catch (err) {
          console.error("Error sending message:", err);
          setSnackbar({
            open: true,
            message: "Failed to send message",
            severity: "error"
          });
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Message options menu handlers - FIXED TO USE POSITION INSTEAD OF ANCHOR
  const handleOpenMessageMenu = (event, message) => {
    // Allow opening menu for any message sent by the current user
    if (String(message.sender_id) === String(userId)) {
      // Store the mouse position instead of the element reference
      setMenuPosition({
        left: event.clientX,
        top: event.clientY
      });
      setSelectedMessage(message);
      setMenuAnchorEl({ current: event.currentTarget });
    }
  };

  const handleCloseMessageMenu = () => {
    setMenuAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleEditMessage = () => {
    if (!selectedMessage) return;
    
    // Start editing mode and move message text to input field
    setIsEditing(true);
    setEditMessageId(selectedMessage.id);
    setMessage(selectedMessage.message_text);
    handleCloseMessageMenu();
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditMessageId(null);
    setMessage("");
  };
  
  const handleSaveEdit = async () => {
    if (!editMessageId || !message.trim()) return;
    
    try {
      await axios.put(`${baseUrl}auth/messages/edit`, {
        message_id: editMessageId,
        message_text: message
      });
      
      // Update the message in the UI
      setChatMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === editMessageId 
            ? { ...msg, message_text: message, edited: true } 
            : msg
        )
      );
      
      setSnackbar({
        open: true,
        message: "Message updated successfully",
        severity: "success"
      });
    } catch (err) {
      console.error("Error editing message:", err);
      
      // Show appropriate error message
      let errorMessage = "Failed to edit the message";
      if (err.response) {
        if (err.response.status === 403) {
          errorMessage = "Cannot edit message that has already been read";
        } else if (err.response.status === 404) {
          errorMessage = "Message not found";
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });
      return; // Return early without clearing edit state on failure
    } 
    
    // Reset edit state only on success
    setIsEditing(false);
    setEditMessageId(null);
    setMessage("");
  };

  const handleDeleteForMe = async () => {
    if (!selectedMessage || !userId) return;
    
    try {
      await axios.post(`${baseUrl}auth/messages/delete`, {
        message_id: selectedMessage.id,
        user_id: userId,
        delete_for: 'me'
      });
  
      // DO NOT remove message from UI, just mark it as deleted for current user
      setDeletedMessages(prev => ({
        ...prev,
        forMe: [...prev.forMe, selectedMessage.id]
      }));
  
      setSnackbar({
        open: true,
        message: "Message deleted for you",
        severity: "success"
      });
  
      handleCloseMessageMenu();
    } catch (error) {
      console.error('Error deleting message for me:', error);
  
      setSnackbar({
        open: true,
        message: "Failed to delete message",
        severity: "error"
      });
    }
  };
  
  // Handle message deletion for all users
  const handleDeleteForEveryone = async () => {
    if (!selectedMessage || !userId) return;
    
    // Check if the current user is the sender
    if (String(selectedMessage.sender_id) !== String(userId)) {
      setSnackbar({
        open: true,
        message: "Only the sender can delete a message for everyone",
        severity: "error"
      });
      handleCloseMessageMenu();
      return;
    }
    
    // Check if the message has been read
    if (selectedMessage.read_status === 'read') {
      setSnackbar({
        open: true,
        message: "Cannot delete messages that have been read",
        severity: "error"
      });
      handleCloseMessageMenu();
      return;
    }
    
    try {
      await axios.post(`${baseUrl}auth/messages/delete`, {
        message_id: selectedMessage.id,
        user_id: userId,
        delete_for: 'everyone'
      });
      
      // Update local state to mark message as deleted for everyone
      setDeletedMessages(prev => ({
        ...prev,
        forEveryone: [...prev.forEveryone, selectedMessage.id]
      }));
      
      setSnackbar({
        open: true,
        message: "Message deleted for everyone",
        severity: "success"
      });
      
      handleCloseMessageMenu();
    } catch (error) {
      console.error('Error deleting message for everyone:', error);
      
      setSnackbar({
        open: true,
        message: "Failed to delete message for everyone",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <>
      <header className="masthead">
        <div className="container">
          <div className="row mt-5 h-100 align-items-center justify-content-center text-center">
            <div
              className="col-lg-10 align-self-end mb-4"
              style={{
                background: "#0000002e",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <h2 className="text-uppercase text-white font-weight-bold">
                My Network
              </h2>
              <hr className="divider my-4" />
              <p className="text-white-75 text-light mb-5">
                Building Relationships, Building Success!
              </p>
            </div>
          </div>
        </div>
      </header>

      <Container maxWidth="lg" sx={{ py: 4, mt: 4 }}>
        {/* Invitations */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="600" mb={3}>
            Invitations ({invitations.length})
          </Typography>

          {invitations.map((invite) => (
            <Box
              key={`invite-${invite.id || `${invite.sender_id}-${invite.sender_name}`}`}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                mb: 2,
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}> 
              <Avatar 
  src={
    invite.avatar
      ? `${baseUrl}${invite.avatar.replace(/\\/g, '/')}`
      : avatarImage
  }
  alt="User"
  sx={{ width: 50, height: 50, mr: 2 }}
/>
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">
                    {invite.sender_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Course: {invite.course}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<Box component="img" src={checkTick} sx={{ width: 24 }} />} 
                  onClick={() => handleAccept(invite.sender_id)}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Box component="img" src={crossIcon} sx={{ width: 20 }} />} 
                  onClick={() => handleDecline(invite.sender_id)}
                >
                  Decline
                </Button>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Accepted Connections */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight="600" mb={3}>
            Accepted Connections
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: { xs: 4, sm: 3 }
            }}
          >
            {acceptedConnections.map((connection) => (
              <Card
                key={`connection-${connection.id || connection.user_id || Math.random().toString(36).substr(2, 9)}`}
                sx={{
                  width: { xs: '90%', sm: '45%', md: '22%' },
                  maxWidth: 280,
                  textAlign: 'center',
                  borderRadius: 3,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  mx: 'auto',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Box sx={{ pt: 4, pb: 2, display: 'flex', justifyContent: 'center' }}>
                  <Avatar
                      src={
                        connection.avatar
                          ? `${baseUrl}${connection.avatar.replace(/\\/g, '/')}`
                          : avatarImage
                      }
                    alt={connection.name}
                    sx={{ width: 80, height: 80 }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" align="center">
                    {connection.user_name}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Course:</strong> {connection.course}  <br />
                      <strong>Currently Working:</strong> {connection.connected_to} <br />
                      <strong>Batch:</strong> {connection.batch}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Badge 
                      badgeContent={unreadCounts[connection.user_id] || 0} 
                      color="error"
                      sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: '18px', minWidth: '18px' } }}
                    >
                      <Box
                        component="img"
                        src={myChatIcon}
                        alt="Chat"
                        sx={{ width: 38, height: 38, cursor: 'pointer' }}
                        onClick={() => handleOpenChat(connection)}
                      />
                    </Badge>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Chat Dialog */}
      <Dialog 
        open={chatOpen} 
        onClose={handleCloseChat}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            width: "500px",
            height: "500px",
            maxWidth: { xs: "95%", sm: "500px" },
            maxHeight: { xs: "95vh", sm: "500px" },
            borderRadius: "10px",
            m: 0,
            overflow: "hidden",
            animation: "popupAnimation 0.3s ease-out",
            "@keyframes popupAnimation": {
              "0%": {
                opacity: 0,
                transform: "scale(0.8)"
              },
              "100%": {
                opacity: 1,
                transform: "scale(1)"
              }
            }
          }
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Chat Header */}
          <Box sx={{ 
            p: 2, 
            bgcolor: "#f5f5f5", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            borderBottom: "1px solid #e0e0e0"
          }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar src={avatarImage} alt={selectedUser?.user_name || "User"} />
              <Typography variant="subtitle1" fontWeight="600" sx={{ ml: 1.5 }}>
                {selectedUser?.user_name || "User"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={() => markMessagesAsRead(selectedUser?.user_id)} size="small" color="primary" sx={{ mr: 1 }}>
                <MarkChatReadIcon />
              </IconButton>
              <IconButton onClick={handleCloseChat} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

   {/* Chat Messages Area */}
<Box sx={{ 
  flexGrow: 1, 
  p: 2, 
  overflowY: "auto", 
  bgcolor: "#f8f9fa", 
  display: "flex", 
  flexDirection: "column" 
}}>
  {(() => {
    // Group messages by date
    const groupedMessages = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    chatMessages.forEach(msg => {
      const msgDate = new Date(msg.created_at);
      msgDate.setHours(0, 0, 0, 0);
      
      let dateKey = msgDate.toISOString();
      groupedMessages[dateKey] = groupedMessages[dateKey] || [];
      groupedMessages[dateKey].push(msg);
    });
    
    // Render messages with date headers
    return Object.keys(groupedMessages).map(dateKey => {
      const messagesForDate = groupedMessages[dateKey];
      const msgDate = new Date(dateKey);
      
      // Determine date label
      let dateLabel;
      if (msgDate.getTime() === today.getTime()) {
        dateLabel = "Today";
      } else if (msgDate.getTime() === yesterday.getTime()) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = msgDate.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      return (
        <React.Fragment key={dateKey}>
          {/* Date header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
              mt: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                bgcolor: "rgba(0, 0, 0, 0.08)",
                px: 2,
                py: 0.5,
                borderRadius: 4,
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              {dateLabel}
            </Typography>
          </Box>
          
          {/* Messages for this date */}
          {messagesForDate.map((msg, index) => {
            const isCurrentUser = String(msg.sender_id) === String(userId);
            const isDeletedForSender = msg.deleted_for_sender === 1;
            const isDeletedForReceiver = msg.deleted_for_receiver === 1;
            const isDeletedForEveryone = isDeletedForSender && isDeletedForReceiver;
            const isDeletedForMe = isCurrentUser ? isDeletedForSender : isDeletedForReceiver;
            const isBeingEdited = isEditing && editMessageId === msg.id;

            let displayText = msg.message_text;
            if (isDeletedForEveryone) {
              displayText = "Message deleted for everyone";
            } else if (isDeletedForMe) {
              displayText = isCurrentUser ? "You deleted this message" : "This message was deleted";
            }

            return (
              <Box
                key={`msg-${index}-${msg.created_at || Date.now()}`}
                sx={{
                  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                  mb: 1.5,
                  maxWidth: "75%",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: isCurrentUser ? "row" : "row-reverse",
                  }}
                >
                  {/* Show menu only if message is not deleted for me or for everyone */}
                  {isCurrentUser && !isDeletedForMe && !isDeletedForEveryone && (
                    <IconButton
                      size="small"
                      sx={{
                        ml: isCurrentUser ? 1 : 0,
                        mr: isCurrentUser ? 0 : 1,
                        p: 0.5,
                        color: "text.secondary",
                      }}
                      onClick={(e) => handleOpenMessageMenu(e, msg)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  )}

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor:
                        isDeletedForMe || isDeletedForEveryone
                          ? "#f1f1f1"
                          : isCurrentUser
                          ? "#1976d2"
                          : "#f5f5f5",
                      color:
                        isDeletedForMe || isDeletedForEveryone
                          ? "#757575"
                          : isCurrentUser
                          ? "#fff"
                          : "#000",
                      fontStyle: isDeletedForMe || isDeletedForEveryone ? "italic" : "normal",
                      border: isBeingEdited ? "2px solid #ffc107" : "none",
                    }}
                  >
                    <Typography variant="body1">{displayText}</Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                    mt: 0.5,
                    px: 1,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {msg.is_edited === 1 && !isDeletedForMe && !isDeletedForEveryone && " (edited)"}
                  </Typography>

                  {/* Show read icon only if message is not deleted for the sender */}
                  {isCurrentUser && !isDeletedForMe && !isDeletedForEveryone && (
                    <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                      {msg.read_status === "read" ? (
                        <MarkChatReadIcon sx={{ fontSize: 14, color: "#4caf50" }} />
                      ) : (
                        <CircleIcon sx={{ fontSize: 8, color: "#9e9e9e" }} />
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </React.Fragment>
      );
    });
  })()}
  <div ref={messagesEndRef} />
</Box>

{/* Message Input Area */}
<Box sx={{ 
  p: 2, 
  borderTop: "1px solid #e0e0e0",
  bgcolor: "#fff"
}}>
  <TextField
    fullWidth
    placeholder={isEditing ? "Edit message..." : "Type a message..."}
    variant="outlined"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyPress={handleKeyPress}
    size="small"
    autoComplete="off"
    InputProps={{
      startAdornment: isEditing && (
        <InputAdornment position="start">
          <Box sx={{ 
            bgcolor: "#ffc107", 
            color: "white", 
            px: 1, 
            py: 0.5, 
            borderRadius: 1, 
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            mr: 1
          }}>
            <EditIcon fontSize="small" sx={{ mr: 0.5, fontSize: "0.875rem" }} />
            Editing
          </Box>
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          {isEditing && (
            <IconButton 
              size="small"
              onClick={handleCancelEdit}
              sx={{ mr: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <SendIcon />
          </IconButton>
        </InputAdornment>
      )
    }}
    sx={{ 
      "& .MuiOutlinedInput-root": { 
        borderRadius: "20px",
        ...(isEditing && { 
          borderColor: "#ffc107", 
          "&.Mui-focused": { 
            borderColor: "#ffc107", 
            boxShadow: "0 0 0 2px rgba(255, 193, 7, 0.2)" 
          }
        })
      } 
    }}
  />
</Box>
        </Box>
      </Dialog>

      {/* Message Options Menu - FIXED TO USE POSITION INSTEAD OF ANCHOR */}
      <Menu
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMessageMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          menuAnchorEl ? { top: menuPosition.top, left: menuPosition.left } : undefined
        }
      >
        {/* Only show Edit and Delete for everyone if message is unread */}
        {selectedMessage && selectedMessage.read_status === 'unread' && (
          <>
            <MenuItem onClick={handleEditMessage}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleDeleteForEveryone} sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete for everyone
            </MenuItem>
          </>
        )}
        <MenuItem onClick={handleDeleteForMe} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete for me
        </MenuItem>
      </Menu>
    <Snackbar 
      open={snackbar.open} 
      autoHideDuration={5000} 
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleCloseSnackbar} 
        severity={snackbar.severity} 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    </>
  );
};

export default MyNetwork;
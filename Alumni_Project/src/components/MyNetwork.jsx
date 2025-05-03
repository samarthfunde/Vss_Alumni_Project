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
  Badge
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import CircleIcon from '@mui/icons-material/Circle';

// Assets
import avatarImage from "../assets/uploads/gallery/avtar.png";
import crossIcon from '../assets/cross_icon.png';
import checkTick from '../assets/check_tick.png';
import myChatIcon from '../assets/mychat.png';
import myVideoCallIcon from '../assets/myvdocall.png';

import { baseUrl } from '../utils/globalurl';

const MyNetwork = () => {
  const [invitations, setInvitations] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
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
    } catch (error) {
      console.error("Error fetching pending invitations:", error);
    }
  };

  const fetchAcceptedConnections = async () => {
    try {
      const res = await axios.get(`${baseUrl}auth/connection`, {
        params: { user_id: userId }
      });
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
      setChatMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleOpenChat = async (user) => {
    setSelectedUser(user);
    setChatOpen(true);

    // Fetch messages
    await fetchMessages(user.user_id);
    
    // Mark all messages from this user as read
    markMessagesAsRead(user.user_id);
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
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    }
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setChatMessages([]);
    setMessage("");
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        sender_id: userId,
        receiver_id: selectedUser.user_id,
        message_text: message
      };

      try {
        await axios.post(`${baseUrl}auth/messages/send`, newMessage);
        setChatMessages(prev => [...prev, {
          sender_id: userId,
          receiver_id: selectedUser.user_id,
          message_text: message,
          created_at: new Date().toISOString(),
          read_status: 'unread'
        }]);
        setMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Video call related
  const handleOpenVideoCall = (user) => {
    setSelectedUser(user);
    setVideoCallOpen(true);
    setVideoEnabled(true);
    setAudioEnabled(true);
  };

  const handleCloseVideoCall = () => {
    setVideoCallOpen(false);
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
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
                <Avatar src={avatarImage} alt="User" sx={{ width: 50, height: 50, mr: 2 }} />
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
                    src={avatarImage}
                    alt={connection.name}
                    sx={{ width: 80, height: 80 }}
                  />
                </Box>
                <CardContent>
                  <Typography variant="h6" fontWeight="600">
                    {connection.user_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {connection.email}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
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
                    <Box
                      component="img"
                      src={myVideoCallIcon}
                      alt="Video Call"
                      sx={{ width: 38, height: 38, cursor: 'pointer' }}
                      onClick={() => handleOpenVideoCall(connection)}
                    />
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
            {chatMessages.map((msg, index) => {
              // Determine if message is from current user
              const isCurrentUser = String(msg.sender_id) === String(userId);
              
              return (
                <Box 
                  key={`msg-${index}-${msg.created_at || Date.now()}`}
                  sx={{ 
                    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                    mb: 1.5,
                    maxWidth: "75%",
                    position: "relative"
                  }}
                >
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: isCurrentUser ? "#1976d2" : "#fff",
                      color: isCurrentUser ? "#fff" : "inherit",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                    }}
                  >
                    <Typography variant="body1">
                      {msg.message_text}
                    </Typography>
                  </Paper>
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                    mt: 0.5, 
                    px: 1 
                  }}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    
                    {isCurrentUser && (
                      <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                        {msg.read_status === 'read' ? (
                          <MarkChatReadIcon sx={{ fontSize: 14, color: '#4caf50' }} />
                        ) : (
                          <CircleIcon sx={{ fontSize: 8, color: '#9e9e9e' }} />
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
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
              placeholder="Type a message..."
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
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
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
            />
          </Box>
        </Box>
      </Dialog>

      {/* Video Call Dialog */}
      <Dialog 
        open={videoCallOpen} 
        onClose={handleCloseVideoCall}
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: "#121212",
            animation: "fadeIn 0.3s ease-out",
            "@keyframes fadeIn": {
              "0%": {
                opacity: 0,
              },
              "100%": {
                opacity: 1,
              }
            }
          }
        }}
      >
        <Box sx={{ 
          height: "100%", 
          width: "100%", 
          display: "flex", 
          flexDirection: "column", 
          position: "relative" 
        }}>
          {/* Video Display Area */}
          <Box sx={{ 
            flexGrow: 1, 
            display: "flex", 
            flexDirection: { xs: "column", md: "row" },
            p: 2,
            gap: 2
          }}>
            {/* Main Video (Other User) */}
            <Box sx={{ 
              flex: 2,
              bgcolor: "#282828",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden"
            }}>
              {videoEnabled ? (
                <Box sx={{ 
                  width: "100%", 
                  height: "100%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}>
                  <Avatar 
                    src={avatarImage} 
                    alt={selectedUser?.user_name || "User"} 
                    sx={{ 
                      width: { xs: 120, md: 160 }, 
                      height: { xs: 120, md: 160 }
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    color="white" 
                    sx={{ 
                      position: "absolute", 
                      bottom: 20, 
                      left: 20 
                    }}
                  >
                    {selectedUser?.user_name || "User"}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  width: "100%", 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}>
                  <VideocamOffIcon sx={{ fontSize: 64, color: "#757575", mb: 2 }} />
                  <Typography variant="h6" color="#757575">
                    Video is turned off
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Self Video (Picture-in-Picture) */}
            <Box sx={{ 
              position: { xs: "relative", md: "absolute" },
              width: { xs: "100%", md: "250px" },
              height: { xs: "200px", md: "180px" },
              bottom: { md: 130 },
              right: { md: 20 },
              bgcolor: "#282828",
              borderRadius: 2,
              zIndex: 100,
              overflow: "hidden",
              border: "2px solid #424242"
            }}>
              {videoEnabled ? (
                <Box sx={{ 
                  height: "100%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}>
                  <Avatar sx={{ width: 80, height: 80 }} />
                  <Typography variant="body2" color="white" sx={{ position: "absolute", bottom: 10, left: 10 }}>
                    You
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}>
                  <VideocamOffIcon sx={{ color: "#757575", mb: 1 }} />
                  <Typography variant="body2" color="#757575">
                    Your camera is off
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Controls */}
          <Box sx={{ 
            p: 3, 
            display: "flex", 
            justifyContent: "center", 
            gap: 4
          }}>
            <IconButton 
              onClick={toggleAudio} 
              sx={{ 
                bgcolor: audioEnabled ? "rgba(255,255,255,0.1)" : "rgba(255,0,0,0.2)", 
                color: "white",
                p: 2,
                "&:hover": { bgcolor: audioEnabled ? "rgba(255,255,255,0.2)" : "rgba(255,0,0,0.3)" }
              }}
            >
              {audioEnabled ? <MicIcon fontSize="large" /> : <MicOffIcon fontSize="large" />}
            </IconButton>
            <IconButton 
              onClick={toggleVideo} 
              sx={{ 
                bgcolor: videoEnabled ? "rgba(255,255,255,0.1)" : "rgba(255,0,0,0.2)", 
                color: "white",
                p: 2,
                "&:hover": { bgcolor: videoEnabled ? "rgba(255,255,255,0.2)" : "rgba(255,0,0,0.3)" }
              }}
            >
              {videoEnabled ? <VideocamIcon fontSize="large" /> : <VideocamOffIcon fontSize="large" />}
            </IconButton>
            
            <IconButton 
              onClick={handleCloseVideoCall} 
              sx={{ 
                bgcolor: "rgba(255,0,0,0.7)", 
                color: "white",
                p: 2,
                "&:hover": { bgcolor: "rgba(255,0,0,0.9)" }
              }}
            >
              <CallEndIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
export default MyNetwork;
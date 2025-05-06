import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import defaultavatar from "../assets/uploads/defaultavatar.jpg";
import checkTick from "../assets/check_tick.png";
import crossIcon from "../assets/cross_icon.png";
import { baseUrl } from '../utils/globalurl';
import { useAuth } from '../AuthContext';

const AlumniList = () => {
    const [alumniList, setAlumniList] = useState([]);
    const [filteredAlumni, setFilteredAlumni] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedAlumni, setSelectedAlumni] = useState(null);
    const [connectionStatuses, setConnectionStatuses] = useState({});
    const { isAdmin, isAlumnus, isStudent } = useAuth();
    const currentUserId = localStorage.getItem("user_id");

    // Fetch the alumni list
    useEffect(() => {
        axios.get(`${baseUrl}auth/alumni_list`)
            .then((res) => {
                setAlumniList(res.data);
                setFilteredAlumni(res.data); // Initialize filtered list with all alumni
            })
            .catch((err) => console.log(err));
    }, []);

    // Fetch connection statuses
    useEffect(() => {
        if (!currentUserId) return;

        axios.get(`${baseUrl}auth/connection/status/${currentUserId}`)
            .then((res) => {
                const statuses = {};
                res.data.connections.forEach(conn => {
                    statuses[conn.userId] = conn.status;
                }); 
                console.log(statuses);
                setConnectionStatuses(statuses);
            })
            .catch((err) => {
                console.error("Error fetching connection statuses:", err);
            });
    }, [currentUserId]);

    // Handle the search input change
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter the alumni list based on search query
    useEffect(() => {
        if (alumniList.length > 0) {
            const filteredList = alumniList.filter(list =>
                list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                list.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                list.batch.toString().includes(searchQuery) ||
                (list.connected_to && list.connected_to.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredAlumni(filteredList);
        }
    }, [searchQuery, alumniList]);

    // Handle search button click
    const handleSearch = () => {
        // The filtering is already done in the useEffect above
        // This is just for the search button click handler
        if (searchQuery.trim() === '') {
            setFilteredAlumni(alumniList);
        }
    };

    // Open modal to view alumni details
    const openModal = (alumni) => {
        setSelectedAlumni(alumni);
        setShowModal(true);
    };

    // Close the modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedAlumni(null);
    }; 

    // Handle connection request
    const handleConnect = (receiverId) => { 
        const storedUserId = localStorage.getItem("user_id");
        const senderId = storedUserId;
        
        if (!senderId) {
            toast.error('User not logged in');
            return;
        }
           
        axios.post(`${baseUrl}auth/connection/send`, {
            sender_id: senderId,
            receiver_id: receiverId,
        })
          .then((res) => { 
            toast.success(res.data.message || 'Connection request sent successfully!');
            // Update local connection statuses
            setConnectionStatuses(prev => ({
                ...prev,
                [receiverId]: 'pending'
            }));
          })
          .catch((err) => { 
            console.log(err);
            const msg = err.response?.data?.message || "Something went wrong";
            toast.error(msg);
          });
    };

    // Render connection button based on status
    const renderConnectionButton = (alumniUserId) => {
        const status = connectionStatuses[alumniUserId];
        
        if (status === 'accepted') {
            return (
                <button className="btn btn-success" style={{ width: '110px' }} disabled>
                    Connected
                </button>
            );
        } else if (status === 'pending') {
            return (
                <button className="btn btn-warning" style={{ width: '90px' }} disabled>
                    Pending
                </button>
            );
        } else if (status === 'rejected') {
            return (
                <button className="btn btn-warning" style={{ width: '90px' }} disabled>
                    Pending
                </button>
            );
        } else {
            return (
                <button className="btn btn-primary" style={{ width: '90px' }} onClick={() => handleConnect(alumniUserId)}>
                    Connect
                </button>
            );
        }
    };

    return (
        <>
            <ToastContainer 
                position="top-center" 
                autoClose={3000} 
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            
            <header className="masthead">
                <div className="container-fluid h-100">
                    <div className="row h-100 align-items-center justify-content-center text-center">
                        <div className="col-lg-8 align-self-end mb-4 page-title">
                            <h3 className="text-white">Alumni List</h3>
                            <hr className="divider my-4" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="container-fluid px-2 px-md-3">
            {alumniList.length > 0 && (
                <div className="container-fluid mt-4 px-2">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-8 col-sm-12 mb-2">
                                    <div className="input-group mb-md-0">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="filter-field">
                                                <FaSearch />
                                            </span>
                                        </div>
                                        <input
                                            value={searchQuery}
                                            onChange={handleSearchInputChange}
                                            type="text"
                                            className="form-control"
                                            id="filter"
                                            placeholder="Filter name, course, batch"
                                            aria-label="Filter"
                                            aria-describedby="filter-field"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <button 
                                        className="btn btn-primary btn-block" 
                                        id="search"
                                        onClick={handleSearch}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>

            <div className="row px-2">
                {filteredAlumni.length > 0 ? (
                    filteredAlumni
                        .filter(a => {
                            // Admin sees everyone; Student/Alumnus sees only verified
                            if (isAdmin) return true;
                            if ((isStudent || isAlumnus) && a.status === 1) return true;
                            return false;
                        })
                        .map((a, index) => (
                            <div className="col-md-4 mb-4 px-2" key={index}>
                                <div className="card h-100 shadow-sm d-flex flex-column">
                                    <center className="pt-3">
                                        <img
                                            src={a.avatar ? `${baseUrl}${a.avatar}` : defaultavatar}
                                            className="card-img-top img-fluid alimg"
                                            alt="avatar"
                                            style={{ 
                                                maxWidth: '120px', 
                                                maxHeight: '120px',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </center>
                                  
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        {/* Name + Tick/Cross for Admin only */}
                                        <div className="d-flex align-items-center justify-content-start mb-2">
                                            <h5 className="card-title mb-0" style={{ marginRight: '10px' }}>
                                                {a.name}
                                            </h5>
                                            {isAdmin && (
                                                <>
                                                    {a.status === 1 ? (
                                                        <img
                                                            src={checkTick}
                                                            alt="Verified"
                                                            style={{ width: '38px', height: '38px' }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={crossIcon}
                                                            alt="Unverified"
                                                            style={{ width: '38px', height: '38px' }}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Alumni details */}
                                        <div>
                                            {a.course && <p className="card-text"><strong>Course:</strong> {a.course}</p>}
                                            {a.batch !== "0000" && <p className="card-text"><strong>Batch:</strong> {a.batch}</p>}
                                            {a.connected_to && <p className="card-text"><strong>Currently working in/as:</strong> {a.connected_to}</p>}
                                        </div>

                                        {/* Buttons */}
                                        {localStorage.getItem("user_name") !== a.name && (
                                            <div className="mt-auto pt-3 d-flex justify-content-center gap-3">
                                                <button className="btn btn-outline-primary" style={{ width: '90px' }} onClick={() => openModal(a)}>
                                                    Show
                                                </button>
                                                {renderConnectionButton(a.user_id)}
                                            </div>
                                        )}
                                        {localStorage.getItem("user_name") === a.name && (
                                            <div className="mt-auto pt-3 d-flex justify-content-center gap-3">
                                                <button className="btn btn-outline-primary" style={{ width: '90px' }} onClick={() => openModal(a)}>
                                                    Show
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <div className="alert alert-info" role="alert" style={{ fontSize: '18px' }}>
                            <i className="fa fa-exclamation-circle mr-2"></i> No Data Found
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && selectedAlumni && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px', width: '80%', height: '80vh', maxHeight: '90vh', minHeight: '300px' }}>
                        <div className="modal-content" style={{ height: '100%', overflowY: 'auto', borderRadius: '10px' }}>
                            <div className="modal-header" style={{ borderBottom: '1px solid #dee2e6' }}>
                                <h5 className="modal-title">{selectedAlumni.name}</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={closeModal}
                                    style={{ background: 'none', border: 'none', fontSize: '1.5rem' }}
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body" style={{ padding: '20px' }}>
                                <div>
                                    {selectedAlumni.course && <p><strong>Course:</strong> {selectedAlumni.course}</p>}
                                    {selectedAlumni.batch !== "0000" && <p><strong>Batch:</strong> {selectedAlumni.batch}</p>}
                                    {selectedAlumni.connected_to && <p><strong>Currently working in/as:</strong> {selectedAlumni.connected_to}</p>}
                                </div>
                            </div>

                            <div className="modal-footer" style={{ borderTop: '1px solid #dee2e6' }}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AlumniList;
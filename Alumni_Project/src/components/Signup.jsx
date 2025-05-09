import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../utils/globalurl';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        userType: "",
        course_id: "",
        course_name: "",
        grn_number: "",
        hostel_name: "",
        isCustomHostel: false
    });

    const [courses, setCourses] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isHostelDropdownOpen, setIsHostelDropdownOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [isUserTypeDropdownOpen, setIsUserTypeDropdownOpen] = useState(false);
    const [hoveredUserTypeItem, setHoveredUserTypeItem] = useState(null);
    const [hoveredHostelItem, setHoveredHostelItem] = useState(null);
    const navigate = useNavigate();

    const hostelOptions = [
        'Haribhau Phatak',
        'Lajpatray Hostel',
        'PD Karkhanis',
        'Apte Hostel',
        'Sumitra Sadan',
        'Wing A Hostel',
        'Wing B Hostel',
        'Other'
    ];

    const userTypeOptions = ['alumnus', 'admin', 'student'];

    const handleUserTypeClick = () => {
        setIsUserTypeDropdownOpen(!isUserTypeDropdownOpen);
        if (isDropdownOpen) setIsDropdownOpen(false);
        if (isHostelDropdownOpen) setIsHostelDropdownOpen(false);
    };

    const handleUserTypeSelect = (userType) => {
        setValues({
            ...values,
            userType: userType,
            ...(userType !== "alumnus" && { course_id: "", course_name: "" }),
            ...(userType !== "student" && { grn_number: "", hostel_name: "", isCustomHostel: false })
        });
        setIsUserTypeDropdownOpen(false);
    };

    const validateForm = () => {
        if (!values.name) {
            toast.error("Name is required");
            return false;
        }
        if (!values.email) {
            toast.error("Email is required");
            return false;
        }
        if (!values.password) {
            toast.error("Password is required");
            return false;
        }
        if (!values.userType) {
            toast.error("User Type is required");
            return false;
        }

        if (values.userType === "alumnus" && !values.course_id) {
            toast.error("Course is required for Alumnus");
            return false;
        }

        if (values.userType === "student") {
            if (!values.grn_number) {
                toast.error("GRN Number is required for Student");
                return false;
            }
            if (!values.hostel_name) {
                toast.error("Hostel Name is required for Student");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const submissionData = { ...values };
        delete submissionData.isCustomHostel;

        axios.post(`${baseUrl}auth/signup`, submissionData)
            .then((res) => {
                if (res.data.email) {
                    return toast.warning("Email Already Exists");
                }

                if (res.data.signupStatus) {
                    toast.success(res.data.message);
                    setTimeout(() => {
                        navigate("/login", { state: { action: "navtologin" } });
                    }, 2000);
                } else {
                    toast.error("An error occurred");
                }
            })
            .catch(err => {
                console.error("Signup error:", err);
                const errorMsg = err?.response?.data?.sqlMessage ||
                    err?.response?.data?.message ||
                    "An unexpected error occurred";
                toast.error(errorMsg);
            });
    };

    useEffect(() => {
        axios.get(`${baseUrl}auth/courses`)
            .then((res) => {
                setCourses(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleCourseClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (isHostelDropdownOpen) setIsHostelDropdownOpen(false);
        if (isUserTypeDropdownOpen) setIsUserTypeDropdownOpen(false);
    };

    const handleHostelClick = () => {
        setIsHostelDropdownOpen(!isHostelDropdownOpen);
        if (isDropdownOpen) setIsDropdownOpen(false);
        if (isUserTypeDropdownOpen) setIsUserTypeDropdownOpen(false);
    };

    const handleCourseSelect = (course) => {
        setValues({
            ...values,
            course_id: course.id,
            course_name: course.course,
        });
        setIsDropdownOpen(false);
    };

    const handleHostelSelect = (hostel) => {
        if (hostel === "Other") {
            setValues({ ...values, hostel_name: "", isCustomHostel: true });
        } else {
            setValues({ ...values, hostel_name: hostel, isCustomHostel: false });
        }
        setIsHostelDropdownOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            const courseDropdown = document.getElementById('course-dropdown-container');
            const hostelDropdown = document.getElementById('hostel-dropdown-container');
            const userTypeDropdown = document.getElementById('userType-dropdown-container');

            if (isDropdownOpen && courseDropdown && !courseDropdown.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (isHostelDropdownOpen && hostelDropdown && !hostelDropdown.contains(event.target)) {
                setIsHostelDropdownOpen(false);
            }
            if (isUserTypeDropdownOpen && userTypeDropdown && !userTypeDropdown.contains(event.target)) {
                setIsUserTypeDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen, isHostelDropdownOpen, isUserTypeDropdownOpen]);

    const dropdownStyle = {
        border: '1px solid #ccc',
        maxHeight: '200px',
        overflowY: 'auto',
        position: 'absolute',
        background: '#fff',
        width: 'calc(100% - 30px)',
        zIndex: 1000,
        borderRadius: '4px',
    };

    const dropdownItemStyle = (id) => ({
        padding: '8px',
        cursor: 'pointer',
        backgroundColor: hoveredItem === id ? '#f1f1f1' : 'transparent',
        marginBottom: '5px',
    });

    const userTypeDropdownItemStyle = (userType) => ({
        padding: '8px',
        cursor: 'pointer',
        backgroundColor: hoveredUserTypeItem === userType ? '#f1f1f1' : 'transparent',
        marginBottom: '5px',
        textTransform: 'capitalize'
    });

    const hostelDropdownItemStyle = (hostel) => ({
        padding: '8px',
        cursor: 'pointer',
        backgroundColor: hoveredHostelItem === hostel ? '#f1f1f1' : 'transparent',
        marginBottom: '5px',
    });

    return (
        <>
            <ToastContainer position="top-center" hideProgressBar />
            <header className="masthead">
                <div className="container-fluid h-100">
                    <div className="row h-100 align-items-center justify-content-center text-center">
                        <div className="col-lg-8 align-self-end mb-4 page-title">
                            <h3 className="text-white">Create Account</h3>
                            <hr className="divider my-4" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mt-3 pt-2">
                <div className="col-lg-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row justify-content-center">
                                <div className="container col-lg-6 col-md-8 col-sm-10">
                                    <form onSubmit={handleSubmit} id="create_account">
                                        {/* Basic Fields */}
                                        <div className="form-group">
                                            <label htmlFor="name" className="control-label">Name</label>
                                            <input
                                                onChange={(e) => setValues({ ...values, name: e.target.value })}
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email" className="control-label">Email</label>
                                            <input
                                                onChange={(e) => setValues({ ...values, email: e.target.value })}
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password" className="control-label">Password</label>
                                            <input
                                                onChange={(e) => setValues({ ...values, password: e.target.value })}
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                required
                                            />
                                        </div>

                                        {/* User Type Dropdown */}
                                        <div className="form-group" id="userType-dropdown-container">
                                            <label className="control-label">User Type</label>
                                            <div className="position-relative">
                                                <div
                                                    className="form-control d-flex justify-content-between align-items-center"
                                                    onClick={handleUserTypeClick}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <span style={{ textTransform: 'capitalize' }}>{values.userType || 'Select User Type'}</span>
                                                    <i className="fa fa-chevron-down" style={{ fontSize: '12px' }}></i>
                                                </div>
                                                {isUserTypeDropdownOpen && (
                                                    <div className="dropdown-list" style={dropdownStyle}>
                                                        {userTypeOptions.map((userType) => (
                                                            <div
                                                                key={userType}
                                                                onClick={() => handleUserTypeSelect(userType)}
                                                                style={userTypeDropdownItemStyle(userType)}
                                                                onMouseEnter={() => setHoveredUserTypeItem(userType)}
                                                                onMouseLeave={() => setHoveredUserTypeItem(null)}
                                                            >
                                                                {userType}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Alumnus Fields */}
                                        {values.userType === "alumnus" && (
                                            <div className="form-group" id="course-dropdown-container">
                                                <label className="control-label">Course</label>
                                                <div className="position-relative">
                                                    <div
                                                        className="form-control d-flex justify-content-between align-items-center"
                                                        onClick={handleCourseClick}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <span>{values.course_name || 'Select Course'}</span>
                                                        <i className="fa fa-chevron-down" style={{ fontSize: '12px' }}></i>
                                                    </div>
                                                    {isDropdownOpen && (
                                                        <div className="dropdown-list" style={dropdownStyle}>
                                                            {courses.map((course) => (
                                                                <div
                                                                    key={course.id}
                                                                    onClick={() => handleCourseSelect(course)}
                                                                    style={dropdownItemStyle(course.id)}
                                                                    onMouseEnter={() => setHoveredItem(course.id)}
                                                                    onMouseLeave={() => setHoveredItem(null)}
                                                                >
                                                                    {course.course}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Student Fields */}
                                        {values.userType === "student" && (
                                            <>
                                                <div className="form-group">
                                                    <label className="control-label">GRN Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={values.grn_number}
                                                        onChange={(e) => setValues({ ...values, grn_number: e.target.value })}
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group" id="hostel-dropdown-container">
                                                    <label className="control-label">Hostel Name</label>
                                                    {values.isCustomHostel ? (
                                                        <div className="input-group">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={values.hostel_name}
                                                                onChange={(e) => setValues({ ...values, hostel_name: e.target.value })}
                                                                placeholder="Enter your hostel name"
                                                            />
                                                            <div className="input-group-append">
                                                                <button
                                                                    className="btn btn-outline-secondary"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setValues({ ...values, isCustomHostel: false, hostel_name: "" });
                                                                        setIsHostelDropdownOpen(true);
                                                                    }}
                                                                >
                                                                    <span>×</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="position-relative">
                                                            <div
                                                                className="form-control d-flex justify-content-between align-items-center"
                                                                onClick={handleHostelClick}
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <span>{values.hostel_name || 'Select Hostel'}</span>
                                                                <i className="fa fa-chevron-down" style={{ fontSize: '12px' }}></i>
                                                            </div>
                                                            {isHostelDropdownOpen && (
                                                                <div className="dropdown-list" style={dropdownStyle}>
                                                                    {hostelOptions.map((hostel) => (
                                                                        <div
                                                                            key={hostel}
                                                                            onClick={() => handleHostelSelect(hostel)}
                                                                            style={hostelDropdownItemStyle(hostel)}
                                                                            onMouseEnter={() => setHoveredHostelItem(hostel)}
                                                                            onMouseLeave={() => setHoveredHostelItem(null)}
                                                                        >
                                                                            {hostel}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        <hr className="divider" />
                                        <div className="row justify-content-center">
                                            <div className="col-md-6 text-center">
                                                <button type="submit" className="btn btn-info btn-block">Create Account</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;

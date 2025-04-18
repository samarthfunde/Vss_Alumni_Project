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
    });

    const [courses, setCourses] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);  // To manage hover effect
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${baseUrl}auth/signup`, values)
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
        setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
    };

    const handleCourseSelect = (course) => {
        setValues({
            ...values,
            course_id: course.id,
            course_name: course.course, // Store the selected course name
        });
        setIsDropdownOpen(false); // Close the dropdown after selection
    };

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
                                        <div className="form-group">
                                            <label htmlFor="name" className="control-label">Name</label>
                                            <input
                                                onChange={(e) => setValues({ ...values, name: e.target.value })}
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                name="name"
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
                                                name="email"
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
                                                name="password"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="userType" className="control-label">User Type</label>
                                            <br />
                                            <select
                                                onChange={(e) => setValues({ ...values, userType: e.target.value })}
                                                className="custom-select"
                                                id="userType"
                                                name="userType"
                                                required
                                                value={values.userType}
                                                style={{ width: '50%' }}
                                            >
                                                <option value="" disabled>Please select</option>
                                                <option value="alumnus">Alumnus</option>
                                                <option value="admin">Admin</option>
                                                <option value="student">Student</option>
                                            </select>
                                        </div>

                                        {values.userType === "alumnus" && (
                                            <div className="form-group">
                                                <label htmlFor="course_id" className="control-label">Course</label>
                                                <div className="form-control" onClick={handleCourseClick} style={{ cursor: 'pointer' }}>
                                                    {values.course_name || 'Select Course'}
                                                </div>
                                                {isDropdownOpen && (
                                                    <div className="dropdown-list" style={{
                                                        border: '1px solid #ccc',
                                                        maxHeight: '200px',
                                                        overflowY: 'auto',
                                                        position: 'absolute',
                                                        background: '#fff',
                                                        width: 'calc(100% - 30px)', // Decrease width by 20px
                                                        zIndex: 1000,
                                                        borderRadius: '4px',
                                                    }}>
                                                        {courses.map((course) => (
                                                            <div
                                                                key={course.id}
                                                                className="dropdown-item"
                                                                onClick={() => handleCourseSelect(course)}
                                                                style={{
                                                                    padding: '8px',
                                                                    cursor: 'pointer',
                                                                    backgroundColor: hoveredItem === course.id ? '#f1f1f1' : 'transparent',
                                                                    marginBottom: '5px',
                                                                }}
                                                                onMouseEnter={() => setHoveredItem(course.id)} // Set hover state
                                                                onMouseLeave={() => setHoveredItem(null)} // Reset hover state
                                                            >
                                                                {course.course}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {values.userType === "student" && (
                                            <div className="form-group">
                                                <label htmlFor="grn_number" className="control-label">GRN Number</label>
                                                <input
                                                    onChange={(e) => setValues({ ...values, grn_number: e.target.value })}
                                                    type="text"
                                                    className="form-control"
                                                    id="grn_number"
                                                    name="grn_number"
                                                    required
                                                    value={values.grn_number}
                                                />
                                            </div>
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

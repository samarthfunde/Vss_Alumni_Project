import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import { baseUrl } from '../utils/globalurl';
import { FaStar } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const MyAccount = () => {
    const [acc, setAcc] = useState({
        name: '',
        connected_to: "",
        course_id: "",
        email: "",
        gender: "",
        password: "",
        batch: "",
    });
    const [file, setFile] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const alumnus_id = localStorage.getItem("alumnus_id");

        const fetchData = async () => {
            try {
                const alumnusDetailsRes = await axios.get(`${baseUrl}auth/alumnusdetails?id=${alumnus_id}`);
                const coursesRes = await axios.get(`${baseUrl}auth/courses`);

                setAcc(alumnusDetailsRes.data[0]);
                setCourses(coursesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Mapping courses for react-select options
    const courseOptions = courses.map(c => ({
        value: c.id,
        label: c.course
    }));

    // Handle form field changes
    const handleChange = (e) => {
        setAcc({ ...acc, [e.target.name]: e.target.value });
    };

    // Handle file selection
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Handle form submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        const alumnus_id = localStorage.getItem("alumnus_id");
        const user_id = localStorage.getItem("user_id");
        const pswrd = document.getElementById("pswrd").value;

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('name', acc.name);
            formData.append('connected_to', acc.connected_to);
            formData.append('course_id', acc.course_id);
            formData.append('email', acc.email);
            formData.append('gender', acc.gender);
            formData.append('password', pswrd);
            formData.append('batch', acc.batch);
            formData.append('alumnus_id', alumnus_id);
            formData.append('user_id', user_id);

            const response = await axios.put(`${baseUrl}auth/upaccount`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success(response.data.message);
            setFile(null);
            setAcc({
                name: '',
                connected_to: "",
                course_id: "",
                email: "",
                gender: "",
                password: "",
                batch: "",
            });
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    return (
        <>
            <ToastContainer position="top-center" />
            <header className="masthead">
                <div className="container-fluid h-100">
                    <div className="row h-100 align-items-center justify-content-center text-center">
                        <div className="col-lg-8 align-self-end mb-4 page-title">
                            <h3 className="text-white">Manage Account</h3>
                            <FaStar className='text-white ' />
                            <hr className="divider my-4" />
                        </div>
                    </div>
                </div>
            </header>
            <section className="page-section bg-dark text-white mb-0" id="about">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <form onSubmit={handleSubmit} className="form-horizontal">
                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-2 col-form-label">Name</label>
                                    <div className="col-sm-10">
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Enter your name"
                                            required
                                            value={acc.name}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-2 col-form-label">Gender</label>
                                    <div className="col-sm-4">
                                        <select onChange={handleChange} className="form-control" name="gender" required value={acc.gender}>
                                            <option disabled value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <label htmlFor="" className="col-sm-2 col-form-label">Batch</label>
                                    <div className="col-sm-4">
                                        <input onChange={handleChange} type="text" className="form-control" name="batch" id="batch" required value={acc.batch} />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-2 col-form-label">Course Graduated</label>
                                    <div className="col-sm-10">
                                    <Select
    onChange={(selectedOption) => setAcc({ ...acc, course_id: selectedOption.value })}
    options={courseOptions}
    value={courseOptions.find(option => option.value === acc.course_id)}
    placeholder="Select Course"
    isSearchable={true}
    styles={{
        control: (provided) => ({
            ...provided,
            borderColor: '#ccc',  // Optional: change border color of the select control
            boxShadow: 'none',     // Optional: remove box-shadow for clean look
        }),
        menu: (provided) => ({
            ...provided,
            maxHeight: '200px',  // Height for the dropdown
        
            zIndex: 9999, // Ensure dropdown is above other content
        }),
        option: (provided, state) => ({
            ...provided,
            color: 'black',  // Set text color to black for all options
            backgroundColor: state.isSelected ? '#ddd' : state.isFocused ? '#f0f0f0' : 'white',  // Highlight on hover or select
            cursor: 'pointer',  // Pointer cursor to indicate clickable items
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'black',  // Set color of the selected value to black
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'black',  // Ensure placeholder text is black
        }),
    }}
/>

                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-2 col-form-label">Currently Connected To</label>
                                    <div className="col-sm-10">
                                        <textarea onChange={handleChange} name="connected_to" className="form-control" rows="3" placeholder="Enter your current connection" value={acc.connected_to}></textarea>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="avatar" className="col-sm-2 col-form-label">Image</label>
                                    <div className="col-sm-10">
                                        <input onChange={handleFileChange} type="file" className="form-control-file" name="avatar" />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-2 col-form-label">Email</label>
                                    <div className="col-sm-10">
                                        <input onChange={handleChange} type="email" className="form-control" name="email" placeholder="Enter your email" required value={acc.email} />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="" className="col-sm-2 col-form-label">Password</label>
                                    <div className="col-sm-10">
                                        <input onChange={handleChange} id='pswrd' type="password" className="form-control" name="password" placeholder="Enter your password" />
                                        <small className="form-text text-info fst-italic ">Leave this blank if you don't want to change your password</small>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-12 text-center">
                                        <button type='submit' className="btn btn-secondary" >Update Account</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MyAccount;

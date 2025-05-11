import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import { baseUrl } from '../utils/globalurl';
import { FaStar } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';



const StudentAccount = () => {  


     const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#ccc',
      boxShadow: 'none',
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: '200px',
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      color: 'black',
      backgroundColor: state.isSelected ? '#ddd' : state.isFocused ? '#f0f0f0' : 'white',
      cursor: 'pointer',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'black',
    }),
  };

    
const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
];
  const [acc, setAcc] = useState({
    name: '',
    connected_to: "",
    course_id: "",
    email: "",
    gender: "",
    password: "",
    batch: "",
    dob: "",
    contact_number: "",
    hostel_name: "",
    year_of_joining_vss: "",
    education_details: "",
  });
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    const fetchData = async () => {
      try {
        const studentDetailsRes = await axios.get(`${baseUrl}auth/studentdetails?id=${user_id}`);
        const coursesRes = await axios.get(`${baseUrl}auth/courses`);

        const userData = studentDetailsRes.data[0];

        if (userData.dob) {
          const dateObj = new Date(userData.dob);
          const formattedDob = dateObj.toISOString().split('T')[0];
          userData.dob = formattedDob;
        }

        setAcc(userData);
        setCourses(coursesRes.data); 
        console.log(coursesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAcc({ ...acc, [name]: value });
  };

 const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

const handleSubmit = async (event) => {
    event.preventDefault();
    const alumnus_id = localStorage.getItem("alumnus_id");
    const user_id = localStorage.getItem("user_id");
    const pswrd = document.getElementById("pswrd").value; 




    try {
      const formData = new FormData();
      
      // Append original fields
      if (file) formData.append('image', file);
      formData.append('name', acc.name);
     
      formData.append('course_id', acc.course_id || "");
      formData.append('email', acc.email);
      formData.append('gender', acc.gender);
      formData.append('password', pswrd || "");
      formData.append('batch', acc.batch);

      formData.append('user_id', user_id);
      
      // Append new fields
      formData.append('dob', acc.dob || "");
      formData.append('contact_number', acc.contact_number || "");
  
     
      formData.append('hostel_name', acc.hostel_name || "");
      formData.append('year_of_joining_vss', acc.year_of_joining_vss || "");
      formData.append('education_details', acc.education_details || "");
    

      const response = await axios.put(`${baseUrl}auth/upaccountstudent`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(response.data.message);
      setFile(null);
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('An error occurred while updating your account');
    }
  };

  const courseOptions = courses.map(c => ({
    value: c.id,
    label: c.course
  }));

  return (
    <>
      <ToastContainer position="top-center" />
      <header className="masthead">
        <div className="container-fluid h-100">
          <div className="row h-100 align-items-center justify-content-center text-center">
            <div className="col-lg-8 align-self-end mb-4 page-title">
              <h3 className="text-white">Manage Account</h3>
              <FaStar className='text-white' />
              <hr className="divider my-4" />
            </div>
          </div>
        </div>
      </header>

      <section className="page-section bg-dark text-white mb-0" id="about">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <form onSubmit={handleSubmit} className="form-horizontal">
                <h4 className="section-title mb-4 border-bottom pb-2">Personal Information</h4>

                {/* Name */}
                <div className="form-group row mb-3">
                  <label className="col-sm-3 col-md-2 col-form-label">Name</label>
                  <div className="col-sm-9 col-md-10">
                    <input
                      onChange={handleChange}
                      name="name"
                      type="text"
                      className="form-control"
                      value={acc.name || ""}
                      required
                    />
                  </div>
                </div>

                {/* Gender and Batch */}
                <div className="form-group row mb-3">
                  <label className="col-sm-3 col-md-2 col-form-label">Gender</label>
                  <div className="col-sm-9 col-md-4">
                    <Select
                      name="gender"
                      options={genderOptions}
                      value={genderOptions.find(opt => opt.value === acc.gender)}
                      onChange={(opt) => setAcc({ ...acc, gender: opt.value })}
                      styles={customSelectStyles}
                      isSearchable={false}
                      placeholder="Select gender"
                    />
                  </div>

                  <label className="col-sm-3 col-md-2 col-form-label">Batch</label>
                  <div className="col-sm-9 col-md-4">
                    <input
                      onChange={handleChange}
                      name="batch"
                      type="text"
                      className="form-control"
                      value={acc.batch || ""}
                      required
                    />
                  </div>
                </div>

                {/* DOB and Contact */}
                
                <div className="form-group row mb-3">
                  <label htmlFor="dob" className="col-sm-3 col-md-2 col-form-label">Date of Birth</label>
                  <div className="col-sm-9 col-md-4">
                    <input 
                      onChange={handleChange} 
                      type="text" 
                      className="form-control" 
                      name="dob" 
                      id="dob" 
                      placeholder='YYYY/MM/DD'
                      value={acc.dob || ""} 
                    />
                  </div>


                  <label className="col-sm-3 col-md-2 col-form-label">Contact Number</label>
                  <div className="col-sm-9 col-md-4">
                    <input
                      onChange={handleChange}
                      name="contact_number"
                      type="tel"
                      className="form-control"
                      value={acc.contact_number || ""}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-group row mb-3">
                  <label className="col-sm-3 col-md-2 col-form-label">Email</label>
                  <div className="col-sm-9 col-md-10">
                    <input
                      onChange={handleChange}
                      name="email"
                      type="email"
                      className="form-control"
                      value={acc.email || ""}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
               
            <div className="form-group row mb-3">
                  <label htmlFor="password" className="col-sm-3 col-md-2 col-form-label">Password</label>
                  <div className="col-sm-9 col-md-10">
                   <input 
                      onChange={handleChange} 
                      id='pswrd' 
                      type="password" 
                      className="form-control" 
                      name="password" 
                      placeholder="Enter your password" 
                    /> 
                          
                    <small className="form-text text-info fst-italic">Leave this blank if you don't want to change your password</small>
                  </div>
                </div>

                {/* Image */}
                <div className="form-group row mb-3">
                  <label className="col-sm-3 col-md-2 col-form-label">Image</label>
                  <div className="col-sm-9 col-md-10">
                    <input
                      onChange={handleFileChange}
                      type="file"
                      className="form-control-file"
                    />
                  </div>
                </div>

                <h4 className="section-title mb-4 mt-5 border-bottom pb-2">Education Information</h4>

                {/* Course */}
                <div className="form-group row mb-3">
                  <label className="col-sm-3 col-md-2 col-form-label">Course</label>
                  <div className="col-sm-9 col-md-10">
                    <Select
                      options={courseOptions}
                      value={courseOptions.find(opt => opt.value === acc.course_id)}
                      onChange={(opt) => setAcc({ ...acc, course_id: opt.value })}
                      styles={customSelectStyles}
                      isSearchable
                      placeholder="Select Course"
                    />
                  </div>
                </div>

                {/* Hostel */}
                <div className="form-group row mb-3">
                  <label className="col-sm-3 col-md-2 col-form-label">Hostel</label>
                  <div className="col-sm-9 col-md-10">
                    <input
                      onChange={handleChange}
                      name="hostel_name"
                      type="text"
                      className="form-control"
                      value={acc.hostel_name || ""}
                    />
                  </div>
                </div>

                {/* Year of Joining */}
                <div className="form-group row mb-3">
                  <label className="col-sm-3 col-md-2 col-form-label">Year of Joining VSS</label>
                  <div className="col-sm-9 col-md-10">
                    <input
                      onChange={handleChange}
                      name="year_of_joining_vss"
                      type="text"
                      className="form-control"
                      value={acc.year_of_joining_vss || ""}
                    />
                  </div>
                </div>

                {/* Education Details */}
                <div className="form-group row mb-3">
                  <label className="col-sm-3 col-md-2 col-form-label">Education Details</label>
                  <div className="col-sm-9 col-md-10">
                    <textarea
                      onChange={handleChange}
                      name="education_details"
                      className="form-control"
                      rows="3"
                      value={acc.education_details || ""}
                    />
                  </div>
                </div>

                <div className="form-group row mt-5">
                  <div className="col-12 text-center">
                    <button type="submit" className="btn btn-secondary btn-lg">Update Account</button>
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

export default StudentAccount;

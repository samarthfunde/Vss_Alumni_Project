import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import { baseUrl } from '../utils/globalurl';
import { FaStar } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

// Import all state data
import AndamanData from '../By States/Andaman & Nicobar Islands.json';
import AndhraPradeshData from '../By States/Andhra Pradesh.json';
import ArunachalData from '../By States/Arunachal Pradesh.json';
import AssamData from '../By States/Assam.json';
import BiharData from '../By States/Bihar.json';
import ChandigarhData from '../By States/Chandigarh.json';
import ChhattisgarhData from '../By States/Chhattisgarh.json';
import DadraNagarData from '../By States/Dadra & Nagar Haveli.json';
import DamanDiuData from '../By States/Daman & Diu.json';
import DelhiData from '../By States/Delhi.json';
import GoaData from '../By States/Goa.json';
import GujaratData from '../By States/Gujarat.json';
import HaryanaData from '../By States/Haryana.json';
import HimachalData from '../By States/Himachal Pradesh.json';
import JammuKashmirData from '../By States/Jammu & Kashmir.json';
import JharkhandData from '../By States/Jharkhand.json';
import KarnatakaData from '../By States/Karnataka.json';
import KeralaData from '../By States/Kerala.json';
import LakshadweepData from '../By States/Lakshadweep.json';
import MadhyaPradeshData from '../By States/Madhya Pradesh.json';
import MaharashtraData from '../By States/Maharashtra.json';
import ManipurData from '../By States/Manipur.json';
import MeghalayaData from '../By States/Meghalaya.json';
import MizoramData from '../By States/Mizoram.json';
import NagalandData from '../By States/Nagaland.json';
import OdishaData from '../By States/Odisha.json';
import PuducherryData from '../By States/Puducherry.json';
import PunjabData from '../By States/Punjab.json';
import RajasthanData from '../By States/Rajasthan.json';
import SikkimData from '../By States/Sikkim.json';
import TamilNaduData from '../By States/Tamil Nadu.json';
import TelanganaData from '../By States/Telangana.json';
import TripuraData from '../By States/Tripura.json';
import UttarPradeshData from '../By States/Uttar Pradesh.json';
import UttarakhandData from '../By States/Uttarakhand.json';
import WestBengalData from '../By States/West Bengal.json';

const MyAccount = () => {
  // Create a map of all state data for easy access
  const stateDataMap = {
    'Andaman & Nicobar Islands': AndamanData,
    'Andhra Pradesh': AndhraPradeshData,
    'Arunachal Pradesh': ArunachalData,
    'Assam': AssamData,
    'Bihar': BiharData,
    'Chandigarh': ChandigarhData,
    'Chhattisgarh': ChhattisgarhData,
    'Dadra & Nagar Haveli': DadraNagarData,
    'Daman & Diu': DamanDiuData,
    'Delhi': DelhiData,
    'Goa': GoaData,
    'Gujarat': GujaratData,
    'Haryana': HaryanaData,
    'Himachal Pradesh': HimachalData,
    'Jammu & Kashmir': JammuKashmirData,
    'Jharkhand': JharkhandData,
    'Karnataka': KarnatakaData,
    'Kerala': KeralaData,
    'Lakshadweep': LakshadweepData,
    'Madhya Pradesh': MadhyaPradeshData,
    'Maharashtra': MaharashtraData,
    'Manipur': ManipurData,
    'Meghalaya': MeghalayaData,
    'Mizoram': MizoramData,
    'Nagaland': NagalandData,
    'Odisha': OdishaData,
    'Puducherry': PuducherryData,
    'Punjab': PunjabData,
    'Rajasthan': RajasthanData,
    'Sikkim': SikkimData,
    'Tamil Nadu': TamilNaduData,
    'Telangana': TelanganaData,
    'Tripura': TripuraData,
    'Uttar Pradesh': UttarPradeshData,
    'Uttarakhand': UttarakhandData,
    'West Bengal': WestBengalData
  };

  const [acc, setAcc] = useState({
    name: '',
    connected_to: "",
    course_id: "",
    email: "",
    gender: "",
    password: "",
    batch: "",
    // New fields
    dob: "",
    contact_number: "",
    email_optional: "",
    current_address: "",
    current_district_taluka: "",
    village_name: "",
    taluka: "",
    other_taluka: "",
    district: "",
    region: "",
    other_district: "",
    state: "",
    hostel: "",
    year_of_joining_vss: "",
    education_details: "",
    special_achievement: "",
    social_work: "",
    associated_with_samiti: "",
    form_of_association: "",
    contribution_areas: "",
    reflection_on_samiti: "",
    additional_comments: ""
  });
  
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showOtherTaluka, setShowOtherTaluka] = useState(false);
  const [showOtherDistrict, setShowOtherDistrict] = useState(false);
  
  // State for location dropdowns
  const [districtOptions, setDistrictOptions] = useState([{ value: '', label: 'Select District' }]);
  const [talukaOptions, setTalukaOptions] = useState([{ value: '', label: 'Select Taluka' }]);
  const [villageOptions, setVillageOptions] = useState([{ value: '', label: 'Select Village' }]);
  
  // Generate state options from the state data map
  const stateOptions = [
    { value: '', label: 'Select State' },
    ...Object.keys(stateDataMap).map(state => ({ value: state, label: state }))
  ]; 
  
  

  
  const samitiOptions = [
    { value: '', label: 'Select' },
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];
  
  const genderOptions = [
    { value: '', label: 'Select' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];
  
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
  
  // Load district options when state changes
  useEffect(() => {
    if (acc.state && stateDataMap[acc.state]) {
      const stateData = stateDataMap[acc.state];
      
      // Check if the state data has districts property
      if (stateData.districts && Array.isArray(stateData.districts)) {
        const districts = stateData.districts.map(dist => ({
          value: dist.district,
          label: dist.district
        }));
        
        setDistrictOptions([
          { value: '', label: 'Select District' },
          ...districts,
          { value: 'other', label: 'Other' }
        ]);
      } else {
        // Handle states with different data structure if needed
        setDistrictOptions([
          { value: '', label: 'Select District' },
          { value: 'other', label: 'Other' }
        ]);
      }
      
      // Reset dependent fields
      setTalukaOptions([{ value: '', label: 'Select Taluka' }]);
      setVillageOptions([{ value: '', label: 'Select Village' }]);
      
      if (acc.district && acc.district !== 'other') {
        // If district is already selected, update taluka options
        updateTalukaOptions(acc.district);
      }
    } else {
      // For states without data or when no state is selected
      setDistrictOptions([
        { value: '', label: 'Select District' },
        { value: 'other', label: 'Other' }
      ]);
      setTalukaOptions([{ value: '', label: 'Select Taluka' }]);
      setVillageOptions([{ value: '', label: 'Select Village' }]);
    } 
    
  }, [acc.state]);
  
  // Function to update taluka options based on selected district
  const updateTalukaOptions = (districtValue) => {
    if (acc.state && stateDataMap[acc.state] && districtValue) {
      const stateData = stateDataMap[acc.state];
      
      // Make sure we have district data before proceeding
      if (stateData.districts && Array.isArray(stateData.districts)) {
        const district = stateData.districts.find(d => d.district === districtValue);
        
        if (district && district.subDistricts) {
          const talukas = district.subDistricts.map(subDist => ({
            value: subDist.subDistrict,
            label: subDist.subDistrict
          }));
          
          setTalukaOptions([
            { value: '', label: 'Select Taluka' },
            ...talukas,
            { value: 'other', label: 'Other' }
          ]);
          
          // Reset village selection
          setAcc(prev => ({ ...prev, village_name: '' }));
          setVillageOptions([{ value: '', label: 'Select Village' }]);
        }
      }
    }
  };
  
  // Function to update village options based on selected taluka
  const updateVillageOptions = (talukaValue) => {
    if (acc.state && stateDataMap[acc.state] && acc.district && talukaValue && talukaValue !== 'other') {
      const stateData = stateDataMap[acc.state];
      
      if (stateData.districts && Array.isArray(stateData.districts)) {
        const district = stateData.districts.find(d => d.district === acc.district);
        
        if (district && district.subDistricts) {
          const subDistrict = district.subDistricts.find(sd => sd.subDistrict === talukaValue);
          
          if (subDistrict && subDistrict.villages) {
            const villages = subDistrict.villages.map(village => ({
              value: village,
              label: village
            }));
            
            setVillageOptions([
              { value: '', label: 'Select Village' },
              ...villages
            ]);
          }
        }
      }
    }
  };

  useEffect(() => {
    const alumnus_id = localStorage.getItem("alumnus_id");

    const fetchData = async () => {
      try {
        const alumnusDetailsRes = await axios.get(`${baseUrl}auth/alumnusdetails?id=${alumnus_id}`);
        const coursesRes = await axios.get(`${baseUrl}auth/courses`);

        const userData = alumnusDetailsRes.data[0]; 
         
        if (userData.dob) {
          // Format to yyyy-mm-dd
          const dateObj = new Date(userData.dob);
          const formattedDob = dateObj.toISOString().split('T')[0];
          userData.dob = formattedDob;
          } 
        
          setAcc(userData);
        setCourses(coursesRes.data);
        
        // Check if "other" options are selected from existing data
        if (userData.taluka === "other") {
          setShowOtherTaluka(true);
        }
        if (userData.district === "other") {
          setShowOtherDistrict(true);
        }
        
        // If state and district are already set, update taluka options
        if (userData.state && stateDataMap[userData.state] && userData.district && userData.district !== 'other') {
          updateTalukaOptions(userData.district);
          
          // If taluka is also set, update village options
          if (userData.taluka && userData.taluka !== 'other') {
            updateVillageOptions(userData.taluka);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
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
    const { name, value } = e.target;
    
    if (name === "taluka") {
      setShowOtherTaluka(value === "other");
    }
    
    if (name === "district") {
      setShowOtherDistrict(value === "other");
    }
    
    setAcc({ ...acc, [name]: value });
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
      
      // Append original fields
      if (file) formData.append('image', file);
      formData.append('name', acc.name);
      formData.append('connected_to', acc.connected_to || "");
      formData.append('course_id', acc.course_id || "");
      formData.append('email', acc.email);
      formData.append('gender', acc.gender);
      formData.append('password', pswrd || "");
      formData.append('batch', acc.batch);
      formData.append('alumnus_id', alumnus_id);
      formData.append('user_id', user_id);
      
      // Append new fields
      formData.append('dob', acc.dob || "");
      formData.append('contact_number', acc.contact_number || "");
      formData.append('email_optional', acc.email_optional || "");
      formData.append('current_address', acc.current_address || "");
      formData.append('current_district_taluka', acc.current_district_taluka || "");
      formData.append('village_name', acc.village_name || "");
      formData.append('taluka', acc.taluka || "");
      formData.append('other_taluka', acc.other_taluka || "");
      formData.append('district', acc.district || "");
      formData.append('region', acc.region || "");
      formData.append('other_district', acc.other_district || "");
      formData.append('state', acc.state || "");
      formData.append('hostel', acc.hostel || "");
      formData.append('year_of_joining_vss', acc.year_of_joining_vss || "");
      formData.append('education_details', acc.education_details || "");
      formData.append('special_achievement', acc.special_achievement || "");
      formData.append('social_work', acc.social_work || "");
      formData.append('associated_with_samiti', acc.associated_with_samiti || "");
      formData.append('form_of_association', acc.form_of_association || "");
      formData.append('contribution_areas', acc.contribution_areas || "");
      formData.append('reflection_on_samiti', acc.reflection_on_samiti || "");
      formData.append('additional_comments', acc.additional_comments || "");

      const response = await axios.put(`${baseUrl}auth/upaccount`, formData, {
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
     
             

           {/* Personal Information Section */}
           <h4 className="section-title mb-4 border-bottom pb-2">Personal Information</h4>
                
                <div className="form-group row mb-3">
                  <label htmlFor="name" className="col-sm-3 col-md-2 col-form-label">Name</label>
                  <div className="col-sm-9 col-md-10">
                    <input
                      onChange={handleChange}
                      type="text"
                      className="form-control"
                      name="name"
                      id="name"
                      placeholder="Enter your name"
                      required
                      value={acc.name || ""}
                    />
                  </div>
                </div>

                <div className="form-group row mb-3">
  <label htmlFor="gender" className="col-sm-3 col-md-2 col-form-label">Gender</label>
  <div className="col-sm-9 col-md-4">
    <Select
      inputId="gender"
      name="gender"
      options={genderOptions}
      value={genderOptions.find(option => option.value === acc.gender)}
      onChange={(selectedOption) =>
        setAcc({ ...acc, gender: selectedOption.value })
      }
      placeholder="Select gender"
      styles={customSelectStyles}
      isSearchable={false}
    />
  </div>



                  
                  <label htmlFor="batch" className="col-sm-3 col-md-2 col-form-label">Batch</label>
                  <div className="col-sm-9 col-md-4">
                    <input 
                      onChange={handleChange} 
                      type="text" 
                      className="form-control" 
                      name="batch" 
                      id="batch" 
                      required 
                      value={acc.batch || ""} 
                    />
                  </div>
                </div>

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

                  
                  <label htmlFor="contact_number" className="col-sm-3 col-md-2 col-form-label">Contact Number</label>
                  <div className="col-sm-9 col-md-4">
                    <input 
                      onChange={handleChange} 
                      type="tel" 
                      className="form-control" 
                      name="contact_number" 
                      id="contact_number"
                      placeholder="Enter contact number"
                      value={acc.contact_number || ""} 
                    />
                  </div>
                </div>

                <div className="form-group row mb-3">
                  <label htmlFor="email" className="col-sm-3 col-md-2 col-form-label">Email</label>
                  <div className="col-sm-9 col-md-10">
                    <input 
                      onChange={handleChange} 
                      type="email" 
                      className="form-control" 
                      name="email" 
                      id="email"
                      placeholder="Enter your email" 
                      required 
                      value={acc.email || ""} 
                    />
                  </div>
                </div>

                <div className="form-group row mb-3">
                  <label htmlFor="email_optional" className="col-sm-3 col-md-2 col-form-label">Email Address (Again)</label>
                  <div className="col-sm-9 col-md-10">
                    <input 
                      onChange={handleChange} 
                      type="email" 
                      className="form-control" 
                      name="email_optional" 
                      id="email_optional"
                      placeholder="Enter secondary email (optional)" 
                      value={acc.email_optional || ""} 
                    />
                    <small className="form-text text-info">Optional</small>
                  </div>
                </div>

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

                <div className="form-group row mb-3">
                  <label htmlFor="avatar" className="col-sm-3 col-md-2 col-form-label">Image</label>
                  <div className="col-sm-9 col-md-10">
                    <input 
                      onChange={handleFileChange} 
                      type="file" 
                      className="form-control-file" 
                      name="avatar" 
                      id="avatar"
                    />
                  </div>
                </div>



                   {/* Address Information Section */}
                   <h4 className="section-title mb-4 mt-5 border-bottom pb-2">Address Information</h4>
                
                <div className="form-group row mb-3">
                  <label htmlFor="current_address" className="col-sm-3 col-md-2 col-form-label">Current Address</label>
                  <div className="col-sm-9 col-md-10">
                    <textarea 
                      onChange={handleChange} 
                      name="current_address" 
                      id="current_address"
                      className="form-control" 
                      rows="3" 
                      placeholder="Enter your current address"
                      value={acc.current_address || ""}
                    ></textarea>
                  </div>
                </div>

                <div className="form-group row mb-3">
                  <label htmlFor="current_district_taluka" className="col-sm-3 col-md-2 col-form-label">Current District/Taluka</label>
                  <div className="col-sm-9 col-md-10">
                    <input 
                      onChange={handleChange} 
                      type="text" 
                      className="form-control" 
                      name="current_district_taluka" 
                      id="current_district_taluka"
                      placeholder="Enter current district/taluka"
                      value={acc.current_district_taluka || ""} 
                    />
                  </div>
                </div>

                {/* State dropdown with dynamic loading */}
                <div className="form-group row mb-3">
                  <label htmlFor="state" className="col-sm-3 col-md-2 col-form-label">State</label>
                  <div className="col-sm-9 col-md-10">
                    <Select
                      inputId="state"
                      name="state"
                      onChange={(selectedOption) => {
                        setAcc({ 
                          ...acc, 
                          state: selectedOption.value,
                          district: '',
                          taluka: '',
                          village_name: '' 
                        });
                      }}
                      options={stateOptions}
                      value={stateOptions.find(option => option.value === acc.state) || stateOptions[0]}
                      placeholder="Select State"
                      isSearchable={true}
                      styles={customSelectStyles}
                    />
                  </div>
                </div>

                {/* District dropdown with dynamic loading based on state */}
                <div className="form-group row mb-3">
                  <label htmlFor="district" className="col-sm-3 col-md-2 col-form-label">District</label>
                  <div className="col-sm-9 col-md-10">
                    <Select
                      inputId="district"
                      name="district"
                      onChange={(selectedOption) => {
                        setAcc({ 
                          ...acc, 
                          district: selectedOption.value,
                          taluka: '',
                          village_name: '' 
                        });
                        setShowOtherDistrict(selectedOption.value === 'other');
                        if (selectedOption.value !== '' && selectedOption.value !== 'other') {
                          updateTalukaOptions(selectedOption.value);
                        }
                      }}
                      options={districtOptions}
                      value={districtOptions.find(option => option.value === acc.district) || districtOptions[0]}
                      placeholder="Select District"
                      isSearchable={true}
                      styles={customSelectStyles}
                      isDisabled={!acc.state}
                    />
                  </div>
                </div>

                {showOtherDistrict && (
                  <div className="form-group row mb-3">
                    <label htmlFor="other_district" className="col-sm-3 col-md-2 col-form-label">Other than the above districts</label>
                    <div className="col-sm-9 col-md-10">
                      <input 
                        onChange={handleChange} 
                        type="text" 
                        className="form-control" 
                        name="other_district" 
                        id="other_district"
                        placeholder="Specify other district"
                        value={acc.other_district || ""} 
                      />
                    </div>
                  </div>
                )}

                {/* Taluka dropdown with dynamic loading based on district */}
                <div className="form-group row mb-3">
                  <label htmlFor="taluka" className="col-sm-3 col-md-2 col-form-label">Taluka</label>
                  <div className="col-sm-9 col-md-10">
                    <Select
                      inputId="taluka"
                      name="taluka"
                      onChange={(selectedOption) => {
                        setAcc({ 
                          ...acc, 
                          taluka: selectedOption.value,
                          village_name: '' 
                        });
                        setShowOtherTaluka(selectedOption.value === 'other');
                        if (selectedOption.value !== '' && selectedOption.value !== 'other') {
                          updateVillageOptions(selectedOption.value);
                        }
                      }}
                      options={talukaOptions}
                      value={talukaOptions.find(option => option.value === acc.taluka) || talukaOptions[0]}
                      placeholder="Select Taluka"
                      isSearchable={true}
                      styles={customSelectStyles}
                      isDisabled={!acc.district || acc.district === 'other'}
                    />
                  </div>
                </div>

                {showOtherTaluka && (
                  <div className="form-group row mb-3">
                    <label htmlFor="other_taluka" className="col-sm-3 col-md-2 col-form-label">Other than the above Talukas</label>
                    <div className="col-sm-9 col-md-10">
                      <input 
                        onChange={handleChange} 
                        type="text" 
                        className="form-control" 
                        name="other_taluka" 
                        id="other_taluka"
                        placeholder="Specify other taluka"
                        value={acc.other_taluka || ""} 
                      />
                    </div>
                  </div>
                )}

                {/* Village dropdown with dynamic loading based on taluka */}
                <div className="form-group row mb-3">
                  <label htmlFor="village_name" className="col-sm-3 col-md-2 col-form-label">Village Name</label>
                  <div className="col-sm-9 col-md-10">
                    <Select
                      inputId="village_name"
                      name="village_name"
                      onChange={(selectedOption) => {
                        setAcc({ ...acc, village_name: selectedOption.value });
                      }}
                      options={villageOptions}
                      value={villageOptions.find(option => option.value === acc.village_name) || villageOptions[0]}
                      placeholder="Select Village"
                      isSearchable={true}
                      styles={customSelectStyles}
                      isDisabled={!acc.taluka || acc.taluka === 'other'}
                    />
                  </div>
                </div>

                <div className="form-group row mb-3">
  <label htmlFor="region" className="col-sm-3 col-md-2 col-form-label">Region</label>
  <div className="col-sm-9 col-md-10">
    <input
      type="text"
      id="region"
      name="region"
      value={acc.region}
      onChange={(e) => setAcc({ ...acc, region: e.target.value })}
      className="form-control"
      placeholder="Enter Region"
    />
  </div>
</div>



                {/* Education Section */}
                <h4 className="section-title mb-4 mt-5 border-bottom pb-2">Education Information</h4>
                
                <div className="form-group row mb-3">
                  <label htmlFor="course_id" className="col-sm-3 col-md-2 col-form-label">Course Graduated</label>
                  <div className="col-sm-9 col-md-10">
                    <Select
                      inputId="course_id"
                      onChange={(selectedOption) => setAcc({ ...acc, course_id: selectedOption.value })}
                      options={courseOptions}
                      value={courseOptions.find(option => option.value === acc.course_id)}
                      placeholder="Select Course"
                      isSearchable={true}
                      styles={{
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
                      }}
                    />
                  </div>
                </div>

                <div className="form-group row mb-3">
                  <label htmlFor="hostel" className="col-sm-3 col-md-2 col-form-label">Hostel</label>
                  <div className="col-sm-9 col-md-10">
                    <input 
                      onChange={handleChange} 
                      type="text" 
                      className="form-control" 
                      name="hostel" 
                      id="hostel"
                      placeholder="Enter hostel information"
                      value={acc.hostel || ""} 
                    />
                  </div>
                </div>

                <div className="form-group row mb-3">
                  <label htmlFor="year_of_joining_vss" className="col-sm-3 col-md-2 col-form-label">Year of Joining VSS</label>
                  <div className="col-sm-9 col-md-10">
                    <input 
                      onChange={handleChange} 
                      type="text" 
                      className="form-control" 
                      name="year_of_joining_vss" 
                      id="year_of_joining_vss"
                      placeholder="Enter year of joining VSS"
                      value={acc.year_of_joining_vss || ""} 
                    />
                  </div>
                </div>

                <div className="form-group row mb-3">
                  <label htmlFor="education_details" className="col-sm-3 col-md-2 col-form-label">Education Details</label>
                  <div className="col-sm-9 col-md-10">
                    <textarea 
                      onChange={handleChange} 
                      name="education_details" 
                      id="education_details"
                      className="form-control" 
                      rows="3" 
                      placeholder="Provide details about your education"
                      value={acc.education_details || ""}
                    ></textarea>
                  </div>
                </div>

                {/* Professional & Achievements Section */}
                <h4 className="section-title mb-4 mt-5 border-bottom pb-2">Professional & Achievements</h4>
                
                <div className="form-group row mb-3">
                  <label htmlFor="connected_to" className="col-sm-3 col-md-2 col-form-label">Currently Connected To</label>
                  <div className="col-sm-9 col-md-10">
                    <textarea 
                      onChange={handleChange} 
                      name="connected_to" 
                      id="connected_to"
                      className="form-control" 
                      rows="3" 
                      placeholder="Enter your current connection"
                      value={acc.connected_to || ""}
                    ></textarea>
                  </div>
                </div>

                <div className="form-group row mb-3">
                  <label htmlFor="special_achievement" className="col-sm-3 col-md-2 col-form-label">Special Achievement</label>
                  <div className="col-sm-9 col-md-10">
                    <textarea 
                      onChange={handleChange} 
                      name="special_achievement" 
                      id="special_achievement"
                      className="form-control" 
                      rows="3" 
                      placeholder="Enter your special achievements"
                      value={acc.special_achievement || ""}
                    ></textarea>
                  </div>
                </div>

                <div className="form-group row mb-3">
                  <label htmlFor="social_work" className="col-sm-3 col-md-2 col-form-label">Any social work</label>
                  <div className="col-sm-9 col-md-10">
                    <textarea 
                      onChange={handleChange} 
                      name="social_work" 
                      id="social_work"
                      className="form-control" 
                      rows="3" 
                      placeholder="Describe any social work you are involved in"
                      value={acc.social_work || ""}
                    ></textarea>
                  </div>
                </div>

                {/* Samiti Association Section */}
                <h4 className="section-title mb-4 mt-5 border-bottom pb-2">Samiti Association</h4>
                
                <div className="form-group row mb-3">
  <label htmlFor="associated_with_samiti" className="col-sm-3 col-md-2 col-form-label">
    Are you currently associated with the Samiti?
  </label>
  <div className="col-sm-9 col-md-10">
    <Select
      inputId="associated_with_samiti"
      name="associated_with_samiti"
      onChange={(selectedOption) =>
        setAcc({ ...acc, associated_with_samiti: selectedOption.value })
      }
      options={samitiOptions}
      value={
        samitiOptions.find(option => option.value === acc.associated_with_samiti) || samitiOptions[0]
      }
      placeholder="Select"
      isSearchable={false}
      styles={customSelectStyles}
    />
  </div>
</div>

                {acc.associated_with_samiti === 'yes' && (
                  <div className="form-group row mb-3">
                    <label htmlFor="form_of_association" className="col-sm-3 col-md-2 col-form-label">In what form</label>
                    <div className="col-sm-9 col-md-10">
                      <textarea 
                        onChange={handleChange} 
                        name="form_of_association" 
                        id="form_of_association"
                        className="form-control" 
                        rows="3" 
                        placeholder="Describe in what form you are associated"
                        value={acc.form_of_association || ""}
                      ></textarea>
                    </div>
                  </div>
                )}

                <div className="form-group row mb-3">
                  <label htmlFor="contribution_areas" className="col-sm-3 col-md-2 col-form-label">Areas where you can contribute</label>
                  <div className="col-sm-9 col-md-10">
                    <textarea 
                      onChange={handleChange} 
                      name="contribution_areas" 
                      id="contribution_areas"
                      className="form-control" 
                      rows="3" 
                      placeholder="Describe areas where you can contribute"
                      value={acc.contribution_areas || ""}
                    ></textarea>
                  </div>
                </div>

                <div className="form-group row mb-3">
                  <label htmlFor="reflection_on_samiti" className="col-sm-3 col-md-2 col-form-label">How you look back to samiti?</label>
                  <div className="col-sm-9 col-md-10">
                    <textarea 
                      onChange={handleChange} 
                      name="reflection_on_samiti" 
                      id="reflection_on_samiti"
                      className="form-control" 
                      rows="3" 
                      placeholder="Share your thoughts about the samiti"
                      value={acc.reflection_on_samiti || ""}
                    ></textarea>
                  </div>
                </div>

                <div className="form-group row mb-3">
                  <label htmlFor="additional_comments" className="col-sm-3 col-md-2 col-form-label">Any additional comments</label>
                  <div className="col-sm-9 col-md-10">
                    <textarea 
                      onChange={handleChange} 
                      name="additional_comments" 
                      id="additional_comments"
                      className="form-control" 
                      rows="3" 
                      placeholder="Any additional comments you would like to share"
                      value={acc.additional_comments || ""}
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-group row mt-5">
                  <div className="col-12 text-center">
                    <button type='submit' className="btn btn-secondary btn-lg">Update Account</button>
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
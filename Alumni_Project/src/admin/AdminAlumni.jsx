


import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import defaultavatar from "../assets/uploads/defaultavatar.jpg"
import { baseUrl } from '../utils/globalurl'

const AdminAlumni = () => {
  const [alumni, setAlumni] = useState([])
  const [filteredAlumni, setFilteredAlumni] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${baseUrl}auth/alumni`)
      .then(res => {
        setAlumni(res.data)
        setFilteredAlumni(res.data)
      })
      .catch(err => console.log(err))
  }, [])

  const delAlumni = (id) => {
    axios.delete(`${baseUrl}auth/alumni/${id}`)
      .then(res => {
        toast.success(res.data.message)
        const updated = alumni.filter(e => e.id !== id)
        setAlumni(updated)
        setFilteredAlumni(updated)
      })
      .catch(err => console.log(err))
  }

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)
    filterData(value, statusFilter)
  }

  const handleStatusChange = (e) => {
    const status = e.target.value
    setStatusFilter(status)
    filterData(searchTerm, status)
  }

  const filterData = (search, status) => {
    let data = [...alumni]

    if (search) {
      data = data.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.course.toLowerCase().includes(search)
      )
    }

    if (status === 'verified') {
      data = data.filter(item => item.status === 1)
    } else if (status === 'not_verified') {
      data = data.filter(item => item.status === 0)
    }

    setFilteredAlumni(data)
  }

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="container-fluid">
        <div className="col-lg-12">
          <div className="row mb-4 mt-4">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or course..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="col-md-6 mb-2">
              <select className="form-control" value={statusFilter} onChange={handleStatusChange}>
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="not_verified">Not Verified</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-8">
              <div className="card">
                <div className="card-header">
                  <b>List of Alumni ({filteredAlumni.length})</b>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-responsive-sm table-condensed table-bordered table-hover">
                      <thead>
                        <tr>
                          <th className="text-center">#</th>
                          <th>Avatar</th>
                          <th>Name</th>
                          <th>Course Graduated</th>
                          <th>Status</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAlumni.length > 0 ? (
                          filteredAlumni.map((a, index) => (
                            <tr key={a.id}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                <div className="avatar">
                                  {a.avatar ? (
                                    <img src={`${baseUrl}${a.avatar}`} className="gimg" alt="avatar" />
                                  ) : (
                                    <img src={defaultavatar} className="gimg" alt="avatar" />
                                  )}
                                </div>
                              </td>
                              <td><b>{a.name}</b></td>
                              <td><b>{a.course}</b></td>
                              <td className="text-center">
                                {a.status === 1 ? (
                                  <span className="badge badge-primary">Verified</span>
                                ) : (
                                  <span className="badge badge-secondary">Not Verified</span>
                                )}
                              </td>
                              <td className="text-center">
                                <div className="d-flex justify-content-center">
                                  <button
                                    onClick={() => navigate("/dashboard/alumni/view", { state: { status: "view", data: a } })}
                                    className="btn btn-sm btn-outline-primary me-1"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => delAlumni(a.id)}
                                    className="btn btn-sm btn-outline-danger"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center">No Alumni Available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminAlumni

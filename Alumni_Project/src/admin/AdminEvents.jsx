import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { baseUrl } from '../utils/globalurl';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${baseUrl}auth/events`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, []);

  const delEvent = (id) => {
    axios.delete(`${baseUrl}auth/events/${id}`)
      .then((res) => {
        toast.success(res.data.message);
        setEvents(events.filter((e) => e.id !== id));
      })
      .catch((err) => console.log(err));
  };

  const handleSendEmail = (event) => {
    axios.post(`${baseUrl}auth/events/send-email`, { eventId: event.id })
      .then((res) => { 
        console.log(res.data);
        toast.success("Emails sent successfully!");
      })
      .catch((err) => {
        toast.error("Failed to send emails.");
        console.error(err);
      });
  };

  const formatDate = (timestamp) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(timestamp).toLocaleDateString('en-US', options);
  };

  const CutContent = (content, maxLength) => {
    const strippedContent = content.replace(/<[^>]+>/g, '');
    if (strippedContent.length > maxLength) {
      return strippedContent.substring(0, maxLength) + '...';
    }
    return strippedContent;
  };

  const handleView = (event) => {
    navigate("/events/view", { state: { action: "view", data: event } });
  };

  return (
    <div className="container-fluid">
      <ToastContainer position="top-center" />
      <div className="col-lg-12">
        <div className="row mb-4 mt-4">
          <div className="col-md-12"></div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <b>List of Events</b>
                <Link
                  to={"/dashboard/events/manage"}
                  className="btn btn-primary btn-sm"
                >
                  <FaPlus /> New Entry
                </Link>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-condensed table-bordered table-hover">
                    <thead>
                      <tr>
                        <th className="text-center">#</th>
                        <th>Schedule</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Commited To Participate</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.length > 0 ? (
                        events.map((event, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{formatDate(event.schedule)}</td>
                            <td>{event.title}</td>
                            <td>{CutContent(event.content, 50)}</td>
                            <td>{event.commits_count}</td>
                            <td className="text-center border-0">
                              <div className="d-flex flex-wrap justify-content-center gap-1">
                                <button
                                  onClick={() => handleView(event)}
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  View
                                </button>
                                <Link
                                  to="/dashboard/events/manage"
                                  state={{ status: "edit", data: event }}
                                  className="btn btn-sm btn-outline-secondary"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => delEvent(event.id)}
                                  className="btn btn-sm btn-outline-danger"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => handleSendEmail(event)}
                                  className="btn btn-sm btn-outline-success"
                                >
                                  Send Email to Alumni
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center">
                            No Event Available
                          </td>
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
  );
};

export default AdminEvents;

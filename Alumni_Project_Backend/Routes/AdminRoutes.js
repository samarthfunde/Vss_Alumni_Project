import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
// import bcrypt from "bcrypt"; 
import bcrypt from 'bcryptjs';   
import { check, validationResult } from 'express-validator'; 


import sendEmail from "../utils/mailer1.js";   
import sendMailToAlumni from "../utils/maileralumni.js";

const router = express.Router();

const queryAsync = (sql, values) => {
    return new Promise((resolve, reject) => {
      con.query(sql, values, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  };
  


const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Avatar');
    },
    filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const avatarUpload = multer({ storage: avatarStorage });

const galleryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const galleryUpload = multer({ storage: galleryStorage });


// app.use(express.static('Public'));
router.get('/alumnusdetails', (req, res) => {
    const alumnusId = req.query.id; // Get the ID from query parameters

    const sql = "SELECT *,DATE_FORMAT(dob, '%Y-%m-%d') as dob FROM alumnus_bio WHERE id = ?";
    con.query(sql, [alumnusId], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }

        if (result.length > 0) {
            return res.json(result); // Send as array to match frontend logic
        } else {
            return res.status(404).json({ message: "Alumnus not found" });
        }
    });
});

router.get('/studentdetails', (req, res) => {
    const studentId = req.query.id; // Get the ID from query parameters

    const sql = "SELECT *,DATE_FORMAT(dob, '%Y-%m-%d') as dob FROM users WHERE id = ?";
    con.query(sql, [studentId], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }

        if (result.length > 0) {
            return res.json(result); // Send as array to match frontend logic
        } else {
            return res.status(404).json({ message: "Alumnus not found" });
        }
    });
});  
//check code for upaccountstudent 

router.put('/upaccountstudent', avatarUpload.single('image'), async (req, res) => {
try {
const {
name,
course_id,
email,
gender,
batch,
password,
user_id,
dob,
contact_number,
hostel_name,
year_of_joining_vss,
education_details
} = req.body;


if (!user_id) {
  return res.status(400).json({ error: 'Missing user ID' });
}

let hashedPassword = null;
if (password) {
  hashedPassword = await bcrypt.hash(password, 10);
}

const updateFields = [
  name,
  course_id,
  email,
  gender,
  batch,
  dob,
  contact_number,
  hostel_name,
  year_of_joining_vss,
  education_details,
  user_id
];

const updateSql = `
  UPDATE users SET 
    name = ?, 
    course_id = ?, 
    email = ?, 
    gender = ?, 
    batch = ?, 
    dob = ?, 
    contact_number = ?, 
    hostel_name = ?, 
    year_of_joining_vss = ?, 
    education_details = ?
  WHERE id = ?
`;

con.query(updateSql, updateFields, (err, result) => {
  if (err) {
    console.error('Error updating users table:', err);
    return res.status(500).json({ error: 'Database update error' });
  }

  // Handle avatar update
  if (req.file) {
    const avatarPath = req.file.path;
    con.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarPath, user_id], (err2) => {
      if (err2) {
        console.error('Error updating avatar:', err2);
      }
    });
  }

  // Handle password update
  if (hashedPassword) {
    con.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user_id], (err3) => {
      if (err3) {
        console.error('Error updating password:', err3);
        return res.status(500).json({ error: 'Error updating password' });
      }
      return res.json({ message: 'Account updated successfully' });
    });
  } else {
    return res.json({ message: 'Account updated successfully' });
  }
});
} catch (error) {
console.error('Server exception:', error);
res.status(500).json({ error: 'Internal server error' });
}
});
router.post("/login", (req, res) => {
    const sql = "SELECT * from users Where email=?";
    con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query Error" })
        if (result.length > 0) {
            bcrypt.compare(req.body.password, result[0].password, (bcryptErr, bcryptResult) => {
                if (bcryptErr) return res.json({ loginStatus: false, Error: "Bcrypt Error" });
                if (bcryptResult) {
                    const email = result[0].email;
                    const token = jwt.sign({ role: "admin", email: email }, "jwt_csalumni_key", { expiresIn: "1d" });
                    res.cookie('token', token);
                    return res.json({ loginStatus: true, userType: result[0].type, userId: result[0].id, userName: result[0].name, alumnus_id: result[0].alumnus_id });
                } else {
                    return res.json({ loginStatus: false, Error: "Wrong Email or Password" });
                }
            });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong Email or Password" })
        }
    })
})





router.post("/signup", async (req, res) => {
    const { name, email, password, userType, course_id, grn_number, hostel_name } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "SELECT * from users WHERE email=?";
        con.query(sql, [email], async (err, result) => {
            if (err) return res.json({ Error: "Query Error" });

            if (result.length > 0) {
                return res.json({ email: result[0].email });
            } else {
                if (userType === "alumnus") {
                    const alumnusSql = "INSERT INTO alumnus_bio(name, email, course_id) VALUES(?,?,?)";
                    con.query(alumnusSql, [name, email, course_id], async (alumnusErr, alumnusResult) => {
                        if (alumnusErr) {
                            console.error("Error executing SQL query for alumnus_bio:", alumnusErr);
                            return res.status(500).json({ error: "Alumnus Bio Query Error", signupStatus: false });
                        }

                        const alumnusId = alumnusResult.insertId;
                        const userSql = "INSERT INTO users(name, email, password, type, alumnus_id) VALUES(?,?,?,?,?)";
                        con.query(userSql, [name, email, hashedPassword, userType, alumnusId], (userErr, userResult) => {
                            if (userErr) {
                                console.error("Error executing SQL query for users:", userErr);
                                return res.status(500).json({ error: "User Query Error", signupStatus: false });
                            }
                            return res.json({ message: 'Signup Successful', userId: userResult.insertId, signupStatus: true });
                        });
                    });
                } else if (userType === "student") {
                    if (!grn_number) {
                        return res.status(400).json({ error: "GRN number is required for students", signupStatus: false });
                    }

                    const studentSql = "INSERT INTO users(name, email, password, type, grn_number, hostel_name) VALUES(?,?,?,?,?,?)";
                    con.query(studentSql, [name, email, hashedPassword, userType, grn_number, hostel_name], (err, result) => {
                        if (err) {
                            console.error("Error executing SQL query for student:", err);
                            return res.status(500).json({ error: "Student Query Error", signupStatus: false });
                        }
                        return res.json({ message: 'Student Signup Successful', userId: result.insertId, signupStatus: true });
                    });
                } else {
                    const sql = "INSERT INTO users(name, email, password, type) VALUES(?,?,?,?)";
                    con.query(sql, [name, email, hashedPassword, userType], (err, result) => {
                        if (err) {
                            console.error("Error executing SQL query for users:", err);
                            return res.status(500).json({ error: "User Query Error", signupStatus: false });
                        }
                        return res.json({ message: 'Signup Successful', userId: result.insertId, signupStatus: true });
                    });
                }
            }
        });
    } catch (error) {
        console.error("Error hashing password:", error);
        return res.status(500).json({ error: "Password Hashing Error", signupStatus: false });
    }
});


router.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout Success' });
});

router.get("/counts", (req, res) => {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM forum_topics) AS forumCount,
            (SELECT COUNT(*) FROM careers) AS jobCount,
            (SELECT COUNT(*) FROM events) AS eventCount,
            (SELECT COUNT(*) FROM events WHERE schedule >= CURDATE()) AS upeventCount,
            (SELECT COUNT(*) FROM alumnus_bio) AS alumniCount;
    `;

    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }

        // Extract counts from the result
        const counts = {
            forums: result[0].forumCount,
            jobs: result[0].jobCount,
            events: result[0].eventCount,
            upevents: result[0].upeventCount,
            alumni: result[0].alumniCount
        };

        // Send the counts to the client
        res.json(counts);
    });
});

router.get('/jobs', (req, res) => {
    // const sql = `
    //     SELECT c.*, u.name
    //     FROM careers c
    //     INNER JOIN users u ON u.id = c.user_id
    //     ORDER BY c.id DESC
    // `;
    const sql = `
    SELECT careers.*, users.name
    FROM careers
    INNER JOIN users ON careers.user_id = users.id
    ORDER BY careers.id DESC       
    `;

    con.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Query Error' });
        }
        // Send the fetched job data to the client
        res.json(result);
    });
});



router.put('/managejob', (req, res) => {
    const { id, company, job_title, location, description } = req.body;

    if (id) {
        const sql = 'UPDATE careers SET company=?, job_title=?, location=?, description=? WHERE id=?';
        con.query(sql, [company, job_title, location, description, id], (err, result) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Database Error' });
            }
            return res.json({ message: 'Job updated successfully' });
        });
    } else {
        return res.status(400).json({ error: 'Invalid Request: No ID provided for update' });
    }
});

router.delete('/jobs/:id', (req, res) => {
    const jid = req.params.id;

    const sql = 'DELETE FROM careers WHERE id= ?';

    con.query(sql, [req.params.id], (err, result) => {
        if (err) { return res.json({ Error: "Query Error" }) }
        return res.json({ message: 'Job deleted successfully' });
    })

});

router.get('/courses', (req, res) => {
    const sql = "SELECT * FROM courses";

    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error retrieving courses:", err);
            return res.status(500).json({ error: "Query Error" });
        }

        return res.json(result); // Send the list of courses as an array
    });
});


router.delete('/courses/:id', (req, res) => {
    // const cid = req.params.id;

    const sql = 'DELETE FROM courses WHERE id= ?';

    con.query(sql, [req.params.id], (err, result) => {
        if (err) { return res.json({ Error: "Query Error" }) }
        return res.json({ message: 'Course deleted successfully' });
    })

});
router.post("/courses", (req, res) => {
    const sql = "INSERT INTO courses(course) VALUES(?)";
    con.query(sql, [req.body.course], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);

            return res.json({ Error: "Query Error" })
        }
        return res.json(result.insertId);
    })
})

router.put('/courses', (req, res) => {
    const { id, course } = req.body;
    if (id != "") {
        const sql = 'UPDATE courses SET course=? WHERE id=?';
        con.query(sql, [course, id], (err, result) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Database Error' });
            }
            return res.json({ message: 'Course Updated Successfully' });
        });
    } else {
        return res.status(400).json({ error: 'Invalid Request: No ID provided for update' });
    }
});

router.get("/events", (req, res) => {
    const sql = "SELECT events.*, COUNT(event_commits.id) AS commits_count FROM events LEFT JOIN event_commits ON events.id = event_commits.event_id GROUP BY events.id ORDER BY events.schedule DESC";

    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json(result);
    });
});


router.post("/events", (req, res) => {
    const { title, content, schedule } = req.body;
    const sql = "INSERT INTO events (title, content, schedule) VALUES (?, ?, ?)";
    con.query(sql, [title, content, schedule], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json({ message: "Event Added Successfully" });
    });
});

router.put("/events", (req, res) => {
    const { id, title, content, schedule } = req.body;
    if (id) {
        const sql = "UPDATE events SET title=?, content=?, schedule=? WHERE id=?";
        con.query(sql, [title, content, schedule, id], (err, result) => {
            if (err) {
                console.error("Error executing SQL query:", err);
                return res.status(500).json({ error: "Query Error" });
            }
            return res.json({ message: "Event Updated Successfully" });
        });
    }
});

router.delete("/events/:id", (req, res) => {
    const eid = req.params.id;
    const sql = 'DELETE FROM events WHERE id=?';
    con.query(sql, [eid], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json({ message: 'Event Deleted Successfully' });
    })
})

router.post("/events/participate", (req, res) => {
    const { event_id, user_id } = req.body;
    const sql = "INSERT INTO event_commits (event_id,user_id) VALUES (?, ?)";
    con.query(sql, [event_id, user_id], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json({ message: "Participated" });
    });
});
router.post("/eventcommits/check", (req, res) => {
    const { event_id, user_id } = req.body;
    const sql = "SELECT * FROM event_commits where event_id=? AND user_id=?";
    con.query(sql, [event_id, user_id], (err, result) => {
        if (err) return res.json({ eventCommit: false, Error: "Query Error" })
        if (result.length > 0) {
            return res.json({ eventCommit: true })
        } else {
            return res.json({ eventCommit: false })
        }
    });
});

router.get("/forums", (req, res) => {
    // const sql = "SELECT forum_topics.*, COUNT(forum_comments.id) AS comments_count FROM forum_topics LEFT JOIN forum_comments ON forum_topics.id = forum_comments.topic_id GROUP BY forum_topics.id ORDER BY forum_topics.id DESC";
    const sql = "SELECT forum_topics.*, COUNT(forum_comments.id) AS comments_count, users.name AS created_by FROM forum_topics LEFT JOIN forum_comments ON forum_topics.id = forum_comments.topic_id LEFT JOIN users ON forum_topics.user_id = users.id GROUP BY forum_topics.id ORDER BY forum_topics.id DESC"
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json(result);
    });
});

router.delete("/forum/:id", (req, res) => {
    const eid = req.params.id;
    const sql = 'DELETE FROM forum_topics WHERE id=?';
    con.query(sql, [eid], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json({ message: 'Forum Deleted Successfully' });
    })
})


router.post("/topiccomments", (req, res) => {
    const { topic_id } = req.body;
    // const sql = "SELECT * FROM forum_comments WHERE topic_id = ?";
    const sql = "SELECT forum_comments.*, users.name AS name FROM forum_comments LEFT JOIN users ON forum_comments.user_id = users.id WHERE topic_id = ?";
    con.query(sql, [topic_id], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json(result);
    });
});

router.put("/view_forum/:id", (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    if (id) {
        const sql = "UPDATE forum_comments SET comment=? WHERE id=?";
        con.query(sql, [comment, id], (err, result) => {
            if (err) {
                console.error("Error executing SQL query:", err);
                return res.status(500).json({ error: "Query Error" });
            }
            return res.json({ message: "Comment Updated Successfully" });
        });
    } else {
        return res.status(400).json({ error: "Invalid request" });
    }
});

router.post("/view_forum", (req, res) => {
    const { c, user_id, topic_id } = req.body;
    const sql = "INSERT INTO forum_comments (topic_id, comment, user_id) VALUES (?, ?, ?)";
    con.query(sql, [topic_id, c, user_id], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json(result);
    });
});


router.delete('/view_forum/:id', (req, res) => {
    // const cid = req.params.id;
    const sql = 'DELETE FROM forum_comments WHERE id= ?';
    con.query(sql, [req.params.id], (err, result) => {
        if (err) { return res.json({ Error: "Query Error" }) }
        return res.json({ message: 'Comment deleted successfully' });
    })
});


router.post('/manageforum', (req, res) => {
    const { title, userId, description } = req.body;

    const sql = 'INSERT INTO forum_topics (title, user_id, description) VALUES (?, ?, ?)';
    con.query(sql, [title, userId, description], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Database Error' });
        }
        return res.json({ message: 'New Forum added successfully', jobId: result.insertId });
    });
});

router.put('/manageforum', (req, res) => {
    const { title, description, id } = req.body;
    if (id) {
        const sql = 'UPDATE forum_topics SET title=?, description=? WHERE id=?';
        con.query(sql, [title, description, id], (err, result) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Database Error' });
            }
            return res.json({ message: 'Forum Topic Updated Successfully' });
        });
    } else {
        return res.status(400).json({ error: 'Invalid Request: No ID provided for update' });
    }
});


router.get("/users", (req, res) => {
    const sql = "SELECT * FROM users order by name asc";
    con.query(sql, (err, result) => {
        if (err) return res.json({ eventCommit: false, Error: "Query Error" })
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.json({ message: "No User Available" })
        }
    });
});




router.put('/manageuser', async (req, res) => {
    try {

        const { name, email, id, password, type } = req.body;
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        if (id) {
            const sql = 'UPDATE users SET name=?, email=?,type=? WHERE id=?';
            con.query(sql, [name, email, type, id], (err, result) => {
                if (err) {
                    console.error('Error executing SQL query:', err);
                    return res.status(500).json({ error: 'Database Error' });
                }
                if (hashedPassword) {
                    const psql = 'UPDATE users SET password = ? WHERE id =?';
                    const pvalues = [hashedPassword, id];
                    con.query(psql, pvalues, (err, result) => {
                        if (err) {
                            console.error('Error updating password:', err);
                            res.status(500).json({ error: 'An error occurred' });
                            return;
                        }
                        res.json({ message: 'User updated successfully' });
                    });
                } else {
                    res.json({ message: 'User updated successfully' });
                }
            });
        } else {
            return res.status(400).json({ error: 'Invalid Request: No ID provided for update' });
        }

    } catch (error) {
        console.error('Error updating User:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.delete('/user/:id', (req, res) => {
    const searchsql = 'Select alumnus_id from users where id=?'
    con.query(searchsql, [req.params.id], (serr, sresult) => {
        if (serr) { return res.json({ Error: "Query Error" }) }
        if (sresult[0].alumnus_id !== 0) {
            const asql = 'DELETE FROM alumnus_bio WHERE id=?';
            con.query(asql, [sresult[0].alumnus_id], (aerr, aresult) => {
                if (aerr) {
                    console.error("Error executing SQL query:", aerr);
                }
            })
        }

        const usql = 'DELETE FROM users WHERE id= ?';
        con.query(usql, [req.params.id], (uerr, uresult) => {
            if (uerr) { return res.json({ Error: "Query Error" }) }
            return res.json({ message: 'User deleted successfully' });
        })

    })

});

router.get("/gallery", (req, res) => {
    const sql = "SELECT * FROM gallery order by id desc";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Query Error" })
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.json({ message: "No Image Available" })
        }
    });
});



router.delete('/gallery/:id', (req, res) => {
    const id = req.params.id;

    con.query('DELETE FROM gallery WHERE id = ?', id, (err, result) => {
        if (err) {
            console.error('Error deleting from gallery:', err);
            res.status(500).json({ error: 'An error occurred' });
            return;
        }
        res.json({ message: 'Image deleted successfully' });
    });
});

router.post('/gallery', galleryUpload.single('image'), (req, res) => {
    try {
        const imagePath = req.file.path;
        const about = req.body.about;

        con.query('INSERT INTO gallery (image_path, about) VALUES (?, ?)', [imagePath, about], (err, result) => {
            if (err) {
                console.error('Error inserting into gallery:', err);
                res.status(500).json({ error: 'An error occurred' });
                return;
            }
            const insertedId = result.insertId;
            res.json({ message: 'Image uploaded successfully', id: insertedId, image_path: imagePath, about: about });
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.get("/alumni", (req, res) => {
    const sql = "SELECT a.*,c.course,a.name as name from alumnus_bio a inner join courses c on c.id = a.course_id order by a.name asc";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Query Error" })
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.json({ message: "No Data Available" })
        }
    });
});

router.delete("/alumni/:id", (req, res) => {
    const eid = req.params.id;
    const sql = 'DELETE FROM alumnus_bio WHERE id=?';
    con.query(sql, [eid], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            return res.status(500).json({ error: "Query Error" });
        }
        return res.json({ message: 'Alumnus Deleted Successfully' });
    })

})

router.put('/viewalumni', (req, res) => {
    const { status, id } = req.body;
    const sql = 'UPDATE alumnus_bio SET status=? WHERE id=?';
    con.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Database Error' });
        }
        return res.json({ message: 'Status Updated Successfully' });
    });
});


router.get("/settings", (req, res) => {
    const sql = "SELECT * FROM system_settings";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Query Error" })
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.json({ message: "No Data Available" })
        }
    });
});



//frontend

router.get("/up_events", (req, res) => {
    const sql = `SELECT * FROM events WHERE schedule >= CURDATE() ORDER BY schedule ASC`;
    con.query(sql, (err, result) => {
        if (err){
            console.log("Database Query Error:", err);
            return res.json({Error: `DB Query Error ${err}`})
            // return res.json({ Error: "DB Query Error" , })
        } 
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.json({ message: "Still there are no upcoming Events" })
        }
    });
});


router.get("/alumni_list", (req, res) => {
    const sql = "SELECT u.id AS user_id, a.*, c.course, a.name AS name FROM alumnus_bio a JOIN users u ON u.alumnus_id = a.id LEFT JOIN courses c ON c.id = a.course_id ORDER BY a.name ASC";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Query Error" })
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.json({ message: "No Alumni available" })
        }
    });
}); 

// In your routes file (e.g., auth.js)
router.get('/connection/status/:userId', async (req, res) => {
    try {
      const currentUserId = req.params.userId;
  
      if (!currentUserId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      // Fetch all connections where current user is either sender or receiver
      const connections = await queryAsync(
        `SELECT * FROM connections 
         WHERE sender_id = ? OR receiver_id = ?`,
        [currentUserId, currentUserId]
      );
  
      if (!connections || connections.length === 0) {
        return res.json({ connections: [] });
      }
  
      // Format the result to return the other user ID and status
      const formattedConnections = connections.map(conn => {
        const isSender = conn.sender_id == currentUserId;
        const otherUserId = isSender ? conn.receiver_id : conn.sender_id;
  
        return {
          connectionId: conn.id,
          userId: otherUserId,
          status: conn.status,
        };
      });
  
      return res.json({ connections: formattedConnections });
    } catch (error) {
      console.error('Error fetching connection status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

router.put('/upaccount', avatarUpload.single('image'), async (req, res) => {
    try {
        const {
            name, connected_to, course_id, email, gender, batch,
            password, alumnus_id, user_id,
            dob, contact_number, email_optional,
            current_address, current_district_taluka, village_name,
            taluka, other_taluka, district, region, other_district,
            state, hostel, year_of_joining_vss, education_details,
            special_achievement, social_work, associated_with_samiti,
            form_of_association, contribution_areas, reflection_on_samiti,
            additional_comments
        } = req.body;

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update alumnus_bio table with all fields
        const asql = `
            UPDATE alumnus_bio SET 
                name = ?, connected_to = ?, course_id = ?, email = ?, gender = ?, batch = ?,
                dob = ?, contact_number = ?, email_optional = ?, current_address = ?, 
                current_district_taluka = ?, village_name = ?, taluka = ?, other_taluka = ?, 
                district = ?, region = ?, other_district = ?, state = ?, hostel = ?, 
                year_of_joining_vss = ?, education_details = ?, special_achievement = ?, 
                social_work = ?, associated_with_samiti = ?, form_of_association = ?, 
                contribution_areas = ?, reflection_on_samiti = ?, additional_comments = ?
            WHERE id = ?
        `;

        const avalues = [
            name, connected_to, course_id, email, gender, batch,
            dob, contact_number, email_optional, current_address,
            current_district_taluka, village_name, taluka, other_taluka,
            district, region, other_district, state, hostel,
            year_of_joining_vss, education_details, special_achievement,
            social_work, associated_with_samiti,form_of_association,
            contribution_areas, reflection_on_samiti, additional_comments,
            alumnus_id
        ];

        con.query(asql, avalues, (err, result) => {
            if (err) {
                console.error('Error updating alumnus_bio:', err);
                return res.status(500).json({ error: 'Error updating alumnus_bio' });
            }

            // Update avatar if image uploaded
            if (req.file) {
                const avsql = 'UPDATE alumnus_bio SET avatar = ? WHERE id = ?';
                const avvalues = [req.file.path, alumnus_id];
                con.query(avsql, avvalues, (err) => {
                    if (err) {
                        console.error('Error updating avatar:', err);
                        // Not critical; continue
                    }
                });
            }

            // Update users table
            const usql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
            const uvalues = [name, email, user_id];
            con.query(usql, uvalues, (err) => {
                if (err) {
                    console.error('Error updating users:', err);
                    return res.status(500).json({ error: 'Error updating users' });
                }

                if (hashedPassword) {
                    const psql = 'UPDATE users SET password = ? WHERE id = ?';
                    const pvalues = [hashedPassword, user_id];
                    con.query(psql, pvalues, (err) => {
                        if (err) {
                            console.error('Error updating password:', err);
                            return res.status(500).json({ error: 'Error updating password' });
                        }
                        return res.json({ message: 'Account updated successfully' });
                    });
                } else {
                    return res.json({ message: 'Account updated successfully' });
                }
            });
        });
    } catch (error) {
        console.error('Exception in /upaccount:', error);
        res.status(500).json({ error: 'Server error' });
    }
});




const getAllStudentEmails = () => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT email FROM users WHERE type = 'student'";
      con.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          const emails = results.map(row => row.email);
          resolve(emails);
        }
      });
    });
  };
  
  router.post('/managejob', async (req, res) => {
    const { company, job_title, location, description, user_id } = req.body;
    const sql = 'INSERT INTO careers (company, job_title, location, description, user_id) VALUES (?, ?, ?, ?, ?)';
  
    con.query(sql, [company, job_title, location, description, user_id], async (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Database Error' });
      }
  
      try {
        const emails = await getAllStudentEmails();
        const subject = `New Job Posted: ${job_title}`;
        const html = `A new job has been posted:<br><br>Company: ${company}<br>Title: ${job_title}<br>Location: ${location}<br>Description: ${description}`;
  
        await Promise.all(emails.map(email => sendEmail(email, subject, html)));
  
        return res.json({ message: 'New job added successfully and emails sent', jobId: result.insertId });
      } catch (error) {
        console.error('Error fetching emails or sending email:', error);
        if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
          return res.status(500).json({ error: 'Network Error: Unable to send emails' });
        } else {
          return res.status(500).json({ error: 'Error sending emails' });
        }
      }
    });
  });   


  

//connection send
  
  
router.post('/connection/send', (req, res) => {
    const { sender_id, receiver_id } = req.body; 
   
  
    if (!sender_id || !receiver_id) {
      return res.status(400).json({ message: 'Sender and receiver IDs are required' });
    }
  
    const checkQuery = 'SELECT * FROM connections WHERE sender_id = ? AND receiver_id = ?';
    con.query(checkQuery, [sender_id, receiver_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error checking for existing connection request' });
  
      if (result.length > 0) {
        return res.status(400).json({ message: 'Connection request already exists' });
      }
  
      const query = 'INSERT INTO connections (sender_id, receiver_id, status) VALUES (?, ?, ?)';
      con.query(query, [sender_id, receiver_id, 'pending'], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error sending connection request' });
  
        res.status(200).json({ message: 'Connection request sent successfully' });
      });
    });
  }); 

 


  //connection accept 

  // GET all pending connection requests for a receiver 
  //lot more work to do 
  router.get('/connection/requests', (req, res) => {
    const receiver_id = req.query.receiver_id;
  
    if (!receiver_id) {
      return res.status(400).json({ message: 'receiver_id is required' });
    }
  
    const query = 
     `SELECT 
    cr.id AS request_id,
    cr.sender_id,
    cr.receiver_id,
    cr.status,
    u.name AS sender_name,
    u.email AS sender_email,
    u.alumnus_id,
    a.batch, 
    a.avatar,
    c.course AS course
FROM connections cr
JOIN users u ON cr.sender_id = u.id
LEFT JOIN alumnus_bio a ON u.alumnus_id = a.id 
LEFT JOIN Courses c ON c.id = a.course_id
WHERE cr.receiver_id = ? AND cr.status = 'pending';
`
    ;
  
    con.query(query, [receiver_id], (err, results) => {
      if (err) {
        console.error('Error fetching pending requests:', err);
        return res.status(500).json({ message: 'Database error while fetching requests' });
      }
  
      res.status(200).json({ requests: results });
    });
  }); 

router.post('/connection/respond', (req, res) => {
    const { sender_id, receiver_id, status } = req.body;
  
    if (!sender_id || !receiver_id || !status) {
      return res.status(400).json({ message: 'Missing fields' });
    }
  
    const query = `
      UPDATE connections
      SET status = ?
      WHERE sender_id = ? AND receiver_id = ?
    `;
  
    con.query(query, [status, sender_id, receiver_id], (err, result) => {
      if (err) {
        console.error('Error updating connection status:', err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      res.status(200).json({ message: 'Connection status updated' });
    });
  });
  router.get('/connection', (req, res) => {
    const { user_id } = req.query;
  
    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
  
    const query = `
      SELECT 
        u.id AS user_id,
        u.name AS user_name,
        u.email,
        ab.batch,
        c.course, 
        ab.connected_to, 
        ab.avatar
      FROM connections con
      JOIN users u ON 
        (u.id = con.sender_id AND con.receiver_id = ?) OR 
        (u.id = con.receiver_id AND con.sender_id = ?)
      LEFT JOIN alumnus_bio ab ON u.alumnus_id = ab.id AND u.alumnus_id != 0
      LEFT JOIN courses c ON ab.course_id = c.id
      WHERE con.status = 'accepted'
        AND (con.sender_id = ? OR con.receiver_id = ?)
    `;
  
    con.query(query, [user_id, user_id, user_id, user_id], (err, results) => {
      if (err) {
        console.error("SQL error:", err.sqlMessage);
        return res.status(500).json({ message: 'Database error', error: err.sqlMessage });
      }
  
      res.status(200).json({ connections: results });
    });
  }); 
  // POST: Send message
router.post('/messages/send', async (req, res) => {
    const { sender_id, receiver_id, message_text } = req.body;
    if (!sender_id || !receiver_id || !message_text) {
      return res.status(400).json({ error: 'Missing fields' });
    }
  
    const sql = `INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)`;
    con.query(sql, [sender_id, receiver_id, message_text], (err, result) => {
      if (err) {
        console.error("Error sending message:", err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Message sent successfully', messageId: result.insertId });
    });
  });

  // GET: Get all messages between two users
  router.get('/messages', async (req, res) => {
    const { sender_id, receiver_id } = req.query;
  
    if (!sender_id || !receiver_id) {
      return res.status(400).json({ error: 'Missing query parameters' });
    }
  
    const sql = `
      SELECT 
        id,
        sender_id,
        receiver_id,
        message_text,
        created_at,
        read_status,
        deleted_for_sender,
        deleted_for_receiver,
        is_edited
      FROM messages 
      WHERE 
        (sender_id = ? AND receiver_id = ?)
        OR 
        (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `;
  
    con.query(sql, [sender_id, receiver_id, receiver_id, sender_id], (err, results) => {
      if (err) {
        console.error("Error fetching messages:", err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ messages: results });
    });
  });
  
  
  router.get('/messages/unread/count', async (req, res) => {
    try {
      const { receiver_id } = req.query;
      
      // SQL query to count unread messages grouped by sender
      const query = `
        SELECT sender_id, COUNT(*) as count 
        FROM messages 
        WHERE receiver_id = ? AND read_status = 'unread' 
        GROUP BY sender_id
      `;
      
      con.query(query, [receiver_id], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        
        res.json({ counts: results });
      });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // 2. Mark messages as read
  // PUT /auth/messages/read
  router.put('/messages/read', async (req, res) => {
    try {
      const { sender_id, receiver_id } = req.body;
      
      // SQL query to update read status
      const query = `
        UPDATE messages 
        SET read_status = 'read' 
        WHERE sender_id = ? AND receiver_id = ? AND read_status = 'unread'
      `;
      
      con.query(query, [sender_id, receiver_id], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        
        res.json({ 
          success: true, 
          message: "Messages marked as read",
          updated: results.affectedRows 
        });
      });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  

  router.post('/messages/delete', async (req, res) => {
  const { message_id, user_id, delete_for, is_edited } = req.body;
  const userIdInt = parseInt(user_id);
  
  console.log('Delete message request:', req.body);

  if (!message_id || !user_id || !delete_for || isNaN(userIdInt)) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    const [rows] = await con.promise().query('SELECT * FROM messages WHERE id = ?', [message_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const message = rows[0];

    if (delete_for === 'me') {
      if (message.sender_id === userIdInt) {
        // Mark message as deleted for the sender (do not delete the row)
        await con.promise().query('UPDATE messages SET deleted_for_sender = 1 WHERE id = ?', [message_id]);
        return res.status(200).json({ message: 'Message deleted for sender' });
      } else if (message.receiver_id === userIdInt) {
        // Mark message as deleted for the receiver (do not delete the row)
        await con.promise().query('UPDATE messages SET deleted_for_receiver = 1 WHERE id = ?', [message_id]);
        return res.status(200).json({ message: 'Message deleted for receiver' });
      } else {
        return res.status(403).json({ error: 'User not authorized to delete this message' });
      }
    }

    if (delete_for === 'everyone') {
      if (message.sender_id !== userIdInt) {
        return res.status(403).json({ error: 'Only sender can delete message for everyone' });
      }

      // Mark message as deleted for both sender and receiver (do not delete the row)
      await con.promise().query('UPDATE messages SET deleted_for_sender = 1, deleted_for_receiver = 1 WHERE id = ?', [message_id]);
      return res.status(200).json({ message: 'Message deleted for everyone' });
    }

    if (is_edited === true) {
      // Mark message as edited (do not delete the row)
      await con.promise().query('UPDATE messages SET is_edited = 1 WHERE id = ?', [message_id]);
      return res.status(200).json({ message: 'Message marked as edited' });
    }

    return res.status(400).json({ error: 'Invalid delete_for value or edit operation' });

  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

  // Edit message endpoint
  router.put('/messages/edit', async (req, res) => {
    const { message_id, message_text } = req.body;
  
    if (!message_id || !message_text) {
      return res.status(400).json({ success: false, message: 'Missing message_id or message_text' });
    }
  
    try {
      const result = await queryAsync(
        'UPDATE messages SET message_text = ?, is_edited = 1 WHERE id = ?',
        [message_text, message_id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Message not found or already deleted' });
      }
  
      res.json({ success: true, message: 'Message updated successfully' });
    } catch (err) {
      console.error('Error updating message:', err);
      res.status(500).json({ success: false, message: 'Database error' });
    }
  }); 

  router.post('/events/send-email', async (req, res) => {
    const { eventId } = req.body;
  
    try {
      // ✅ Query event details
      const eventRows = await queryAsync('SELECT * FROM events WHERE id = ?', [eventId]);
      if (!eventRows || eventRows.length === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      const event = eventRows[0];
  
      // ✅ Query alumni emails
      const alumniRows = await queryAsync(
        'SELECT email FROM users WHERE type = "alumnus" AND email IS NOT NULL'
      );
  
      const emails = alumniRows.map(user => user.email);
  
      if (emails.length === 0) {
        return res.status(400).json({ message: 'No alumni emails found' });
      }
  
      // ✅ Send email
      const subject = `You're Invited: ${event.title}`;
      const htmlContent = `
        <h2>${event.title}</h2>
        <p><strong>Date:</strong> ${new Date(event.schedule).toLocaleDateString()}</p>
        <p><strong>Description:</strong></p>
        <p>${event.content}</p>
      `;
  
      await sendMailToAlumni(emails, subject, htmlContent);
  
      res.json({ message: 'Emails sent successfully!' });
    } catch (error) {
      console.error('Email sending error:', error);
      res.status(500).json({ message: 'Failed to send emails.' });
    }
  });
  

export { router as adminRouter } 
    


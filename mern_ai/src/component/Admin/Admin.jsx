import React, { useEffect, useState, useContext } from 'react'
import style from './Admin.module.css'
import Skeleton from "@mui/material/Skeleton"
import withAuthHOC from "../../Utlis/HOC/withAuthHOC"
import axios from "../../Utlis/axios"
import { AuthContext } from "../../Utlis/AuthContext"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"

function Admin() {
  const { userInfo } = useContext(AuthContext);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllResumes = async () => {
      if (!userInfo || userInfo.role !== "admin") return;
      try {
        const response = await axios.get('/api/resume/get');
        setResumes(response.data.resumes || []);
      } catch (err) {
        console.error("Error fetching all resumes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllResumes();
  }, [userInfo]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume history record?")) {
      return;
    }
    try {
      await axios.delete(`/api/resume/delete/${id}`);
      setResumes((prev) => prev.filter((resume) => resume._id !== id));
    } catch (err) {
      console.error("Error deleting resume record:", err);
      alert("Error deleting record: " + (err.response?.data?.message || err.message));
    }
  };

  if (userInfo?.role !== "admin") {
    return (
      <div className={style.admin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <h2 style={{ color: 'var(--accent-color)', fontSize: '28px', fontWeight: '700' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>You do not have administrative privileges to view this page.</p>
      </div>
    );
  }

  return (
    <div className={style.admin}>
      <div className={style.adminBlock}>
        {loading ? (
          <>
            <Skeleton variant="rectangular" sx={{ borderRadius: '20px' }} width={400} height={280} />
            <Skeleton variant="rectangular" sx={{ borderRadius: '20px' }} width={400} height={280} />
            <Skeleton variant="rectangular" sx={{ borderRadius: '20px' }} width={400} height={280} />
          </>
        ) : resumes.length === 0 ? (
          <div className={style.noData} style={{ color: "var(--text-secondary)", gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px" }}>
            <h2>No history found</h2>
            <p>No resumes have been submitted for screening yet.</p>
          </div>
        ) : (
          resumes.map((resume) => (
            <div key={resume._id} className={style.adminCard} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                <IconButton onClick={() => handleDelete(resume._id)} sx={{ color: '#ef4444' }} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </div>
              <h2>{resume.user?.name || "Unknown User"}</h2>
              <p style={{ color: "var(--accent-color)", fontWeight: '500' }}>{resume.user?.email || "No Email"}</p>
              <h3>Score: {resume.score}%</h3>
              <p><strong>Resume:</strong> {resume.resume_name}</p>
              <p><strong>Feedback:</strong> {resume.feedback || "No feedback provided."}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default withAuthHOC(Admin);
import React, { useEffect, useState, useContext } from 'react'
import style from './History.module.css'
import Skeleton from "@mui/material/Skeleton"
import withAuthHOC from "../../Utlis/HOC/withAuthHOC"
import axios from "../../Utlis/axios"
import { AuthContext } from "../../Utlis/AuthContext"

function History() {
  const { userInfo } = useContext(AuthContext);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userInfo || !userInfo._id) return;
      try {
        const response = await axios.get(`/api/resume/get/${userInfo._id}`);
        setResumes(response.data.resumes || []);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userInfo]);

  return (
    <div className={style.history}>
      <div className={style.historyCardBlock}>
        {loading ? (
          <>
            <Skeleton variant="rectangular" sx={{ borderRadius: '20px' }} width={266} height={200} />
            <Skeleton variant="rectangular" sx={{ borderRadius: '20px' }} width={266} height={200} />
            <Skeleton variant="rectangular" sx={{ borderRadius: '20px' }} width={266} height={200} />
          </>
        ) : resumes.length === 0 ? (
          <div className={style.noHistory} style={{ color: "#fff", gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px" }}>
            <h2>No history found</h2>
            <p>Upload a resume and job description on the Dashboard to get started.</p>
          </div>
        ) : (
          resumes.map((resume) => (
            <div key={resume._id} className={style.historyCard}>
              <div className={style.cardPercentage}>{resume.score}%</div>
              <h2>{resume.resume_name}</h2>
              <p><strong>Job Description:</strong> {resume.job_Desc}</p>
              {resume.feedback && <p><strong>Feedback:</strong> {resume.feedback}</p>}
              <p><strong>Dated:</strong> {new Date(resume.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default withAuthHOC(History);
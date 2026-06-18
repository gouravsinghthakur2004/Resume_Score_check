

import React from "react";
import style from "./Dashboard.module.css";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import gouravImg from '../images/gourav.jpg'; // Adjust path relative to this file
import Skeleton from "@mui/material/Skeleton"
import withAuthHOC from "../../Utlis/HOC/withAuthHOC"
import { useState } from "react";
import axios from '../../Utlis/axios'
import { useContext } from "react";
import { AuthContext } from "../../Utlis/AuthContext";

function Dashboard() {

  const [uploadFileText, setUploadFileText] = useState("Upload your resume")
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);

  const { userInfo } = useContext(AuthContext)

  const handleOnChangeFile = (e) => {
    setResumeFile(e.target.files[0]);
    setUploadFileText(e.target.files[0].name);
  }

  const handleReset = () => {
    setResumeFile(null);
    setUploadFileText("Upload your resume");
    setJobDesc("");
    setResult(null);
  }

  const handleUplaod = async () => {
    setResult(null)
    if (!jobDesc || !resumeFile) {
      alert("please fill the job Description & Upload Resume")
      return;
    }

    if (!userInfo || !userInfo._id) {
      alert("User authentication error. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_desc", jobDesc);
    formData.append("user", userInfo._id);
    setLoading(true)
    try {
      const result = await axios.post('/api/resume/addResume', formData)
      setResult(result.data.data);

    } catch (err) {
      console.log(err)
      alert("Error analyzing resume: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className={style.dashboard}>
      {/* Left Section */}
      <div className={style.dashboardLeft}>
        <div className={style.dashboardHeader}>
          <p className={style.dashboardHeaderTitle}>
            Smart Resume Screening
          </p>

          <h1 className={style.dashboardHeaderLargeTitle}>
            Resume Match Score
          </h1>
        </div>

        <div className={style.alertInfo}>
          <h3>Important Instructions</h3>

          <ul className={style.dashboardInstruction}>
            <li>
              Please paste the complete Job Description before submitting.
            </li>

            <li>Only PDF (.pdf) resumes are accepted.</li>
          </ul>
        </div>

        <div className={style.dashboardUploadResume}>
          <div className={style.dashboardResumeBlock}>
            {uploadFileText}
          </div>
        </div>

        <div className={style.dashboardInputField}>
          <label
            htmlFor="resumeInput"
            className={style.analyzeAiBtn}
          >
            Upload Resume
          </label>

          <input
            id="resumeInput"
            type="file"
            accept=".pdf"
            onChange={handleOnChangeFile}
          />
        </div>

        <div className={style.jobDesc}>
          <textarea
            value={jobDesc} onChange={(e) => { setJobDesc(e.target.value) }}
            className={style.textarea}
            rows={10}
            placeholder="Paste the Job Description here..."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'space-between' }}>
            <button className={style.analyzeBtn} onClick={handleUplaod}>
              Analyze
            </button>
            <button className={style.resetBtn} onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Right Section */}

      <div className={style.dashboardRight}>
        <div className={style.dashboardRightTopCard}>
          <h3>Analyze with AI</h3>

          <img
            src={userInfo?.photoUrl || userInfo?.photoURL || gouravImg}
            alt="User Profile"
            className={style.profileImg}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = gouravImg;
            }}
          />

          <h2>{userInfo?.name || "Coding Hunger AI"}</h2>
        </div>

        {result && <div className={style.scoreCard}>
          <h2>Resume Score</h2>

          <div className={style.scoreContainer}>
            <h1>{result?.score}%</h1>

            <CreditScoreIcon sx={{ fontSize: 50 }} />
          </div>

          <div className={style.feedback}>
            <h3>Feedback</h3>

            <p>
              {result?.feedback}
            </p>
          </div>
        </div>
        }

        {loading && <Skeleton variant="rectangular" sx={{ borderRadius: '20px' }} width={280} height={280} />}
      </div>
    </div>
  );
}

export { Dashboard };
export default withAuthHOC(Dashboard);
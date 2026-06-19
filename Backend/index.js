require('dotenv').config();
const express=require("express")
const cors=require("cors")
const app = express()
app.use(express.json())
const Port=process.env.PORT || 5000

require('./connection')


app.use(cors({
  credentials: true,
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://resumescorecheck.netlify.app"
  ]
}));
app.use(express.urlencoded({ extended: true }));

const UserRoutes=require("./Routes/user")
const ResumeRoutes=require('./Routes/resume')

app.use('/api/user',UserRoutes)
app.use('/api/resume',ResumeRoutes)

app.listen(Port,()=>{
    console.log(`server is running on port ${Port}`)
})
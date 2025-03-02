import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'

dotenv.config()
const app = express();

app.use(express.json())
app.use(cors());
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

const port = process.env.PORT

app.listen(port, ()=> console.log(`Server is running on port: ${port}`))
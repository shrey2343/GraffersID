import express from "express";
import companyRoute from "./routes/companyRoute.js";
import dotenv from 'dotenv'
import connectDB from "./config/db.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config()

const server = express()
server.use(cors())

server.use(express.json())
server.use(express.urlencoded({extended: true}));

// Static serving for uploaded files (backend/uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

server.get('/', (req, res) => {
  res.json({ message: 'GrafferID Backend API is running!' });
});

server.use('/company', companyRoute)

// Not Found handler
server.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
server.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(()=>{
    server.listen(PORT, () => {
        console.log('server started on port', PORT)
    })
}).catch((err)=>{console.log(err)})
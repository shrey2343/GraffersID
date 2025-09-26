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

// Local uploads static serving removed; using Cloudinary for assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.get('/', (req, res) => {
  res.json({ message: 'GrafferID Backend API is running!' });
});

server.use('/company', companyRoute)

// Cloudinary health check
server.get('/health/cloudinary', async (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = !!process.env.CLOUDINARY_API_KEY;
    const apiSecret = !!process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(400).json({ ok: false, msg: 'Cloudinary env vars missing' });
    }
    return res.json({ ok: true, cloudName });
  } catch (e) {
    res.status(500).json({ ok: false, msg: e?.message || 'Error' });
  }
});

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
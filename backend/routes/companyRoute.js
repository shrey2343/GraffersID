import {companyController} from '../controllers/companyController.js'
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const route = express.Router();

// Ensure uploads directory exists (backend/uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || '');
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

route.post('/add-company', upload.single('logo'), companyController.addCompany)
route.get('/get-All-Company',companyController.getAllCompany)
route.get('/get-Company/:id', companyController.getCompanyById)
route.post('/:companyid/add-review',companyController.addReview)
route.get('/:companyid/get-review',companyController.getAllReviews)
route.delete('/delete-company/:id', companyController.deleteCompany)


export default route;
import {companyController} from '../controllers/companyController.js'
import express from 'express';
import multer from 'multer';
const route = express.Router();

// Multer memory storage for Cloudinary upload with size/type limits
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

route.post('/add-company', upload.single('logo'), companyController.addCompany)
route.get('/get-All-Company',companyController.getAllCompany)
route.get('/get-Company/:id', companyController.getCompanyById)
route.post('/:companyid/add-review',companyController.addReview)
route.get('/:companyid/get-review',companyController.getAllReviews)
route.delete('/delete-company/:id', companyController.deleteCompany)


export default route;
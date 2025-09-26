import Company from "../models/company.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

 const addCompany = async(req,res)=>{
   try{
        if(!req.body){
            return res.status(400).json({msg: 'send data to backend'});
        }
        const required = ['companyName','location','city','foundedOn','description'];
        const missing = required.filter(k => !req.body[k] || String(req.body[k]).trim() === '');
        if (missing.length){
            return res.status(400).json({msg: `Missing fields: ${missing.join(', ')}`});
        }
        const fondedOn=req.body.foundedOn.split('T')[0];

        let logoUrl = req.body.logo || "";
        if (req.file && req.file.buffer) {
            try {
                // Upload buffer to Cloudinary
                const uploadFromBuffer = () => new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "grafferid/logos", resource_type: "image" },
                        (error, result) => {
                            if (error) return reject(error);
                            return resolve(result);
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
                });

                const uploadResult = await uploadFromBuffer();
                logoUrl = uploadResult.secure_url;
            } catch (uploadErr) {
                console.error('Cloudinary upload failed:', uploadErr);
                return res.status(502).json({ msg: 'Image upload failed', detail: uploadErr?.message || 'Unknown error' });
            }
        }

        const company = await Company.create({
            ...req.body,
            logo: logoUrl,
            foundedOn: fondedOn
        });
        if(company){
            res.status(201).json(company);
        }
    }catch(err){
        console.log(err);
        res.status(500).json({msg: err.message})
    }
}

 const getAllCompany = async(req,res)=>{
    try{
        const companies = await Company.find();
        if(!companies || companies.length === 0){
            return res.status(404).json({msg: 'No companies found'});
        }
        
        const companiesWithAvgRating = companies.map(company => {
            let averageRating = 0;
            if(company.reviews && company.reviews.length > 0) {
                averageRating = company.reviews.reduce((sum, review) => sum + review.rating, 0) / company.reviews.length;
            }
            return {
                ...company.toObject(),
                rating: averageRating
            };
        });
        
        res.status(201).json(companiesWithAvgRating);
    }catch(err){
        console.log(err);
        res.status(500).json({msg:err})
    }
}


const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const addReview = async (req, res) => {
  try {
    const companyId = req.params.companyid;
    if (!req.body) return res.status(400).send("Send data to backend");

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });

    const newReview = {
      fullName: req.body.fullName,
      subject: req.body.subject,
      reviewText: req.body.reviewText,
      rating: req.body.rating,
    };
    company.reviews.push(newReview);
    await company.save(); 
    res.status(201).json(company.reviews[company.reviews.length - 1]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};


const getAllReviews = async (req, res) => {
  try {
    const companyId = req.params.companyid;
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });
    res.status(200).json(company.reviews || []);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Company.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: 'Company not found' });
    res.status(200).json({ msg: 'Company deleted', id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};


export const companyController={
    getAllCompany,addCompany,getCompanyById,addReview,getAllReviews,deleteCompany

}

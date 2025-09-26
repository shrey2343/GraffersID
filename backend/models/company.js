import mongoose from "mongoose"
const reviewSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  subject: String,
  reviewText: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });
const companySchema = mongoose.Schema({
    companyName:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    foundedOn:{
        type:Date,
        required:true
    },
    reviews:[reviewSchema]
})
export default mongoose.model("company",companySchema)
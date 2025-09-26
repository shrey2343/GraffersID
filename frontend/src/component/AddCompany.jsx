import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

function AddCompany({ onAddCompany, onClose }) {
  const [company, setCompany] = useState({
    companyName: "",
    location: "",
    foundedOn: "",
    logo: "",
    description: "",
    city: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if(!company.companyName || company.companyName.trim().length < 2){
      newErrors.companyName = 'Company name is required (min 2 chars)';
    }
    if(!company.location || company.location.trim().length < 2){
      newErrors.location = 'Location is required';
    }
    if(!company.city || company.city.trim().length < 2){
      newErrors.city = 'City is required';
    }
    if(!company.foundedOn){
      newErrors.foundedOn = 'Founded date is required';
    }
    if(!company.description || company.description.trim().length < 10){
      newErrors.description = 'Description must be at least 10 characters';
    }
    if(!logoFile){
      newErrors.logo = 'Logo image is required';
    } else if(logoFile && !/^image\//.test(logoFile.type)){
      newErrors.logo = 'Logo must be an image file';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      if(!validate()) return;
      const formData = new FormData();
      formData.append('companyName', company.companyName);
      formData.append('location', company.location);
      formData.append('foundedOn', company.foundedOn);
      formData.append('description', company.description);
      formData.append('city', company.city);
      if (logoFile) {
        formData.append('logo', logoFile);
      } else if (company.logo) {
        formData.append('logo', company.logo);
      }

      const response = await axios.post(`${API_BASE_URL}/company/add-company`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if(response.status === 201){
        onAddCompany(response.data || company);
        setCompany({ companyName: "", location: "", foundedOn: "", logo: "", description: "", city: "" });
        setLogoFile(null);
        setLogoPreview("");
        setErrors({});
        onClose();
      }else{
        alert('Unexpected response from server.');
      }
    }catch(err){
      const message = err?.response?.data?.msg || err?.message || 'Failed to add company';
      alert(`Error: ${message}`);
      console.error('Add company failed:', err);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div className="modal-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #e9ecef',
          paddingBottom: '15px'
        }}>
          <h5 className="modal-title fw-bold">Add Company</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} >
          <div className="modal-body">
            {/* Company Name */}
            <div className="mb-3">
              <label className="form-label">Company name</label>
              <input
                type="text"
                className="form-control"
                name="companyName"
                value={company.companyName}
                onChange={handleChange}
                placeholder="Enter..."
                required
              />
              {errors.companyName && <div className="text-danger mt-1" style={{fontSize:'0.875rem'}}>{errors.companyName}</div>}
            </div>

            {/* Location */}
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={company.location}
                onChange={handleChange}
                placeholder="Enter..."
                required
              />
              {errors.location && <div className="text-danger mt-1" style={{fontSize:'0.875rem'}}>{errors.location}</div>}
            </div>

            {/* Founded on */}
            <div className="mb-3">
              <label className="form-label">Founded on</label>
              <input
                type="date"
                className="form-control"
                name="foundedOn"
                value={company.foundedOn}
                onChange={handleChange}
                required
              />
              {errors.foundedOn && <div className="text-danger mt-1" style={{fontSize:'0.875rem'}}>{errors.foundedOn}</div>}
            </div>

            {/* City */}
            <div className="mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                  name="city"
                  value={company.city}
                onChange={handleChange}
                placeholder="Enter City"
                required
              />
              {errors.city && <div className="text-danger mt-1" style={{fontSize:'0.875rem'}}>{errors.city}</div>}
            </div>

            {/* Logo */}
            <div className="mb-3">
              <label className="form-label">Logo</label>
              <input 
                type="file" 
                accept="image/*" 
                className="form-control" 
                name="logo"
                onChange={(e)=>{
                  const file = e.target.files && e.target.files[0];
                  setLogoFile(file || null);
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setLogoPreview(url);
                  } else {
                    setLogoPreview("");
                  }
                }}
                required 
              />
              {logoPreview && (
                <div className="mt-2">
                  <img src={logoPreview} alt="Logo preview" style={{maxWidth: '120px', borderRadius: '8px'}} />
                </div>
              )}
              {errors.logo && <div className="text-danger mt-1" style={{fontSize:'0.875rem'}}>{errors.logo}</div>}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={company.description} onChange={handleChange} required />
              {errors.description && <div className="text-danger mt-1" style={{fontSize:'0.875rem'}}>{errors.description}</div>}
            </div>
          </div>

          <div className="modal-footer" style={{ borderTop: '1px solid #e9ecef', paddingTop: '15px' }}>
            <button
              type="submit"
              className="btn text-white w-100"
              style={{
                background: 'linear-gradient(90deg, #6f42c1, #007bff)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px'
              }}
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCompany;

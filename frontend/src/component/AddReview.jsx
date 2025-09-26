import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

export default function AddReview({ companyId, onAddReview, onClose }) {
  const [review, setReview] = useState({
    fullName: "",
    subject: "",
    reviewText: "",
    rating: 4,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if(!review.fullName || review.fullName.trim().length < 2){
      newErrors.fullName = 'Full name is required (min 2 chars)';
    }
    if(!review.subject || review.subject.trim().length < 3){
      newErrors.subject = 'Subject is required (min 3 chars)';
    }
    if(!review.reviewText || review.reviewText.trim().length < 10){
      newErrors.reviewText = 'Review must be at least 10 characters';
    }
    if(!review.rating || review.rating < 1 || review.rating > 5){
      newErrors.rating = 'Rating must be between 1 and 5';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      if(!validate()) return;
      if(!companyId){
        alert('Missing company id.');
        return;
      }
      const response = await axios.post(`${API_BASE_URL}/company/${companyId}/add-review`, review);
      if(response.status === 201){
        onAddReview(response.data);
        setReview({ fullName: "", subject: "", reviewText: "", rating: 4 });
        setErrors({});
        onClose();
      }else{
        alert('Unexpected response from server.');
      }
    }catch(err){
      const message = err?.response?.data?.msg || err?.message || 'Failed to add review';
      alert(`Error: ${message}`);
      console.error('Add review failed:', err);
    }
  };

  const getRatingText = (rating) => {
    if (rating <= 1) return "Very Dissatisfied";
    if (rating <= 2) return "Dissatisfied";
    if (rating <= 3) return "Neutral";
    if (rating <= 4) return "Satisfied";
    return "Very Satisfied";
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
        border: 'none',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ 
          border: 'none', 
          padding: '20px 25px 10px 25px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '20px',
            width: '20px',
            height: '20px',
            backgroundColor: '#6f42c1',
            borderRadius: '50%',
            zIndex: 1
          }}></div>
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '30px',
            width: '15px',
            height: '15px',
            backgroundColor: 'rgba(111, 66, 193, 0.3)',
            borderRadius: '50%',
            zIndex: 0
          }}></div>
          
          <h2 className="modal-title fw-bold" style={{ marginLeft: '40px' }}>
            Add Review
          </h2>
          
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

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '20px 25px' }}>
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter"
                className="form-control"
                value={review.fullName}
                onChange={handleChange}
                required
                style={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '10px 15px'
                }}
              />
              {errors.fullName && <div className="text-danger mt-1" style={{fontSize:'0.875rem'}}>{errors.fullName}</div>}
            </div>

            {/* Subject */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Enter"
                className="form-control"
                value={review.subject}
                onChange={handleChange}
                required
                style={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '10px 15px'
                }}
              />
              {errors.subject && <div className="text-danger mt-1" style={{fontSize:'0.875rem'}}>{errors.subject}</div>}
            </div>

            {/* Review Text */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Enter your Review</label>
              <textarea
                name="reviewText"
                placeholder="Description"
                className="form-control"
                rows="4"
                value={review.reviewText}
                onChange={handleChange}
                required
                style={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '10px 15px',
                  resize: 'none'
                }}
              ></textarea>
              {errors.reviewText && <div className="text-danger mt-1" style={{fontSize:'0.875rem'}}>{errors.reviewText}</div>}
            </div>

            {/* Rating */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Rating</label>
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center me-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="me-1"
                      style={{
                        fontSize: '24px',
                        color: star <= review.rating ? '#ffc107' : '#e0e0e0',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease'
                      }}
                      onClick={() => setReview({ ...review, rating: star })}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-muted" style={{ fontSize: '14px' }}>
                  {getRatingText(review.rating)}
                </span>
              </div>
              {errors.rating && <div className="text-danger mt-1" style={{fontSize:'0.875rem'}}>{errors.rating}</div>}
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="btn w-100 text-white fw-semibold"
              style={{
                background: 'linear-gradient(90deg, #6f42c1, #2575fc)',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '16px'
              }}
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

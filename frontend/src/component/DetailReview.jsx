import React from 'react';
import AddReview from './AddReview';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
const DetailReview = ({ company, onClose, onReviewUpdate }) => {
    const [showAddReview, setShowAddReview] = useState(false);  
    const [reviews, setReviews] = useState(company.reviews || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      const load = async () => {
        try{
          setLoading(true);
          setError('');
          if (!company?._id) return;
          const resp = await axios.get(`${API_BASE_URL}/company/${company._id}/get-review`);
          if (resp.status === 200 && Array.isArray(resp.data)){
            setReviews(resp.data);
          }
        }catch(err){
          setError(err?.response?.data?.msg || 'Failed to load reviews');
        }finally{
          setLoading(false);
        }
      };
      load();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company?._id]);

    const handleAddReview = (newReview) => {
        // Add the new review to the reviews array (API already called in AddReview component)
        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        
        // Calculate new average rating
        const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / updatedReviews.length;
        
        // Update the company object with new reviews and rating
        const updatedCompany = {
            ...company,
            reviews: updatedReviews,
            rating: averageRating
        };
        
        // Notify parent component about the update
        if (onReviewUpdate) {
            onReviewUpdate(updatedCompany);
        }
        
        alert('Review added successfully');
    };

    const handleShowAddReview = () => {
    setShowAddReview(true);
  };

  const handleCloseAddReview = () => {
    setShowAddReview(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star rating-stars"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star rating-stars"></i>);
      }
    }
    return stars;
  };

  const renderCompanyStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star rating-stars"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt rating-stars"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star rating-stars"></i>);
    }

    return stars;
  };

  const handleLike = async (reviewId) => {
    if (!reviewId){
      alert('Invalid review');
      return;
    }
    try{
      const resp = await axios.post(`${API_BASE_URL}/company/${company._id}/reviews/${reviewId}/like`);
      if (resp.status === 200){
        const { likes } = resp.data;
        setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, likes } : r));
      }
    }catch(err){
      console.error('Like failed:', err);
      alert(err?.response?.data?.msg || 'Failed to like review');
    }
  };

  const handleShare = async (review) => {
    const shareText = `${review.fullName} reviewed ${company.companyName}: "${review.subject}" - ${review.reviewText}`;
    const shareUrl = window.location.href;
    if (navigator.share){
      try{
        await navigator.share({ title: company.companyName, text: shareText, url: shareUrl });
      }catch(e){ /* user cancelled */ }
    } else {
      try{
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert('Link copied to clipboard');
      }catch(e){
        alert('Copy failed');
      }
    }
  };

  return (
    <div className="App">
      {/* Main Content */}
      <main className="container my-4">
          {/* Company Profile Card */}
          <div className="company-profile-card">
            <div className="row align-items-center">
              <div className="col-md-1">
                <div 
                  className="company-logo-large"
                  style={{ backgroundColor: company.logoColor }}
                >
                   {company.logo &&(
                     <>
                       <img 
                         src={company.logo} 
                         alt={company.name}
                         style={{ 
                           width: '100%', 
                           height: '100%', 
                           objectFit: 'cover',
                           borderRadius: '12px'
                         }}
                         onError={(e) => {
                           e.target.style.display = 'none';
                           if (e.target.nextSibling) {
                             e.target.nextSibling.style.display = 'block';
                           }
                         }}
                       />
                       <div 
                         style={{ 
                           width: '100%', 
                           height: '100%', 
                           borderRadius: '12px',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           color: 'white',
                           fontSize: '24px',
                           fontWeight: 'bold'
                         }}
                       >
                         {company.companyName ? company.companyName.charAt(0).toUpperCase() : 'C'}
                       </div>
                     </>
                   )}
                </div>
              </div>
              <div className="col-md-6">
                <h4 className="company-name mb-2">{company.companyName}</h4>
                <p className="company-address text-muted mb-2">
                  <i className="fas fa-map-marker-alt me-1"></i>
                  {company.location}
                </p>
                <div className="d-flex align-items-center">
                  <span className="me-2 fw-semibold fs-5">{reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : '0.0'}</span>
                  <div className="me-3">
                    {renderCompanyStars(reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0)}
                  </div>
                  <span className="text-muted">{reviews.length} Reviews</span>
                </div>
              </div>
              <div className="col-md-3 text-end">
                <p className="text-muted mb-0">Founded on {company.foundedOn || company.regDate}</p>
              </div>
              <div className="col-md-2 text-end">
                <button 
                  className="btn btn-purple text-white"
                  onClick={handleShowAddReview}
                >
                  + Add Review
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header mb-3">
              <h5 className="text-muted">Result Found: {reviews.length}</h5>
              {loading && <span className="text-muted ms-2">Loading…</span>}
              {error && <div className="text-danger small">{error}</div>}
            </div>

            {/* Individual Reviews */}
            <div className="reviews-list">
              {reviews.map((review, index) => (
                <div key={review._id || index} className="review-card">
                  <div className="d-flex">
                    <div className="review-avatar me-3">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.fullName)}&background=6f42c1&color=fff&size=100`} 
                        alt={review.fullName}
                        className="rounded-circle"
                      />
                    </div>
                    <div className="review-content flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="reviewer-name mb-1">{review.fullName}</h6>
                          <p className="review-date text-muted mb-1">{review.subject}</p>
                        </div>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="review-text">{review.reviewText}</p>
                      <div className="d-flex align-items-center gap-3 mt-2">
                        <button className="btn btn-sm btn-outline-purple" onClick={() => handleLike(review._id)}>
                          <i className="far fa-thumbs-up me-1"></i>
                          Like {typeof review.likes === 'number' ? `(${review.likes})` : ''}
                        </button>
                        <button className="btn btn-sm btn-outline-gray" onClick={() => handleShare(review)}>
                          <i className="fas fa-share me-1"></i>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        
        

        {/* Back Button */}
        <div className="text-center mt-4">
          <button 
            className="btn btn-outline-purple"
            onClick={onClose}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Back to Company List
          </button>
        </div>

        {/* Add Review Modal */}
        {showAddReview && (
            <AddReview
              companyId={company._id}
              onAddReview={handleAddReview}
              onClose={handleCloseAddReview}
            />
        )}
      </main>
    </div>
  );
};

export default DetailReview;

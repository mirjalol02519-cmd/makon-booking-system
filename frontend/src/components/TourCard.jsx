import React from 'react';
import { getImageUrl } from '../config';

const styles = `
  .tour-card {
    width: 100%;
    background: #1A1A22;
    border: 1px solid #2A2A35;
    border-radius: 24px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s, box-shadow 0.25s;
    display: flex;
    flex-direction: column;
  }

  .tour-card:hover {
    transform: translateY(-4px);
    border-color: rgba(200, 169, 110, 0.3);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }

  .tour-card:active {
    transform: translateY(-2px) scale(0.99);
  }

  .tour-card-media {
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;
    background: #22222E;
  }

  .tour-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .tour-card:hover .tour-card-img {
    transform: scale(1.05);
  }

  .tour-card-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: #4A4A55;
  }

  .tour-card-badge {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(13, 13, 18, 0.75);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #F0EDE6;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .tour-card-info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex-grow: 1;
  }

  .tour-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #F0EDE6;
    line-height: 1.4;
    margin: 0;
    /* Matn 2 qatordan oshsa "..." qilish */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 44px; 
  }

  .tour-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #2A2A35;
    padding-top: 12px;
    margin-top: auto;
  }

  .tour-card-price-box {
    display: flex;
    flex-direction: column;
  }

  .tour-card-price-label {
    font-size: 10px;
    color: #6A6A72;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }

  .tour-card-price {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #C8A96E;
  }
`;

function TourCard({ tour, onClick }) {
  const imgUrl = getImageUrl(tour.image);

  return (
    <>
      <style>{styles}</style>
      <div className="tour-card" onClick={onClick}>
        
        {/* Media qismi (Rasm yoki Placeholder) */}
        <div className="tour-card-media">
          {imgUrl ? (
            <img 
              src={imgUrl} 
              alt={tour.title} 
              className="tour-card-img" 
              loading="lazy" 
            />
          ) : (
            <div className="tour-card-placeholder">🏔</div>
          )}
          
          {/* Davomiylik badji rasm ustida chiroyli turishi uchun */}
          <div className="tour-card-badge">
            ⏱ {tour.duration_days} kun
          </div>
        </div>
        
        {/* Ma'lumotlar qismi */}
        <div className="tour-card-info">
          <h3 className="tour-card-title" title={tour.title}>
            {tour.title}
          </h3>
          
          <div className="tour-card-footer">
            <div className="tour-card-price-box">
              <span className="tour-card-price-label">Narxi</span>
              <span className="tour-card-price">
                {tour.price ? Number(tour.price).toLocaleString('uz-UZ') : 0} so'm
              </span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default TourCard;
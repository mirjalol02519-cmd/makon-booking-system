import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTourDetail } from '../api';
import { getImageUrl } from '../config';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=DM+Sans:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .td-root {
    font-family: 'DM Sans', sans-serif;
    background: #0D0D12;
    min-height: 100vh;
    color: #F0EDE6;
    max-width: 430px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
  }

  .td-hero {
    position: relative;
    height: 300px;
    overflow: hidden;
  }

  .td-hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .td-hero-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1E2030, #2A2040);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 72px;
  }

  .td-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(13,13,18,0.5) 0%,
      transparent 40%,
      rgba(13,13,18,0.95) 100%
    );
  }

  .td-back {
    position: absolute;
    top: 16px;
    left: 16px;
    width: 38px;
    height: 38px;
    background: rgba(13,13,18,0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
  }

  .td-fav {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 38px;
    height: 38px;
    background: rgba(13,13,18,0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    font-size: 18px;
  }

  .td-hero-bottom {
    position: absolute;
    bottom: 16px;
    left: 16px;
    right: 16px;
  }

  .td-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(200,169,110,0.2);
    border: 1px solid rgba(200,169,110,0.4);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 11px;
    color: #C8A96E;
    margin-bottom: 8px;
    backdrop-filter: blur(4px);
  }

  .td-hero-title {
    font-family: 'Sora', sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: #F0EDE6;
    line-height: 1.3;
  }

  .td-body {
    padding: 20px 20px 120px;
  }

  .td-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 24px;
  }

  .td-stat {
    background: #1A1A22;
    border: 1px solid #2A2A35;
    border-radius: 14px;
    padding: 14px 10px;
    text-align: center;
  }

  .td-stat-icon {
    font-size: 20px;
    margin-bottom: 6px;
    display: block;
  }

  .td-stat-value {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #F0EDE6;
    display: block;
  }

  .td-stat-label {
    font-size: 11px;
    color: #6A6A72;
    display: block;
    margin-top: 2px;
  }

  .td-section {
    margin-bottom: 24px;
  }

  .td-section-title {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #F0EDE6;
    margin-bottom: 10px;
  }

  .td-desc {
    font-size: 14px;
    color: #9A9A9A;
    line-height: 1.7;
    white-space: pre-line;
  }

  .td-includes {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .td-include-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #1A1A22;
    border: 1px solid #2A2A35;
    border-radius: 12px;
    padding: 12px;
    font-size: 13px;
    color: #C0C0C8;
  }

  .td-include-icon {
    width: 32px;
    height: 32px;
    background: rgba(200,169,110,0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .td-divider {
    height: 1px;
    background: #2A2A35;
    margin: 24px 0;
  }

  .td-price-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .td-price-label {
    font-size: 12px;
    color: #6A6A72;
    margin-bottom: 4px;
  }

  .td-price-value {
    font-family: 'Sora', sans-serif;
    font-size: 26px;
    font-weight: 600;
    color: #C8A96E;
  }

  .td-price-per {
    font-size: 13px;
    color: #6A6A72;
    font-weight: 400;
  }

  .td-availability {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #4CAF82;
  }

  .td-avail-dot {
    width: 7px;
    height: 7px;
    background: #4CAF82;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .td-footer {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    background: rgba(13,13,18,0.97);
    backdrop-filter: blur(20px);
    border-top: 1px solid #2A2A35;
    padding: 16px 20px 28px;
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .td-price-footer {
    flex: 1;
  }

  .td-price-footer-label {
    font-size: 11px;
    color: #6A6A72;
  }

  .td-price-footer-value {
    font-family: 'Sora', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #C8A96E;
  }

  .td-book-btn {
    flex: 2;
    background: linear-gradient(135deg, #C8A96E, #9B7B3F);
    color: #0D0D12;
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    border: none;
    border-radius: 14px;
    padding: 16px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .td-book-btn:active {
    opacity: 0.85;
    transform: scale(0.97);
  }

  .td-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 16px;
  }

  .td-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #2A2A35;
    border-top-color: #C8A96E;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;


function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    getTourDetail(id)
      .then(res => setTour(res.data))
      .catch(console.error);
  }, [id]);

  if (!tour) return (
    <>
      <style>{styles}</style>
      <div className="td-root">
        <div className="td-loading">
          <div className="td-spinner"></div>
          <span style={{color:'#5A5A65', fontSize:'13px'}}>Yuklanmoqda...</span>
        </div>
      </div>
    </>
  );


  const imageUrl = getImageUrl(tour.image);

  return (
    <>
      <style>{styles}</style>
      <div className="td-root">

        {/* Hero */}
        <div className="td-hero">
          {imageUrl
            ? <img src={imageUrl} alt={tour.title} className="td-hero-img" />
            : <div className="td-hero-placeholder">🏔</div>
          }
          <div className="td-hero-overlay" />

          <div className="td-back" onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F0EDE6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </div>

          <div className="td-fav" onClick={() => setLiked(!liked)}>
            {liked ? '❤️' : '🤍'}
          </div>

          <div className="td-hero-bottom">
            <div className="td-badge">⭐ Top tur</div>
            <div className="td-hero-title">{tour.title}</div>
          </div>
        </div>

        {/* Body */}
        <div className="td-body">

          {/* Stats */}
          <div className="td-stats">
            <div className="td-stat">
              <span className="td-stat-icon">🕐</span>
              <span className="td-stat-value">{tour.duration_days} kun</span>
              <span className="td-stat-label">Davomiyligi</span>
            </div>
            <div className="td-stat">
              <span className="td-stat-icon">👥</span>
              <span className="td-stat-value">{tour.max_people} kishi</span>
              <span className="td-stat-label">Max guruh</span>
            </div>
            <div className="td-stat">
              <span className="td-stat-icon">📍</span>
              <span className="td-stat-value">O'zbekiston</span>
              <span className="td-stat-label">Yo'nalish</span>
            </div>
          </div>

          {/* Description */}
          <div className="td-section">
            <div className="td-section-title">Tavsif</div>
            <div className="td-desc">
              {tour.description || "Tur haqida ma'lumot yo'q."}
            </div>
          </div>

          <div className="td-divider" />

          {tour.includes && tour.includes.length > 0 && (
            <>
              <div className="td-divider" />
              <div className="td-section">
                <div className="td-section-title">Nimalar kiritilgan?</div>
                <div className="td-includes">
                  {tour.includes.map((item, i) => (
                    <div key={i} className="td-include-item">
                      <div className="td-include-icon">{item.icon}</div>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="td-divider" />

          <div className="td-divider" />

          {/* Price + availability */}
          <div className="td-price-row">
            <div>
              <div className="td-price-label">Narx</div>
              <div className="td-price-value">
                {Number(tour.price).toLocaleString('uz-UZ')} so'm
                <span className="td-price-per"> / kishi</span>
              </div>
            </div>
            <div className="td-availability">
              <div className="td-avail-dot"></div>
              Mavjud
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="td-footer">
          <div className="td-price-footer">
            <div className="td-price-footer-label">Jami narx</div>
            <div className="td-price-footer-value">
              {Number(tour.price).toLocaleString('uz-UZ')} so'm
            </div>
          </div>
          <button
            className="td-book-btn"
            onClick={() => navigate(`/booking/${tour.id}`)}
          >
            📋 Joy bron qilish
          </button>
        </div>

      </div>
    </>
  );
}

export default TourDetail;
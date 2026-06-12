import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTours } from '../api';
import { getImageUrl } from '../config';

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .tl-root {
    font-family: 'DM Sans', sans-serif;
    background: #0D0D12;
    min-height: 100vh;
    color: #F0EDE6;
    max-width: 430px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .tl-header {
    padding: 20px 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tl-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tl-logo-img {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    object-fit: cover;
    background: #1A1A22;
    border: 1px solid #2A2A35;
  }

  .tl-logo-fallback {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, #C8A96E, #9B7B3F);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: bold;
    color: #0D0D12;
    font-family: 'Sora', sans-serif;
    border: 1px solid #2A2A35;
  }

  .tl-logo-text {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #F0EDE6;
    line-height: 1.2;
  }

  .tl-logo-sub {
    font-size: 11px;
    color: #8A8580;
    font-weight: 400;
  }

  .tl-notif {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #1A1A22;
    border: 1px solid #2A2A35;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
  }

  .tl-notif-dot {
    width: 8px;
    height: 8px;
    background: #C8A96E;
    border-radius: 50%;
    position: absolute;
    top: 7px;
    right: 7px;
    border: 2px solid #0D0D12;
  }

  .tl-greeting {
    padding: 20px 20px 0;
  }

  .tl-greeting h1 {
    font-family: 'Sora', sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: #F0EDE6;
    line-height: 1.3;
  }

  .tl-greeting p {
    font-size: 13px;
    color: #8A8580;
    margin-top: 4px;
  }

  .tl-search {
    margin: 16px 20px 0;
    position: relative;
  }

  .tl-search input {
    width: 100%;
    background: #1A1A22;
    border: 1px solid #2A2A35;
    border-radius: 12px;
    padding: 12px 16px 12px 44px;
    font-size: 14px;
    color: #F0EDE6;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }

  .tl-search input::placeholder { color: #5A5A65; }
  .tl-search input:focus { border-color: #C8A96E; }

  .tl-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #5A5A65;
    font-size: 18px;
  }

  .tl-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 20px 14px;
  }

  .tl-section-title {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #F0EDE6;
  }

  .tl-see-all {
    font-size: 13px;
    color: #C8A96E;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }

  .tl-featured-vertical-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 0 20px 120px;
    width: 100%;
  }

  .tl-featured-card {
    width: 100%;
    max-width: 390px;
    height: 280px;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .tl-featured-card:active { transform: scale(0.97); }

  .tl-featured-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .tl-featured-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1E2030, #2A2040);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
  }

  .tl-featured-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 60px 18px 18px;
    background: linear-gradient(transparent, rgba(10,10,16,0.95));
  }

  .tl-featured-badge {
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
    font-weight: 500;
  }

  .tl-featured-name {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #F0EDE6;
    line-height: 1.3;
    margin-bottom: 8px;
  }

  .tl-featured-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tl-featured-price {
    font-size: 16px;
    font-weight: 600;
    color: #C8A96E;
    font-family: 'Sora', sans-serif;
  }

  .tl-featured-duration {
    font-size: 12px;
    color: #A0A0A8;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .tl-list {
    padding: 0 20px 120px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .tl-card {
    background: #1A1A22;
    border: 1px solid #2A2A35;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    gap: 0;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.15s;
    position: relative;
  }

  .tl-card:active { transform: scale(0.98); }
  .tl-card:hover { border-color: #3A3A48; }

  .tl-card-img {
    width: 100px;
    height: 110px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .tl-card-img-placeholder {
    width: 100px;
    height: 110px;
    background: linear-gradient(135deg, #22222E, #2E2E3E);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
  }

  .tl-card-body {
    padding: 14px 14px 14px 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .tl-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #F0EDE6;
    line-height: 1.3;
    margin-bottom: 6px;
  }

  .tl-card-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }

  .tl-tag {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 20px;
    background: #22222E;
    color: #8A8590;
    border: 1px solid #2E2E3C;
  }

  .tl-card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tl-card-price {
    font-size: 15px;
    font-weight: 600;
    color: #C8A96E;
    font-family: 'Sora', sans-serif;
  }

  .tl-card-price span {
    font-size: 11px;
    font-weight: 400;
    color: #6A6A72;
  }

  .tl-card-btn {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(200,169,110,0.15);
    border: 1px solid rgba(200,169,110,0.3);
    color: #C8A96E;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .tl-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    background: rgba(13,13,18,0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid #2A2A35;
    display: flex;
    padding: 10px 0 20px;
    z-index: 100;
  }

  .tl-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    padding: 4px 0;
  }

  .tl-nav-icon {
    font-size: 22px;
    color: #5A5A65;
    transition: color 0.2s;
  }

  .tl-nav-item.active .tl-nav-icon { color: #C8A96E; }

  .tl-nav-label {
    font-size: 10px;
    color: #5A5A65;
    transition: color 0.2s;
  }

  .tl-nav-item.active .tl-nav-label { color: #C8A96E; }

  .tl-nav-dot {
    width: 4px;
    height: 4px;
    background: #C8A96E;
    border-radius: 50%;
    margin-top: -2px;
  }

  .tl-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    gap: 16px;
  }

  .tl-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #2A2A35;
    border-top-color: #C8A96E;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .tl-empty {
    text-align: center;
    padding: 60px 20px;
    color: #5A5A65;
    font-size: 14px;
  }

  .tl-empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
    display: block;
  }
`;

function formatPrice(price) {
  return Number(price).toLocaleString('uz-UZ') + " so'm";
}

function TourList() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [logoError, setLogoError] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    getTours()
      .then(res => setTours(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = tours.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered.slice(0, 3);
  const list = filtered.slice(3);

  return (
    <>
      <style>{styles}</style>
      <div className="tl-root">

        {/* Header */}
        <div className="tl-header">
          <div className="tl-logo">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="Makon Trip" 
                className="tl-logo-img" 
                onError={() => setLogoError(true)} 
              />
            ) : (
              <div className="tl-logo-fallback">MT</div>
            )}
            
            <div>
              <div className="tl-logo-text">Makon Trip</div>
              <div className="tl-logo-sub">Tanlang, biz bilan sayohat qiling</div>
            </div>
          </div>
  
          <div className="tl-notif">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A8580" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div className="tl-notif-dot"></div>
          </div>
        </div>

        {/* Greeting */}
        <div className="tl-greeting">
          <h1>Mashxur turlar 🌍</h1>
          <p>Sizga eng yaxshi marshrutlarni topamiz</p>
        </div>

        {/* Search */}
        <div className="tl-search">
          <svg className="tl-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="tl-loading">
            <div className="tl-spinner"></div>
            <span style={{color:'#5A5A65', fontSize:'13px'}}>Yuklanmoqda...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="tl-empty">
            <span className="tl-empty-icon">🔍</span>
            Hech narsa topilmadi
          </div>
        ) : (
          <>
            {/* Featured vertical centered list */}
            {featured.length > 0 && (
              <>
                <div className="tl-section-header">
                  <span className="tl-section-title">Tavsiya etilgan</span>
                  <button className="tl-see-all">Barchasi →</button>
                </div>
                <div className="tl-featured-vertical-list">
                  {featured.map(tour => {
                    const featuredImg = getImageUrl(tour.image);
                    
                    return (
                      <div
                        key={tour.id}
                        className="tl-featured-card"
                        onClick={() => navigate(`/tour/${tour.id}`)}
                      >
                        {featuredImg
                          ? <img 
                              src={featuredImg} 
                              alt={tour.title} 
                              className="tl-featured-img" 
                            />
                          : <div className="tl-featured-placeholder">🏞</div>
                        }
                        <div className="tl-featured-overlay">
                          <div className="tl-featured-badge">⭐ Top tur</div>
                          <div className="tl-featured-name">{tour.title}</div>
                          <div className="tl-featured-meta">
                            <div className="tl-featured-price">{formatPrice(tour.price)}</div>
                            <div className="tl-featured-duration">🕐 {tour.duration_days} kun</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* List */}
            {list.length > 0 && (
              <>
                <div className="tl-section-header">
                  <span className="tl-section-title">Barcha turlar</span>
                </div>
                <div className="tl-list">
                  {list.map(tour => {
                    const cardImg = getImageUrl(tour.image);

                    return (
                      <div
                        key={tour.id}
                        className="tl-card"
                        onClick={() => navigate(`/tour/${tour.id}`)}
                      >
                        {cardImg
                          ? <img src={cardImg} alt={tour.title} className="tl-card-img" />
                          : <div className="tl-card-img-placeholder">🏞</div>
                        }
                        <div className="tl-card-body">
                          <div>
                            <div className="tl-card-title">{tour.title}</div>
                            <div className="tl-card-tags">
                              <span className="tl-tag">🕐 {tour.duration_days} kun</span>
                              <span className="tl-tag">👥 {tour.max_people} kishi</span>
                            </div>
                          </div>
                          <div className="tl-card-bottom">
                            <div className="tl-card-price">
                              {formatPrice(tour.price)} <span>/ kishi</span>
                            </div>
                            <div className="tl-card-btn">→</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* Bottom Nav */}
        <nav className="tl-bottom-nav">
          {[
            { icon: '🏠', label: 'Asosiy', active: true, onClick: () => navigate('/') },
            { icon: '🌍', label: 'Turlar', active: false, onClick: () => navigate('/') },
            { icon: '📋', label: 'Bronlar', active: false, onClick: () => navigate('/my-bookings') },
            { icon: '👤', label: 'Profil', active: false, onClick: () => navigate('/profile') },
          ].map((item, i) => (
            <div
              key={i}
              className={`tl-nav-item ${item.active ? 'active' : ''}`}
              onClick={item.onClick}
            >
              <span className="tl-nav-icon">{item.icon}</span>
              <span className="tl-nav-label">{item.label}</span>
              {item.active && <div className="tl-nav-dot"></div>}
            </div>
          ))}
        </nav>

      </div>
    </>
  );
}

export default TourList;
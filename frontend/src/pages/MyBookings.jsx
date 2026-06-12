import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, getImageUrl } from '../config';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=DM+Sans:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .mb-root {
    font-family: 'DM Sans', sans-serif;
    background: #0D0D12;
    min-height: 100vh;
    color: #F0EDE6;
    max-width: 430px;
    margin: 0 auto;
  }

  .mb-header {
    padding: 20px 20px 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mb-back {
    width: 38px;
    height: 38px;
    background: #1A1A22;
    border: 1px solid #2A2A35;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  .mb-title {
    font-family: 'Sora', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #F0EDE6;
  }

  /* TABS */
  .mb-tabs {
    display: flex;
    gap: 8px;
    padding: 20px 20px 0;
  }

  .mb-tab {
    flex: 1;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #2A2A35;
    background: #1A1A22;
    color: #6A6A72;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
  }

  .mb-tab.active {
    background: rgba(200,169,110,0.15);
    border-color: rgba(200,169,110,0.4);
    color: #C8A96E;
    font-weight: 500;
  }

  /* LIST */
  .mb-list {
    padding: 16px 20px 100px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mb-card {
    background: #1A1A22;
    border: 1px solid #2A2A35;
    border-radius: 16px;
    overflow: hidden;
    transition: border-color 0.2s;
  }

  .mb-card-top {
    display: flex;
    gap: 12px;
    padding: 14px;
    align-items: center;
  }

  .mb-card-img {
    width: 70px;
    height: 70px;
    border-radius: 12px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .mb-card-placeholder {
    width: 70px;
    height: 70px;
    border-radius: 12px;
    background: #22222E;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    flex-shrink: 0;
  }

  .mb-card-info {
    flex: 1;
  }

  .mb-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #F0EDE6;
    margin-bottom: 6px;
  }

  .mb-card-meta {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .mb-meta-item {
    font-size: 12px;
    color: #7A7A82;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .mb-card-bottom {
    border-top: 1px solid #1E1E28;
    padding: 12px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mb-card-price {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #C8A96E;
  }

  .mb-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }

  .mb-status.pending {
    background: rgba(255,180,50,0.12);
    color: #FFB432;
    border: 1px solid rgba(255,180,50,0.25);
  }

  .mb-status.paid, .mb-status.confirmed {
    background: rgba(76,175,130,0.12);
    color: #4CAF82;
    border: 1px solid rgba(76,175,130,0.25);
  }

  .mb-status.cancelled {
    background: rgba(255,80,80,0.1);
    color: #FF6060;
    border: 1px solid rgba(255,80,80,0.2);
  }

  /* EMPTY */
  .mb-empty {
    text-align: center;
    padding: 80px 20px;
  }

  .mb-empty-icon {
    font-size: 56px;
    display: block;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .mb-empty-title {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #4A4A55;
    margin-bottom: 8px;
  }

  .mb-empty-sub {
    font-size: 13px;
    color: #3A3A45;
    margin-bottom: 24px;
  }

  .mb-empty-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(200,169,110,0.15);
    border: 1px solid rgba(200,169,110,0.3);
    color: #C8A96E;
    border-radius: 12px;
    padding: 12px 24px;
    font-size: 14px;
    font-family: 'Sora', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  /* LOADING */
  .mb-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    gap: 16px;
  }

  .mb-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #2A2A35;
    border-top-color: #C8A96E;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* BOTTOM NAV */
  .mb-bottom-nav {
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

  .mb-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    padding: 4px 0;
  }

  .mb-nav-icon { font-size: 22px; color: #5A5A65; }
  .mb-nav-label { font-size: 10px; color: #5A5A65; }
  .mb-nav-item.active .mb-nav-icon { color: #C8A96E; }
  .mb-nav-item.active .mb-nav-label { color: #C8A96E; }
  .mb-nav-dot {
    width: 4px; height: 4px;
    background: #C8A96E;
    border-radius: 50%;
    margin-top: -2px;
  }
`;


const STATUS_MAP = {
  pending:   { label: 'Kutilmoqda', dot: '🟡' },
  confirmed: { label: 'Tasdiqlandi', dot: '🟢' },
  paid:      { label: 'To\'langan', dot: '🟢' },
  cancelled: { label: 'Bekor qilindi', dot: '🔴' },
};

const TABS = ['Faol', "O'tgan", 'Bekor qilingan'];

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const tg = window.Telegram?.WebApp;
  const telegramId = tg?.initDataUnsafe?.user?.id || "7449826129";

  useEffect(() => {
    const baseUrl = getApiUrl();
    
    axios.get(`${baseUrl}/api/bookings/my/?telegram_id=${telegramId}`)
      .then(res => setBookings(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [telegramId]);


  const filtered = bookings.filter(b => {
    const status = b.status ? b.status.toLowerCase() : 'pending';

    if (activeTab === 0) {
      return status === 'pending' || status === 'confirmed' || status === 'paid';
    }
    if (activeTab === 1) {
      return status === 'completed'; 
    }
    return status === 'cancelled';
  });

  return (
    <>
      <style>{styles}</style>
      <div className="mb-root">

        {/* Header */}
        <div className="mb-header">
          <div className="mb-back" onClick={() => navigate('/')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F0EDE6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </div>
          <div className="mb-title">Mening bronlarim</div>
        </div>

        {/* Tabs */}
        <div className="mb-tabs">
          {TABS.map((tab, i) => (
            <div
              key={i}
              className={`mb-tab ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="mb-loading">
            <div className="mb-spinner" />
            <span style={{color:'#5A5A65', fontSize:'13px'}}>Yuklanmoqda...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mb-empty">
            <span className="mb-empty-icon">📋</span>
            <div className="mb-empty-title">Bronlar yo'q</div>
            <div className="mb-empty-sub">Hali hech qanday tur bronlanmagan</div>
            <div className="mb-empty-btn" onClick={() => navigate('/')}>
              🌍 Turlarni ko'rish
            </div>
          </div>
        ) : (
          <div className="mb-list">
            {filtered.map(booking => {
              // 💡 TO'G'RILANDI: Kichik harfga o'girib xavfsiz tarzda status ma'lumotlarini map qilamiz
              const currentStatusStr = booking.status ? booking.status.toLowerCase() : 'pending';
              const statusInfo = STATUS_MAP[currentStatusStr] || STATUS_MAP.pending;
              
              const imgUrl = getImageUrl(booking.tour_image);

              return (
                <div key={booking.id} className="mb-card">
                  <div className="mb-card-top">
                    {imgUrl
                      ? <img src={imgUrl} alt={booking.tour_title} className="mb-card-img" />
                      : <div className="mb-card-placeholder">🏔</div>
                    }
                    <div className="mb-card-info">
                      <div className="mb-card-title">{booking.tour_title}</div>
                      <div className="mb-card-meta">
                        <span className="mb-meta-item">👥 {booking.people_count} kishi</span>
                        <span className="mb-meta-item">📅 {new Date(booking.created_at).toLocaleDateString('uz-UZ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-card-bottom">
                    <div className="mb-card-price">
                      {Number(booking.total_price).toLocaleString('uz-UZ')} so'm
                    </div>
                    <div className={`mb-status ${currentStatusStr}`}>
                      {statusInfo.dot} {statusInfo.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Nav */}
        <nav className="mb-bottom-nav">
          {[
            { icon: '🏠', label: 'Asosiy', path: '/' },
            { icon: '🌍', label: 'Turlar', path: '/' },
            { icon: '📋', label: 'Bronlar', active: true },
            { icon: '👤', label: 'Profil', path: '/profile' },
          ].map((item, i) => (
            <div
              key={i}
              className={`mb-nav-item ${item.active ? 'active' : ''}`}
              onClick={() => item.path && navigate(item.path)}
            >
              <span className="mb-nav-icon">{item.icon}</span>
              <span className="mb-nav-label">{item.label}</span>
              {item.active && <div className="mb-nav-dot" />}
            </div>
          ))}
        </nav>

      </div>
    </>
  );
}

export default MyBookings;
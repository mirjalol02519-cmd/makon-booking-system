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
    padding-bottom: 120px;
  }

  .mb-container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 0 20px;
  }

  .mb-header {
    padding: 24px 0 12px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .mb-back {
    width: 40px;
    height: 40px;
    background: #1A1A22;
    border: 1px solid #2A2A35;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .mb-back:hover { background: #22222D; }

  .mb-title {
    font-family: 'Sora', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #F0EDE6;
  }

  /* TABS */
  .mb-tabs {
    display: flex;
    gap: 10px;
    padding: 12px 0 24px;
    max-width: 500px;
  }

  .mb-tab {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #2A2A35;
    background: #1A1A22;
    color: #6A6A72;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    font-weight: 500;
  }
  .mb-tab:hover { border-color: #3A3A45; color: #9A9A9A; }

  .mb-tab.active {
    background: rgba(200,169,110,0.15);
    border-color: rgba(200,169,110,0.4);
    color: #C8A96E;
  }

  /* LIST GRID */
  .mb-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .mb-card {
    background: #1A1A22;
    border: 1px solid #2A2A35;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: border-color 0.2s, transform 0.2s;
  }
  .mb-card:hover { border-color: #3A3A45; }

  .mb-card-top {
    display: flex;
    gap: 14px;
    padding: 16px;
    align-items: center;
  }

  .mb-card-img {
    width: 74px;
    height: 74px;
    border-radius: 12px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .mb-card-placeholder {
    width: 74px;
    height: 74px;
    border-radius: 12px;
    background: #22222E;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    flex-shrink: 0;
  }

  .mb-card-info { flex: 1; min-width: 0; }
  .mb-card-title {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #F0EDE6;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mb-card-meta { display: flex; gap: 12px; flex-wrap: wrap; }
  .mb-meta-item { font-size: 12px; color: #7A7A82; display: flex; align-items: center; gap: 4px; }

  .mb-card-bottom {
    border-top: 1px solid #2A2A35;
    padding: 14px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(13,13,18,0.2);
  }

  .mb-card-price { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; color: #C8A96E; }
  .mb-status { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; }

  .mb-status.pending { background: rgba(255,180,50,0.1); color: #FFB432; border: 1px solid rgba(255,180,50,0.2); }
  .mb-status.paid, .mb-status.confirmed { background: rgba(76,175,130,0.1); color: #4CAF82; border: 1px solid rgba(76,175,130,0.2); }
  .mb-status.completed { background: rgba(200,169,110,0.1); color: #C8A96E; border: 1px solid rgba(200,169,110,0.2); }
  .mb-status.cancelled { background: rgba(255,80,80,0.08); color: #FF6060; border: 1px solid rgba(255,80,80,0.15); }

  /* EMPTY */
  .mb-empty { text-align: center; padding: 100px 20px; }
  .mb-empty-icon { font-size: 64px; display: block; margin-bottom: 16px; opacity: 0.5; }
  .mb-empty-title { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 600; color: #6A6A72; margin-bottom: 8px; }
  .mb-empty-sub { font-size: 14px; color: #4A4A55; margin-bottom: 24px; }
  .mb-empty-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(200,169,110,0.15);
    border: 1px solid rgba(200,169,110,0.3);
    color: #C8A96E;
    border-radius: 14px;
    padding: 14px 28px;
    font-size: 14px;
    font-family: 'Sora', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .mb-empty-btn:hover { background: rgba(200,169,110,0.25); }

  /* LOADING */
  .mb-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 350px; gap: 16px; }
  .mb-spinner { width: 36px; height: 36px; border: 3px solid #2A2A35; border-top-color: #C8A96E; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* BOTTOM NAV */
  .mb-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    background: rgba(13,13,18,0.92);
    backdrop-filter: blur(20px);
    border-top: 1px solid #2A2A35;
    display: flex;
    padding: 12px 0 24px;
    z-index: 100;
  }

  .mb-nav-content { display: flex; width: 100%; max-width: 600px; margin: 0 auto; padding: 0 10px; }
  .mb-nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 4px 0; }
  .mb-nav-icon { font-size: 22px; color: #5A5A65; }
  .mb-nav-label { font-size: 11px; color: #5A5A65; font-weight: 500; }
  .mb-nav-item.active .mb-nav-icon { color: #C8A96E; }
  .mb-nav-item.active .mb-nav-label { color: #C8A96E; }
  .mb-nav-dot { width: 4px; height: 4px; background: #C8A96E; border-radius: 50%; margin-top: -2px; }

  @media (min-width: 576px) {
    .mb-list { grid-template-columns: repeat(2, 1fr); }
  }

  @media (min-width: 992px) {
    .mb-list { grid-template-columns: repeat(3, 1fr); }
  }
`;

const STATUS_MAP = {
  pending:   { label: 'Kutilmoqda', dot: '🟡' },
  confirmed: { label: 'Tasdiqlandi', dot: '🟢' },
  paid:      { label: 'To\'langan', dot: '🟢' },
  completed: { label: 'Tugallangan', dot: '✨' },
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString('uz-UZ');
  };

  return (
    <>
      <style>{styles}</style>
      <div className="mb-root">
        <div className="mb-container">

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
                        <div className="mb-card-title" title={booking.tour_title}>
                          {booking.tour_title}
                        </div>
                        <div className="mb-card-meta">
                          <span className="mb-meta-item">👥 {booking.people_count} kishi</span>
                          {booking.created_at && (
                            <span className="mb-meta-item">
                              📅 {formatDate(booking.created_at)}
                            </span>
                          )}
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

        </div>

        {/* Bottom Nav */}
        <nav className="mb-bottom-nav">
          <div className="mb-nav-content">
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
          </div>
        </nav>

      </div>
    </>
  );
}

export default MyBookings;
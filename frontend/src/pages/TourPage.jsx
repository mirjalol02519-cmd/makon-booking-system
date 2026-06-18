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

  .tl-logo { display: flex; align-items: center; gap: 12px; }
  .tl-logo-img { width: 42px; height: 42px; border-radius: 12px; object-fit: cover; background: #1A1A22; border: 1px solid #2A2A35; }
  .tl-logo-fallback { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #C8A96E, #9B7B3F); display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: bold; color: #0D0D12; border: 1px solid #2A2A35; }
  .tl-logo-text { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 600; color: #F0EDE6; line-height: 1.2; }
  .tl-logo-sub { font-size: 11px; color: #8A8580; }

  .tl-search { margin: 20px 20px 14px; position: relative; }
  .tl-search input { width: 100%; background: #1A1A22; border: 1px solid #2A2A35; border-radius: 12px; padding: 12px 16px 12px 44px; font-size: 14px; color: #F0EDE6; outline: none; }
  .tl-search input:focus { border-color: #C8A96E; }
  .tl-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #5A5A65; font-size: 18px; }

  .tl-list { padding: 0 20px 120px; display: flex; flex-direction: column; gap: 12px; }
  .tl-card { background: #1A1A22; border: 1px solid #2A2A35; border-radius: 16px; overflow: hidden; display: flex; cursor: pointer; transition: transform 0.15s; }
  .tl-card:active { transform: scale(0.98); }
  .tl-card-img { width: 100px; height: 110px; object-fit: cover; flex-shrink: 0; }
  .tl-card-img-placeholder { width: 100px; height: 110px; background: #22222E; display: flex; align-items: center; justify-content: center; font-size: 30px; }
  .tl-card-body { padding: 14px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
  .tl-card-title { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #F0EDE6; }
  .tl-card-tags { display: flex; gap: 6px; margin-top: 4px; }
  .tl-tag { font-size: 11px; padding: 2px 8px; border-radius: 20px; background: #22222E; color: #8A8590; }
  .tl-card-bottom { display: flex; align-items: center; justify-content: space-between; }
  .tl-card-price { font-size: 15px; font-weight: 600; color: #C8A96E; font-family: 'Sora', sans-serif; }
  .tl-card-price span { font-size: 11px; color: #6A6A72; }
  .tl-card-btn { width: 30px; height: 30px; border-radius: 8px; background: rgba(200,169,110,0.15); color: #C8A96E; display: flex; align-items: center; justify-content: center; }

  .tl-bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: rgba(13,13,18,0.95); backdrop-filter: blur(20px); border-top: 1px solid #2A2A35; display: flex; padding: 10px 0 20px; z-index: 100; }
  .tl-nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; }
  .tl-nav-icon { font-size: 22px; color: #5A5A65; }
  .tl-nav-item.active .tl-nav-icon { color: #C8A96E; }
  .tl-nav-label { font-size: 10px; color: #5A5A65; }
  .tl-nav-item.active .tl-nav-label { color: #C8A96E; }
  .tl-nav-dot { width: 4px; height: 4px; background: #C8A96E; border-radius: 50%; }
  
  .tl-loading { display: flex; justify-content: center; align-items: center; height: 200px; color: #5A5A65; gap: 10px; }
  .tl-spinner { width: 24px; height: 24px; border: 2px solid #2A2A35; border-top-color: #C8A96E; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function formatPrice(price) {
  return Number(price).toLocaleString('uz-UZ') + " so'm";
}

function ToursPage() {
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

  return (
    <>
      <style>{styles}</style>
      <div className="tl-root">
        {/* Header */}
        <div className="tl-header">
          <div className="tl-logo">
            {!logoError ? (
              <img src="/logo.png" alt="Makon Trip" className="tl-logo-img" onError={() => setLogoError(true)} />
            ) : (
              <div className="tl-logo-fallback">MT</div>
            )}
            <div>
              <div className="tl-logo-text">Makon Trip</div>
              <div className="tl-logo-sub">Barcha faol turlarimiz ro'yxati</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="tl-search">
          <svg className="tl-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Turlarni qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* List */}
        {loading ? (
          <div className="tl-loading"><div className="tl-spinner"></div>Yuklanmoqda...</div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center', padding:'40px', color:'#5A5A65'}}>Turlar topilmadi</div>
        ) : (
          <div className="tl-list">
            {filtered.map(tour => {
              const cardImg = getImageUrl(tour.image);
              return (
                <div key={tour.id} className="tl-card" onClick={() => navigate(`/tour/${tour.id}`)}>
                  {cardImg ? <img src={cardImg} alt={tour.title} className="tl-card-img" /> : <div className="tl-card-img-placeholder">🏞</div>}
                  <div className="tl-card-body">
                    <div>
                      <div className="tl-card-title">{tour.title}</div>
                      <div className="tl-card-tags">
                        <span className="tl-tag">🕐 {tour.duration_days} kun</span>
                        <span className="tl-tag">👥 {tour.max_people} kishi</span>
                      </div>
                    </div>
                    <div className="tl-card-bottom">
                      <div className="tl-card-price">{formatPrice(tour.price)} <span>/ kishi</span></div>
                      <div className="tl-card-btn">→</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Nav ("Turlar" faol qilingan) */}
        <nav className="tl-bottom-nav">
          {[
            { icon: '🏠', label: 'Asosiy', active: false, onClick: () => navigate('/') },
            { icon: '🌍', label: 'Turlar', active: true, onClick: () => navigate('/tours') },
            { icon: '📋', label: 'Bronlar', active: false, onClick: () => navigate('/my-bookings') },
            { icon: '👤', label: 'Profil', active: false, onClick: () => navigate('/profile') },
          ].map((item, i) => (
            <div key={i} className={`tl-nav-item ${item.active ? 'active' : ''}`} onClick={item.onClick}>
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

export default ToursPage;
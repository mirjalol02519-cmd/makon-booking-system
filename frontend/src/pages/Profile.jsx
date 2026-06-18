import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=DM+Sans:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pf-root {
    font-family: 'DM Sans', sans-serif;
    background: #0D0D12;
    min-height: 100vh;
    color: #F0EDE6;
    padding-bottom: 120px;
  }

  .pf-container {
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
    padding: 0 20px;
  }

  .pf-header {
    padding: 40px 20px;
    text-align: center;
    background: linear-gradient(180deg, #1A1A22 0%, #0D0D12 100%);
    border-bottom: 1px solid #2A2A35;
    border-radius: 0 0 24px 24px;
    margin-bottom: 24px;
  }

  .pf-avatar-container {
    position: relative;
    width: 96px;
    height: 96px;
    margin: 0 auto 16px;
  }

  .pf-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #C8A96E, #9B7B3F);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    font-weight: bold;
    color: #0D0D12;
    border: 2px solid #C8A96E;
    box-shadow: 0 8px 24px rgba(200, 169, 110, 0.15);
  }

  .pf-badge {
    position: absolute;
    bottom: -2px;
    right: -2px;
    background: #C8A96E;
    color: #0D0D12;
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 12px;
    font-weight: bold;
    border: 2px solid #0D0D12;
    letter-spacing: 0.5px;
  }

  .pf-name {
    font-family: 'Sora', sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: #F0EDE6;
  }

  .pf-phone {
    font-size: 14px;
    color: #6A6A72;
    margin-top: 6px;
  }

  .pf-menu {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pf-menu-item {
    background: #1A1A22;
    border: 1px solid #2A2A35;
    border-radius: 16px;
    padding: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }

  .pf-menu-item:hover {
    background: #22222D;
    border-color: #3A3A45;
  }

  .pf-menu-item:active { transform: scale(0.98); }

  .pf-menu-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .pf-menu-icon {
    font-size: 20px;
    width: 24px;
    display: flex;
    justify-content: center;
  }

  .pf-menu-text { font-size: 14px; font-weight: 500; color: #F0EDE6; }
  .pf-menu-sub { font-size: 13px; color: #6A6A72; }

  .tl-bottom-nav {
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

  .tl-nav-content {
    display: flex;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 0 10px;
  }

  .tl-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    padding: 4px 0;
    transition: opacity 0.2s;
  }

  .tl-nav-icon { font-size: 22px; color: #5A5A65; transition: color 0.2s; }
  .tl-nav-item.active .tl-nav-icon { color: #C8A96E; }
  .tl-nav-label { font-size: 11px; color: #5A5A65; font-weight: 500; transition: color 0.2s; }
  .tl-nav-item.active .tl-nav-label { color: #C8A96E; }
  .tl-nav-dot { width: 4px; height: 4px; background: #C8A96E; border-radius: 50%; margin-top: -2px; }

  @media (min-width: 768px) {
    .pf-header { border-radius: 24px; margin-top: 20px; }
  }
`;

export default function Profile() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: "Foydalanuvchi", 
    phone: "",
    isClubMember: true
  });

  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
      setUser(prev => ({
        ...prev,
        name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
        phone: tgUser.username ? `@${tgUser.username}` : prev.phone
      }));
    }
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="pf-root">
        <div className="pf-container">
          
          {/* Profile Header */}
          <div className="pf-header">
            <div className="pf-avatar-container">
              <div className="pf-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {user.isClubMember && <span className="pf-badge">CLUB</span>}
            </div>
            <div className="pf-name">{user.name}</div>
            {user.phone && <div className="pf-phone">{user.phone}</div>}
          </div>

          {/* Profile Menu */}
          <div className="pf-menu">
            
            {/* 1. Mening bronlarim */}
            <div className="pf-menu-item" onClick={() => navigate('/my-bookings')}>
              <div className="pf-menu-left">
                <span className="pf-menu-icon">📋</span>
                <span className="pf-menu-text">Mening bronlarim</span>
              </div>
              <span className="pf-menu-sub">Tarix →</span>
            </div>

            {/* 2. Makon Club */}
            <div className="pf-menu-item">
              <div className="pf-menu-left">
                <span className="pf-menu-icon">🎖️</span>
                <span className="pf-menu-text">Makon Club a'zoligi</span>
              </div>
              <span style={{color: '#C8A96E', fontSize: '13px', fontWeight: '600'}}>Faol</span>
            </div>

            {/* 3. Qo'llab-quvvatlash */}
            <div className="pf-menu-item" onClick={() => window.open('https://t.me/makontrip_admin', '_blank')}>
              <div className="pf-menu-left">
                <span className="pf-menu-icon">💬</span>
                <span className="pf-menu-text">Qo'llab-quvvatlash / Aloqa</span>
              </div>
              <span className="pf-menu-sub">→</span>
            </div>
            
            {/* 4. Ilovani yopish */}
            <div className="pf-menu-item" style={{borderColor: 'rgba(255, 90, 90, 0.2)', background: 'rgba(255, 90, 90, 0.03)'}} onClick={() => window.Telegram?.WebApp?.close()}>
              <div className="pf-menu-left">
                <span className="pf-menu-icon" style={{color: '#FF5A5A'}}>🚪</span>
                <span className="pf-menu-text" style={{color: '#FF5A5A', fontWeight: '600'}}>Ilovani yopish</span>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="tl-bottom-nav">
          <div className="tl-nav-content">
            {[
              { icon: '🏠', label: 'Asosiy', active: false, onClick: () => navigate('/') },
              { icon: '🌍', label: 'Turlar', active: false, onClick: () => navigate('/') },
              { icon: '📋', label: 'Bronlar', active: false, onClick: () => navigate('/my-bookings') },
              { icon: '👤', label: 'Profil', active: true, onClick: () => navigate('/profile') },
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
          </div>
        </nav>

      </div>
    </>
  );
}
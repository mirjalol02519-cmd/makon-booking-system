import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  .pf-root {
    font-family: 'DM Sans', sans-serif;
    background: #0D0D12;
    min-height: 100vh;
    color: #F0EDE6;
    max-width: 430px;
    margin: 0 auto;
    padding-bottom: 100px;
  }
  .pf-header {
    padding: 30px 20px;
    text-align: center;
    background: linear-gradient(180deg, #1A1A22 0%, #0D0D12 100%);
    border-bottom: 1px solid #2A2A35;
  }
  .pf-avatar-container {
    position: relative;
    width: 90px;
    height: 90px;
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
    font-size: 32px;
    font-weight: bold;
    color: #0D0D12;
    border: 2px solid #C8A96E;
  }
  .pf-badge {
    position: absolute;
    bottom: -5px;
    right: -5px;
    background: #C8A96E;
    color: #0D0D12;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: bold;
    border: 2px solid #0D0D12;
  }
  .pf-name {
    font-family: 'Sora', sans-serif;
    font-size: 20px;
    font-weight: 600;
  }
  .pf-phone {
    font-size: 13px;
    color: #8A8580;
    margin-top: 4px;
  }
  .pf-menu {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .pf-menu-item {
    background: #1A1A22;
    border: 1px solid #2A2A35;
    border-radius: 14px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.2s;
  }
  .pf-menu-item:active { transform: scale(0.98); }
  .pf-menu-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .pf-menu-icon { font-size: 20px; }
  .pf-menu-text { font-size: 14px; font-weight: 500; }
  .pf-menu-sub { font-size: 12px; color: #6A6A72; }
  
  /* Bottom Nav */
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
  .tl-nav-icon { font-size: 22px; color: #5A5A65; }
  .tl-nav-item.active .tl-nav-icon { color: #C8A96E; }
  .tl-nav-label { font-size: 10px; color: #5A5A65; }
  .tl-nav-item.active .tl-nav-label { color: #C8A96E; }
  .tl-nav-dot { width: 4px; height: 4px; background: #C8A96E; border-radius: 50%; margin-top: -2px; }
`;

export default function Profile() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: "Foydalanuvchi", 
    phone: "   ",
    isClubMember: true
  });

  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
      setUser(prev => ({
        ...prev,
        name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim()
      }));
    }
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="pf-root">
        
        {/* Profile Header */}
        <div className="pf-header">
          <div className="pf-avatar-container">
            <div className="pf-avatar">
              {user.name.charAt(0)}
            </div>
            {user.isClubMember && <span className="pf-badge">CLUB</span>}
          </div>
          <div className="pf-name">{user.name}</div>
          <div className="pf-phone">{user.phone}</div>
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
            <span style={{color: '#C8A96E', fontSize: '12px', fontWeight: 'bold'}}>Faol</span>
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
          <div className="pf-menu-item" style={{borderColor: '#352222'}} onClick={() => window.Telegram?.WebApp?.close()}>
            <div className="pf-menu-left">
              <span className="pf-menu-icon" style={{color: '#FF5A5A'}}>🚪</span>
              <span className="pf-menu-text" style={{color: '#FF5A5A'}}>Ilovani yopish</span>
            </div>
          </div>

        </div>

        {/* Navigation Bar */}
        <nav className="tl-bottom-nav">
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
        </nav>

      </div>
    </>
  );
}
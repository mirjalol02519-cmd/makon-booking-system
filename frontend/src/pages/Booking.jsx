import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTourDetail } from '../api';
import axios from 'axios';
import { getApiUrl, getImageUrl } from '../config';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=DM+Sans:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .bk-root {
    font-family: 'DM Sans', sans-serif;
    background: #0D0D12;
    min-height: 100vh;
    color: #F0EDE6;
    max-width: 430px;
    margin: 0 auto;
  }

  .bk-header {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #1E1E28;
  }

  .bk-back {
    width: 38px; height: 38px;
    background: #1A1A22;
    border: 1px solid #2A2A35;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0;
  }

  .bk-header-title {
    font-family: 'Sora', sans-serif;
    font-size: 16px; font-weight: 600; color: #F0EDE6;
  }

  /* STEPS */
  .bk-steps {
    display: flex; align-items: center;
    padding: 20px 20px 0; gap: 0;
  }

  .bk-step {
    display: flex; flex-direction: column;
    align-items: center; gap: 6px; flex: 1;
  }

  .bk-step-circle {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600;
    border: 2px solid #2A2A35; color: #5A5A65; background: #1A1A22;
    transition: all 0.3s;
  }

  .bk-step.active .bk-step-circle { background: #C8A96E; border-color: #C8A96E; color: #0D0D12; }
  .bk-step.done .bk-step-circle { background: rgba(200,169,110,0.15); border-color: #C8A96E; color: #C8A96E; }

  .bk-step-label { font-size: 10px; color: #5A5A65; transition: color 0.3s; white-space: nowrap; }
  .bk-step.active .bk-step-label { color: #C8A96E; }
  .bk-step.done .bk-step-label { color: #8A8A92; }

  .bk-step-line { height: 2px; flex: 1; background: #2A2A35; margin-bottom: 20px; transition: background 0.3s; }
  .bk-step-line.done { background: #C8A96E; }

  /* TOUR MINI CARD */
  .bk-tour-card {
    margin: 20px; background: #1A1A22;
    border: 1px solid #2A2A35; border-radius: 14px;
    display: flex; gap: 12px; padding: 12px; align-items: center;
  }

  .bk-tour-img { width: 60px; height: 60px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
  .bk-tour-placeholder {
    width: 60px; height: 60px; border-radius: 10px;
    background: #22222E; display: flex; align-items: center;
    justify-content: center; font-size: 24px; flex-shrink: 0;
  }

  .bk-tour-name { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 600; color: #F0EDE6; margin-bottom: 4px; }
  .bk-tour-price { font-size: 13px; color: #C8A96E; }

  /* CONTENT */
  .bk-content { padding: 0 20px 120px; }
  .bk-step-title { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 600; color: #F0EDE6; margin-bottom: 6px; margin-top: 8px; }
  .bk-step-sub { font-size: 13px; color: #6A6A72; margin-bottom: 24px; }

  /* PEOPLE COUNTER */
  .bk-people-counter {
    display: flex; align-items: center; justify-content: center;
    gap: 32px; background: #1A1A22; border: 1px solid #2A2A35;
    border-radius: 16px; padding: 24px; margin-bottom: 20px;
  }

  .bk-counter-btn {
    width: 48px; height: 48px; border-radius: 12px;
    border: 1px solid #3A3A45; background: #22222E;
    color: #F0EDE6; font-size: 22px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s; user-select: none;
  }

  .bk-counter-btn:active { background: #C8A96E; color: #0D0D12; border-color: #C8A96E; }
  .bk-counter-btn.disabled { opacity: 0.3; cursor: not-allowed; }
  .bk-counter-value { font-family: 'Sora', sans-serif; font-size: 42px; font-weight: 600; color: #F0EDE6; min-width: 60px; text-align: center; }

  .bk-summary-box { background: #1A1A22; border: 1px solid #2A2A35; border-radius: 14px; padding: 16px; }
  .bk-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 14px; }
  .bk-summary-row:not(:last-child) { border-bottom: 1px solid #1E1E28; }
  .bk-summary-label { color: #7A7A82; }
  .bk-summary-value { color: #F0EDE6; font-weight: 500; }
  .bk-summary-total { color: #C8A96E; font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 600; }

  .bk-discount-box {
    margin-top: 16px; background: rgba(200,169,110,0.05);
    border: 1px dashed rgba(200,169,110,0.3); border-radius: 12px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s;
  }
  .bk-discount-box:active { transform: scale(0.99); }
  .bk-discount-checkbox { width: 20px; height: 20px; accent-color: #C8A96E; cursor: pointer; }
  .bk-discount-text { font-size: 13px; color: #DCD8D0; font-weight: 500; }
  .bk-discount-badge { margin-left: auto; background: #C8A96E; color: #0D0D12; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 6px; }

  /* FORM */
  .bk-form { display: flex; flex-direction: column; gap: 14px; }
  .bk-field { display: flex; flex-direction: column; gap: 8px; }
  .bk-input {
    background: #1A1A22; border: 1px solid #2A2A35; border-radius: 12px;
    padding: 14px 16px; font-size: 14px; color: #F0EDE6;
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.2s; width: 100%;
  }
  .bk-input::placeholder { color: #4A4A55; }
  .bk-input:focus { border-color: #C8A96E; }

  /* PASSENGER CARD */
  .bk-passenger-card {
    background: #15151C; border: 1px dashed #2A2A35;
    border-radius: 12px; padding: 14px; margin-top: 6px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .bk-passenger-number { font-size: 12px; color: #C8A96E; font-weight: 600; }

  /* CONFIRM */
  .bk-confirm-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
  .bk-confirm-item {
    background: #1A1A22; border: 1px solid #2A2A35;
    border-radius: 14px; padding: 16px;
    display: flex; align-items: center; gap: 14px;
  }
  .bk-confirm-icon {
    width: 40px; height: 40px; background: rgba(200,169,110,0.1);
    border-radius: 10px; display: flex; align-items: center;
    justify-content: center; font-size: 18px; flex-shrink: 0;
  }
  .bk-confirm-label { font-size: 12px; color: #6A6A72; margin-bottom: 2px; }
  .bk-confirm-value { font-size: 14px; font-weight: 500; color: #F0EDE6; }

  .bk-total-box {
    background: rgba(200,169,110,0.08); border: 1px solid rgba(200,169,110,0.25);
    border-radius: 14px; padding: 16px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .bk-total-label { font-size: 13px; color: #9A9A9A; }
  .bk-total-value { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 600; color: #C8A96E; }

  /* PAYMENT STEP */
  .bk-payment-title { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 600; color: #F0EDE6; margin-bottom: 6px; margin-top: 8px; text-align: center; }
  .bk-payment-sub { font-size: 13px; color: #6A6A72; margin-bottom: 28px; text-align: center; }
  .bk-payment-amount {
    background: rgba(200,169,110,0.08); border: 1px solid rgba(200,169,110,0.2);
    border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 28px;
  }
  .bk-payment-amount-label { font-size: 12px; color: #7A7A82; margin-bottom: 6px; }
  .bk-payment-amount-value { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 600; color: #C8A96E; }
  .bk-payment-methods { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }

  .bk-pay-btn {
    display: flex; align-items: center; gap: 16px;
    background: #1A1A22; border: 1px solid #2A2A35;
    border-radius: 16px; padding: 18px 20px;
    cursor: pointer; transition: all 0.2s; width: 100%;
  }
  .bk-pay-btn:hover { border-color: #3A3A48; background: #1E1E28; }
  .bk-pay-btn:active { transform: scale(0.98); }

  .bk-pay-logo {
    width: 52px; height: 36px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 13px; flex-shrink: 0; letter-spacing: -0.5px;
  }
  .bk-pay-logo.click { background: linear-gradient(135deg, #00B4D8, #0077B6); color: white; }
  .bk-pay-logo.payme { background: linear-gradient(135deg, #00C78C, #00A86B); color: white; }

  .bk-pay-info { flex: 1; text-align: left; }
  .bk-pay-name { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600; color: #F0EDE6; margin-bottom: 3px; }
  .bk-pay-desc { font-size: 12px; color: #6A6A72; }

  /* SIMULYATSIYA */
  .bk-sim-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: #3A3A45; font-size: 12px; }
  .bk-sim-divider::before, .bk-sim-divider::after { content: ''; flex: 1; height: 1px; background: #2A2A35; }
  .bk-sim-btn {
    width: 100%; padding: 14px; background: rgba(255,180,50,0.08);
    border: 1px dashed rgba(255,180,50,0.3); border-radius: 14px; color: #FFB432;
    font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  /* PROCESSING & SUCCESS */
  .bk-processing { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 20px; padding: 40px; text-align: center; }
  .bk-processing-spinner { width: 60px; height: 60px; border: 4px solid #2A2A35; border-top-color: #C8A96E; border-radius: 50%; animation: spin 0.8s linear infinite; }
  .bk-processing h3 { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 600; color: #F0EDE6; }
  .bk-processing p { font-size: 13px; color: #6A6A72; line-height: 1.6; }

  .bk-success { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 40px 20px; text-align: center; }
  .bk-success-icon { width: 90px; height: 90px; background: rgba(76,175,130,0.15); border: 2px solid rgba(76,175,130,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 24px; animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

  @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  @keyframes spin { to { transform: rotate(360deg); } }

  .bk-success h2 { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 600; color: #F0EDE6; margin-bottom: 10px; }
  .bk-success p { font-size: 14px; color: #7A7A82; line-height: 1.6; margin-bottom: 12px; }
  .bk-success-details { background: #1A1A22; border: 1px solid #2A2A35; border-radius: 14px; padding: 16px; width: 100%; margin-bottom: 28px; }
  .bk-success-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; }
  .bk-success-row:not(:last-child) { border-bottom: 1px solid #1E1E28; }
  .bk-success-row-label { color: #7A7A82; }
  .bk-success-row-value { color: #F0EDE6; font-weight: 500; }

  /* FOOTER */
  .bk-footer {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 430px; background: rgba(13,13,18,0.97);
    backdrop-filter: blur(20px); border-top: 1px solid #2A2A35;
    padding: 16px 20px 28px; display: flex; gap: 10px; z-index: 10;
  }

  .bk-btn {
    flex: 1; border-radius: 14px; padding: 16px; font-family: 'Sora', sans-serif;
    font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: none;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .bk-btn:active { transform: scale(0.97); }
  .bk-btn-primary { background: linear-gradient(135deg, #C8A96E, #9B7B3F); color: #0D0D12; }
  .bk-btn-secondary { background: #1A1A22; border: 1px solid #2A2A35; color: #C0C0C8; flex: 0.6; }
  .bk-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .bk-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 16px; }
  .bk-spinner { width: 36px; height: 36px; border: 3px solid #2A2A35; border-top-color: #C8A96E; border-radius: 50%; animation: spin 0.8s linear infinite; }
`;

const STEPS = ["Kishi soni", "Ma'lumotlar", "Tasdiqlash", "To'lov"];

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tour, setTour] = useState(null);
  const [people, setPeople] = useState(1);
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paidWith, setPaidWith] = useState('');
  const [passengers, setPassengers] = useState([{ first_name: '', last_name: '', phone_number: '' }]);
  const [useDiscount, setUseDiscount] = useState(false);
  const [checkingGroup, setCheckingGroup] = useState(false);

  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    getTourDetail(id).then(res => setTour(res.data)).catch(console.error);
    
    if (tg?.initDataUnsafe?.user) {
      const u = tg.initDataUnsafe.user;
      setPassengers([{ 
        first_name: u.first_name || '', 
        last_name: u.last_name || '', 
        phone_number: '' 
      }]);
    }
  }, [id, tg]);

  const handlePeopleChange = (newPeopleCount) => {
    setPeople(newPeopleCount);
    const updated = Array.from({ length: newPeopleCount }, (_, i) => {
      return passengers[i] || { first_name: '', last_name: '', phone_number: '' };
    });
    setPassengers(updated);
  };

  const handlePassengerInput = (index, field, value) => {
    const updated = [...passengers];
    
    if (field === 'phone_number') {
      let input = value;
      if (!input.startsWith('+998 ')) {
        input = '+998 ';
      }
      let digits = input.substring(5).replace(/\D/g, '');
      if (digits.length > 9) digits = digits.substring(0, 9);

      let formatted = '+998 ';
      if (digits.length > 0) formatted += '(' + digits.substring(0, 2);
      if (digits.length >= 2) formatted += ') ';
      if (digits.length > 2) formatted += digits.substring(2, 5);
      if (digits.length >= 5) formatted += ' ';
      if (digits.length > 5) formatted += digits.substring(5, 7);
      if (digits.length >= 7) formatted += ' ';
      if (digits.length > 7) formatted += digits.substring(7, 9);

      updated[index][field] = formatted;
    } else {
      updated[index][field] = value;
    }
    setPassengers(updated);
  };

  const isFormValid = () => {
    return passengers.every(passenger => {
      const hasFirstName = passenger.first_name && passenger.first_name.trim().length > 0;
      const hasLastName = passenger.last_name && passenger.last_name.trim().length > 0;
      const hasValidPhone = passenger.phone_number && passenger.phone_number.length === 19;
      return hasFirstName && hasLastName && hasValidPhone;
    });
  };

  const baseTotal = tour ? Number(tour.price) * people : 0;
  const finalTotal = useDiscount ? Math.max(baseTotal - 50000, 0) : baseTotal;

  const handleNextStep = async () => {
    if (step === 1 && useDiscount) {
      setCheckingGroup(true);
      try {
        const telegramId = tg?.initDataUnsafe?.user?.id || 1;
        const baseUrl = getApiUrl();
        const response = await axios.get(`${baseUrl}/api/users/check-membership/?telegram_id=${telegramId}`);
        
        if (response.data.is_member) {
          setStep(2);
        } else {
          alert("Siz chegirmadan foydalanish uchun 1 marotaba biz bilan sayohat qilgan bo'lishingiz va yopiq telegram guruhga qo'shilgan bo'lishingiz kerak :)");
        }
      } catch (error) {
        console.error("Guruhni tekshirishda xatolik:", error);
        alert("Guruh a'zoligini tekshirishda texnik xatolik yuz berdi.");
      } finally {
        setCheckingGroup(false);
      }
    } else {
      setStep(s => s + 1);
    }
  };

const handleCreateBooking = async () => {
  setLoading(true);
  
  const tgWebApp = window.Telegram?.WebApp;
  const tgUser = tgWebApp?.initDataUnsafe?.user;
  
  const currentTelegramId = tgUser?.id ? String(tgUser.id) : "1"; 
  const currentUsername = tgUser?.username || `user_${currentTelegramId}`;
  const currentFirstName = tgUser?.first_name || `User_${currentTelegramId}`;

  const formattedPassengers = passengers
    .filter(p => p.first_name && p.last_name) 
    .map(p => ({
      full_name: `${p.first_name} ${p.last_name}`.trim(),
      phone_number: p.phone_number || ''
    }));

  if (formattedPassengers.length === 0) {
    alert("Iltimos, kamida bitta yo'lovchi ma'lumotlarini to'liq kiriting.");
    setLoading(false);
    return;
  }


  let hasDiscount = false; 
  try {
    const baseUrl = getApiUrl();
    const checkRes = await fetch(`${baseUrl}/api/bookings/check-membership/?telegram_id=${currentTelegramId}`);
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      hasDiscount = Boolean(checkData.is_member);
    }
  } catch (e) {
    console.log("Guruh a'zoligini tekshirishda xatolik (sukut bo'yicha false):", e);
  }


  const payload = {
    user: currentTelegramId,         
    tour: tour.id,              
    people_count: passengers.length, 
    passengers: formattedPassengers, 
    use_discount: hasDiscount, 
    
    username: currentUsername,
    first_name: currentFirstName
  };

  try {
    const baseUrl = getApiUrl(); 
    console.log("Yuborilayotgan payload:", payload);

    const response = await fetch(`${baseUrl}/api/bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Backend xatolik tafsiloti:", result);
      if (result.use_discount) {
        throw new Error(result.use_discount);
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        throw new Error(JSON.stringify(result));
      }
    }

    console.log("Muvaffaqiyatli bron qilindi:", result);
    
    
    if (typeof setBookingId === 'function') {
      setBookingId(result.id);
    }
    
   
    if (typeof setStep === 'function') {
      setStep(4); 
    }

  } catch (err) {
    console.error("Xatolik:", err);
    alert("Xato yuz berdi: " + err.message);
  } finally {
    setLoading(false);
  }
};
  const handlePayment = (provider) => {
    setPaidWith(provider === 'click' ? 'Click' : 'Payme');
    if (provider === 'click') {
      const url = `https://my.click.uz/services/pay?service_id=${process.env.REACT_APP_CLICK_SERVICE_ID}&merchant_id=${process.env.REACT_APP_CLICK_MERCHANT_ID}&amount=${finalTotal}&transaction_param=${bookingId}`;
      if (tg?.openLink) tg.openLink(url);
      else window.open(url, '_blank');
    } else {
      const url = `https://checkout.paycom.uz/${process.env.REACT_APP_PAYME_MERCHANT_ID}`;
      if (tg?.openLink) tg.openLink(url);
      else window.open(url, '_blank');
    }
  };

  const handleSimulate = async (provider) => {
    setPaidWith(provider === 'click' ? 'Click' : 'Payme');
    setProcessing(true);
    try {
      const baseUrl = getApiUrl();
      await axios.post(`${baseUrl}/api/bookings/payment-simulate/`, {
        booking_id: bookingId,
        provider: provider
      });
      setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
      }, 1500);
    } catch (e) {
      setProcessing(false);
      alert("Simulyatsiya xatosi: " + (e.response?.data?.message || e.message));
    }
  };

  if (!tour) return (
    <>
      <style>{styles}</style>
      <div className="bk-root">
        <div className="bk-loading">
          <div className="bk-spinner" />
          <span style={{color:'#5A5A65',fontSize:'13px'}}>Yuklanmoqda...</span>
        </div>
      </div>
    </>
  );

  if (processing) return (
    <>
      <style>{styles}</style>
      <div className="bk-root">
        <div className="bk-processing">
          <div className="bk-processing-spinner" />
          <h3>To'lov tekshirilmoqda...</h3>
          <p>Iltimos kuting,<br/>bu bir necha soniya oladi.</p>
        </div>
      </div>
    </>
  );

  if (success) return (
    <>
      <style>{styles}</style>
      <div className="bk-root">
        <div className="bk-success">
          <div className="bk-success-icon">✅</div>
          <h2>To'lov muvaffaqiyatli!</h2>
          <p>Broningiz tasdiqlandi.<br/>Barcha ma'lumotlar quyida.</p>

          <div className="bk-success-details">
            {[
              { label: 'Tur', value: tour.title },
              { label: 'Ishtirokchilar', value: `${people} kishi` },
              { label: 'To\'lov usuli', value: paidWith },
              { label: 'Umumiy summa', value: `${finalTotal.toLocaleString('uz-UZ')} so'm` },
              { label: 'Status', value: '✅ Tasdiqlandi' },
            ].map((row, i) => (
              <div key={i} className="bk-success-row">
                <span className="bk-success-row-label">{row.label}</span>
                <span className="bk-success-row-value">{row.value}</span>
              </div>
            ))}
          </div>

          <button className="bk-btn bk-btn-primary" style={{width:'100%', maxWidth:'280px'}} onClick={() => navigate('/')}>
            🏠 Asosiy sahifaga
          </button>
        </div>
      </div>
    </>
  );

  const imageUrl = getImageUrl(tour.image);

  return (
    <>
      <style>{styles}</style>
      <div className="bk-root">

        {/* Header */}
        <div className="bk-header">
          <div className="bk-back" onClick={() => step > 1 ? setStep(s => s-1) : navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F0EDE6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </div>
          <div className="bk-header-title">Joy bron qilish</div>
        </div>

        {/* Steps */}
        <div className="bk-steps">
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div className={`bk-step ${step === i+1 ? 'active' : step > i+1 ? 'done' : ''}`}>
                <div className="bk-step-circle">{step > i+1 ? '✓' : i+1}</div>
                <span className="bk-step-label">{label}</span>
              </div>
              {i < STEPS.length-1 && (
                <div className={`bk-step-line ${step > i+1 ? 'done' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Tour mini card */}
        <div className="bk-tour-card">
          {imageUrl ? <img src={imageUrl} alt={tour.title} className="bk-tour-img" /> : <div className="bk-tour-placeholder">🏔</div>}
          <div>
            <div className="bk-tour-name">{tour.title}</div>
            <div className="bk-tour-price">{Number(tour.price).toLocaleString('uz-UZ')} so'm / kishi</div>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="bk-content">
            <div className="bk-step-title">Ishtirokchilar soni</div>
            <div className="bk-step-sub">Necha kishi uchun bron qilmoqdasiz?</div>
            <div className="bk-people-counter">
              <div className={`bk-counter-btn ${people<=1?'disabled':''}`} onClick={() => people>1 && handlePeopleChange(people-1)}>−</div>
              <div className="bk-counter-value">{people}</div>
              <div className={`bk-counter-btn ${people>=tour.max_people?'disabled':''}`} onClick={() => people<tour.max_people && handlePeopleChange(people+1)}>+</div>
            </div>
            <div className="bk-summary-box">
              <div className="bk-summary-row">
                <span className="bk-summary-label">1 kishi uchun</span>
                <span className="bk-summary-value">{Number(tour.price).toLocaleString('uz-UZ')} so'm</span>
              </div>
              <div className="bk-summary-row">
                <span className="bk-summary-label">Ishtirokchilar</span>
                <span className="bk-summary-value">{people} kishi</span>
              </div>

              <div className="bk-discount-box" onClick={() => setUseDiscount(!useDiscount)}>
                <input 
                  type="checkbox" 
                  className="bk-discount-checkbox" 
                  checked={useDiscount}
                  onChange={(e) => setUseDiscount(e.target.checked)}
                  onClick={(e) => e.stopPropagation()} 
                />
                <span className="bk-discount-text">Makon Club guruh a'zosiman</span>
                <span className="bk-discount-badge">-50k so'm</span>
              </div>

              <div className="bk-summary-row" style={{marginTop: '12px', borderTop: '1px dashed #2A2A35', paddingTop: '12px'}}>
                <span className="bk-summary-label">Jami</span>
                <span className="bk-summary-total">{finalTotal.toLocaleString('uz-UZ')} so'm</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="bk-content">
            <div className="bk-step-title">Ishtirokchilar ma'lumotlari</div>
            <div className="bk-step-sub">Har bir yo'lovchining ism va telefon raqamini kiriting</div>
            <div className="bk-form">
              {passengers.map((passenger, index) => (
                <div key={index} className="bk-passenger-card">
                  <div className="bk-passenger-number">
                    {index === 0 ? "👤 Asosiy buyurtmachi (Siz)" : `👥 Yo'lovchi #${index + 1}`}
                  </div>
                  
                  <div className="bk-field" style={{ marginBottom: '10px' }}>
                    <input 
                      className="bk-input" 
                      placeholder="Ismi (Majburiy)" 
                      value={passenger.first_name || ""} 
                      onChange={e => handlePassengerInput(index, 'first_name', e.target.value)} 
                      required
                    />
                  </div>

                  <div className="bk-field" style={{ marginBottom: '10px' }}>
                    <input 
                      className="bk-input" 
                      placeholder="Familiyasi (Majburiy)" 
                      value={passenger.last_name || ""} 
                      onChange={e => handlePassengerInput(index, 'last_name', e.target.value)} 
                      required
                    />
                  </div>

                  <div className="bk-field">
                    <input 
                      className="bk-input" 
                      placeholder="+998 (90) 999 99 99" 
                      value={passenger.phone_number || ""} 
                      onChange={e => handlePassengerInput(index, 'phone_number', e.target.value)} 
                      onKeyDown={e => {
                        const { selectionStart, value } = e.target;
                        if (selectionStart < 5 && (e.key === 'Backspace' || e.key === 'Delete')) {
                          e.preventDefault();
                          return;
                        }
                        if (e.key === 'Backspace') {
                          const charToDelete = value[selectionStart - 1];
                          if (charToDelete === ' ' || charToDelete === ')') {
                            e.preventDefault();
                            let skipCount = charToDelete === ' ' && value[selectionStart - 2] === ')' ? 2 : 1;
                            let leftPart = value.substring(0, selectionStart - skipCount).replace(/\d$/, '');
                            let rightPart = value.substring(selectionStart);
                            handlePassengerInput(index, 'phone_number', leftPart + rightPart);
                          }
                        }
                      }}
                      maxLength={19}
                      type="tel" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="bk-content">
            <div className="bk-step-title">Ma'lumotlarni tekshiring</div>
            <div className="bk-step-sub">Hamma narsa to'g'rimi?</div>
            <div className="bk-confirm-list">
              <div className="bk-confirm-item">
                <div className="bk-confirm-icon">🌍</div>
                <div>
                  <div className="bk-confirm-label">Tur</div>
                  <div className="bk-confirm-value">{tour.title}</div>
                </div>
              </div>
              <div className="bk-confirm-item">
                <div className="bk-confirm-icon">👥</div>
                <div>
                  <div className="bk-confirm-label">Ishtirokchilar soni</div>
                  <div className="bk-confirm-value">{people} kishi</div>
                </div>
              </div>
              
              {useDiscount && (
                <div className="bk-confirm-item" style={{borderColor: 'rgba(200,169,110,0.4)', background: 'rgba(200,169,110,0.03)'}}>
                  <div className="bk-confirm-icon">🔥</div>
                  <div>
                    <div className="bk-confirm-label">Klub chegirmasi</div>
                    <div className="bk-confirm-value" style={{color: '#C8A96E'}}>Faollashtirilgan (-50,000 so'm)</div>
                  </div>
                </div>
              )}
              
          
              {passengers.map((p, idx) => (
                <div key={idx} className="bk-confirm-item" style={{borderLeft: '2px solid #C8A96E'}}>
                  <div className="bk-confirm-icon">👤</div>
                  <div>
                    <div className="bk-confirm-label">
                      {idx === 0 ? "Asosiy buyurtmachi (Siz)" : `Yo'lovchi #${idx + 1}`}
                    </div>
                    <div className="bk-confirm-value">
                      {p.first_name || ''} {p.last_name || ''}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                      {p.phone_number}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bk-total-box">
              <span className="bk-total-label">Umumiy to'lov</span>
              <span className="bk-total-value">{finalTotal.toLocaleString('uz-UZ')} so'm</span>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="bk-content">
            <div className="bk-payment-title">To'lov usulini tanlang</div>
            <div className="bk-payment-sub">Qaysi to'lov usuli sizga mos keladi?</div>
            <div className="bk-payment-amount">
              <div className="bk-payment-amount-label">To'lov miqdori</div>
              <div className="bk-payment-amount-value">{finalTotal.toLocaleString('uz-UZ')} so'm</div>
            </div>
            
            <div className="bk-payment-methods">
              <button className="bk-pay-btn" onClick={() => handlePayment('click')}>
                <div className="bk-pay-logo click">CLICK</div>
                <div className="bk-pay-info">
                  <div className="bk-pay-name">Click App</div>
                  <div className="bk-pay-desc">Click tizimi orqali tezkor to'lov</div>
                </div>
              </button>

              <button className="bk-pay-btn" onClick={() => handlePayment('payme')}>
                <div className="bk-pay-logo payme">PAYME</div>
                <div className="bk-pay-info">
                  <div className="bk-pay-name">Payme App</div>
                  <div className="bk-pay-desc">Payme tizimi orqali xavfsiz to'lov</div>
                </div>
              </button>
            </div>

            <div className="bk-sim-divider">Yoki real to'lovni simulyatsiya qiling</div>
            <button className="bk-sim-btn" onClick={() => handleSimulate('click')}>⚙️ Click To'lovni Simulyatsiya Qilish</button>
            <button className="bk-sim-btn" style={{marginTop:'10px'}} onClick={() => handleSimulate('payme')}>⚙️ Payme To'lovni Simulyatsiya Qilish</button>
          </div>
        )}

        {/* Dynamic Footer for Steps */}
        {step < 4 && (
          <div className="bk-footer">
            {step > 1 && (
              <button className="bk-btn bk-btn-secondary" onClick={() => setStep(s => s - 1)}>
                ← Orqaga
              </button>
            )}
            
            {step === 2 ? (
              <button className="bk-btn bk-btn-primary" disabled={!isFormValid() || loading} onClick={handleCreateBooking}>
                {loading ? "Yuklanmoqda..." : "Tasdiqlashga o'tish →"}
              </button>
            ) : step === 3 ? (
              <button className="bk-btn bk-btn-primary" disabled={loading} onClick={handleCreateBooking}>
                {loading ? "Yuklanmoqda..." : "To'lovga o'tish →"}
              </button>
            ) : (
              <button className="bk-btn bk-btn-primary" disabled={checkingGroup} onClick={handleNextStep}>
                {checkingGroup ? "Tekshirilmoqda..." : "Keyingi →"}
              </button>
            )}
          </div>
        )}

      </div>
    </>
  );
}

export default Booking;
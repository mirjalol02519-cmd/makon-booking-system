import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TourList from './pages/TourList';
import TourDetail from './pages/TourDetail';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TourList />} />
        <Route path="/tour/:id" element={<TourDetail />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
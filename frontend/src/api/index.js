import axios from 'axios';
import { getApiUrl } from '../config';

const instance = axios.create({
  baseURL: getApiUrl(),
});


export const getTours = () => instance.get('/api/tours/');
export const getTourDetail = (id) => instance.get(`/api/tours/${id}/`);
export const createBooking = (data) => instance.post('/api/bookings/', data);


const api = {
  getTours,
  getTourDetail,
  createBooking,
  defaults: instance.defaults
};

export default api;
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WeddingContext = createContext();

export const WeddingProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const loadData = async () => {
      const currentToken = localStorage.getItem('token');
      if (!currentToken || currentToken === 'undefined') {
        setLoading(false);
        return;
      }
      
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
        const userRes = await axios.get(`${API_URL}/auth/user`);
        setUser(userRes.data);
        
        const dataRes = await axios.get(`${API_URL}/v1/wedding/data`);
        setData(dataRes.data);
      } catch (err) {
        // FIX: Only log the user out if the token is actually invalid (401)
        if (err.response && err.response.status === 401) {
          console.warn('Session expired or invalid.');
          setToken(null);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        } else {
          console.error('Backend Server Error:', err.response?.data || err.message);
          toast.error("Database error. Please check your backend terminal.");
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  const login = async (email, password) => {
    const config = { headers: { Authorization: '' } };
    const res = await axios.post(`${API_URL}/auth/login`, { email, password }, config);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (name, email, password) => {
    const config = { headers: { Authorization: '' } };
    await axios.post(`${API_URL}/auth/register`, { name, email, password }, config);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setData(null);
  };

  const updateData = useCallback(async (updatedFields, showToast = false) => {
    setData(prev => ({ ...prev, ...updatedFields }));
    try {
      await axios.put(`${API_URL}/v1/wedding/update`, updatedFields);
      if(showToast) toast.success('Details Saved Successfully!');
    } catch (err) {
      if(showToast) toast.error('Failed to save details.');
      console.error('Failed to sync state:', err);
    }
  }, []);

  const analytics = React.useMemo(() => {
    if (!data) return {};
    const totalGuests = data.guests?.length || 0;
    const confirmedCount = data.guests?.filter(g => g.rsvp === 'Confirmed').length || 0;
    
    let totalBudgetUsed = 0;
    data.budget?.categories?.forEach(cat => {
      cat.items?.forEach(i => totalBudgetUsed += (Number(i.cost) || 0));
    });

    const eventDate = data.eventInfo?.date ? new Date(data.eventInfo.date) : null;
    const daysUntil = eventDate ? Math.max(0, Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24))) : 'TBD';

    return { totalGuests, confirmedCount, totalBudgetUsed, daysUntil };
  }, [data]);

  if (loading) return <div className="flex h-screen items-center justify-center font-medium text-gray-500">Loading Portal...</div>;

  return (
    <WeddingContext.Provider value={{ user, token, login, register, logout, data, updateData, analytics }}>
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => useContext(WeddingContext);
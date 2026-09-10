import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WeddingContext = createContext();

export const WeddingProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [activeEventId, setActiveEventId] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const getAuthHeaders = () => {
    const currentToken = localStorage.getItem('token');
    return currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
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
        const headers = { Authorization: `Bearer ${currentToken}` };
        const userRes = await axios.get(`${API_URL}/auth/user`, { headers });
        setUser(userRes.data);
        
        const eventsRes = await axios.get(`${API_URL}/v1/wedding/events`, { headers });
        setEvents(eventsRes.data);
        if (eventsRes.data.length > 0) {
          setActiveEventId(eventsRes.data[0]._id);
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setToken(null);
          localStorage.removeItem('token');
        } else {
          console.error('Backend Server Error:', err.response?.data || err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, API_URL]);

  const data = events.find(e => e._id === activeEventId) || events[0] || null;

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const newToken = res.data.token;
    
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(res.data.user);
    
    const eventsRes = await axios.get(`${API_URL}/v1/wedding/events`, {
      headers: { Authorization: `Bearer ${newToken}` }
    });
    setEvents(eventsRes.data);
    if (eventsRes.data.length > 0) {
      setActiveEventId(eventsRes.data[0]._id);
    }
    toast.success('Logged in successfully!');
  };

  const register = async (name, email, password, initialEventType = 'Wedding') => {
    await axios.post(`${API_URL}/auth/register`, { name, email, password, initialEventType });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setEvents([]);
    setActiveEventId(null);
    toast.success('Logged out successfully.');
  };

  const updateData = useCallback(async (updatedFields, showToast = false) => {
    if (!data) return;
    setEvents(prev => prev.map(ev => ev._id === data._id ? { ...ev, ...updatedFields } : ev));
    try {
      await axios.put(`${API_URL}/v1/wedding/update/${data._id}`, updatedFields, {
        headers: getAuthHeaders()
      });
      if(showToast) toast.success('Details Saved Successfully!');
    } catch (err) {
      if(showToast) toast.error('Failed to save details.');
    }
  }, [data, API_URL]);

  const createNewEvent = async (eventType) => {
    try {
      const res = await axios.post(`${API_URL}/v1/wedding/events`, { eventType }, {
        headers: getAuthHeaders()
      });
      setEvents(prev => [...prev, res.data]);
      setActiveEventId(res.data._id);
      toast.success(`Created new ${eventType} event successfully!`);
    } catch (err) {
      toast.error('Failed to create event.');
    }
  };

  const deleteEvent = async (eventId) => {
    if (events.length <= 1) {
      toast.error('You must keep at least one active event.');
      return;
    }
    try {
      await axios.delete(`${API_URL}/v1/wedding/events/${eventId}`, {
        headers: getAuthHeaders()
      });
      const remaining = events.filter(e => e._id !== eventId);
      setEvents(remaining);
      if (activeEventId === eventId) {
        setActiveEventId(remaining[0]._id);
      }
      toast.success('Event deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete event.');
    }
  };

  const analytics = React.useMemo(() => {
    if (!data) return {};
    const totalGuests = data.guests?.length || 0;
    const confirmedCount = data.guests?.filter(g => g.rsvp === 'Confirmed').length || 0;
    const invitedCount = data.guests?.filter(g => g.rsvp === 'Invited').length || 0;
    const pendingCount = data.guests?.filter(g => g.rsvp === 'Pending' || !g.rsvp).length || 0;
    const maybeCount = data.guests?.filter(g => g.rsvp === 'Maybe').length || 0;
    const declinedCount = data.guests?.filter(g => g.rsvp === 'Declined').length || 0;

    const brideSideCount = data.guests?.filter(g => (g.side || "Bride's") === "Bride's").length || 0;
    const groomSideCount = data.guests?.filter(g => g.side === "Groom's").length || 0;

    let totalPax = 0;
    let totalAdults = 0;
    let totalChildren = 0;
    let confirmedPax = 0;
    const categoryCounts = { "mother relative": 0, "father relative": 0, "family": 0, "colleagues and office": 0, "sibling guests": 0, "friends": 0, "other guests": 0 };

    data.guests?.forEach(g => {
      const adults = Number(g.adults) || 0;
      const half = Number(g.half) || 0;
      const kids = Number(g.kids) || 0;
      const p = adults + half + kids;
      totalPax += p;
      totalAdults += adults;
      totalChildren += half + kids;
      if (g.rsvp === 'Confirmed') confirmedPax += p;

      const catKey = (g.category || '').toLowerCase();
      if (categoryCounts[catKey] !== undefined) {
        categoryCounts[catKey] += 1;
      } else if (catKey) {
        categoryCounts[catKey] = 1;
      }
    });

    const budgetByCategory = {};
    let totalBudgetUsed = 0;
    data.budget?.categories?.forEach(cat => {
      let catTotal = 0;
      cat.items?.forEach(i => {
        const cost = Number(i.cost) || 0;
        catTotal += cost;
        totalBudgetUsed += cost;
      });
      budgetByCategory[cat.name] = catTotal;
    });

    const totalBudget = Number(data.budget?.totalBudget) || 0;
    const budgetPercentage = totalBudget > 0 ? Math.min(100, Math.round((totalBudgetUsed / totalBudget) * 100)) : 0;

    const totalTables = data.tables?.length || 0;
    let totalSeats = 0;
    let allocatedSeats = 0;
    data.tables?.forEach(t => {
      const cap = Number(t.capacity) || 0;
      totalSeats += cap;
      allocatedSeats += (t.assignedGuests?.filter(Boolean).length || 0);
    });
    const availableSeats = Math.max(0, totalSeats - allocatedSeats);
    const seatUtilizationRate = totalSeats > 0 ? Math.min(100, Math.round((allocatedSeats / totalSeats) * 100)) : 0;

    const eventDateStr = data.eventInfo?.date;
    let daysUntil = 'TBD';
    if (eventDateStr) {
      const eventDate = new Date(eventDateStr);
      if (!isNaN(eventDate.getTime())) {
        daysUntil = Math.max(0, Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24)));
      }
    }

    const completedSections = data.completedSections || {};
    const totalSectionsCount = 6;
    const completedCountVal = Object.values(completedSections).filter(Boolean).length;
    const progressPercentage = Math.round((completedCountVal / totalSectionsCount) * 100);

    return { 
      totalGuests, confirmedCount, invitedCount, pendingCount, maybeCount, declinedCount,
      brideSideCount, groomSideCount, totalPax, totalAdults, totalChildren, confirmedPax,
      categoryCounts, budgetByCategory, totalBudgetUsed, budgetPercentage, totalTables,
      totalSeats, allocatedSeats, availableSeats, seatUtilizationRate, daysUntil,
      completedSections, completedCountVal, progressPercentage
    };
  }, [data]);

  if (loading) return <div className="flex h-screen items-center justify-center font-medium text-gray-500">Loading Portal...</div>;

  return (
    <WeddingContext.Provider value={{ user, token, login, register, logout, data, events, activeEventId, setActiveEventId, createNewEvent, deleteEvent, updateData, analytics }}>
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => useContext(WeddingContext);
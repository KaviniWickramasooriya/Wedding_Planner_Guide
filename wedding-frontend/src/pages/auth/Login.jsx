import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import toast from 'react-hot-toast';

export const Login = ({ onSwitch }) => {
  const { login } = useWedding();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      toast.success('Logged in successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed';
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-2">Sign in to manage your events</p>
        </div>
        {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700">Email Address</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full mt-1 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Password</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full mt-1 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">Sign In</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <button onClick={onSwitch} className="text-blue-600 font-bold hover:underline">Register</button>
        </p>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import toast from 'react-hot-toast';

export const Register = ({ onSwitch }) => {
  const { register } = useWedding();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created successfully! Please log in.');
      onSwitch(); // This moves the user to the login page
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
          <p className="text-sm text-gray-500 mt-2">Start planning your perfect day</p>
        </div>
        {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700">Full Name</label>
            <input type="text" required onChange={e => setForm({...form, name: e.target.value})} className="w-full mt-1 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Email Address</label>
            <input type="email" required onChange={e => setForm({...form, email: e.target.value})} className="w-full mt-1 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Password</label>
            <input type="password" required onChange={e => setForm({...form, password: e.target.value})} className="w-full mt-1 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">Create Account</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <button onClick={onSwitch} className="text-blue-600 font-bold hover:underline">Sign In</button>
        </p>
      </div>
    </div>
  );
};
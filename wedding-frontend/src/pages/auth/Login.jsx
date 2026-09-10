import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import toast from 'react-hot-toast';
import { HeartHandshake, Mail, Lock, ArrowRight } from 'lucide-react';

export const Login = ({ onSwitch }) => {
  const { login } = useWedding();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Logged in successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 p-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl text-white shadow-lg shadow-indigo-500/30 mb-2">
            <HeartHandshake size={24} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-purple-200/70 font-medium">Sign in to continue planning your events</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-2xl text-xs font-semibold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-purple-200/80 uppercase tracking-wider pl-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-purple-300/50" />
              <input 
                type="email" 
                required 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/30 outline-none focus:border-purple-400 focus:bg-white/15 transition-all font-medium" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-purple-200/80 uppercase tracking-wider pl-1">Password</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-purple-300/50" />
              <input 
                type="password" 
                required 
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})} 
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/30 outline-none focus:border-purple-400 focus:bg-white/15 transition-all font-medium" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-xs active:scale-[0.98]"
          >
            {loading ? 'Signing in...' : <>Sign In <ArrowRight size={15} /></>}
          </button>
        </form>

        <p className="text-center text-xs text-purple-200/60 mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitch} className="text-purple-300 font-bold hover:text-white transition-colors underline underline-offset-4">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};
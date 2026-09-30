import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);

      // Redirect based on role
      const role = (user?.role || 'EMPLOYEE').toUpperCase();
      if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'AGENT') {
        navigate('/agent');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      console.error('Login error:', err);
      let message = 'Invalid email or password.';
      if (err.response?.status === 500 || err.response?.data?.message) {
        message = err.response?.data?.message || 'User not found or password incorrect. Please sign up if you do not have an account yet.';
      } else if (err.code === 'ERR_NETWORK') {
        message = 'Cannot connect to backend server. If using Render free tier, the server may take 30-50 seconds to wake up from sleep. Please wait a moment and try again.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-white">
          Sign in to ResolveAI
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Autonomous IT Incident & Multi-Agent Support Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 py-8 px-6 sm:px-10 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mb-6 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-center">
              Quick One-Click Demo Access
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => { setEmail('admin@resolve.ai'); setPassword('Admin@123'); }}
                className="py-1.5 px-2 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-semibold transition-all cursor-pointer text-center"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => { setEmail('agent@resolve.ai'); setPassword('Agent@123'); }}
                className="py-1.5 px-2 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-semibold transition-all cursor-pointer text-center"
              >
                🛡️ Agent
              </button>
              <button
                type="button"
                onClick={() => { setEmail('employee@resolve.ai'); setPassword('Employee@123'); }}
                className="py-1.5 px-2 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/30 text-brand-300 font-semibold transition-all cursor-pointer text-center"
              >
                👤 Employee
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>
              <div className="flex justify-end mt-1.5">
                <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

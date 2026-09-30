import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Sparkles, Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setResetToken('');

    if (!email.trim()) {
      setError('Please provide your registered email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.forgotPassword(email.trim());
      const token = res.data;
      setResetToken(token);
      setSuccessMsg('Reset token generated successfully! You can now reset your password.');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to process request. Verify your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-white">
          Reset Password
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Enter your registered email to receive your password reset token
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

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3">
              <div className="flex items-start gap-2 text-emerald-400 text-xs">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
              {resetToken && (
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Reset Token:</span>
                  <p className="font-mono text-brand-300 break-all select-all">{resetToken}</p>
                </div>
              )}
              <button
                onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                className="w-full mt-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Set New Password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!resetToken && (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Account Work Email
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-600/30 transition-all cursor-pointer"
              >
                {loading ? 'Generating Token...' : 'Generate Reset Token'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
            <Link to="/login" className="inline-flex items-center gap-1 text-slate-400 hover:text-white">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
            <Link to="/reset-password" className="text-brand-400 hover:text-brand-300">
              Already have a token?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

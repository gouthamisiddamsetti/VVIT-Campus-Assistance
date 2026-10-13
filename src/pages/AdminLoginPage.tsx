import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { authService, DEMO_ADMIN_ACCOUNTS } from '../services/firebase/authService';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await authService.login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    const account = DEMO_ADMIN_ACCOUNTS[demoEmail];
    if (account) {
      setEmail(demoEmail);
      setPassword(account.pass);
      setErrorMsg('');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6 bg-white">
      {/* Logo & Header */}
      <div className="text-center space-y-3">
        <div className="bg-white p-2 rounded-2xl shadow-md border-2 border-[#E67E6A] inline-block">
          <img
            src="/vvit-logo.jpg"
            alt="VVIT University Logo"
            className="h-16 w-auto object-contain mx-auto"
          />
        </div>
        <h1 className="text-2xl font-extrabold text-black">Administrator Portal</h1>
        <p className="text-xs text-neutral-600 font-medium">
          Sign in to manage VVIT campus buildings, facilities, and verification records.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-black shadow-xl space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-black mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-black absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vvitu@ac.in"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-neutral-300 text-xs text-black focus:outline-none focus:border-[#E67E6A] font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-black absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-neutral-300 text-xs text-black focus:outline-none focus:border-[#E67E6A] font-semibold"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-black border border-[#E67E6A] text-[#E67E6A] rounded-xl text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E67E6A]" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#E67E6A] hover:bg-[#d66c58] disabled:bg-neutral-300 text-white font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick-Fill Profiles */}
        <div className="pt-4 border-t border-neutral-200 space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-black block">
            Master Admin Quick Access:
          </span>
          <div className="space-y-2">
            {/* Primary Master Admin Account Requested by User */}
            <button
              type="button"
              onClick={() => fillDemoAccount('vvitu@ac.in')}
              className="w-full text-left text-xs bg-black text-white hover:bg-neutral-900 border-2 border-[#E67E6A] p-3 rounded-2xl transition-colors flex items-center justify-between shadow-sm"
            >
              <div>
                <strong className="block text-[#E67E6A] font-extrabold text-xs">
                  Master Admin (Full Website Access)
                </strong>
                <span className="text-[11px] text-neutral-300 font-mono">
                  vvitu@ac.in • Password: vvitu@123
                </span>
              </div>
              <span className="text-[11px] font-bold text-white bg-[#E67E6A] px-2.5 py-1 rounded-lg">
                Autofill
              </span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('directory.admin@vvitu.edu.in')}
              className="w-full text-left text-xs bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 p-2.5 rounded-xl transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="block text-black font-bold">Directory Admin</strong>
                <span className="text-[10px] text-neutral-500 font-mono">directory.admin@vvitu.edu.in</span>
              </div>
              <span className="text-[10px] font-bold text-black border border-black px-2 py-0.5 rounded">
                Autofill
              </span>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('auditor@vvitu.edu.in')}
              className="w-full text-left text-xs bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 p-2.5 rounded-xl transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="block text-black font-bold">Auditor (Read-Only)</strong>
                <span className="text-[10px] text-neutral-500 font-mono">auditor@vvitu.edu.in</span>
              </div>
              <span className="text-[10px] font-bold text-black border border-black px-2 py-0.5 rounded">
                Autofill
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import * as authApi from '../api/auth';
import { useNavigation } from '../contexts/NavigationContext';

export const WelcomeScreen: React.FC = () => {
  const { setToken, setCurrentUser } = useAuth();
  const { triggerToast } = useNotification();
  const { setCurrentScreen } = useNavigation();

  const [isRegistering, setIsRegistering] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      let data;
      if (isRegistering) {
        data = await authApi.register(authEmail, authPassword, authName);
      } else {
        data = await authApi.login(authEmail, authPassword);
      }
      setToken(data.token);
      setCurrentUser(data.user);
      triggerToast(isRegistering ? 'Account registered successfully!' : 'Signed in successfully!', 'success');
      setCurrentScreen('browse');
    } catch (err: any) {
      setAuthError(err.message);
      triggerToast(err.message, 'error');
    } finally {
      setAuthLoading(false);
    }
  };



  return (
    <motion.div
      key="welcome-screen"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="min-h-[80vh] flex flex-col justify-center items-center py-6"
    >
      <div id="auth-box-container" className="bg-surface-container-lowest rounded-3xl p-6 md:p-10 shadow-xl border border-stone-100/80 max-w-md w-full relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-secondary-container/20 rounded-full blur-xl pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <span className="text-primary font-bold text-4xl block font-display uppercase tracking-tight mb-2">Pocket Labs</span>
          <p className="text-stone-500 font-semibold text-sm">Where play, learning, and wonder unite!</p>
        </div>

        <div className="bg-stone-100 dark:bg-stone-800 p-1 rounded-full flex mb-6">
          <button
            type="button"
            onClick={() => { setIsRegistering(false); setAuthError(null); }}
            className={`flex-1 py-2 rounded-full font-bold text-stone-700 dark:text-white text-xs transition-all ${!isRegistering ? 'bg-white dark:bg-stone-600 shadow' : 'opacity-60'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegistering(true); setAuthError(null); }}
            className={`flex-1 py-2 rounded-full font-bold text-stone-700 dark:text-white text-xs transition-all ${isRegistering ? 'bg-white dark:bg-stone-600 shadow' : 'opacity-60'}`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-extrabold text-stone-600 uppercase tracking-wider mb-1.5">Your Full Name</label>
              <input
                type="text"
                required
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                placeholder="username"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold text-stone-600 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="email"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-stone-600 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-white pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-xl text-xs font-bold leading-relaxed flex items-start gap-2">
              <span className="bg-rose-500 text-white rounded-full p-0.5 text-[8px] font-black w-4 h-4 flex items-center justify-center shrink-0">!</span>
              <span>{authError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3.5 bg-primary text-white font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
          >
            {authLoading ? 'Verifying Credentials...' : isRegistering ? 'Register & Start Playing' : 'Sign In To Pocket Labs'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>



      </div>
    </motion.div>
  );
};

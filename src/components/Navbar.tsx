import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setView, setAuthMode, setPreselectedRole } = useAuth();
  
  const handleSignIn = () => {
    setAuthMode('login');
    setView('auth');
  };

  const handleListProperty = () => {
    setAuthMode('signup');
    setPreselectedRole('agent');
    setView('auth');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
                <Home className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-slate-900 leading-none">
                Direct <span className="text-blue-700">Rent</span>
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#listings" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Browse</a>
            <button 
              onClick={handleListProperty}
              className="text-sm font-medium text-primary-600 border border-primary-200 px-4 py-2 rounded-[10px] hover:bg-primary-50 transition-all"
            >
              List Property
            </button>
            <button 
              onClick={handleSignIn}
              className="text-sm font-medium bg-primary-600 text-white px-5 py-2 rounded-[10px] hover:bg-primary-700 shadow-sm transition-all shadow-primary-200"
            >
              Sign In
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <a href="#listings" className="block text-lg font-medium text-slate-900">Browse</a>
              <div className="pt-4 flex flex-col gap-3">
                <button onClick={handleSignIn} className="w-full bg-primary-600 text-white px-5 py-2.5 rounded-[10px] font-medium transition-colors hover:bg-primary-700">Sign In</button>
                <button onClick={handleListProperty} className="w-full text-primary-600 border border-primary-100 px-5 py-2.5 rounded-[10px] font-medium transition-colors hover:bg-primary-50">List Property</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

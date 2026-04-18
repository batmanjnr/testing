import React, { useState } from 'react';
import { Home, X, Users, Handshake, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const Auth = () => {
  const { authMode, setAuthMode, preselectedRole, login, setView } = useAuth();
  const [role, setRole] = useState<UserRole>(preselectedRole);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nin: '',
    city: '',
    password: '',
    confirmPassword: ''
  });

  const oyoCities = [
    "Ibadan", "Ogbomoso", "Oyo", "Iseyin", "Saki", "Eruwa", 
    "Igboora", "Kisi", "Okeho", "Lalate", "Ado-Awaye"
  ];

  const capitalize = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    if (name === 'nin') {
      value = value.replace(/\D/g, ''); 
    } else if (name === 'name') {
      value = capitalize(value);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const uppercaseRegex = /[A-Z]/;
    const ninRegex = /^\d{11}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) newErrors.password = 'Password is required';

    if (authMode === 'signup') {
      if (!formData.name) newErrors.name = 'Full name is required';
      if (!formData.city) newErrors.city = 'Please select a city';
      
      if (!formData.nin) {
        newErrors.nin = 'NIN is required';
      } else if (!ninRegex.test(formData.nin)) {
        newErrors.nin = 'NIN must be 11 digits';
      }

      if (formData.password) {
        if (formData.password.length < 7) {
          newErrors.password = 'Min 7 characters';
        } else if (!uppercaseRegex.test(formData.password)) {
          newErrors.password = 'Need one uppercase letter';
        } else if (!specialCharRegex.test(formData.password)) {
          newErrors.password = 'Need one special character';
        }
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ninRegex = /^\d{11}$/;
    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    const emailValid = formData.email && emailRegex.test(formData.email);
    const passwordValid = formData.password && (authMode === 'login' || (
      formData.password.length >= 7 && 
      uppercaseRegex.test(formData.password) && 
      specialCharRegex.test(formData.password)
    ));

    if (authMode === 'login') {
      return !!(emailValid && passwordValid);
    }

    return !!(
      formData.name && 
      emailValid && 
      formData.city && 
      formData.nin && ninRegex.test(formData.nin) &&
      passwordValid &&
      formData.password === formData.confirmPassword
    );
  };

  const isReady = isFormValid();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (validate()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Simulated Server Error demo
        if (formData.email === 'error@example.com') {
          setErrors({ email: 'This email is already registered' });
          setIsLoading(false);
          return;
        }

        login(role, { 
          name: formData.name, 
          email: formData.email, 
          nin: formData.nin, 
          city: formData.city 
        });
        setIsLoading(false);
      }, 1500);
    }
  };

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full bg-slate-50 border px-4 py-3 rounded-xl outline-none transition-all text-sm";
    const errorClass = errors[fieldName] 
      ? "border-red-500 bg-red-50/30 focus:border-red-600 text-red-900 placeholder-red-300" 
      : "border-slate-100 focus:border-primary-300 focus:bg-white text-slate-900 placeholder-slate-400";
    return `${baseClass} ${errorClass}`;
  };

  const ErrorMsg = ({ name }: { name: string }) => errors[name] ? (
    <p className="text-[10px] text-red-500 mt-1 ml-1">{errors[name]}</p>
  ) : null;

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <header className="flex items-center mb-8">
        <button onClick={() => setView('landing')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="mx-auto flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Home className="text-white w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-900 tracking-tight">Rent Direct</span>
        </div>
        <div className="w-10" />
      </header>

      <main className="max-w-md mx-auto w-full pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">{authMode === 'login' ? 'Welcome back' : 'Create account'}</h1>
          <p className="text-slate-500 text-sm">{authMode === 'login' ? 'Sign in to access your listings' : 'Fast signup to start your housing journey'}</p>
        </div>

        <div className="bg-slate-50 p-1 rounded-xl flex items-center gap-1 mb-8">
          <button onClick={() => { setAuthMode('login'); setErrors({}); }} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Login</button>
          <button onClick={() => { setAuthMode('signup'); setErrors({}); }} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${authMode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {authMode === 'signup' && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button type="button" onClick={() => setRole('tenant')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'tenant' ? 'border-primary-500 bg-primary-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}><Users className={`w-6 h-6 ${role === 'tenant' ? 'text-primary-600' : 'text-slate-400'}`} /><span className={`text-[10px] font-bold uppercase tracking-wider ${role === 'tenant' ? 'text-primary-700' : 'text-slate-400'}`}>Tenant</span></button>
              <button type="button" onClick={() => setRole('agent')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'agent' ? 'border-primary-500 bg-primary-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}><Handshake className={`w-6 h-6 ${role === 'agent' ? 'text-primary-600' : 'text-slate-400'}`} /><span className={`text-[10px] font-bold uppercase tracking-wider ${role === 'agent' ? 'text-primary-700' : 'text-slate-400'}`}>Agent</span></button>
            </div>
          )}

          {authMode === 'signup' && (
            <>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="John Doe" className={getInputClass('name')} />
                <ErrorMsg name="name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">NIN</label>
                  <input name="nin" value={formData.nin} onChange={handleChange} type="text" placeholder="11 digits" maxLength={11} className={getInputClass('nin')} />
                  <ErrorMsg name="nin" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">City</label>
                  <select name="city" value={formData.city} onChange={handleChange} className={getInputClass('city')}>
                    <option value="">Select City</option>
                    {oyoCities.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                  <ErrorMsg name="city" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
            <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="user@example.com" className={getInputClass('email')} />
            <ErrorMsg name="email" />
          </div>

          <div className={`${authMode === 'signup' ? 'grid grid-cols-2 gap-4' : ''}`}>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Password</label>
              <div className="relative">
                <input 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={getInputClass('password')} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <ErrorMsg name="password" />
            </div>
            {authMode === 'signup' && (
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Confirm</label>
                <div className="relative">
                  <input 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className={getInputClass('confirmPassword')} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMsg name="confirmPassword" />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold mt-6 transition-all flex items-center justify-center gap-2 
              ${isReady && !isLoading 
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-200 active:scale-[0.98]' 
                : 'bg-slate-200 text-slate-400 opacity-80'}`}
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? (authMode === 'login' ? 'Signing In...' : 'Creating Account...') : (authMode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Auth;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  Zap, 
  Trash2, 
  Edit3, 
  Plus, 
  LogOut, 
  Lock, 
  Globe, 
  Tag, 
  Save, 
  X, 
  FileSpreadsheet, 
  CheckCircle 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTranslations } from '../../lib/i18n';

interface Region {
  id: string;
  country_code: string;
  state_province: string;
  city: string;
  postal_code: string;
  grid_rate: number;
  sun_hours: number;
  grid_emissions: number;
  cost_per_watt: number;
}

interface Rebate {
  id: string;
  region_id: string;
  authority_name: string;
  technology_category: string;
  incentive_value: number;
  incentive_type: string;
  max_limit: number | null;
  is_active: boolean;
}

interface RawRebateData {
  id: string;
  region_id: string | number;
  authority_name: string;
  technology_category: string;
  incentive_value: string | number;
  incentive_type: string;
  max_limit: string | number | null;
  is_active: boolean;
}

interface AdminDashboardProps {
  lang: string;
}

export default function AdminDashboard({ lang }: AdminDashboardProps) {
  const t = useTranslations(lang);
  
  // Auth states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Data states
  const [regions, setRegions] = useState<Region[]>([]);
  const [rebates, setRebates] = useState<Rebate[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('all');
  
  // Form states: New Region
  const [newCountry, setNewCountry] = useState('us');
  const [newState, setNewState] = useState('');
  const [newCityName, setNewCityName] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newGridRate, setNewGridRate] = useState('0.15');
  const [newSunHours, setNewSunHours] = useState('1500');
  const [newGridEmissions, setNewGridEmissions] = useState('0.50');
  const [newCostPerWatt, setNewCostPerWatt] = useState('3.00');

  // Form states: New Rebate
  const [rebateRegionId, setRebateRegionId] = useState('');
  const [authorityName, setAuthorityName] = useState('');
  const [techCategory, setTechCategory] = useState('Solar');
  const [incentiveValue, setIncentiveValue] = useState('1000');
  const [incentiveType, setIncentiveType] = useState('fixed');
  const [maxLimit, setMaxLimit] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Edit Rebate states
  const [editingRebateId, setEditingRebateId] = useState<string | null>(null);
  const [editAuthorityName, setEditAuthorityName] = useState('');
  const [editTechCategory, setEditTechCategory] = useState('');
  const [editIncentiveValue, setEditIncentiveValue] = useState('');
  const [editIncentiveType, setEditIncentiveType] = useState('');
  const [editMaxLimit, setEditMaxLimit] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  // Notification Toast state
  const [toastMsg, setToastMsg] = useState('');

  // Default preset regions to bootstrap the mock database
  const mockRegions: Region[] = [
    { id: '1', country_code: 'us', state_province: 'California', city: 'Los Angeles', postal_code: '90210', grid_rate: 0.28, sun_hours: 1800, grid_emissions: 0.52, cost_per_watt: 3.10 },
    { id: '2', country_code: 'us', state_province: 'Texas', city: 'Houston', postal_code: '77001', grid_rate: 0.14, sun_hours: 1950, grid_emissions: 0.82, cost_per_watt: 2.70 },
    { id: '3', country_code: 'us', state_province: 'New York', city: 'New York City', postal_code: '10001', grid_rate: 0.23, sun_hours: 1250, grid_emissions: 0.66, cost_per_watt: 3.25 },
    { id: '4', country_code: 'gb', state_province: 'England', city: 'London', postal_code: 'EC1A', grid_rate: 0.22, sun_hours: 1050, grid_emissions: 0.40, cost_per_watt: 3.40 },
    { id: '5', country_code: 'de', state_province: 'Berlin', city: 'Berlin', postal_code: '10115', grid_rate: 0.38, sun_hours: 1100, grid_emissions: 0.70, cost_per_watt: 2.90 },
    { id: '6', country_code: 'au', state_province: 'New South Wales', city: 'Sydney', postal_code: '2000', grid_rate: 0.26, sun_hours: 2100, grid_emissions: 0.75, cost_per_watt: 1.80 },
    { id: '7', country_code: 'ca', state_province: 'Ontario', city: 'Toronto', postal_code: 'M5V', grid_rate: 0.16, sun_hours: 1300, grid_emissions: 0.12, cost_per_watt: 2.80 }
  ];

  const mockRebates: Rebate[] = [
    { id: 'r1', region_id: '1', authority_name: 'Federal Solar Tax Credit', technology_category: 'Federal Tax Incentive', incentive_value: 30, incentive_type: 'percentage', max_limit: null, is_active: true },
    { id: 'r2', region_id: '1', authority_name: 'California SGIP Battery Rebate', technology_category: 'Battery Storage Program', incentive_value: 2000, incentive_type: 'fixed', max_limit: 5000, is_active: true },
    { id: 'r3', region_id: '1', authority_name: 'LADWP Solar Net Incentive', technology_category: 'Local Utility Rebate', incentive_value: 0.50, incentive_type: 'per_watt', max_limit: 1500, is_active: true },
    { id: 'r4', region_id: '2', authority_name: 'Federal Solar Tax Credit', technology_category: 'Federal Tax Incentive', incentive_value: 30, incentive_type: 'percentage', max_limit: null, is_active: true },
    { id: 'r5', region_id: '2', authority_name: 'CenterPoint Energy Solar Rebate', technology_category: 'Local Utility Rebate', incentive_value: 0.75, incentive_type: 'per_watt', max_limit: 2500, is_active: true }
  ];

  // Initialize session from storage
  useEffect(() => {
    const sessionToken = sessionStorage.getItem('admin_session');
    if (sessionToken === 'live') {
      setIsLoggedIn(true);
      setIsMockMode(false);
    } else if (sessionToken === 'mock') {
      setIsLoggedIn(true);
      setIsMockMode(true);
    }
  }, []);

  // Fetch Database or LocalStorage Records
  useEffect(() => {
    if (!isLoggedIn) return;
    loadRecords();
  }, [isLoggedIn, isMockMode]);

  async function loadRecords() {
    let activeRegions: Region[] = [];
    let activeRebates: Rebate[] = [];

    // 1. Fetch from live database if available and not explicitly mock
    if (supabase && !isMockMode) {
      try {
        const { data: regionsData } = await supabase.from('regions').select('*');
        const { data: rebatesData } = await supabase.from('rebates').select('*');
        
        if (regionsData) activeRegions = regionsData;
        if (rebatesData) {
          activeRebates = rebatesData.map((item: RawRebateData) => ({
            id: item.id,
            region_id: String(item.region_id),
            authority_name: item.authority_name,
            technology_category: item.technology_category,
            incentive_value: Number(item.incentive_value),
            incentive_type: item.incentive_type,
            max_limit: item.max_limit ? Number(item.max_limit) : null,
            is_active: item.is_active
          }));
        }
      } catch (err) {
        console.error('Failed to load database records:', err);
      }
    }

    // Initialize mock database in localStorage if it doesn't exist
    if (!localStorage.getItem('local_regions')) {
      localStorage.setItem('local_regions', JSON.stringify(mockRegions));
    }
    if (!localStorage.getItem('local_rebates')) {
      localStorage.setItem('local_rebates', JSON.stringify(mockRebates));
    }

    // Merge in LocalStorage edits/additions (applies to both mock and live database modes to support offline previews)
    try {
      const localRegionsRaw = localStorage.getItem('local_regions');
      const localRebatesRaw = localStorage.getItem('local_rebates');
      
      const localRegionsList: Region[] = localRegionsRaw ? JSON.parse(localRegionsRaw) : [];
      const localRebatesList: Rebate[] = localRebatesRaw ? JSON.parse(localRebatesRaw) : [];

      if (isMockMode) {
        activeRegions = localRegionsList;
        activeRebates = localRebatesList;
      } else {
        // In live DB mode, merge localstorage modifications on top of fetched DB records for previews
        const liveRegionIds = new Set(activeRegions.map(r => String(r.id)));
        localRegionsList.forEach(r => {
          if (!liveRegionIds.has(String(r.id))) {
            activeRegions.push(r);
          }
        });

        const liveRebateIds = new Set(activeRebates.map(b => String(b.id)));
        localRebatesList.forEach(b => {
          if (!liveRebateIds.has(String(b.id))) {
            activeRebates.push(b);
          }
        });
      }
    } catch (err) {
      console.error('Failed to parse local storage records:', err);
    }

    setRegions(activeRegions);
    setRebates(activeRebates);
    if (activeRegions.length > 0 && !rebateRegionId) {
      setRebateRegionId(String(activeRegions[0].id));
    }
  }

  // Handle Authentication submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Attempt live Supabase Authentication first if configured
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (data?.session && !error) {
          setIsLoggedIn(true);
          setIsMockMode(false);
          sessionStorage.setItem('admin_session', 'live');
          triggerToast('Welcome, Administrator! Authenticated via Supabase.');
          return;
        }
      } catch (err) {
        console.warn('Supabase authentication failed, attempting offline credentials fallback.');
      }
    }

    // Offline / Mock credentials fallback
    if (email === 'admin@incentivemapper.com' && password === 'admin123') {
      setIsLoggedIn(true);
      setIsMockMode(true);
      sessionStorage.setItem('admin_session', 'mock');
      triggerToast('Offline Mock Mode active. Changes will write to LocalStorage.');
    } else {
      setErrorMsg(t.admin.loginError);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_session');
    if (supabase) {
      supabase.auth.signOut();
    }
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Add a new Region
  const handleAddRegion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName || !newState || !newPostalCode) {
      alert('Please fill out all city parameters.');
      return;
    }

    const regionData = {
      country_code: newCountry,
      state_province: newState,
      city: newCityName,
      postal_code: newPostalCode,
      grid_rate: Number(newGridRate),
      sun_hours: Number(newSunHours),
      grid_emissions: Number(newGridEmissions),
      cost_per_watt: Number(newCostPerWatt)
    };

    if (supabase && !isMockMode) {
      // Live DB Mode
      try {
        const { data, error } = await supabase
          .from('regions')
          .insert([regionData])
          .select();

        if (error) throw error;
        triggerToast(t.admin.successAddCity);
        loadRecords();
      } catch (err: any) {
        alert(`Supabase Write Error: ${err.message || err}`);
      }
    } else {
      // Mock Mode - Write to local storage
      const localRegionsRaw = localStorage.getItem('local_regions');
      const localRegions: Region[] = localRegionsRaw ? JSON.parse(localRegionsRaw) : [];
      const newId = String(localRegions.length + 101);
      const newRegionItem: Region = { id: newId, ...regionData };

      localStorage.setItem('local_regions', JSON.stringify([...localRegions, newRegionItem]));
      triggerToast(t.admin.successAddCity + ' (Saved in LocalStorage)');
      loadRecords();
    }

    // Reset inputs
    setNewCityName('');
    setNewState('');
    setNewPostalCode('');
  };

  // Add a new Rebate
  const handleAddRebate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorityName || !rebateRegionId) {
      alert('Please select a target city and provide program name.');
      return;
    }

    const rebateData = {
      region_id: rebateRegionId,
      authority_name: authorityName,
      technology_category: techCategory,
      incentive_value: Number(incentiveValue),
      incentive_type: incentiveType,
      max_limit: maxLimit ? Number(maxLimit) : null,
      is_active: isActive
    };

    if (supabase && !isMockMode) {
      // Live DB Mode
      try {
        const { error } = await supabase
          .from('rebates')
          .insert([{
            ...rebateData,
            region_id: Number(rebateRegionId) // DB requires integer bigint
          }]);

        if (error) throw error;
        triggerToast(t.admin.successAddRebate);
        loadRecords();
      } catch (err: any) {
        alert(`Supabase Rebate Write Error: ${err.message || err}`);
      }
    } else {
      // Mock Mode
      const localRebatesRaw = localStorage.getItem('local_rebates');
      const localRebates: Rebate[] = localRebatesRaw ? JSON.parse(localRebatesRaw) : [];
      const newId = `rebate-${Date.now()}`;
      const newRebateItem: Rebate = { id: newId, ...rebateData };

      localStorage.setItem('local_rebates', JSON.stringify([...localRebates, newRebateItem]));
      triggerToast(t.admin.successAddRebate + ' (Saved in LocalStorage)');
      loadRecords();
    }

    // Reset Form
    setAuthorityName('');
    setMaxLimit('');
  };

  // Trigger inline Edit mode
  const startEditRebate = (rebate: Rebate) => {
    setEditingRebateId(rebate.id);
    setEditAuthorityName(rebate.authority_name);
    setEditTechCategory(rebate.technology_category);
    setEditIncentiveValue(String(rebate.incentive_value));
    setEditIncentiveType(rebate.incentive_type);
    setEditMaxLimit(rebate.max_limit ? String(rebate.max_limit) : '');
    setEditIsActive(rebate.is_active);
  };

  // Save edited rebate
  const handleSaveRebate = async (id: string) => {
    const updatedData = {
      authority_name: editAuthorityName,
      technology_category: editTechCategory,
      incentive_value: Number(editIncentiveValue),
      incentive_type: editIncentiveType,
      max_limit: editMaxLimit ? Number(editMaxLimit) : null,
      is_active: editIsActive
    };

    if (supabase && !isMockMode && !id.startsWith('rebate-')) {
      // Live DB Mode
      try {
        const { error } = await supabase
          .from('rebates')
          .update(updatedData)
          .eq('id', id);

        if (error) throw error;
        triggerToast('Rebate details updated!');
        setEditingRebateId(null);
        loadRecords();
      } catch (err: any) {
        alert(`Supabase Update Error: ${err.message || err}`);
      }
    } else {
      // Mock Mode or local override
      const localRebatesRaw = localStorage.getItem('local_rebates');
      if (localRebatesRaw) {
        const localRebates: Rebate[] = JSON.parse(localRebatesRaw);
        const updated = localRebates.map(r => r.id === id ? { ...r, ...updatedData } : r);
        localStorage.setItem('local_rebates', JSON.stringify(updated));
        triggerToast('Rebate details updated in LocalStorage!');
        setEditingRebateId(null);
        loadRecords();
      }
    }
  };

  // Delete region
  const handleDeleteRegion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this regional hub? All linked rebates will be removed.')) return;

    if (supabase && !isMockMode && !isNaN(Number(id))) {
      try {
        const { error } = await supabase.from('regions').delete().eq('id', id);
        if (error) throw error;
        triggerToast(t.admin.successDelete);
        loadRecords();
      } catch (err: any) {
        alert(`Delete Error: ${err.message || err}`);
      }
    } else {
      const localRegionsRaw = localStorage.getItem('local_regions');
      const localRebatesRaw = localStorage.getItem('local_rebates');
      if (localRegionsRaw) {
        const list: Region[] = JSON.parse(localRegionsRaw);
        localStorage.setItem('local_regions', JSON.stringify(list.filter(r => String(r.id) !== String(id))));
      }
      if (localRebatesRaw) {
        const list: Rebate[] = JSON.parse(localRebatesRaw);
        localStorage.setItem('local_rebates', JSON.stringify(list.filter(b => String(b.region_id) !== String(id))));
      }
      triggerToast(t.admin.successDelete + ' (Removed from LocalStorage)');
      loadRecords();
    }
  };

  // Delete rebate
  const handleDeleteRebate = async (id: string) => {
    if (!confirm('Delete this rebate program specification?')) return;

    if (supabase && !isMockMode && !id.startsWith('rebate-')) {
      try {
        const { error } = await supabase.from('rebates').delete().eq('id', id);
        if (error) throw error;
        triggerToast(t.admin.successDelete);
        loadRecords();
      } catch (err: any) {
        alert(`Delete Error: ${err.message || err}`);
      }
    } else {
      const localRebatesRaw = localStorage.getItem('local_rebates');
      if (localRebatesRaw) {
        const list: Rebate[] = JSON.parse(localRebatesRaw);
        localStorage.setItem('local_rebates', JSON.stringify(list.filter(b => b.id !== id)));
        triggerToast(t.admin.successDelete + ' (Removed from LocalStorage)');
        loadRecords();
      }
    }
  };

  // Render Login Panel
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl p-8 shadow-xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-12 h-12 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full flex items-center justify-center mx-auto border border-[var(--color-accent)]/20 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight">{t.admin.loginTitle}</h2>
            <p className="text-xs text-[var(--text-muted)]">Secure administrator credentials check.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {errorMsg && (
              <div className="bg-red-500/10 text-red-500 text-xs font-semibold p-3.5 rounded-xl border border-red-500/20 text-center animate-shake">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.admin.username}</label>
              <input 
                type="email" 
                required 
                placeholder="admin@incentivemapper.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-3 px-4 outline-none focus:border-[var(--color-accent)] transition-all font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.admin.password}</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-3 px-4 outline-none focus:border-[var(--color-accent)] transition-all font-semibold"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[var(--color-accent)] hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-98 mt-2"
            >
              {t.admin.loginBtn}
            </button>
          </form>

          <div className="border-t border-[var(--color-border)]/50 pt-5 mt-6 text-center">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-primary)] border border-[var(--color-border)] px-3 py-1 rounded-full shadow-inner">
              {supabase ? 'Supabase Database Configured' : 'Offline Sandbox Sandbox active'}
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  const filteredRebates = selectedRegionId === 'all' 
    ? rebates 
    : rebates.filter(r => String(r.region_id) === String(selectedRegionId));

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 z-50 border border-white/20"
          >
            <CheckCircle className="w-5 h-5" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Sync Panel */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--color-border)] p-6 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden">
        {/* Subtle background strip */}
        <div className={`absolute left-0 top-0 bottom-0 w-2 ${isMockMode ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
        
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight">{t.admin.title}</h2>
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border shadow-sm ${
              isMockMode 
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            }`}>
              {isMockMode ? t.admin.mockMode : t.admin.liveMode}
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1.5">
            Registered: <strong>{regions.length}</strong> regions and <strong>{rebates.length}</strong> policies in workspace.
          </p>
        </div>

        <button 
          onClick={handleLogout}
          className="bg-[var(--bg-primary)] border border-[var(--color-border)] hover:border-red-500 hover:text-red-500 text-[var(--text-main)] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-97"
        >
          <LogOut className="w-4 h-4" />
          {t.admin.logoutBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* -------------------- LEFT PANEL: ADD NEW CITY -------------------- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6 shadow-md">
            <h3 className="text-lg font-black text-[var(--text-main)] mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-[var(--color-accent)]" />
              {t.admin.addCityTitle}
            </h3>

            <form onSubmit={handleAddRegion} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.admin.countryCode}</label>
                  <select 
                    value={newCountry} 
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2 px-3 outline-none text-xs font-semibold"
                  >
                    <option value="us">US (United States)</option>
                    <option value="uk">UK (United Kingdom)</option>
                    <option value="de">DE (Germany)</option>
                    <option value="ca">CA (Canada)</option>
                    <option value="au">AU (Australia)</option>
                    <option value="fr">FR (France)</option>
                    <option value="ie">IE (Ireland)</option>
                    <option value="nl">NL (Netherlands)</option>
                    <option value="nz">NZ (New Zealand)</option>
                    <option value="jp">JP (Japan)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.admin.postalCode}</label>
                  <input 
                    type="text" required placeholder="90210"
                    value={newPostalCode} onChange={(e) => setNewPostalCode(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2 px-3 outline-none text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.admin.stateProvince}</label>
                <input 
                  type="text" required placeholder="California"
                  value={newState} onChange={(e) => setNewState(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2 px-3 outline-none text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.admin.city}</label>
                <input 
                  type="text" required placeholder="Los Angeles"
                  value={newCityName} onChange={(e) => setNewCityName(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2 px-3 outline-none text-xs font-semibold"
                />
              </div>

              <div className="border-t border-[var(--color-border)]/50 pt-3 my-2">
                <span className="text-[9px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider block mb-2.5">
                  Default energy specs presets
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-[var(--text-muted)]">{t.admin.gridRate}</label>
                    <input 
                      type="number" step="0.01" required value={newGridRate} onChange={(e) => setNewGridRate(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2 px-3 outline-none text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-[var(--text-muted)]">Solar Hours (Peak/Yr)</label>
                    <input 
                      type="number" step="10" required value={newSunHours} onChange={(e) => setNewSunHours(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2 px-3 outline-none text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-[var(--text-muted)]">{t.admin.gridEmissions}</label>
                    <input 
                      type="number" step="0.01" required value={newGridEmissions} onChange={(e) => setNewGridEmissions(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2 px-3 outline-none text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-[var(--text-muted)]">{t.admin.costPerWatt}</label>
                    <input 
                      type="number" step="0.05" required value={newCostPerWatt} onChange={(e) => setNewCostPerWatt(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2 px-3 outline-none text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[var(--color-accent)] text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-97 text-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {t.admin.addCityBtn}
              </button>
            </form>
          </div>
        </div>

        {/* -------------------- RIGHT PANEL: MANAGE REBATES -------------------- */}
        <div className="lg:col-span-8 space-y-6">
          {/* Create Rebate Form */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6 shadow-md">
            <h3 className="text-lg font-black text-[var(--text-main)] mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[var(--color-accent)]" />
              {t.admin.createRebateBtn}
            </h3>

            <form onSubmit={handleAddRebate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.admin.region}</label>
                <select 
                  value={rebateRegionId} 
                  onChange={(e) => setRebateRegionId(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2.5 px-3 outline-none text-xs font-semibold appearance-none cursor-pointer"
                >
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.city} ({r.state_province}), {r.country_code.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.admin.authorityName}</label>
                <input 
                  type="text" required placeholder="LADWP Feed-in Tariff"
                  value={authorityName} onChange={(e) => setAuthorityName(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2.5 px-3 outline-none text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 md:col-span-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.admin.techCategory}</label>
                  <select 
                    value={techCategory} 
                    onChange={(e) => setTechCategory(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2 px-3 outline-none text-xs font-semibold"
                  >
                    <option value="Solar Sizing / Tax Program">Solar Tax Credit</option>
                    <option value="Battery Storage Program">Battery Storage</option>
                    <option value="Heat Pump Subsidy">Heat Pump Grant</option>
                    <option value="Local Utility Rebate">Local Utility Offset</option>
                    <option value="National Feed-in Tariff">National Feed-in Tariff</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.admin.incentiveValue}</label>
                  <input 
                    type="number" step="0.01" required value={incentiveValue} onChange={(e) => setIncentiveValue(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2 px-3 outline-none text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.admin.incentiveType}</label>
                  <select 
                    value={incentiveType} 
                    onChange={(e) => setIncentiveType(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2 px-3 outline-none text-xs font-semibold"
                  >
                    <option value="fixed">Fixed Grant ($)</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="per_watt">Per Watt ($/W)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:col-span-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{t.admin.maxLimit}</label>
                  <input 
                    type="number" placeholder="5000"
                    value={maxLimit} onChange={(e) => setMaxLimit(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-xl py-2 px-3 outline-none text-xs font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input 
                    type="checkbox" id="is-active"
                    checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                  />
                  <label htmlFor="is-active" className="text-xs font-bold text-[var(--text-main)]">{t.admin.isActive}</label>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full md:col-span-2 bg-[var(--color-accent)] text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-97 text-xs flex items-center justify-center gap-1.5 mt-2"
              >
                <Plus className="w-4 h-4" />
                {t.admin.createRebateBtn}
              </button>
            </form>
          </div>

          {/* Rebates Management List */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6 shadow-md overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-black text-[var(--text-main)] flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[var(--color-accent)]" />
                {t.admin.manageRebatesTitle}
              </h3>

              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
                <span>Filter:</span>
                <select 
                  value={selectedRegionId} 
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  className="bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded-lg py-1 px-2 outline-none cursor-pointer"
                >
                  <option value="all">All Registered Regions</option>
                  {regions.map(r => (
                    <option key={r.id} value={r.id}>{r.city} ({r.state_province})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--text-muted)] font-extrabold uppercase tracking-wider">
                    <th className="pb-3 pr-2">Region</th>
                    <th className="pb-3 px-2">{t.admin.authorityName}</th>
                    <th className="pb-3 px-2">{t.admin.techCategory}</th>
                    <th className="pb-3 px-2">Incentive</th>
                    <th className="pb-3 px-2">Cap</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 pl-2 text-right">{t.admin.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/50 font-semibold text-[var(--text-main)]">
                  {filteredRebates.map(r => {
                    const matchedRegion = regions.find(reg => String(reg.id) === String(r.region_id));
                    const isEditing = editingRebateId === r.id;

                    return (
                      <tr key={r.id} className="hover:bg-[var(--bg-primary)]/30 transition-colors">
                        <td className="py-3.5 pr-2 font-bold max-w-[100px] truncate">
                          {matchedRegion ? matchedRegion.city : `Region ID ${r.region_id}`}
                        </td>
                        
                        <td className="py-3.5 px-2">
                          {isEditing ? (
                            <input 
                              type="text" value={editAuthorityName} onChange={(e) => setEditAuthorityName(e.target.value)}
                              className="bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded px-2 py-1 outline-none text-xs font-semibold w-full"
                            />
                          ) : r.authority_name}
                        </td>

                        <td className="py-3.5 px-2 font-medium">
                          {isEditing ? (
                            <select 
                              value={editTechCategory} onChange={(e) => setEditTechCategory(e.target.value)}
                              className="bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded px-1.5 py-1 outline-none text-xs font-semibold"
                            >
                              <option value="Federal Tax Incentive">Solar Tax Credit</option>
                              <option value="Battery Storage Program">Battery Storage</option>
                              <option value="Heat Pump Subsidy">Heat Pump Grant</option>
                              <option value="Local Utility Rebate">Local Utility Offset</option>
                              <option value="National Feed-in Tariff">National Feed-in Tariff</option>
                            </select>
                          ) : r.technology_category}
                        </td>

                        <td className="py-3.5 px-2 font-black">
                          {isEditing ? (
                            <div className="flex gap-1.5 items-center max-w-[120px]">
                              <input 
                                type="number" step="0.01" value={editIncentiveValue} onChange={(e) => setEditIncentiveValue(e.target.value)}
                                className="bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded px-1.5 py-1 outline-none text-xs font-semibold w-14"
                              />
                              <select 
                                value={editIncentiveType} onChange={(e) => setEditIncentiveType(e.target.value)}
                                className="bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded px-1 py-1 outline-none text-[10px] font-semibold"
                              >
                                <option value="fixed">$</option>
                                <option value="percentage">%</option>
                                <option value="per_watt">/W</option>
                              </select>
                            </div>
                          ) : (
                            <>
                              {r.incentive_type === 'percentage' && `${r.incentive_value}%`}
                              {r.incentive_type === 'fixed' && `$${r.incentive_value.toLocaleString()}`}
                              {r.incentive_type === 'per_watt' && `$${r.incentive_value}/W`}
                            </>
                          )}
                        </td>

                        <td className="py-3.5 px-2 text-[var(--text-muted)] font-bold">
                          {isEditing ? (
                            <input 
                              type="number" placeholder="No cap" value={editMaxLimit} onChange={(e) => setEditMaxLimit(e.target.value)}
                              className="bg-[var(--bg-primary)] border border-[var(--color-border)] text-[var(--text-main)] rounded px-1.5 py-1 outline-none text-xs font-semibold w-20"
                            />
                          ) : r.max_limit ? `$${r.max_limit.toLocaleString()}` : '-'}
                        </td>

                        <td className="py-3.5 px-2">
                          {isEditing ? (
                            <input 
                              type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)}
                              className="w-4 h-4 accent-[var(--color-accent)]"
                            />
                          ) : (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                              r.is_active 
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-600 border-red-500/20'
                            }`}>
                              {r.is_active ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 pl-2 text-right">
                          {isEditing ? (
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => handleSaveRebate(r.id)}
                                className="text-emerald-500 hover:opacity-80 p-1 rounded hover:bg-emerald-500/10 transition-colors"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setEditingRebateId(null)}
                                className="text-[var(--text-muted)] hover:opacity-80 p-1 rounded hover:bg-[var(--color-border)]/20 transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2 justify-end opacity-60 hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => startEditRebate(r)}
                                className="text-[var(--color-accent)] hover:opacity-80 p-1 rounded hover:bg-[var(--color-accent)]/10 transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteRebate(r.id)}
                                className="text-red-500 hover:opacity-80 p-1 rounded hover:bg-red-500/10 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  
                  {filteredRebates.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-[var(--text-muted)] font-medium">
                        No rebate specifications registered for this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Registered Regions List */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6 shadow-md overflow-hidden">
            <h3 className="text-lg font-black text-[var(--text-main)] mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[var(--color-accent)]" />
              Registered Regional Hubs ({regions.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regions.map(reg => (
                <div key={reg.id} className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-2xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="font-bold text-sm text-[var(--text-main)]">{reg.city}, {reg.state_province}</h4>
                    <span className="text-[10px] font-black bg-[var(--bg-secondary)] border border-[var(--color-border)] px-2 py-0.5 rounded uppercase tracking-wider text-[var(--text-muted)] mr-2">
                      {reg.country_code.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)]">Postal: {reg.postal_code}</span>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2.5 text-[10px] text-[var(--text-muted)] font-semibold">
                      <div>Rate: <span className="text-[var(--text-main)] font-bold">${reg.grid_rate}/kWh</span></div>
                      <div>Sun: <span className="text-[var(--text-main)] font-bold">{reg.sun_hours} hrs/yr</span></div>
                      <div>Carbon: <span className="text-[var(--text-main)] font-bold">{reg.grid_emissions} kg/kWh</span></div>
                      <div>Cost: <span className="text-[var(--text-main)] font-bold">${reg.cost_per_watt}/W</span></div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteRegion(reg.id)}
                    className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-colors self-start"
                    title="Delete Region"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

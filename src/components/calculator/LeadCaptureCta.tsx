import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface LeadCaptureCtaProps {
  region: string;
  calculatorType: 'residential' | 'commercial';
}

export default function LeadCaptureCta({ region, calculatorType }: LeadCaptureCtaProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const storageKey = 'incentivemapper-lead-cta-dismissed';

  useEffect(() => {
    // Only show if not previously dismissed
    const dismissed = localStorage.getItem(storageKey);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    const payload = {
      name: name.trim(),
      email: email.trim(),
      region,
      calculatorType,
      timestamp: new Date().toISOString()
    };

    const endpoint = import.meta.env.PUBLIC_LEAD_CAPTURE_URL;

    try {
      if (!endpoint) {
        // Mock simulation mode when endpoint is not configured (development fallback)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStatus('success');
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Server returned an error status.');
      }

      const result = await response.json();
      if (result.status === 'success') {
        setStatus('success');
      } else {
        throw new Error(result.message || 'Submission failed.');
      }
    } catch (err: any) {
      console.error('Lead capture error:', err);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300"
      >
        {/* Top accent blur background */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full blur-xl" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-secondary)] p-1.5 rounded-full transition-all cursor-pointer z-10"
          aria-label="Dismiss lead form"
        >
          <X className="w-4 h-4" />
        </button>

        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-6 space-y-3"
          >
            <div className="p-3 bg-green-500/10 rounded-full text-green-500">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">Thank You!</h3>
            <p className="text-sm text-[var(--text-muted)] max-w-sm">
              We have received your request. A solar specialist will review your regional rebates and contact you shortly.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                <Mail className="w-5 h-5 text-[var(--color-accent)]" />
                Get Your Custom Solar Rebate Report
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Receive a detailed breakdown of active utility incentives, federal tax credits, and payback scenarios for <span className="text-[var(--text-main)] font-semibold">{region}</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    disabled={status === 'loading'}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email Address"
                    disabled={status === 'loading'}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  />
                </div>
              </div>

              {status === 'error' && (
                <div className="text-xs text-red-500 flex items-center gap-1.5 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={status === 'loading' || !name.trim() || !email.trim()}
                  className="bg-[var(--color-accent)] hover:opacity-90 disabled:opacity-50 text-white font-bold text-sm px-6 py-2.5 rounded-xl cursor-pointer transition-opacity flex items-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Request Free Report'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

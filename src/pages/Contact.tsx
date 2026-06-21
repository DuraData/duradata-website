import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle, AlertTriangle, Send, Calendar } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
}

export default function Contact() {
  const [searchParams] = useSearchParams();
  const interestParam = searchParams.get('interest') || '';
  const messageParam = searchParams.get('message') || '';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    interest: interestParam,
    message: messageParam,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync search parameters if they change
  useEffect(() => {
    if (interestParam) {
      setFormData(prev => ({ ...prev, interest: interestParam }));
    }
    if (messageParam) {
      setFormData(prev => ({ ...prev, message: messageParam }));
    }
  }, [interestParam, messageParam]);

  const interestOptions = [
    'Data Analytics',
    'Artificial Intelligence',
    'Power BI',
    'Tableau',
    'Power Platform',
    'Azure',
    'AWS',
    'Website Development',
    'Application Development',
    'Training',
    'Other'
  ];

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required.';
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required.';
      isValid = false;
    } else if (!/^\+?[0-9\s-]{9,15}$/.test(formData.phone)) {
      tempErrors.phone = 'Please enter a valid phone number.';
      isValid = false;
    }

    if (!formData.interest) {
      tempErrors.interest = 'Please select a service interest.';
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required.';
      isValid = false;
    } else if (formData.message.length < 10) {
      tempErrors.message = 'Message must be at least 10 characters long.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error dynamically
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API submit
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          interest: '',
          message: '',
        });
      }, 1500);
    }
  };

  return (
    <div className="pt-24 pb-20 relative">
      {/* Decorative Glow */}
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-brand-teal uppercase tracking-widest"
          >
            Connect With Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white"
          >
            Let's Discuss Your <span className="text-gradient-primary">Next Project</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Have a question about data integration, custom apps, or training packages? Send us a message and a consultant will follow up with you.
          </motion.p>
        </div>
      </section>

      {/* Content Form and details */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <AnimatedSection className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col gap-6">
              <h3 className="text-xl font-bold text-white">Office Contact Info</h3>
              
              <ul className="flex flex-col gap-6 text-sm text-slate-300">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-slate-500 font-mono">EMAIL</span>
                    <a href="mailto:info@duradata.co.za" className="hover:text-brand-teal transition-colors font-bold">
                      info@duradata.co.za
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-azure/10 border border-brand-azure/20 flex items-center justify-center text-brand-azure shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-slate-500 font-mono">PHONE</span>
                    <a href="tel:+27110000000" className="hover:text-brand-teal transition-colors font-bold">
                      +27 (11) 123-4567
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-slate-500 font-mono">HEADQUARTERS</span>
                    <span className="leading-relaxed">
                      100 Melrose Boulevard, Melrose Arch, Johannesburg, 2076, South Africa
                    </span>
                  </div>
                </li>
              </ul>
            </AnimatedSection>

            {/* Quick Consultation block */}
            <AnimatedSection className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-r from-brand-blue/20 to-brand-azure/10 flex items-start gap-4">
              <Calendar className="w-8 h-8 text-brand-teal shrink-0" />
              <div className="flex flex-col gap-2">
                <h4 className="text-base font-bold text-white">Virtual Audits Available</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We schedule 30-minute MS Teams or Zoom calls to analyze your current spreadsheet architectures and SQL structures.
                </p>
              </div>
            </AnimatedSection>

            {/* Google Map Mockup */}
            <AnimatedSection className="glass-panel h-[200px] rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-slate-950 opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
              {/* Abstract SVG grid representation of a map */}
              <svg viewBox="0 0 400 200" className="w-full h-full text-brand-blue/20" stroke="currentColor" strokeWidth="1">
                <line x1="0" y1="50" x2="400" y2="50" />
                <line x1="0" y1="120" x2="400" y2="120" />
                <line x1="100" y1="0" x2="100" y2="200" />
                <line x1="280" y1="0" x2="280" y2="200" />
                {/* Diagonal highway */}
                <line x1="0" y1="180" x2="400" y2="20" strokeWidth="3" className="text-brand-teal/10" />
                {/* Melrose Arch Pin */}
                <circle cx="280" cy="120" r="8" className="fill-brand-teal text-none animate-ping" />
                <circle cx="280" cy="120" r="5" className="fill-brand-teal text-none" />
              </svg>
              <div className="absolute px-4 py-2 bg-brand-deep/80 backdrop-blur rounded-lg border border-white/10 text-xs font-mono text-slate-300">
                Johannesburg, South Africa
              </div>
            </AnimatedSection>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <AnimatedSection className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/5">
              <AnimatePresence mode="wait">
                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-16 flex flex-col items-center gap-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl font-bold text-white">Consultation Requested!</h3>
                      <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Thank you for reaching out. A DuraData consulting manager will review your submission and email you back within 24 hours.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="px-6 py-2.5 rounded-full bg-brand-deep border border-white/15 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 rounded-xl bg-brand-deep/80 border text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-teal transition-colors ${
                            errors.name ? 'border-red-500/50' : 'border-white/5'
                          }`}
                        />
                        {errors.name && (
                          <span className="text-[10px] text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.name}
                          </span>
                        )}
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                          Business Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                          className={`w-full px-4 py-3 rounded-xl bg-brand-deep/80 border text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-teal transition-colors ${
                            errors.email ? 'border-red-500/50' : 'border-white/5'
                          }`}
                        />
                        {errors.email && (
                          <span className="text-[10px] text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="phone" className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+27 11 123 4567"
                          className={`w-full px-4 py-3 rounded-xl bg-brand-deep/80 border text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-teal transition-colors ${
                            errors.phone ? 'border-red-500/50' : 'border-white/5'
                          }`}
                        />
                        {errors.phone && (
                          <span className="text-[10px] text-red-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.phone}
                          </span>
                        )}
                      </div>

                      {/* Company */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="company" className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Acme Holdings"
                          className="w-full px-4 py-3 rounded-xl bg-brand-deep/80 border border-white/5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-teal transition-colors"
                        />
                      </div>
                    </div>

                    {/* Interest Dropdown */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="interest" className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Service Interest *
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-brand-deep/80 border text-sm text-white focus:outline-none focus:border-brand-teal transition-colors appearance-none ${
                          errors.interest ? 'border-red-500/50' : 'border-white/5'
                        }`}
                      >
                        <option value="" disabled className="bg-brand-deep">Select an option...</option>
                        {interestOptions.map(opt => (
                          <option key={opt} value={opt} className="bg-slate-900 text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.interest && (
                        <span className="text-[10px] text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {errors.interest}
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Project Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us about your database structure, key objectives, or training requirements..."
                        className={`w-full px-4 py-3 rounded-xl bg-brand-deep/80 border text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-teal transition-colors resize-none ${
                          errors.message ? 'border-red-500/50' : 'border-white/5'
                        }`}
                      />
                      {errors.message && (
                        <span className="text-[10px] text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {errors.message}
                        </span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-blue to-brand-azure text-sm font-bold text-white shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 disabled:opacity-50 transition-all duration-200"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Sending Request...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Request Consultation</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </AnimatedSection>
          </div>

        </div>
      </section>
    </div>
  );
}

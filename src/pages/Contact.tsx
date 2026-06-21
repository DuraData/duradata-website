import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  CheckCircle,
  AlertTriangle,
  Send,
  Target,
  LifeBuoy,
  Lightbulb,
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

interface FormData {
  name: string;
  email: string;
  address: string;
  residentialBusiness: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  residentialBusiness?: string;
  message?: string;
}

const faqItems = [
  {
    question: 'What types of data analytics training do you offer?',
    answer:
      'We offer beginner to advanced training in data analytics, covering tools like Excel, Power BI, Tableau, SQL, Python, and R, as well as topics like data visualization, data cleaning, and machine learning fundamentals.',
  },
  {
    question: 'Do I need prior experience in data analytics to enroll?',
    answer:
      'Not at all! We offer beginner-friendly courses that start with the basics. No prior experience is needed unless you are enrolling in an advanced-level program.',
  },
  {
    question: 'Do you offer corporate or group training programs?',
    answer:
      'Absolutely. We specialize in custom corporate training tailored to your team\'s skill level, tools, and business goals. Reach out to our sales team to learn more.',
  },
  {
    question: 'Who are the courses designed for?',
    answer:
      'Our courses are designed for individuals at all levels - students, professionals looking to upskill, and organizations seeking custom training for their teams.',
  },
  {
    question: 'Are the courses instructor-led or self-paced?',
    answer:
      'We provide both options. You can join live, instructor-led sessions or choose self-paced modules, depending on your schedule and learning preference.',
  },
  {
    question: 'How do I access the training materials?',
    answer:
      'Once enrolled, you will receive access to our learning portal, where you can download resources, watch recordings, and track your progress.',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    address: '',
    residentialBusiness: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

    if (!formData.address.trim()) {
      tempErrors.address = 'Address is required.';
      isValid = false;
    }

    if (!formData.residentialBusiness) {
      tempErrors.residentialBusiness = 'Please select Residential or Business.';
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required.';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters long.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      setIsSubmitting(true);

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          address: '',
          residentialBusiness: '',
          message: '',
        });
      }, 1500);
    }
  };

  return (
    <div className="pt-24 pb-20 relative">
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />

      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-brand-teal uppercase tracking-widest"
          >
            Contact info
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white"
          >
            Contact <span className="text-gradient-primary">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Whether you have a question, need a custom solution, or just want to learn more about our services, our team is ready to assist you. Reach out to us anytime - we are committed to providing prompt and helpful responses to support your goals.
          </motion.p>
        </div>
      </section>

      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <AnimatedSection className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-white">Contact Sales</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Looking for the right solution? Our sales team is here to help with quotes, product info, and tailored options to fit your needs.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-azure/10 border border-brand-azure/20 flex items-center justify-center text-brand-azure shrink-0">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-white">Contact Support</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Our support team is here to assist you with any questions, issues, or technical concerns. We are just a message away.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-white">Request a Feature</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Have an Idea? We would love to hear it! Share your feature request and help us improve your experience.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection className="glass-panel p-8 rounded-2xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-6">Office Contact Details</h3>
              <ul className="flex flex-col gap-6 text-sm text-slate-300">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-slate-500 font-mono">OFFICE</span>
                    <span>512 The Himalaya</span>
                    <span>Durban 4001</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal shrink-0">
                    <Clock3 className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-slate-500 font-mono">HOURS</span>
                    <span>Mon - Fri : 08am - 16:00pm</span>
                    <span>S-S: Closed</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-azure/10 border border-brand-azure/20 flex items-center justify-center text-brand-azure shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-slate-500 font-mono">CALL US</span>
                    <a href="tel:+27638610733" className="hover:text-brand-teal transition-colors">
                      +27 63 861 0733
                    </a>
                    <a href="tel:+27631692324" className="hover:text-brand-teal transition-colors">
                      +27 63 169 2324
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-slate-500 font-mono">EMAIL</span>
                    <a href="mailto:info@duradata.co.za" className="hover:text-brand-teal transition-colors">
                      info@duradata.co.za
                    </a>
                  </div>
                </li>
              </ul>
            </AnimatedSection>
          </div>

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
                      <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                      <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Thank you for contacting us. Our team will get back to you shortly.
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
                    <h3 className="text-2xl font-bold text-white">We are Here To Help!</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Name"
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

                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email Address"
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

                    <div className="flex flex-col gap-2">
                      <label htmlFor="address" className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className={`w-full px-4 py-3 rounded-xl bg-brand-deep/80 border text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-teal transition-colors ${
                          errors.address ? 'border-red-500/50' : 'border-white/5'
                        }`}
                      />
                      {errors.address && (
                        <span className="text-[10px] text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {errors.address}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="residentialBusiness" className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Residential/Business
                      </label>
                      <select
                        id="residentialBusiness"
                        name="residentialBusiness"
                        value={formData.residentialBusiness}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-brand-deep/80 border text-sm text-white focus:outline-none focus:border-brand-teal transition-colors appearance-none ${
                          errors.residentialBusiness ? 'border-red-500/50' : 'border-white/5'
                        }`}
                      >
                        <option value="" disabled className="bg-brand-deep">
                          Select one...
                        </option>
                        <option value="Residential" className="bg-slate-900 text-white">
                          Residential
                        </option>
                        <option value="Business" className="bg-slate-900 text-white">
                          Business
                        </option>
                      </select>
                      {errors.residentialBusiness && (
                        <span className="text-[10px] text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {errors.residentialBusiness}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Message"
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

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-blue to-brand-azure text-sm font-bold text-white shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 disabled:opacity-50 transition-all duration-200"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>send messages</span>
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

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center flex flex-col items-center gap-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-slate-300 max-w-3xl text-sm leading-relaxed">
              Our FAQ section covers the most common questions about our services, features, pricing, and support. Whether you are just getting started or need help with something specific, you will find quick, helpful answers right here.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((item, idx) => (
              <AnimatedSection
                key={item.question}
                delay={idx * 0.04}
                className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-3"
              >
                <h3 className="text-base font-bold text-white leading-relaxed">{item.question}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{item.answer}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
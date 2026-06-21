import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock3, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Training Academy', path: '/training' },
    { name: 'Case Studies', path: '/case-studies' },
  ];

  const techLinks = [
    { name: 'Microsoft Power Platform', path: '/solutions#power-platform' },
    { name: 'Power BI Analytics', path: '/solutions#power-bi' },
    { name: 'Tableau Visualizations', path: '/solutions#tableau' },
    { name: 'Microsoft Azure Cloud', path: '/solutions#azure' },
    { name: 'AWS Cloud Infrastructure', path: '/solutions#aws' },
    { name: 'Python Data Science', path: '/training' },
  ];

  const socialLinks = [
    { 
      name: 'LinkedIn', 
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" stroke="none">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ), 
      url: 'https://linkedin.com' 
    },
    { 
      name: 'Facebook', 
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" stroke="none">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
        </svg>
      ), 
      url: 'https://facebook.com' 
    },
    { 
      name: 'X', 
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" stroke="none">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ), 
      url: 'https://twitter.com' 
    },
    { 
      name: 'YouTube', 
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" stroke="none">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.525 3.545 12 3.545 12 3.545s-7.525 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.025 0 12 0 12s0 3.975.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.863.508 9.388.508 9.388.508s7.525 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.975 24 12 24 12s0-3.975-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ), 
      url: 'https://youtube.com' 
    },
  ];

  return (
    <footer className="bg-brand-deep border-t border-white/5 relative z-10 pt-20 pb-10">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-40 bg-gradient-to-t from-brand-blue/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand & Mission */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-3">
            <svg 
              viewBox="0 0 100 100" 
              className="w-8 h-8 text-brand-teal"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="10"
            >
              <path d="M 85 15 L 15 15 L 15 85 L 85 85" strokeLinecap="square" />
              <rect x="45" y="45" width="20" height="20" className="fill-brand-blue stroke-none" />
            </svg>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white">
                Dura<span className="text-brand-teal">Data</span>
              </span>
              <span className="text-[9px] tracking-[0.12em] text-slate-400 uppercase -mt-1 font-semibold">
                Transforming Data
              </span>
            </div>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Empowering organizations with state-of-the-art data analytics, artificial intelligence, cloud infrastructure, automation, custom applications, and professional training.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full glass-panel-light flex items-center justify-center text-slate-400 hover:text-brand-teal hover:border-brand-teal/40 transition-all duration-300"
                aria-label={`Follow us on ${social.name}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-base font-bold text-white tracking-wider uppercase mb-6">Company</h4>
          <ul className="flex flex-col gap-3">
            {companyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-sm text-slate-400 hover:text-brand-teal transition-colors flex items-center gap-1 group"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all duration-200" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div>
          <h4 className="text-base font-bold text-white tracking-wider uppercase mb-6">Technologies</h4>
          <ul className="flex flex-col gap-3">
            {techLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-sm text-slate-400 hover:text-brand-teal transition-colors flex items-center gap-1 group"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all duration-200" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-base font-bold text-white tracking-wider uppercase mb-6">Contact Us</h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-500 font-mono">OFFICE</span>
                <span>512 The Himalaya</span>
                <span>Durban 4001</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock3 className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-500 font-mono">HOURS</span>
                <span>Mon - Fri : 08am - 16:00pm</span>
                <span>S-S: Closed</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
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
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-500 font-mono">EMAIL</span>
                <a href="mailto:info@duradata.co.za" className="hover:text-brand-teal transition-colors">
                  info@duradata.co.za
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          &copy; {currentYear} DuraData (Pty) Ltd. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link to="/contact?message=Hi%2C%20please%20share%20your%20Privacy%20Policy." className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <Link to="/contact?message=Hi%2C%20please%20share%20your%20Terms%20of%20Service." className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          <Link to="/contact?message=Hi%2C%20please%20share%20your%20PAIA%20Manual." className="hover:text-slate-300 transition-colors">PAIA Manual</Link>
        </div>
      </div>
    </footer>
  );
}

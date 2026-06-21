import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart3, Brain, Database, Cpu, Cloud, Laptop, Code, GraduationCap, 
  ArrowRight, Zap, TrendingUp, CheckCircle
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

export default function Home() {
  const partners = [
    { name: 'Microsoft Power Platform', desc: 'Custom apps & workflow automation' },
    { name: 'Microsoft Azure', desc: 'Enterprise data warehousing & AI' },
    { name: 'AWS Consulting', desc: 'Scalable cloud infrastructure & ETL' },
    { name: 'Power BI', desc: 'Interactive dashboards & BI architecture' },
    { name: 'Tableau', desc: 'Advanced analytics & visualization' },
    { name: 'Python', desc: 'Machine learning & automation scripting' },
    { name: 'SQL & Database', desc: 'Robust data modeling & warehousing' },
    { name: 'React Development', desc: 'Modern web & business applications' }
  ];

  const services = [
    {
      icon: <BarChart3 className="w-8 h-8 text-brand-teal" />,
      title: 'Data Analytics',
      desc: 'Business insights, KPIs, and interactive reporting that turn complex raw data into actionable strategies.'
    },
    {
      icon: <Brain className="w-8 h-8 text-cyan-400" />,
      title: 'Artificial Intelligence',
      desc: 'Predictive analytics, custom machine learning models, and automated cognitive systems built for business.'
    },
    {
      icon: <Database className="w-8 h-8 text-brand-blue" />,
      title: 'Business Intelligence',
      desc: 'Robust corporate data warehouses, ETL data pipelines, and executive dashboards for real-time visibility.'
    },
    {
      icon: <Cpu className="w-8 h-8 text-brand-teal" />,
      title: 'Power Platform',
      desc: 'Rapid application development and automated workflows utilizing Power Apps, Power Automate, and Dataverse.'
    },
    {
      icon: <Cloud className="w-8 h-8 text-brand-azure" />,
      title: 'Azure Solutions',
      desc: 'Scalable, secure cloud environments configured for data engineering, serverless applications, and enterprise AI.'
    },
    {
      icon: <Cloud className="w-8 h-8 text-blue-500" />,
      title: 'AWS Solutions',
      desc: 'Cloud-native analytics infrastructure, serverless computing, and enterprise data lake architectures.'
    },
    {
      icon: <Laptop className="w-8 h-8 text-brand-teal" />,
      title: 'Website Development',
      desc: 'Premium, fast, modern, and SEO-friendly corporate portals, intranets, and customer-facing websites.'
    },
    {
      icon: <Code className="w-8 h-8 text-cyan-400" />,
      title: 'Application Development',
      desc: 'Tailor-made web applications, enterprise systems, custom CRMs, and database-driven software architectures.'
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-brand-blue" />,
      title: 'Training Academy',
      desc: 'Expert-led corporate training and workshops across Excel, Power BI, SQL, Python, Cloud, and Power Platform.'
    }
  ];

  const whyChooseUs = [
    { title: 'Better Decision Making', desc: 'Replace guesswork with concrete data-backed logic.' },
    { title: 'Operational Efficiency', desc: 'Automate repetitive tasks and manual reporting workflows.' },
    { title: 'Reduced Costs', desc: 'Eliminate duplicate licensing, legacy servers, and bad data overhead.' },
    { title: 'Increased Productivity', desc: 'Equip your staff with streamlined apps and rapid self-service dashboards.' },
    { title: 'Data-Driven Culture', desc: 'Promote data literacy and empower teams to self-serve insights.' },
    { title: 'Faster Reporting', desc: 'Generate complex monthly executive reports in seconds instead of weeks.' },
    { title: 'Business Automation', desc: 'Connect disparate software systems using smart API integrations.' },
    { title: 'Scalable Cloud Solutions', desc: 'Grow your infrastructure on-demand with modern cloud architectures.' }
  ];

  const statistics = [
    { count: '100+', label: 'Projects Delivered' },
    { count: '50+', label: 'Organizations Trained' },
    { count: '10+', label: 'Technologies Supported' },
    { count: '95%', label: 'Client Satisfaction' }
  ];

  const testimonials = [
    {
      quote: "DuraData revolutionized our financial reporting. What used to take our accounting team five days to compile in Excel now updates automatically in a Power BI dashboard every morning. The ROI was almost immediate.",
      author: "Nomvula Khumalo",
      role: "Finance Director, Vuka Capital",
      tags: ["Power BI", "Data Warehousing"]
    },
    {
      quote: "The custom Power Apps solution DuraData built for our logistics team eliminated paper forms entirely. Our drivers log deliveries in real-time, feeding directly into our Azure database. Absolute game changer.",
      author: "David Miller",
      role: "Operations Manager, Apex Logistics",
      tags: ["Power Platform", "Azure"]
    },
    {
      quote: "Their SQL and Python training program was exceptional. They customized the curriculum to our actual company data, meaning our analysts were writing useful production scripts before the course even finished.",
      author: "Dr. Sarah Jenkins",
      role: "Head of Talent Development, MedTech Group",
      tags: ["Corporate Training", "Python"]
    }
  ];

  return (
    <div className="relative overflow-hidden pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center py-20 px-6">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-teal/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-light text-brand-teal text-xs font-semibold tracking-wider uppercase self-start"
            >
              <Zap className="w-3.5 h-3.5 text-brand-teal animate-pulse" />
              <span>Transforming Data Into Decisions</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white"
            >
              Transform Data Into <span className="text-gradient-primary">Business Growth</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-300 leading-relaxed max-w-xl"
            >
              DuraData helps organizations unlock the full value of their data through analytics, artificial intelligence, cloud solutions, business intelligence, automation, and custom application development.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 mt-4"
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-blue to-brand-azure text-base font-bold text-white shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-panel text-base font-bold text-white hover:bg-white/5 transition-all duration-200"
              >
                <span>Explore Services</span>
              </Link>
            </motion.div>
          </div>

          {/* Premium Dashboard-Inspired SVG Visual */}
          <div className="lg:col-span-5 relative w-full h-full min-h-[350px] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-[450px] aspect-square rounded-2xl glass-panel p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between"
            >
              {/* Animated decorative glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/20 blur-[50px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-blue/20 blur-[50px] rounded-full" />

              {/* Fake Dashboard Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-[10px] text-slate-400 font-mono ml-2">duradata_analytics_v3.2</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-brand-teal/10 text-[9px] text-brand-teal font-mono">
                  LIVE STREAM
                </div>
              </div>

              {/* Chart Mockup Grid */}
              <div className="grid grid-cols-2 gap-4 grow">
                {/* Metric 1 */}
                <div className="glass-panel-light p-3 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Revenue Target</span>
                    <TrendingUp className="w-3.5 h-3.5 text-brand-teal" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold font-mono text-white">$1.24M</span>
                    <span className="text-[9px] text-brand-teal font-medium">+14.2% MoM</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="glass-panel-light p-3 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>AI Model Accuracy</span>
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold font-mono text-white">98.4%</span>
                    <span className="text-[9px] text-cyan-400 font-medium">Optimal Status</span>
                  </div>
                </div>

                {/* Big Bar Chart Block */}
                <div className="col-span-2 glass-panel-light p-3 rounded-xl flex flex-col justify-between h-[120px]">
                  <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>Weekly Performance & Cloud Resources</span>
                    <span className="text-[9px] font-mono text-slate-500">Node: us-east-2</span>
                  </div>
                  {/* Bars */}
                  <div className="flex items-end justify-between h-[70px] px-2 pt-2 gap-1.5">
                    {[40, 65, 50, 85, 60, 95, 75, 55, 90, 80].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        className={`w-full rounded-t-sm ${
                          i % 3 === 0 
                            ? 'bg-brand-blue' 
                            : i % 3 === 1 
                            ? 'bg-brand-teal' 
                            : 'bg-brand-azure'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer labels */}
              <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono mt-4 pt-3 border-t border-white/5">
                <span>CPU: 14.8%</span>
                <span>RAM: 4.2GB / 16GB</span>
                <span>PING: 12ms</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted Technology Partner Section */}
      <section className="py-20 px-6 border-t border-white/5 bg-slate-900/30 relative">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection className="flex flex-col items-center gap-4 mb-16">
            <span className="text-sm font-bold text-brand-teal uppercase tracking-widest">Global Competence</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Trusted Technology Partners</h2>
            <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
              We leverage market-leading platforms and tools to build robust architectures that stand the test of scale, security, and performance.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner, idx) => (
              <AnimatedSection
                key={partner.name}
                delay={idx * 0.05}
                className="gradient-border-card p-6 flex flex-col justify-between items-start text-left group"
              >
                <div className="flex flex-col gap-2">
                  <div className="h-1 w-8 bg-brand-blue group-hover:bg-brand-teal group-hover:w-16 transition-all duration-300 rounded" />
                  <h3 className="text-lg font-bold text-white mt-2">{partner.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{partner.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-brand-teal mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16">
            <AnimatedSection className="flex flex-col gap-3">
              <span className="text-sm font-bold text-brand-teal uppercase tracking-widest">Our Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Enterprise Consulting Services</h2>
            </AnimatedSection>
            <AnimatedSection className="shrink-0">
              <Link 
                to="/services" 
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-teal hover:text-white transition-colors"
              >
                <span>View detailed services catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <AnimatedSection
                key={service.title}
                delay={idx * 0.05}
                className="glass-panel p-8 rounded-2xl hover:bg-slate-800/40 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group border border-white/5"
              >
                <div className="flex flex-col gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-deep border border-white/10 flex items-center justify-center group-hover:border-brand-teal/40 group-hover:bg-brand-blue/10 transition-all duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-teal transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/5 flex justify-end">
                  <Link
                    to="/services"
                    className="text-xs font-semibold text-slate-400 group-hover:text-brand-teal flex items-center gap-1.5 transition-colors"
                  >
                    <span>Read Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose DuraData */}
      <section className="py-24 px-6 border-t border-white/5 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-sm font-bold text-brand-teal uppercase tracking-widest">Business Value</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why Partner With DuraData</h2>
            <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
              We design and construct digital workflows, dashboards, databases, and systems that generate clear, quantifiable value for operations and finances.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, idx) => (
              <AnimatedSection
                key={item.title}
                delay={idx * 0.05}
                className="flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center shrink-0 border border-brand-teal/20 text-brand-teal">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics section */}
      <section className="py-20 px-6 bg-gradient-to-r from-brand-blue/20 to-brand-azure/10 border-y border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.05),transparent)]" />
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
          {statistics.map((stat, idx) => (
            <AnimatedSection
              key={stat.label}
              delay={idx * 0.1}
              className="flex flex-col gap-2"
            >
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono text-brand-teal">
                {stat.count}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-widest">
                {stat.label}
              </span>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center flex flex-col items-center gap-4 mb-16">
            <span className="text-sm font-bold text-brand-teal uppercase tracking-widest">Client Success</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">What Our Clients Say</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <AnimatedSection
                key={t.author}
                delay={idx * 0.1}
                className="glass-panel p-8 rounded-2xl flex flex-col justify-between relative border border-white/5"
              >
                {/* Decorative quote icon */}
                <span className="absolute top-4 right-6 text-7xl font-serif text-slate-800 pointer-events-none select-none">“</span>
                
                <div className="flex flex-col gap-6">
                  <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                    "{t.quote}"
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {t.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-blue/10 border border-brand-blue/20 text-brand-azure">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col">
                  <span className="text-sm font-bold text-white">{t.author}</span>
                  <span className="text-xs text-slate-400">{t.role}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/30 via-brand-teal/10 to-brand-azure/30 opacity-40 blur-[80px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 glass-panel p-12 sm:p-16 rounded-3xl border border-white/10 flex flex-col items-center gap-8 shadow-2xl">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
              Ready to Transform Your Business?
            </h2>
            <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Book a session with one of our principal architects to examine your current data infrastructure, cloud setups, or custom development requirements.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-brand-blue to-brand-azure text-base font-bold text-white shadow-lg shadow-brand-blue/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <span>Schedule a Consultation</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

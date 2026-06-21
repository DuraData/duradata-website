import { motion } from 'framer-motion';
import { Target, Eye, Shield, Award, Users, Star, BookOpen, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

export default function About() {
  const coreValues = [
    {
      icon: <Star className="w-6 h-6 text-brand-teal" />,
      title: 'Innovation',
      desc: 'We continuously push the boundaries of what is possible, staying ahead of technology curves to offer cutting-edge solutions.'
    },
    {
      icon: <Award className="w-6 h-6 text-brand-azure" />,
      title: 'Excellence',
      desc: 'We are committed to delivering the highest quality of work, ensuring our projects yield maximum business value.'
    },
    {
      icon: <Shield className="w-6 h-6 text-brand-blue" />,
      title: 'Integrity',
      desc: 'We build relationships based on trust, absolute transparency, data security, and ethical consulting practices.'
    },
    {
      icon: <Users className="w-6 h-6 text-brand-teal" />,
      title: 'Collaboration',
      desc: 'We work as an extension of our clients\' teams, co-creating solutions designed around their specific processes.'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-brand-azure" />,
      title: 'Continuous Learning',
      desc: 'Technology changes rapidly; we invest heavily in certification, academic training, and research to keep our skills premium.'
    }
  ];

  const specializations = [
    'Data Analytics & KPI Design',
    'Artificial Intelligence & Predictive Analytics',
    'Microsoft Power Platform (Apps, Automate, Dataverse)',
    'Microsoft Azure Enterprise Cloud Architectures',
    'AWS Cloud Infrastructure & Serverless Pipelines',
    'Executive Business Intelligence & Dashboards',
    'Corporate Web Portals & CMS Development',
    'Custom Business Systems, CRMs & ERP Solutions',
    'Professional Training Academy (Excel, SQL, Python, Power BI)'
  ];

  return (
    <div className="pt-24 pb-20 relative">
      {/* Decorative Blur */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-brand-teal uppercase tracking-widest"
          >
            Who We Are
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white"
          >
            About <span className="text-gradient-primary">DuraData</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            A premier technology consulting partner helping organizations transform their operational intelligence and capabilities through modern data platforms and software solutions.
          </motion.p>
        </div>
      </section>

      {/* Overview & Specializations */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <AnimatedSection className="lg:col-span-6 flex flex-col gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Company Overview</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              DuraData is an enterprise-grade technology consulting and professional training firm. We assist mid-market and large enterprises in replacing outdated spreadsheets and siloed systems with centralized, automated, and secure cloud platforms.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Whether you need to architect a robust data warehouse in Azure, develop a custom application using Microsoft Power Apps, write a machine learning model for predictive forecasting, or skill up your staff in modern analytics languages, DuraData supplies the technical execution and strategic vision.
            </p>
          </AnimatedSection>
          
          <AnimatedSection className="lg:col-span-6 glass-panel p-8 rounded-2xl border border-white/5 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/10 blur-[40px] rounded-full" />
            <h3 className="text-lg font-bold text-brand-teal mb-6">Our Areas of Expertise</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              {specializations.map((spec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200 leading-relaxed">{spec}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 bg-slate-900/30 border-y border-white/5 my-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mission */}
          <AnimatedSection className="glass-panel p-8 sm:p-10 rounded-2xl flex flex-col gap-6 relative group border border-white/5 hover:border-brand-teal/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal">
              <Target className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                To empower organizations with high-performing technology, advanced data analytics, and intelligent software systems that drive continuous innovation, optimize operations, and unlock true growth potential.
              </p>
            </div>
          </AnimatedSection>

          {/* Vision */}
          <AnimatedSection className="glass-panel p-8 sm:p-10 rounded-2xl flex flex-col gap-6 relative group border border-white/5 hover:border-brand-blue/20 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
              <Eye className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                To become Africa's leading data, cloud, and technology consulting partner, recognized for client excellence, innovative system architecture, and impactful technical capacity-building.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection className="flex flex-col items-center gap-4 mb-16">
            <span className="text-sm font-bold text-brand-azure uppercase tracking-widest">Guiding Principles</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Our Core Values</h2>
            <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
              These principles guide our developer and consultant teams in every script written, every architecture deployed, and every client interaction.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {coreValues.map((value, idx) => (
              <AnimatedSection
                key={value.title}
                delay={idx * 0.05}
                className="glass-panel p-8 rounded-2xl border border-white/5 text-left flex flex-col gap-4 hover:bg-slate-800/20 hover:scale-[1.01] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-deep border border-white/10 flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{value.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{value.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

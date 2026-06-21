import { motion } from 'framer-motion';
import { Users, BriefcaseBusiness, Smile, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

export default function About() {
  const stats = [
    {
      icon: <Users className="w-6 h-6 text-brand-teal" />,
      value: '8',
      label: 'IT Experts'
    },
    {
      icon: <BriefcaseBusiness className="w-6 h-6 text-brand-azure" />,
      value: '15',
      label: 'Years Of Combined Experience'
    },
    {
      icon: <Smile className="w-6 h-6 text-brand-blue" />,
      value: '11',
      label: 'Satisfied Clients'
    }
  ];

  const whyChooseUs = [
    {
      title: 'Expertise and Experience',
      desc: 'Our consultants bring deep technical knowledge and practical industry insight to each engagement.'
    },
    {
      title: 'Customized Solutions',
      desc: 'We tailor every strategy and implementation plan to your business goals, data maturity, and environment.'
    },
    {
      title: 'Cutting-Edge Technology',
      desc: 'We apply modern analytics platforms and AI capabilities to help you move faster with confidence.'
    },
    {
      title: 'Proven Track Record',
      desc: 'Our delivery history reflects measurable outcomes, long-term partnerships, and dependable execution.'
    },
    {
      title: 'Commitment to Excellence',
      desc: 'We maintain high standards in quality, service, and continuous improvement across all client work.'
    }
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
            Data Analytics Consulting Since 2023
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
            At Duradata, we specialize in delivering cutting-edge data analytics and artificial intelligence solutions tailored to meet the unique needs of our clients.
          </motion.p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <AnimatedSection className="flex flex-col gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Company Overview</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              As a trusted consulting firm, we empower businesses to make data-driven decisions, unlock insights, and enhance operational efficiency. Our expert team combines deep industry knowledge with advanced technologies to provide innovative strategies that drive growth and transformation.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Partner with us to harness the power of your data and elevate your organization's potential.
            </p>
          </AnimatedSection>

          <AnimatedSection className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {stats.map((item) => (
              <div key={item.label} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-3 items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-brand-deep border border-white/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-3xl font-extrabold text-brand-teal font-mono">{item.value}</span>
                <span className="text-xs uppercase tracking-wider text-slate-300">{item.label}</span>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-slate-900/30 border-y border-white/5 my-12">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center flex flex-col items-center gap-4 mb-12">
            <span className="text-sm font-bold text-brand-azure uppercase tracking-widest">Trust</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why choose us</h2>
            <p className="text-slate-300 max-w-3xl text-sm leading-relaxed">
              Duradata is a premier consulting firm specializing in data analytics and artificial intelligence solutions. We empower businesses to unlock the full potential of their data through customized strategies that drive informed decision-making and operational efficiency.
            </p>
            <p className="text-slate-300 max-w-3xl text-sm leading-relaxed">
              With a team of experienced professionals and a commitment to leveraging cutting-edge technology, we deliver innovative solutions tailored to the unique needs of each client.
            </p>
            <p className="text-slate-300 max-w-3xl text-sm leading-relaxed">
              Our proven track record of success and dedication to excellence make us the ideal partner for organizations looking to enhance their competitive edge and achieve sustainable growth.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => (
              <AnimatedSection
                key={item.title}
                delay={idx * 0.05}
                className="glass-panel p-8 rounded-2xl border border-white/5 text-left flex flex-col gap-4 hover:bg-slate-800/20 hover:scale-[1.01] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-brand-teal" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Factory, Shield, HeartPulse, Landmark, PhoneCall, 
  BookOpen, Droplets, Truck, ArrowRight, Activity, Ban, CheckCircle
} from 'lucide-react';

export default function Industries() {
  const industries = [
    {
      id: 'finance',
      icon: <Landmark className="w-5 h-5" />,
      name: 'Financial Services',
      tagline: 'Secure, real-time portfolio and asset metrics.',
      challenges: 'Finance houses wrestle with fragmented systems, delayed reconciliation reports, strict regulatory audits, and manual data pipelines.',
      solutions: 'We build enterprise Azure data lakes that pull transaction logs from core banking systems, using Power BI and Tableau for instant financial modeling.',
      outcomes: 'Reconciliation times cut from five days to real-time. Audits completed in hours instead of weeks.'
    },
    {
      id: 'retail',
      icon: <ShoppingBag className="w-5 h-5" />,
      name: 'Retail & E-Commerce',
      tagline: 'Data-driven inventory and shopping behavior analytics.',
      challenges: 'Retailers face stock-outs, inventory bloat, high customer acquisition costs, and poor loyalty tracking.',
      solutions: 'Predictive machine learning models hosted on AWS that analyze basket data to forecast regional demand fluctuations.',
      outcomes: 'Inventory carrying costs reduced by up to 22%. Stockout instances minimized by 18%.'
    },
    {
      id: 'manufacturing',
      icon: <Factory className="w-5 h-5" />,
      name: 'Manufacturing',
      tagline: 'OEE and predictive maintenance monitoring.',
      challenges: 'Legacy factory floor machines operate in silos, causing unexpected failures and bottlenecked scheduling.',
      solutions: 'Custom IoT hubs in AWS or Azure that capture temperature/vibro-sensor logs, paired with real-time OEE reporting apps.',
      outcomes: 'Machine downtime reduced by 15%. Increased overall equipment effectiveness (OEE) tracking.'
    },
    {
      id: 'mining',
      icon: <Activity className="w-5 h-5" />,
      name: 'Mining & Heavy Industry',
      tagline: 'Safety, asset telemetry, and yield insights.',
      challenges: 'Managing remote assets, tracking fleet metrics, monitoring safety risks, and optimizing minerals yield.',
      solutions: 'Relational data platforms combined with custom Power Apps tracking site safety audits and machinery diagnostics.',
      outcomes: 'Real-time telemetry and geofencing. Safety audits completed and synced instantly, eliminating manual entry.'
    },
    {
      id: 'healthcare',
      icon: <HeartPulse className="w-5 h-5" />,
      name: 'Healthcare & Biotech',
      tagline: 'Secure, regulatory-compliant patient dashboarding.',
      challenges: 'Healthcare providers struggle with disconnected patient records, long waiting queues, and HIPAA/POPIA compliance.',
      solutions: 'Highly encrypted Azure cloud databases that clean and aggregate patient records, paired with capacity forecasting models.',
      outcomes: 'Patient wait times decreased by 25%. Absolute adherence to POPI and medical security regulations.'
    },
    {
      id: 'government',
      icon: <Shield className="w-5 h-5" />,
      name: 'Government & Public Sector',
      tagline: 'Accountable public auditing and citizen service portals.',
      challenges: 'Inadequate citizen feedback channels, slow case allocations, and lack of unified data tracking.',
      solutions: 'Custom Power Apps portals and secure database systems to digitize citizen queries and automate dispatch workflows.',
      outcomes: 'Citizen response times improved. Operational transparency increased with audited dashboards.'
    },
    {
      id: 'telco',
      icon: <PhoneCall className="w-5 h-5" />,
      name: 'Telecommunications',
      tagline: 'High-volume network telemetry and churn forecasting.',
      challenges: 'Vast, multi-million record log files, dropoff indicators, and high customer switching rates.',
      solutions: 'AWS Redshift and Athena architectures that analyze packet and customer logs, coupled with predictive churn Python models.',
      outcomes: 'Predicted 80% of customer dropoffs in advance, allowing retention marketing campaigns to target at-risk users.'
    },
    {
      id: 'education',
      icon: <BookOpen className="w-5 h-5" />,
      name: 'Education & Academics',
      tagline: 'Student enrollment, attendance, and performance indicators.',
      challenges: 'High dropout rates, manual grading files, and disconnected student management softwares.',
      solutions: 'Unified database aggregations displaying student attendance, financial balances, and test score indexes.',
      outcomes: 'Educators flags at-risk students 3x faster, improving graduation indices.'
    },
    {
      id: 'agriculture',
      icon: <Droplets className="w-5 h-5" />,
      name: 'Agriculture',
      tagline: 'Precision crop yield, weather, and logistics data.',
      challenges: 'Fluctuating soil profiles, volatile climates, transport delays, and unpredictable crop output.',
      solutions: 'Cloud-based predictive models analyzing climate records, combined with logistical tracking apps.',
      outcomes: 'Yield predictions achieved 92% accuracy, optimizing pre-harvest transport booking costs.'
    },
    {
      id: 'logistics',
      icon: <Truck className="w-5 h-5" />,
      name: 'Logistics & Supply Chain',
      tagline: 'Real-time fleet tracking, routes, and warehouse metrics.',
      challenges: 'Volatile fuel variables, unoptimized route planning, and delayed invoice processing.',
      solutions: 'Custom web dashboard portals tracking GPS coordinates, fuel indicators, and automated invoicing loops.',
      outcomes: 'Delivery routes optimized, trimming fuel bills by 12% and automating billing.'
    }
  ];

  const [activeIndustryId, setActiveIndustryId] = useState(industries[0].id);

  const selectedIndustry = industries.find(ind => ind.id === activeIndustryId) || industries[0];

  return (
    <div className="pt-24 pb-20 relative">
      {/* Glows */}
      <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-brand-teal uppercase tracking-widest"
          >
            Sector Expertise
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white"
          >
            Industries We <span className="text-gradient-primary">Serve</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Every sector encounters distinct challenges. We configure architectures specifically suited to your industry\'s regulations, systems, and metrics.
          </motion.p>
        </div>
      </section>

      {/* Industry Explorer */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation */}
          <div className="lg:col-span-4 flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2">
            {industries.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setActiveIndustryId(ind.id)}
                className={`w-full text-left p-3.5 rounded-xl flex items-center gap-4 transition-all duration-200 border ${
                  activeIndustryId === ind.id
                    ? 'bg-gradient-to-r from-brand-blue/30 to-brand-azure/10 border-brand-teal text-white shadow-md'
                    : 'bg-slate-900/40 hover:bg-slate-800/30 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeIndustryId === ind.id ? 'bg-brand-teal/20 text-brand-teal' : 'bg-brand-deep text-slate-500'
                }`}>
                  {ind.icon}
                </div>
                <span className="text-sm font-bold tracking-wide">{ind.name}</span>
              </button>
            ))}
          </div>

          {/* Details */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndustry.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/5 min-h-[480px] flex flex-col justify-between"
              >
                <div className="flex flex-col gap-8">
                  {/* Title & Tagline */}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                      <span className="p-2.5 rounded-xl bg-brand-blue/20 text-brand-teal border border-brand-teal/20">
                        {selectedIndustry.icon}
                      </span>
                      {selectedIndustry.name}
                    </h2>
                    <p className="text-sm text-brand-teal font-sans italic mt-2">
                      {selectedIndustry.tagline}
                    </p>
                  </div>

                  {/* Grid: Challenge vs. Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Challenge */}
                    <div className="p-5 rounded-2xl bg-brand-deep/50 border border-white/5 flex flex-col gap-3">
                      <span className="text-xs font-mono uppercase tracking-widest text-red-400/80 flex items-center gap-1.5 font-bold">
                        <Ban className="w-3.5 h-3.5" />
                        Industry Challenges
                      </span>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {selectedIndustry.challenges}
                      </p>
                    </div>

                    {/* Solution */}
                    <div className="p-5 rounded-2xl bg-brand-deep/50 border border-white/5 flex flex-col gap-3">
                      <span className="text-xs font-mono uppercase tracking-widest text-brand-teal flex items-center gap-1.5 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        DuraData Solution
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {selectedIndustry.solutions}
                      </p>
                    </div>
                  </div>

                  {/* Expected Outcomes */}
                  <div className="p-5 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex flex-col gap-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-brand-azure font-bold">
                      Expected Business Outcomes
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      {selectedIndustry.outcomes}
                    </p>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                  <Link
                    to={`/contact?interest=${encodeURIComponent(`${selectedIndustry.name} Consulting`)}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-blue to-brand-azure text-xs font-bold text-white transition-all duration-200 hover:scale-[1.01]"
                  >
                    <span>Request Sector Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>
    </div>
  );
}

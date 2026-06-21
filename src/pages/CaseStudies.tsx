import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Filter } from 'lucide-react';

export default function CaseStudies() {
  const caseStudies = [
    {
      title: 'Automated Procurement Workflows',
      category: 'Power Platform',
      client: 'Vanguard Industrial Group',
      challenge: 'Vanguard relied on paper checkout slips and carbon-copied approval sheets to procure site parts. Approvals took up to 8 days, leading to machine downtime.',
      solution: 'We built a secure mobile Power App connected to a Microsoft Dataverse back-end. Automatic approval alerts are sent to managers via Power Automate and Teams.',
      techStack: ['Power Apps', 'Power Automate', 'Microsoft Dataverse', 'Office 365'],
      outcome: 'Approval turnaround reduced from 8 days to 4 hours. Manual entry errors completely eliminated.'
    },
    {
      title: 'Real-Time Financial Intelligence',
      category: 'Data Analytics',
      client: 'Ascent Property Fund',
      challenge: 'Ascent compiled monthly asset performance manually in Excel. The process was slow, error-prone, and only allowed historical monthly snapshots.',
      solution: 'We designed a central Azure SQL database mapping multiple property databases, feeding into a set of interactive Power BI dashboards with complex currency conversions.',
      techStack: ['Power BI', 'Azure SQL Database', 'Data Modeling', 'DAX Scripting'],
      outcome: 'Executives access daily cash-flow and vacancy metrics. Reporting preparation overhead cut by 85%.'
    },
    {
      title: 'Predictive Inventory Engine',
      category: 'Artificial Intelligence',
      client: 'Zeta Pharmaceuticals',
      challenge: 'Zeta faced frequent stock-outs of critical medicines and raw chemical materials due to fluctuating demand and seasonal shipping variances.',
      solution: 'A Python-based machine learning forecasting engine hosted on AWS that processes historical invoice data, regional weather forecasts, and shipping timetables.',
      techStack: ['Python', 'AWS Lambda', 'Amazon S3', 'Amazon Athena', 'Scikit-learn'],
      outcome: 'Product stockout instances reduced by 24%. Inventory storage footprint optimized, saving $45k annually.'
    },
    {
      title: 'Enterprise Data Lake Migration',
      category: 'Cloud Solutions',
      client: 'Apex Telecomm Group',
      challenge: 'Apex generated over 50 million database records daily across multiple databases, overloading their local SQL servers and blocking analytical reports.',
      solution: 'Architected an AWS Data Lake with Amazon S3. Configured serverless queries using AWS Glue catalogs and Amazon Redshift serverless clusters.',
      techStack: ['AWS Glue', 'Amazon S3', 'Amazon Redshift', 'Cloud Architecture'],
      outcome: 'Data querying speeds increased by 40x. Legacy local server licenses retired, reducing IT cost by 30%.'
    },
    {
      title: 'Corporate Customer Portal',
      category: 'Custom Development',
      client: 'Safeland Security Ltd',
      challenge: 'Safeland\'s corporate clients could only request project files, invoice histories, and guard duty sheets by emailing support agents, overloading the staff.',
      solution: 'A custom, encrypted React + TypeScript customer portal connected to a Node.js API and PostgreSQL, hosting automated PDFs and invoice lists.',
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      outcome: '55% of support requests migrated to customer self-service. Customer ticketing satisfaction rose to 98%.'
    }
  ];

  const [activeFilter, setActiveFilter] = useState('All');

  const filterOptions = ['All', 'Power Platform', 'Data Analytics', 'Artificial Intelligence', 'Cloud Solutions', 'Custom Development'];

  const filteredStudies = activeFilter === 'All'
    ? caseStudies
    : caseStudies.filter(cs => cs.category === activeFilter);

  return (
    <div className="pt-24 pb-20 relative">
      {/* Glow backgrounds */}
      <div className="absolute top-20 left-1/4 w-[450px] h-[450px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[450px] h-[450px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-brand-teal uppercase tracking-widest"
          >
            Proven Results
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white"
          >
            Case <span className="text-gradient-primary">Studies</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Discover how we apply platform integrations, cloud engineering, and custom programming to solve business-critical issues.
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 justify-center border-b border-white/5 pb-6">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setActiveFilter(opt)}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                activeFilter === opt
                  ? 'bg-brand-teal text-brand-deep font-bold shadow-md'
                  : 'bg-slate-900/40 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredStudies.map((study) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.3 }}
                key={study.title}
                className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-brand-teal/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-6">
                  {/* Top Header */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-brand-teal font-semibold">
                        {study.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Client: {study.client}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-snug mt-1">{study.title}</h3>
                  </div>

                  {/* Challenge and Solution */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Challenge</span>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{study.challenge}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Solution Delivered</span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{study.solution}</p>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5">
                    {study.techStack.map(tech => (
                      <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-deep border border-white/10 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Business Outcome */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-brand-teal">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono uppercase text-slate-500">Business Outcome</span>
                      <span className="text-xs sm:text-sm font-bold text-white">{study.outcome}</span>
                    </div>
                  </div>
                  <a
                    href="/contact"
                    className="text-xs font-semibold text-brand-teal flex items-center gap-1 hover:text-white transition-colors group shrink-0"
                  >
                    <span>Request Project Review</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

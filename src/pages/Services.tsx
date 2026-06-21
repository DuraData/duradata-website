import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Brain, Database, Cpu, Cloud, Code,
  ArrowRight, Server, Globe
} from 'lucide-react';

export default function Services() {
  const serviceCategories = [
    {
      id: 'analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Data Analytics Consulting',
      tagline: 'Make decisions based on structured intelligence, not guesswork.',
      desc: 'Our data analytics consulting provides end-to-end strategy, mapping your business KPIs directly to data collection and cleaning workflows, resulting in pristine, ready-to-analyze datasets.',
      bulletTitle: 'Key Capabilities',
      bullets: [
        { name: 'Analytics Strategy', desc: 'Designing roadmaps to move your organization from raw data to mature predictive forecasting.' },
        { name: 'Data Modeling', desc: 'Structuring databases and tables to ensure high-speed querying and single-source-of-truth accuracy.' },
        { name: 'KPI Design', desc: 'Developing actionable, executive-level metrics tailored to your industry operations.' },
        { name: 'Data Warehousing', desc: 'Consolidating multiple databases into optimized analytical repositories.' },
        { name: 'Reporting Frameworks', desc: 'Establishing governed templates and distribution channels for reports across teams.' }
      ]
    },
    {
      id: 'ai',
      icon: <Brain className="w-5 h-5" />,
      title: 'Artificial Intelligence',
      tagline: 'Automate cognitive processes and forecast market demands.',
      desc: 'We build custom machine learning systems and AI integrations that automate repetitive cognitive tasks, identify anomalies, and forecast key operational outcomes.',
      bulletTitle: 'AI Offerings',
      bullets: [
        { name: 'Machine Learning Models', desc: 'Developing classification, regression, and clustering models for custom business workflows.' },
        { name: 'Predictive Analytics', desc: 'Forecasting demand, inventory fluctuations, customer churn, and financial risk profiles.' },
        { name: 'AI Integration', desc: 'Integrating LLMs (OpenAI, Anthropic) and cognitive tools directly into your enterprise software.' },
        { name: 'AI Strategy & Auditing', desc: 'Reviewing data readiness and regulatory compliance for corporate AI initiatives.' }
      ]
    },
    {
      id: 'bi',
      icon: <Database className="w-5 h-5" />,
      title: 'Business Intelligence',
      tagline: 'Real-time visibility into executive and operational metrics.',
      desc: 'Our Business Intelligence setups extract data from your databases, ERPs, or CRMs, clean it, and display it in beautiful dashboards that refresh automatically.',
      bulletTitle: 'BI Focus Areas',
      bullets: [
        { name: 'Executive Dashboards', desc: 'High-level summaries of profit margins, sales performance, and workforce utilization.' },
        { name: 'Performance Reporting', desc: 'Granular views of operational pipelines, department targets, and historical trends.' },
        { name: 'Interactive Analytics', desc: 'Equipping managers with drill-down tables to investigate anomalies themselves.' }
      ]
    },
    {
      id: 'powerplatform',
      icon: <Cpu className="w-5 h-5" />,
      title: 'Microsoft Power Platform',
      tagline: 'Rapid app development and process digitalization.',
      desc: 'Build enterprise-grade internal systems and workflows in days instead of months. We leverage Microsoft\'s suite to automate your operations.',
      bulletTitle: 'Platform Pillars',
      bullets: [
        { name: 'Power Apps', desc: 'Creating mobile-ready custom applications for site audits, expense claims, or inventory checkouts.' },
        { name: 'Power Automate', desc: 'Building multi-step background workflows that sync emails, databases, and notifications.' },
        { name: 'Power BI', desc: 'Connecting directly to Power Platform databases for unified analytics dashboards.' },
        { name: 'Microsoft Dataverse', desc: 'Deploying secure, relational, cloud-hosted databases natively tied to your Office 365 environment.' }
      ]
    },
    {
      id: 'azure',
      icon: <Cloud className="w-5 h-5" />,
      title: 'Azure Cloud Solutions',
      tagline: 'Enterprise-grade cloud data engineering and infrastructure.',
      desc: 'Architect secure, scalable Microsoft Azure cloud architectures to store, compute, and serve your enterprise application files and database records.',
      bulletTitle: 'Azure Stack',
      bullets: [
        { name: 'Azure Data Factory', desc: 'Developing cloud-based ETL pipelines to ingest data from dozens of different sources.' },
        { name: 'Azure Synapse Analytics', desc: 'Setting up high-performance enterprise data warehouses with serverless querying.' },
        { name: 'Azure SQL Database', desc: 'Deploying highly secure, auto-scaling relational cloud databases.' },
        { name: 'Azure Functions & AI', desc: 'Creating event-driven serverless code and integrating Azure Cognitive services.' }
      ]
    },
    {
      id: 'aws',
      icon: <Server className="w-5 h-5" />,
      title: 'AWS Cloud Solutions',
      tagline: 'Scalable cloud-native engineering and data pipelines.',
      desc: 'Configure flexible Amazon Web Services setups for high-capacity analytical processing, database warehousing, and microservice hosts.',
      bulletTitle: 'AWS Stack',
      bullets: [
        { name: 'AWS Glue', desc: 'Configuring serverless data integration and cataloging for search.' },
        { name: 'Amazon Redshift', desc: 'Architecting fast, PB-scale cloud data warehouses.' },
        { name: 'Amazon S3 & Athena', desc: 'Constructing robust data lakes and running ad-hoc SQL queries on raw files.' },
        { name: 'AWS Lambda', desc: 'Creating serverless functions to run scripts triggered by database updates or webhooks.' }
      ]
    },
    {
      id: 'webdev',
      icon: <Globe className="w-5 h-5" />,
      title: 'Website Development',
      tagline: 'Stunning, fast, and search-optimized web presences.',
      desc: 'Your website is your digital corporate headquarters. We build fast, fully responsive, and highly secure websites that generate consulting leads.',
      bulletTitle: 'Web Offerings',
      bullets: [
        { name: 'Corporate Websites', desc: 'Premium, modern web presences that position your brand as a market leader.' },
        { name: 'E-Commerce Portals', desc: 'Robust transaction portals integrated with payment gateways and stock control.' },
        { name: 'Customer & Partner Portals', desc: 'Secure, login-walled spaces for client invoicing, ticketing, and file sharing.' },
        { name: 'CMS & Headless Setups', desc: 'Deploying WordPress, Strapi, or Sanity content editors for easy in-house updates.' }
      ]
    },
    {
      id: 'appdev',
      icon: <Code className="w-5 h-5" />,
      title: 'Application Development',
      tagline: 'Custom business systems tailored to your unique workflows.',
      desc: 'When off-the-shelf software falls short, we design, write, and maintain custom web applications, internal databases, and SaaS tools.',
      bulletTitle: 'System Architectures',
      bullets: [
        { name: 'Web Applications', desc: 'Responsive dashboard apps, client platforms, and custom administrative tools.' },
        { name: 'Enterprise Business Systems', desc: 'Consolidated CRM and ERP systems designed precisely for your team\'s operational steps.' },
        { name: 'Workflow Systems', desc: 'Role-based approval loops, automatic PDF creators, and dashboard tracking systems.' }
      ]
    }
  ];

  const [activeCategory, setActiveCategory] = useState(serviceCategories[0].id);

  const selectedCategory = serviceCategories.find(c => c.id === activeCategory) || serviceCategories[0];

  return (
    <div className="pt-24 pb-20 relative">
      {/* Glow background */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Header */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-brand-teal uppercase tracking-widest"
          >
            What We Deliver
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white"
          >
            Our <span className="text-gradient-primary">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            From strategic guidance and data warehousing configuration to application coding and corporate capacity building.
          </motion.p>
        </div>
      </section>

      {/* Services Tabs Explorer */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Column */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all duration-200 border ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-brand-blue/30 to-brand-azure/10 border-brand-teal text-white shadow-lg'
                    : 'bg-slate-900/40 hover:bg-slate-800/30 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${
                  activeCategory === category.id ? 'bg-brand-teal/20 text-brand-teal' : 'bg-brand-deep text-slate-500'
                }`}>
                  {category.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-wide">{category.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Details Display Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="glass-panel p-8 sm:p-10 rounded-2xl border border-white/5 flex flex-col gap-8 min-h-[480px]"
              >
                {/* Header */}
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {selectedCategory.title}
                  </h2>
                  <p className="text-sm font-semibold text-brand-teal font-sans">
                    {selectedCategory.tagline}
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed mt-2">
                    {selectedCategory.desc}
                  </p>
                </div>

                {/* Bullets Grid */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                    {selectedCategory.bulletTitle}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedCategory.bullets.map((bullet, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-4 p-4 rounded-xl bg-brand-deep/50 border border-white/5 hover:border-brand-teal/20 transition-all duration-200"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0 mt-2" />
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-white">{bullet.name}</span>
                          <span className="text-xs text-slate-400 leading-relaxed">{bullet.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-6 border-t border-white/5 flex justify-between items-center flex-wrap gap-4">
                  <span className="text-xs text-slate-500 font-mono">Platform compliance standard: ISO 27001 ready</span>
                  <Link
                    to={`/contact?interest=${encodeURIComponent(selectedCategory.title)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-blue hover:bg-brand-azure text-xs font-bold text-white transition-all duration-200"
                  >
                    <span>Request Service Quote</span>
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

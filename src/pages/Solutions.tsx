import { motion } from 'framer-motion';
import { 
  BarChart3, Database, ArrowRight, Activity, Cpu
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

export default function Solutions() {
  const solutions = [
    {
      id: 'power-bi',
      title: 'Power BI Solutions',
      subtitle: 'Microsoft Gold Standard BI Development',
      desc: 'We design unified corporate Power BI tenant setups, construct custom DAX measurements, and deliver clean, brand-compliant data dashboards.',
      features: [
        { name: 'Executive Dashboards', desc: 'Consolidating finance, marketing, and operations into a single-pane viewport.' },
        { name: 'KPI Monitoring', desc: 'Automating alerts when performance thresholds dip below target levels.' },
        { name: 'Self-Service BI', desc: 'Configuring clean data models and parameters so internal staff can construct custom reports.' },
        { name: 'Financial Reporting', desc: 'Balancing balance sheets, P&Ls, and cash-flow sheets with multi-currency conversions.' }
      ],
      color: 'from-amber-400/20 to-yellow-500/10 border-amber-500/30 text-amber-400'
    },
    {
      id: 'tableau',
      title: 'Tableau Solutions',
      subtitle: 'Advanced Visualization & Analytics',
      desc: 'For organizations demanding premium data discovery, our Tableau consultants build performant workbooks and custom dashboard extensions.',
      features: [
        { name: 'Data Storytelling', desc: 'Crafting sequential visual dashboards that guide analysts from high-level summaries down to line-level factors.' },
        { name: 'Advanced Visual Analytics', desc: 'Utilizing cohort analyses, scatterplots, geospatial maps, and predictive regression curves.' },
        { name: 'Interactive Dashboards', desc: 'Developing complex parameters and filters to allow ad-hoc data investigations.' }
      ],
      color: 'from-blue-400/20 to-indigo-500/10 border-blue-500/30 text-blue-400'
    },
    {
      id: 'power-platform',
      title: 'Power Platform Solutions',
      subtitle: 'Low-Code Rapid System Development',
      desc: 'Digitize manual operations, paper audits, and legacy databases. We build apps and background automations connected to your Office 365 license.',
      features: [
        { name: 'Custom App Development', desc: 'Deploying canvas and model-driven Power Apps integrated with SharePoint, Dataverse, or SQL.' },
        { name: 'Workflow Automation', desc: 'Constructing Power Automate flows for electronic approval chains, notifications, and scheduled synchronizations.' },
        { name: 'Process Digitization', desc: 'Replacing clipboards, paper check sheets, and manual spreadsheets with clean relational interfaces.' }
      ],
      color: 'from-pink-400/20 to-rose-500/10 border-pink-500/30 text-pink-400'
    },
    {
      id: 'azure',
      title: 'Azure Cloud Solutions',
      subtitle: 'Enterprise-Scale Cloud Architecture',
      desc: 'Store databases, host application files, run cloud-native scripts, and deploy serverless systems inside Microsoft Azure.',
      features: [
        { name: 'Data Platforms', desc: 'Constructing enterprise-wide data lakes (ADLS Gen2) and Synapse modern data warehouses.' },
        { name: 'AI & Cognitive Services', desc: 'Deploying Azure OpenAI services, cognitive search indexing, and custom machine learning models.' },
        { name: 'Cloud Modernization', desc: 'Migrating legacy on-premise SQL servers and files into highly secure cloud tenancies.' }
      ],
      color: 'from-cyan-400/20 to-blue-500/10 border-cyan-500/30 text-cyan-400'
    },
    {
      id: 'aws',
      title: 'AWS Cloud Solutions',
      subtitle: 'Scalable Cloud-Native Infrastructure',
      desc: 'Build high-volume, secure analytics systems and file warehouses using Amazon Web Services.',
      features: [
        { name: 'Cloud Analytics', desc: 'Querying millions of rows in seconds using Amazon Redshift and Athena.' },
        { name: 'Enterprise Data Lakes', desc: 'Storing multi-structured data inside secure, version-controlled Amazon S3 buckets.' },
        { name: 'ETL Pipelines', desc: 'Ingesting and transforming transaction databases automatically using AWS Glue and Lambda.' }
      ],
      color: 'from-orange-400/20 to-amber-500/10 border-orange-500/30 text-orange-400'
    },
    {
      id: 'custom-dev',
      title: 'Custom Development Solutions',
      subtitle: 'Web Platforms & Integrated Softwares',
      desc: 'Where off-the-shelf platforms are insufficient, we construct bespoke software architectures with React, TypeScript, and robust database layers.',
      features: [
        { name: 'Web Applications', desc: 'Clean, secure dashboard apps and client portal platforms.' },
        { name: 'Customer & Partner Portals', desc: 'Encrypted login areas allowing clients to view project logs, download reports, and file tickets.' },
        { name: 'Enterprise Database Systems', desc: 'Custom core architectures mapping precisely to unique operational systems, CRM, or ERP steps.' }
      ],
      color: 'from-teal-400/20 to-emerald-500/10 border-teal-500/30 text-teal-400'
    }
  ];

  return (
    <div className="pt-24 pb-20 relative">
      {/* Decorative glows */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-brand-teal uppercase tracking-widest"
          >
            Our Frameworks
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white"
          >
            Technical <span className="text-gradient-primary">Solutions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            We package technology stacks, workflows, and database layers into secure, unified systems that resolve specific operational challenges.
          </motion.p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-20">
          {solutions.map((solution) => (
            <div id={solution.id} key={solution.id}>
              <AnimatedSection
                className={`glass-panel p-8 sm:p-12 rounded-3xl border border-white/5 bg-gradient-to-br ${solution.color} transition-all duration-300 relative`}
              >
              {/* Corner decorative light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/3 blur-[40px] rounded-full" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                {/* Info block */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400">{solution.subtitle}</span>
                  <h2 className="text-3xl font-extrabold text-white">{solution.title}</h2>
                  <p className="text-sm text-slate-300 leading-relaxed mt-2">{solution.desc}</p>
                  <div className="mt-6">
                    <a
                      href={`/contact?interest=${encodeURIComponent(solution.title)}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-deep border border-white/10 hover:border-brand-teal/40 text-xs font-bold text-white transition-all duration-200"
                    >
                      <span>Discuss {solution.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Features block */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <h3 className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">Capabilities & Modules</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {solution.features.map((feature, fIdx) => (
                      <div
                        key={fIdx}
                        className="p-4 rounded-2xl bg-brand-deep/60 border border-white/5 flex flex-col gap-2 hover:border-white/10 transition-all duration-200"
                      >
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          <Activity className="w-4 h-4 text-brand-teal" />
                          {feature.name}
                        </span>
                        <span className="text-xs text-slate-400 leading-relaxed">{feature.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Graphical Schema Mockup (inline SVG representation of the system pipeline) */}
              <div className="mt-12 pt-8 border-t border-white/5 hidden md:block">
                <div className="flex items-center justify-between gap-4 text-xs font-mono text-slate-500 overflow-x-auto py-2">
                  <div className="px-3 py-1.5 rounded bg-brand-deep border border-white/5 flex items-center gap-2 text-slate-400 shrink-0">
                    <Database className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Raw Data Sources (APIs, SQL, CSV)</span>
                  </div>
                  <div className="h-0.5 w-16 bg-gradient-to-r from-brand-teal to-brand-blue shrink-0 animate-pulse" />
                  <div className="px-3 py-1.5 rounded bg-brand-deep border border-white/5 flex items-center gap-2 text-slate-300 shrink-0">
                    <Cpu className="w-3.5 h-3.5 text-brand-blue" />
                    <span>DuraData Cloud Pipeline (ETL / Cleaning)</span>
                  </div>
                  <div className="h-0.5 w-16 bg-gradient-to-r from-brand-blue to-brand-azure shrink-0 animate-pulse" />
                  <div className="px-3 py-1.5 rounded bg-brand-deep border border-brand-teal/20 flex items-center gap-2 text-white shrink-0">
                    <BarChart3 className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Automated Dashboard / Application Interface</span>
                  </div>
                </div>
              </div>

              </AnimatedSection>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Award, Users, Video, 
  MapPin, CheckCircle, ArrowRight
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

export default function Training() {
  const trainingFormats = [
    {
      icon: <Users className="w-6 h-6 text-brand-teal" />,
      title: 'Corporate Training',
      desc: 'Customized training designed around your actual business datasets to solve real-world in-house challenges.'
    },
    {
      icon: <Video className="w-6 h-6 text-brand-azure" />,
      title: 'Virtual Training',
      desc: 'Interactive, instructor-led remote classes featuring hands-on coding labs and live screen sharing.'
    },
    {
      icon: <MapPin className="w-6 h-6 text-brand-blue" />,
      title: 'Onsite Training',
      desc: 'Our senior consultants facilitate intensive workshops directly at your corporate offices.'
    },
    {
      icon: <Clock className="w-6 h-6 text-brand-teal" />,
      title: 'One-on-One Coaching',
      desc: 'Dedicated mentorship hours for team leaders and senior analysts building complex internal systems.'
    }
  ];

  const courses = [
    {
      category: 'Microsoft Excel',
      title: 'Excel Analytics Academy',
      duration: '3 Days',
      level: 'All Levels',
      topics: ['Beginner Fundamentals', 'Intermediate Lookup & Pivot Tables', 'Advanced Formulaic Analysis (LAMBDA, Power Query)']
    },
    {
      category: 'Power BI',
      title: 'Power BI Professional',
      duration: '4 Days',
      level: 'Intermediate',
      topics: ['Data ingestion & Star Schemas', 'Calculated Columns & DAX Scripting', 'Advanced Dashboard Design & Tenant Governance']
    },
    {
      category: 'Tableau',
      title: 'Tableau Visual Analytics',
      duration: '3 Days',
      level: 'Intermediate',
      topics: ['Data connection & Blending', 'Advanced Visualizations & Cohort Analysis', 'Interactive Dashboards & Stories']
    },
    {
      category: 'SQL',
      title: 'Enterprise SQL Queries',
      duration: '3 Days',
      level: 'Beginner to Advanced',
      topics: ['Relational Database Structures', 'Joins, CTEs, & Window Functions', 'Query Optimization & Indexing']
    },
    {
      category: 'Python',
      title: 'Python for Data & Automation',
      duration: '5 Days',
      level: 'Intermediate',
      topics: ['Pandas, Numpy, & Matplotlib', 'Automating File & Spreadsheet Workflows', 'REST API Integrations & Web Scraping']
    },
    {
      category: 'Data Analytics',
      title: 'Business Analytics Masterclass',
      duration: '4 Days',
      level: 'Beginner',
      topics: ['Statistical Business Analysis', 'Data storytelling & Communication', 'Executive Report Architecture']
    },
    {
      category: 'Artificial Intelligence',
      title: 'AI for Business & Machine Learning',
      duration: '4 Days',
      level: 'Advanced',
      topics: ['Supervised & Unsupervised Learning', 'Model Evaluation & Hyperparameter Tuning', 'Generative AI & LLM APIs for Business']
    },
    {
      category: 'Microsoft Power Platform',
      title: 'Power Platform Developer Path',
      duration: '5 Days',
      level: 'Intermediate',
      topics: ['Power Apps Custom Canvas UI', 'Power Automate background workflows', 'Microsoft Dataverse database setup']
    },
    {
      category: 'Microsoft Azure',
      title: 'Azure Data Engineering Path',
      duration: '5 Days',
      level: 'Advanced',
      topics: ['Azure Data Factory pipeline builds', 'Azure Synapse Data Warehousing', 'Serverless Functions & SQL Administration']
    },
    {
      category: 'AWS',
      title: 'AWS Cloud Analytics Path',
      duration: '5 Days',
      level: 'Advanced',
      topics: ['AWS Glue catalogs & ETL pipelines', 'Amazon S3 Data Lakes & Athena SQL', 'Amazon Redshift optimization']
    },
    {
      category: 'Website Development',
      title: 'Modern Frontend Engineering',
      duration: '8 Weeks (Part-time)',
      level: 'Intermediate',
      topics: ['HTML5, CSS3, & Modern JavaScript', 'React 18 Component Architecture', 'TypeScript, styling, and State Management']
    },
    {
      category: 'Application Development',
      title: 'Full-Stack System Design',
      duration: '6 Weeks (Part-time)',
      level: 'Advanced',
      topics: ['Software Architecture & System Design', 'Robust API creation & endpoints', 'Database management & testing methods']
    }
  ];

  const [activeCourseCategory, setActiveCourseCategory] = useState('All');

  const categoriesList = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = activeCourseCategory === 'All' 
    ? courses 
    : courses.filter(c => c.category === activeCourseCategory);

  return (
    <div className="pt-24 pb-20 relative">
      {/* Glows */}
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
            Capacity Building
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white"
          >
            DuraData <span className="text-gradient-primary">Training Academy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Up-skill your analysts, cloud engineers, developers, and executives with training paths designed around real production environments.
          </motion.p>
        </div>
      </section>

      {/* Formats Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainingFormats.map((format, idx) => (
              <AnimatedSection
                key={format.title}
                delay={idx * 0.05}
                className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4 hover:border-brand-teal/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-deep border border-white/10 flex items-center justify-center text-brand-teal">
                  {format.icon}
                </div>
                <h3 className="text-base font-bold text-white">{format.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{format.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Course Explorer */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-8 mb-12">
            <AnimatedSection className="flex flex-col gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Academy Directory</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Explore Training Paths</h2>
            </AnimatedSection>

            {/* Selector list */}
            <AnimatedSection className="flex flex-wrap gap-2 overflow-x-auto pb-2 border-b border-white/5">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCourseCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeCourseCategory === cat
                      ? 'bg-brand-teal text-brand-deep font-bold shadow-lg shadow-brand-teal/15'
                      : 'bg-slate-900/40 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </AnimatedSection>
          </div>

          {/* Courses Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  key={course.title}
                  className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col justify-between hover:bg-slate-800/20 hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="flex flex-col gap-5">
                    {/* Header */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-brand-teal">{course.category}</span>
                      <h3 className="text-lg font-bold text-white leading-tight mt-1">{course.title}</h3>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex gap-4 text-xs text-slate-400 font-mono border-y border-white/5 py-3">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-teal" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-brand-azure" />
                        {course.level}
                      </span>
                    </div>

                    {/* Topics */}
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Syllabus Highlights</span>
                      <ul className="flex flex-col gap-2">
                        {course.topics.map((topic, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2 text-xs text-slate-300 leading-normal">
                            <CheckCircle className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA link */}
                  <div className="pt-6 mt-6 border-t border-white/5 flex justify-end">
                    <Link
                      to={`/contact?interest=Training&message=${encodeURIComponent(`Hi, I'm interested in the ${course.title} training path.`)}`}
                      className="text-xs font-semibold text-brand-teal flex items-center gap-1 hover:text-white transition-colors group"
                    >
                      <span>Request Syllabus & Booking</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

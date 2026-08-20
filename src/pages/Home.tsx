import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, ChevronDown } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { supabase } from '../lib/supabase';
import './Home.css';

/* ─── Fixed set of 4 real projects for instant, zero-fetch hero render ──── */
const FIXED_HERO_PROJECTS = [
  {
    id: "7bc07f3c-f159-4ad4-91e6-417fcf43b746",
    name: "Cloey",
    shortDescription: "AI wardrobe app that helps you dress better and spend less",
    founderName: "Kevin",
    recruiting: false,
    coverImageUrl: "https://oyhwpjqqrzwkzeejrkrh.supabase.co/storage/v1/object/public/project%20images/Screenshot%202026-05-12%20at%207.28.06%20PM.png"
  },
  {
    id: "577ddf0a-a468-44a4-8613-b463d4e7425b",
    name: "Digital Persuasion Academy",
    shortDescription: "Free Copywriting Course",
    founderName: "Grant",
    recruiting: false,
    coverImageUrl: "https://oyhwpjqqrzwkzeejrkrh.supabase.co/storage/v1/object/public/project%20images/Screenshot%202026-05-11%20at%204.55.44%20PM.png"
  },
  {
    id: "7de5b7cd-a28f-4bdb-a840-bf498e9f5b67",
    name: "Pact",
    shortDescription: "Habit tracking with friends app",
    founderName: "Marco",
    recruiting: true,
    coverImageUrl: "https://oyhwpjqqrzwkzeejrkrh.supabase.co/storage/v1/object/public/project%20images/Screenshot%202026-06-30%20at%206.18.36%20PM.png"
  },
  {
    id: "cfd2f36d-4717-4e0a-9639-13870b898c0e",
    name: "JellyJelly: Human Social!",
    shortDescription: "Authentic social media",
    founderName: "Iqram Magdon-Ismail",
    recruiting: false,
    coverImageUrl: "https://oyhwpjqqrzwkzeejrkrh.supabase.co/storage/v1/object/public/project%20images/548887908_18047982359649735_7095410614213960464_n.jpg"
  }
];

/* ─── Hero Floating Project Card ─────────────────────────────── */
const HeroCard: React.FC<{ project: typeof FIXED_HERO_PROJECTS[0]; className?: string }> = ({ project, className = '' }) => (
  <Link to={`/project/${project.id}`} className={`hero-card ${className}`}>
    <div className="hero-card-header">
      <div className="hero-card-avatar">
        {project.coverImageUrl
          ? <img src={project.coverImageUrl} alt={project.name} loading="eager" />
          : <span>{project.name.charAt(0)}</span>
        }
      </div>
      <div>
        <div className="hero-card-name">{project.name}</div>
        <div className="hero-card-founder">{project.founderName}</div>
      </div>
    </div>
    <p className="hero-card-desc">{project.shortDescription}</p>
    {project.recruiting && (
      <div className="hero-card-badge">Recruiting</div>
    )}
  </Link>
);

/* ─── FAQ Accordion Item Component ───────────────────────────── */
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`lp-faq-item ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
      <div className="lp-faq-question">
        <h3>{question}</h3>
        <ChevronDown size={18} className={`lp-faq-icon ${isOpen ? 'rotate' : ''}`} />
      </div>
      {isOpen && <p className="lp-faq-answer">{answer}</p>}
    </div>
  );
};

/* ─── Home / Landing page ─────────────────────────────────────── */
export const Home: React.FC = () => {
  const [stats, setStats] = useState<{ total: number; hiring: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Stats
      const { count: totalCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      const { count: hiringCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .eq('recruiting', true);

      if (totalCount !== null && hiringCount !== null) {
        setStats({ total: totalCount, hiring: hiringCount });
      }
    };

    fetchData();
  }, []);

  const testimonials = [
    "FoundrBoard helped us connect with our lead frontend engineer in under 48 hours. The community here is unmatched.",
    "Listing our project gave us our first 200 beta testers and built incredible credibility with student investors.",
    "No endless application forms. Just submit your project, show what you're building, and start meeting collaborators."
  ];

  const faqs = [
    {
      question: "Who can post a project on FoundrBoard?",
      answer: "Any student or young founder building a startup, app, side project, or nonprofit — at any stage. No application or approval process required."
    },
    {
      question: "Is FoundrBoard free to use?",
      answer: "Yes! FoundrBoard is 100% free to post projects, search for teammates, and connect with other student builders."
    },
    {
      question: "How do I find teammates or co-founders?",
      answer: "When submitting your project, toggle 'Actively Recruiting' and select the roles you need. Your project will be highlighted in the recruiting feed!"
    },
    {
      question: "What stage does my project need to be at?",
      answer: "Any stage! Whether it's a wireframe concept, an MVP, or a launched business with active revenue, you are welcome here."
    }
  ];

  return (
    <div className="landing-page">
      <SEO
        title="FoundrBoard – Find Your Co-Founders and Collaborators"
        description="FoundrBoard is where student founders post what they're building — at any stage, no application required — to find collaborators and get discovered."
        canonicalUrl="https://foundrboard.com/"
      />

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="lp-hero">
        <div className="container lp-hero-inner">
          {/* Left: text */}
          <div className="lp-hero-text">
            <div className="lp-badge">
              <Layers size={13} />
              <span>Student Founders · No Application Required</span>
            </div>

            <h1 className="lp-headline">
              Find Your <span className="lp-headline-accent">Co-Founders</span> and Collaborators
            </h1>

            <p className="lp-subheadline">
              Post what you're building, attract collaborators, promote your startup, and find real startup work.
            </p>

            <div className="lp-cta-row">
              <Link to="/browse">
                <button className="lp-btn-dark">
                  Browse Projects <ArrowRight size={17} />
                </button>
              </Link>
              <Link to="/submit">
                <button className="lp-btn-ghost">Submit Your Project</button>
              </Link>
            </div>

            {/* Stats */}
            {stats && (
              <div className="lp-inline-stats">
                <span className="lp-inline-stat">
                  <strong>{stats.total}</strong> projects posted
                </span>
                <span className="lp-inline-stat-sep">·</span>
                <span className="lp-inline-stat">
                  <strong>{stats.hiring}</strong> actively recruiting
                </span>
              </div>
            )}
          </div>

          {/* Right: instant floating card collage using fixed 4 real projects */}
          <div className="lp-hero-visual">
            <div className="lp-collage">
              <HeroCard project={FIXED_HERO_PROJECTS[0]} className="hc-1" />
              <HeroCard project={FIXED_HERO_PROJECTS[1]} className="hc-2" />
              <HeroCard project={FIXED_HERO_PROJECTS[2]} className="hc-3" />
              <HeroCard project={FIXED_HERO_PROJECTS[3]} className="hc-4" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════════ */}
      <section className="lp-section container">
        <div className="lp-section-header">
          <span className="lp-section-tag">Simple Process</span>
          <h2>How FoundrBoard Works</h2>
        </div>

        <div className="lp-steps-grid">
          <div className="lp-step-card">
            <div className="lp-step-number">01</div>
            <h3>Post Your Project</h3>
            <p>Share your startup, app, or side project in under 2 minutes. No pitch deck or application required.</p>
          </div>
          <div className="lp-step-card">
            <div className="lp-step-number">02</div>
            <h3>Get Discovered</h3>
            <p>Showcase what you're building to thousands of student developers, designers, and marketers.</p>
          </div>
          <div className="lp-step-card">
            <div className="lp-step-number">03</div>
            <h3>Connect & Build</h3>
            <p>Find collaborators for your project or discover real startup work to get hired.</p>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ═════════════════════════════════════════ */}
      <section className="lp-section lp-bg-alt">
        <div className="container">
          <div className="lp-section-header">
            <span className="lp-section-tag">Loved by Builders</span>
            <h2>What Student Founders Say</h2>
            <p>Hear from creators who found teammates and traction on FoundrBoard.</p>
          </div>

          <div className="lp-testimonials-grid">
            {testimonials.map((quote, idx) => (
              <div key={idx} className="lp-testimonial-card">
                <div className="lp-quote-mark">“</div>
                <p className="lp-testimonial-quote" style={{ marginBottom: 0 }}>{quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Q&A / FAQ SECTION ════════════════════════════════════ */}
      <section className="lp-section container">
        <div className="lp-section-header">
          <span className="lp-section-tag">Got Questions?</span>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about publishing and finding projects on FoundrBoard.</p>
        </div>

        <div className="lp-faq-container">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════════ */}
      <section className="lp-final-cta container">
        <div className="lp-cta-box">
          <div className="lp-cta-text">
            <h2>Have something to show? Post your project.</h2>
            <p>Join over 70+ student founders building the next generation of software, products, and brands.</p>
          </div>
          <div className="lp-cta-actions">
            <Link to="/submit">
              <Button size="lg" className="submit-btn-cta">Submit Your Project</Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" size="lg">Browse All Projects</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

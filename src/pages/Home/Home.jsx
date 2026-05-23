import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Users, RefreshCw, Clock, CheckCircle, ArrowRight, Code, BookOpen, Music, ChefHat, Monitor, PenTool } from 'lucide-react';
import './Home.css';
const Home = () => {
  return <div className="home-style-1">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        
        {/* Left Info Column */}
        <div className="home-style-2">
          <span className="badge badge-tech home-style-3">
            🔥 Zero Money, Pure Exchange
          </span>
          <h1 className="home-style-4">
            Teach One Skill.<br />
            Learn Another <span className="text-gradient">For Free.</span>
          </h1>
          <p className="home-style-5">
            Welcome to the ultimate community learning exchange. Share your expertise in coding, cooking, languages, or music, and learn directly from industry peers—without spending a single dime.
          </p>
          <div className="home-style-6">
            <Link to="/login" className="btn btn-primary home-style-7">
              Explore Skills <Compass size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary home-style-8">
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Right Visual Column (Interactive Skill Swap Mockup) */}
        <div className="home-style-9">
          
          {/* Background decorative dashed rings */}
          <div className="home-style-10"></div>
          
          <div className="home-style-11"></div>

          {/* Floating Card 1: Liam Vance teaches React */}
          <div className="glass-panel home-style-12">
            <div className="home-style-13">
              <div className="home-style-14">HP</div>
              <div>
                <h4 className="home-style-15">Harsh Patel</h4>
                <p className="home-style-16">Frontend Developer</p>
              </div>
            </div>
            <div className="home-style-17">
              <span className="badge badge-tech home-style-18">React JS</span>
              <Code size={14} className="home-style-19" />
            </div>
          </div>

          {/* Swapping Loop Indicator in the Middle */}
          <div className="home-style-20">
            <RefreshCw size={18} className="home-style-21" />
          </div>

          {/* Floating Card 2: Maya Thorne teaches English */}
          <div className="glass-panel home-style-22">
            <div className="home-style-23">
              <div className="home-style-24">JC</div>
              <div>
                <h4 className="home-style-25">Jitendra Chaurasiya</h4>
                <p className="home-style-26">Backend Developer</p>
              </div>
            </div>
            <div className="home-style-27">
              <span className="badge badge-lang home-style-28">Node JS</span>
              <Code size={14} className="home-style-29" />
              {/* <BookOpen size={14} className="home-style-29" /> */}
            </div>
          </div>

        </div>
      </section>

      {/* Stats Counter Row */}
      <section className="home-style-30">
        <div className="home-style-31">
          <div className="glass-panel stat-card">
            <div className="home-style-32">
              <Users size={28} />
            </div>
            <div>
              <h3 className="home-style-33">1,428</h3>
              <p className="home-style-34">Community Members</p>
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="home-style-35">
              <RefreshCw size={28} />
            </div>
            <div>
              <h3 className="home-style-36">384</h3>
              <p className="home-style-37">Active Exchanges</p>
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="home-style-38">
              <Clock size={28} />
            </div>
            <div>
              <h3 className="home-style-39">5,240</h3>
              <p className="home-style-40">Hours Swapped</p>
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="home-style-41">
              <CheckCircle size={28} />
            </div>
            <div>
              <h3 className="home-style-42">98.2%</h3>
              <p className="home-style-43">Exchange Success</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="home-style-44">
        <h2 className="home-style-45">
          How It Works
        </h2>
        <p className="home-style-46">
          Swap skills smoothly with our transparent, trust-based three-step pipeline.
        </p>

        <div className="home-style-47">
          <div className="glass-panel step-card">
            <div className="home-style-48">1</div>
            <h3 className="home-style-49">List Your Skills</h3>
            <p className="home-style-50">
              Add skills you are ready to teach and skills you want to learn to your profile.
            </p>
          </div>

          <div className="glass-panel step-card">
            <div className="home-style-51">2</div>
            <h3 className="home-style-52">Send Exchange Offers</h3>
            <p className="home-style-53">
              Find matching teachers in the directory and send them a tailored mutual study proposal.
            </p>
          </div>

          <div className="glass-panel step-card">
            <div className="home-style-54">3</div>
            <h3 className="home-style-55">Log & Upgrade</h3>
            <p className="home-style-56">
              Chat with your partner, complete sessions, track progress milestones, and level up!
            </p>
          </div>
        </div>
      </section>

      {/* Featured Skills Grid */}
      <section className="home-style-57">
        <div className="home-style-58">
          <div>
            <h2 className="home-style-59">Popular Skills in Demand</h2>
            <p className="home-style-60">Explore what our global community is exchanging right now.</p>
          </div>
          <Link to="/login" className="btn btn-secondary home-style-61">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="home-style-62">
          
          <div className="glass-panel popular-skill-card">
            <div className="home-style-63">
              <span className="badge badge-tech">Technology</span>
              <span className="home-style-64">42 Experts</span>
            </div>
            <div className="home-style-65">
              <div className="home-style-66">
                <Code size={20} />
              </div>
              <h3 className="home-style-67">React JS Development</h3>
            </div>
            <p className="home-style-68">
              Build fast, interactive web applications with modern features like Hooks and Context.
            </p>
          </div>

          <div className="glass-panel popular-skill-card">
            <div className="home-style-69">
              <span className="badge badge-lang">Language</span>
              <span className="home-style-70">28 Experts</span>
            </div>
            <div className="home-style-71">
              <div className="home-style-72">
                <BookOpen size={20} />
              </div>
              <h3 className="home-style-73">English Conversational</h3>
            </div>
            <p className="home-style-74">
              Master accent clarity, professional pitch structures, and grammar tips in real talks.
            </p>
          </div>

          <div className="glass-panel popular-skill-card">
            <div className="home-style-75">
              <span className="badge badge-creative">Creative</span>
              <span className="home-style-76">18 Experts</span>
            </div>
            <div className="home-style-77">
              <div className="home-style-78">
                <ChefHat size={20} />
              </div>
              <h3 className="home-style-79">Gourmet Baking</h3>
            </div>
            <p className="home-style-80">
              Understand the science behind sourdough bread, fine French pastries, and decoration.
            </p>
          </div>

          <div className="glass-panel popular-skill-card">
            <div className="home-style-81">
              <span className="badge badge-creative">Creative</span>
              <span className="home-style-82">15 Experts</span>
            </div>
            <div className="home-style-83">
              <div className="home-style-84">
                <Music size={20} />
              </div>
              <h3 className="home-style-85">Acoustic Guitar</h3>
            </div>
            <p className="home-style-86">
              Learn fingerstyle techniques, guitar tabs, basic music theory, and popular chord maps.
            </p>
          </div>

          <div className="glass-panel popular-skill-card">
            <div className="home-style-87">
              <span className="badge badge-tech">Technology</span>
              <span className="home-style-88">19 Experts</span>
            </div>
            <div className="home-style-89">
              <div className="home-style-90">
                <PenTool size={20} />
              </div>
              <h3 className="home-style-91">UI/UX Figma Design</h3>
            </div>
            <p className="home-style-92">
              Create wireframes, high-fidelity prototypes, and component design libraries in Figma.
            </p>
          </div>

          <div className="glass-panel popular-skill-card">
            <div className="home-style-93">
              <span className="badge badge-other">Business</span>
              <span className="home-style-94">23 Experts</span>
            </div>
            <div className="home-style-95">
              <div className="home-style-96">
                <Monitor size={20} />
              </div>
              <h3 className="home-style-97">SEO & Growth Ads</h3>
            </div>
            <p className="home-style-98">
              Learn search engine optimization, keywords research, Google Ads campaigns, and conversions tracking.
            </p>
          </div>

        </div>
      </section>
      {/* Why Choose Us Section */}
      <section className="home-benefits">
        <div className="section-header">
          <h2>Why Choose SkillSwap?</h2>
          <p>We're rethinking education by putting the community first.</p>
        </div>
        <div className="benefits-grid">
          <div className="glass-panel benefit-card">
            <div className="benefit-icon bg-primary">💳</div>
            <h3>100% Free Forever</h3>
            <p>No subscriptions, no hidden fees, and no paywalls. Knowledge is exchanged purely on a time-for-time basis.</p>
          </div>
          <div className="glass-panel benefit-card">
            <div className="benefit-icon bg-success">🛡️</div>
            <h3>Verified Peers</h3>
            <p>Our rating and review system ensures you only match with reliable, high-quality learning partners.</p>
          </div>
          <div className="glass-panel benefit-card">
            <div className="benefit-icon bg-creative">📈</div>
            <h3>Gamified Growth</h3>
            <p>Earn XP, level up, and unlock achievements as you teach and learn. Make education fun and rewarding.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="home-testimonials">
        <h2 className="section-title">Success Stories</h2>
        <div className="testimonials-grid">
          <div className="glass-panel testimonial-card">
            <div className="testimonial-header">
              <div className="avatar">SJ</div>
              <div>
                <h4>Sarah Jenkins</h4>
                <div className="stars">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p>"I taught English for 2 hours a week, and in exchange, my partner helped me build my first React app from scratch. Incredible community!"</p>
          </div>
          <div className="glass-panel testimonial-card">
            <div className="testimonial-header">
              <div className="avatar">MP</div>
              <div>
                <h4>Marcus Polo</h4>
                <div className="stars">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p>"SkillSwap is exactly what I needed. I wanted to learn piano but couldn't afford lessons. Found a music teacher who needed help with SEO. Perfect match!"</p>
          </div>
          <div className="glass-panel testimonial-card">
            <div className="testimonial-header">
              <div className="avatar">AL</div>
              <div>
                <h4>Aisha Lin</h4>
                <div className="stars">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p>"The gamification aspect is brilliant. I just hit Level 10 'Elite Mentor' today. It keeps both me and my students highly motivated."</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="home-faq">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          <div className="faq-item">
            <h4>Do I need to be an absolute expert to teach?</h4>
            <p>Not at all! As long as you have practical experience and can help a beginner, you have a valuable skill to offer.</p>
          </div>
          <div className="faq-item">
            <h4>What if my partner stops responding?</h4>
            <p>We require both parties to approve milestones. If someone goes inactive, you can simply cancel the contract without penalty and find a new partner.</p>
          </div>
          <div className="faq-item">
            <h4>How do we communicate?</h4>
            <p>Once your swap contract is approved, you unlock a private, real-time chat room with your partner right here on the platform.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="home-cta">
        <div className="cta-content">
          <h2>Ready to upgrade your skills?</h2>
          <p>Join thousands of learners exchanging knowledge today. No credit card required.</p>
          <Link to="/signup" className="btn btn-primary cta-btn">
            Create Your Free Account Now <ArrowRight size={18} />
          </Link>
        </div>
        <div className="cta-circles"></div>
      </section>

    </div>;
};
export default Home;

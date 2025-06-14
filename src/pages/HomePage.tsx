import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stars, ArrowRight, Users, Zap, Clock, Sparkles, Star } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import DreamInterpreter from '../components/DreamInterpreter';
import { features } from '../data/featuresData.jsx';
import { testimonials } from '../data/testimonialsData';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Touch/swipe handling for testimonials
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - go to next testimonial
      setActiveTestimonial((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    } else if (isRightSwipe) {
      // Swipe right - go to previous testimonial
      setActiveTestimonial((prev) => 
        prev === 0 ? testimonials.length - 1 : prev - 1
      );
    }
  };

  // Mouse events for desktop testing
  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (touchStart !== null) {
      setTouchEnd(e.clientX);
    }
  };

  const onMouseUp = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveTestimonial((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    } else if (isRightSwipe) {
      setActiveTestimonial((prev) => 
        prev === 0 ? testimonials.length - 1 : prev - 1
      );
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Static Background Elements - No Canvas */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 left-[10%] top-[20%]" />
        <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 right-[15%] bottom-[20%]" />
      </div>

      {/* Static Floating Stars - No Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          >
            <Stars className="w-4 h-4 text-yellow-300" />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20 md:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse mb-6">
            <Stars className="w-12 h-12 mx-auto text-yellow-400" />
          </div>
          
          {isAuthenticated ? (
            /* Authenticated User Hero */
            <>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                Welcome Back, {user?.firstName}!
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Ready to explore another dream? Your AI-powered insights are waiting to unlock the mysteries of your subconscious mind.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => document.getElementById('interpreter')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transform hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.5)]"
                >
                  <span className="absolute inset-0 w-full h-full bg-white rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    Interpret New Dream
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button 
                  onClick={() => navigate('/insights')}
                  className="group relative px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transform hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.5)]"
                >
                  <span className="absolute inset-0 w-full h-full bg-white rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    View My Insights
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                </button>
              </div>
              
              {user?.stats && (
                <div className="mt-12 flex justify-center items-center gap-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{user.stats.totalDreams} Dreams Interpreted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>{user.stats.streakDays} Day Streak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>{user.subscription?.plan === 'premium' ? 'Premium' : 'Free'} Plan</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Non-authenticated User Hero */
            <>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                Unlock Your Dreams' Hidden Meanings
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Luna uses advanced AI to decode your subconscious mind, revealing profound insights through instant dream interpretation
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => document.getElementById('interpreter')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transform hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.5)]"
                >
                  <span className="absolute inset-0 w-full h-full bg-white rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    Try Free Dream Interpretation
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button 
                  onClick={() => navigate('/signin')}
                  className="relative px-8 py-4 rounded-full text-lg transition-all duration-300 bg-white/5 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/60 hover:bg-white/10 group overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative">Sign In For Full Experience</span>
                </button>
              </div>
              
              <div className="mt-12 flex justify-center items-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>50K+ Active Dreamers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>1M+ Dreams Interpreted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>24/7 Availability</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Dream Interpreter Section */}
      <DreamInterpreter />

      {/* Features Section - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <section id="features" className="relative z-10 px-6 lg:px-12 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Why Luna is Different
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <section id="how-it-works" className="relative z-10 px-6 lg:px-12 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              How Luna Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Share Your Dream", description: "Type or speak your dream in detail - every element matters" },
                { step: "2", title: "AI Analysis", description: "Luna's neural networks analyze symbols, emotions, and patterns" },
                { step: "3", title: "Get Insights", description: "Receive comprehensive interpretation with actionable guidance" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <section id="testimonials" className="relative z-10 px-6 lg:px-12 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Trusted by Dreamers Worldwide
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div 
                className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
              >
                <div 
                  className="flex transition-transform duration-500"
                  style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10">
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-xl mb-6 text-gray-300 italic">"{testimonial.text}"</p>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-gray-400">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center mt-8 gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeTestimonial ? 'w-8 bg-purple-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Different content for authenticated vs non-authenticated */}
      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {isAuthenticated ? (
            /* Authenticated User CTA */
            <>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Continue Your Dream Journey
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Your subconscious has more secrets to reveal. Ready for another exploration?
              </p>
              <button 
                onClick={() => document.getElementById('interpreter')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                Interpret Another Dream
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </>
          ) : (
            /* Non-authenticated User CTA */
            <>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Begin Your Journey Into the Subconscious
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands discovering the profound wisdom hidden in their dreams
              </p>
              <button 
                onClick={() => navigate('/signup')}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                Start Your Free Dream Analysis
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage; 
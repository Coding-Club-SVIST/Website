import Layout from '@/components/Layout';
import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: '[EMAIL NOT PROVISIONED]',
      link: 'mailto:void',
      color: 'primary',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Dakshin Gobindapur Rd, Dakshin Gobindopur, Rajpur Sonarpur, Jaynagar, West Bengal 700145',
      link: 'https://share.google/uz0SxHv3brU2WOhtw',
      color: 'secondary',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '[PHONE NOT PROVISIONED]',
      link: 'tel:910000000000',
      color: 'accent',
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      name: 'GitHub',
      link: 'https://github.com/Coding-Club-SVIST',
      color: 'hover:text-white',
    },
    {
      icon: Linkedin,
      name: 'LinkedIn [NOT PROVISIONED]',
      link: 'https://linkedin.com/company/',
      color: 'hover:text-blue-400',
    },
    {
      icon: Twitter,
      name: 'Twitter [NOT PROVISIONED]',
      link: 'https://twitter.com/',
      color: 'hover:text-sky-400',
    },
    {
      icon: MessageSquare,
      name: 'Discord',
      link: 'https://discord.gg/YzUtfk6zHP',
      color: 'hover:text-indigo-400',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative text-center">
          <div className="inline-block mb-6 animate-bounce-slow">
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
              <Mail className="text-primary" size={48} />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Get In Touch
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto animate-fade-in-delay">
            Have a question or want to collaborate? We'd love to hear from you. Drop us a message!
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="container-custom -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {contactInfo.map((info, index) => (
            <a
              key={index}
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative mb-6">
                <info.icon 
                  size={40} 
                  className={`mx-auto text-${info.color} group-hover:scale-110 transition-transform`}
                />
                <div className={`absolute inset-0 bg-${info.color}/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{info.title}</h3>
              <p className="text-slate-400">{info.details}</p>
              <div className={`mt-4 h-1 bg-gradient-to-r from-transparent via-${info.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            </a>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="container-custom pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="animate-fade-in">
            <div className="card p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Send className="text-primary" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-white">Send a Message</h2>
              </div>

              {status === 'success' && (
                <div className="mb-6 p-4 bg-green-900/30 border-l-4 border-green-500 rounded-r text-green-300 animate-slide-down flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold">Message sent successfully!</p>
                    <p className="text-sm text-green-400/80">We'll get back to you soon.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 rounded-r text-red-300 animate-slide-down flex items-start gap-3">
                  <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="membership">Membership</option>
                    <option value="event">Event Related</option>
                    <option value="support">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                  <p className="text-xs text-slate-500 mt-2">{formData.message.length} characters</p>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-8 animate-fade-in-delay">
            {/* FAQ */}
            <div className="card p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked</h3>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors">
                    <span className="font-semibold text-white">How do I join the community?</span>
                    <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 px-4 text-slate-400 text-sm">
                    Sign up using your GitHub account and complete your profile. Once approved by our admin team, you'll have full access to all community features!
                  </p>
                </details>

                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors">
                    <span className="font-semibold text-white">Can I showcase my projects?</span>
                    <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 px-4 text-slate-400 text-sm">
                    Absolutely! Members can add their projects to their profile. Projects are reviewed by admins before being displayed publicly.
                  </p>
                </details>

                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors">
                    <span className="font-semibold text-white">How often are events held?</span>
                    <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 px-4 text-slate-400 text-sm">
                    We host workshops, hackathons, and meetups regularly. Check our events page to stay updated on upcoming activities!
                  </p>
                </details>

                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors">
                    <span className="font-semibold text-white">Is membership free?</span>
                    <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 px-4 text-slate-400 text-sm">
                    Yes! Coder Ride is completely free for all members. We believe in building an inclusive community for developers.
                  </p>
                </details>
              </div>
            </div>

            {/* Social Links */}
            <div className="card p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-white mb-6">Connect With Us</h3>
              <p className="text-slate-400 mb-6">
                Follow us on social media to stay updated with the latest news, events, and community highlights.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 ${social.color} transition-all group`}
                  >
                    <social.icon size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-slate-300 group-hover:text-white">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="card p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">Response Time</h3>
              <p className="text-slate-400 mb-4">
                We typically respond to inquiries within 24-48 hours during business days (excluding examination days).
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Usually responds within a day</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        details summary::-webkit-details-marker {
          display: none;
        }

        input:focus, textarea:focus, select:focus {
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
        }
      `}</style>
    </Layout>
  );
}
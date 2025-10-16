"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useMemo, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Headphones,
  CaretDown,
  Star,
  Globe,
  CheckCircle,
  ArrowRight,
  List,
  X,
  Phone,
  EnvelopeSimple,
  MapPin,
  ChatCircle,
  FacebookLogo,
  TwitterLogo,
  LinkedinLogo,
  GithubLogo,
  InstagramLogo,
  YoutubeLogo,
} from "phosphor-react";
import ContactForm from '../components/ContactForm';

export default function Home() {
  type FormPayload = {
    email: string;
    firstName: string;
    lastName: string;
    company?: string;
    jobTitle?: string;
    country?: string;
    phone?: string;
    message: string;
    consent?: boolean;
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keep theme state in sync with system preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setTheme(mq.matches ? 'dark' : 'light');
    try { mq.addEventListener('change', onChange); } catch { /* ignore legacy */ }
    setTheme(mq.matches ? 'dark' : 'light');
    // expose detected value for debugging and ensure nav has data-theme attribute
    try {
      const nav = document.querySelector('nav');
      if (nav) {
        nav.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
      }
    } catch {}
    console.debug('[theme] prefers-color-scheme dark:', mq.matches);
    return () => { try { mq.removeEventListener('change', onChange); } catch {} };
  }, []);

  // JS fallback to explicitly toggle which logo is visible. This helps on mobile
  // More robust logo chooser: compute the navbar's effective background color and
  // choose the logo by luminance. This handles complex backgrounds and mobile
  // blending where prefers-color-scheme alone isn't enough.
  useEffect(() => {
  if (typeof window === 'undefined') return;
  const nav = document.querySelector('nav') as HTMLElement | null;
  if (!nav) return;

    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    const parseRgb = (s: string) => {
      // Accept formats: rgb(r,g,b), rgba(r,g,b,a), #rrggbb, #rgb
      s = s.trim();
      if (s.startsWith('rgb')) {
        const parts = s.replace(/rgba?\(/, '').replace(/\)/, '').split(',').map(p => parseFloat(p));
        return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
      }
      if (s.startsWith('#')) {
        let hex = s.slice(1);
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const num = parseInt(hex, 16);
        return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 1 };
      }
      return null;
    };

    const luminance = (r: number, g: number, b: number) => {
      const a = [r, g, b].map(v => {
        v = v / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };

    const getNavBgColor = () => {
      const nav = document.querySelector('nav') as HTMLElement | null;
      if (!nav) return null;
      const cs = window.getComputedStyle(nav);
      let bg = cs.backgroundColor || cs.background || '';
      if (!bg || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') {
        const bodyCs = window.getComputedStyle(document.body);
        bg = bodyCs.backgroundColor || bodyCs.background || '';
      }
      return bg || null;
    };

    const applyByBg = () => {
      // Decide whether we need the dark-logo (white text) -- true when nav
      // background is dark OR when scrolled. Otherwise use light-logo (dark text).
      let needDarkLogo = false;
      if (isScrolled) {
        needDarkLogo = true;
      } else {
        const bg = getNavBgColor();
        if (bg) {
          const rgb = parseRgb(bg);
          if (rgb) {
            const l = luminance(rgb.r, rgb.g, rgb.b);
            needDarkLogo = l < 0.5;
          }
        } else {
          // fallback to prefers-color-scheme
          needDarkLogo = mq ? mq.matches : false;
        }
      }

      if (needDarkLogo) {
        nav.classList.add('force-dark-logo');
        nav.classList.remove('force-light-logo');
      } else {
        nav.classList.add('force-light-logo');
        nav.classList.remove('force-dark-logo');
      }
    };

    applyByBg();

    const onResizeOrScroll = () => applyByBg();
    window.addEventListener('resize', onResizeOrScroll);
    window.addEventListener('scroll', onResizeOrScroll);

    const onChange = () => applyByBg();
    if (mq) {
      try { mq.addEventListener('change', onChange); } catch {}
    }

    return () => {
      window.removeEventListener('resize', onResizeOrScroll);
      window.removeEventListener('scroll', onResizeOrScroll);
      if (mq) {
        try { mq.removeEventListener('change', onChange); } catch {}
      }
    };
  }, [isScrolled]);

  

  // country select handled inside ContactForm component

  // Intersection Observer hooks for scroll animations
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const [testimonialsRef, testimonialsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [processRef, processInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // ...existing code... (calendly redirect removed - form handles submits now)

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Smooth scroll helper for in-page anchors. On mobile we close the menu first
  // then scroll after a short delay so the nav overlay doesn't block the target.
  const scrollToTestimonials = (closeMenu = true) => {
    if (closeMenu) setIsMenuOpen(false);
    const el = typeof document !== 'undefined' ? document.getElementById('testimonials') : null;
    if (el) {
      // wait a tick for the mobile menu to collapse/animate
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  };

  const testimonials = [
    {
      name: "Aggie B.",
      role: "Founder, Patherra",
      rating: 5,
      text: "Amazing work with Moducode, the commitment was super amazing\n\nThe engineers from Moducode brought my vision to live. It's amazing seeing how they built my platform much more than how I even expected.",
    },
    {
      name: "L. Odunowo.",
      role: "Procapitos Group",
      rating: 5,
      text: "I respect the level of professionalism\n\nThe development was on time and on point. Well done Moducode.",
    },
  ];

  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [calendlyLoading, setCalendlyLoading] = useState(false);

  type FormPayloadMinimal = {
    email: string;
    firstName: string;
    lastName: string;
  };

  const onFormSuccess = (payload: FormPayloadMinimal) => {
    const calendly = process.env.NEXT_PUBLIC_CALENDLY_LINK || '';
    if (calendly) setShowCalendlyModal(true);
    try {
      // Delay dispatch slightly so the modal and embed container exists
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('contact_form_submit', { detail: { payload } }));
      }, 200);
    } catch {}
  };

  // Listen for custom events from the Calendly embed script so we can show/hide a loading spinner
  useEffect(() => {
    const onLoading = () => setCalendlyLoading(true);
    const onReady = () => setCalendlyLoading(false);
    try {
      window.addEventListener('calendly_widget_loading', onLoading);
      window.addEventListener('calendly_widget_ready', onReady);
    } catch {}
    return () => {
      try {
        window.removeEventListener('calendly_widget_loading', onLoading);
        window.removeEventListener('calendly_widget_ready', onReady);
      } catch {}
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navigation with Logo and Why Moducode Link */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 theme-${theme} ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg scrolled' 
          : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
      }`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo wrapper: ensure both images are plain <img> descendants of the nav so .scrolled selectors match */}
            <Link href="/" className="logo-wrapper relative flex items-center">
              <Image
                src="/images/logo-dark.png"
                alt="Moducode Logo (dark)"
                width={150}
                height={150}
                className="logo-dark rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                priority
              />
              <Image
                src="/images/logo-light.png"
                alt="Moducode Logo (light)"
                width={150}
                height={150}
                className="logo-light rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                priority
              />
            </Link>
          </div>

          {/* Desktop Menu - Always visible on desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#testimonials" 
              className={`font-medium text-lg transition-colors duration-200 ${
                isScrolled ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-teal-600'
              }`}
            >
              Why Moducode?
            </a>
            <motion.button
              onClick={openModal}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-teal-600 to-green-700 text-white px-6 py-3 font-semibold text-lg border-l-4 border-teal-400"
            >
              Hire Talent
            </motion.button>
          </div>

          {/* Mobile Menu Button - Only visible on mobile */}
          <button
            className={`md:hidden ${isScrolled ? 'text-white' : 'text-gray-900'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>

        {/* Mobile Menu - Only visible on mobile when open */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden ${isScrolled ? 'bg-gray-800' : 'bg-white'} border-t ${
                isScrolled ? 'border-gray-700' : 'border-gray-100'
              }`}
            >
              <div className="px-6 py-4 space-y-3">
                <a 
                  href="#testimonials" 
                  className={`block font-medium py-2 text-lg ${
                    isScrolled ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-teal-600'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTestimonials(true);
                  }}
                >
                  Why Moducode?
                </a>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full bg-gradient-to-r from-teal-600 to-green-700 text-white px-6 py-3 font-semibold text-lg border-l-4 border-teal-400"
                  onClick={() => {
                    openModal();
                    setIsMenuOpen(false);
                  }}
                >
                  Hire Talent
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border-l-4 border-teal-500"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Request A Demo</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <ContactForm isModal={true} onSuccess={onFormSuccess} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Green Gradient Blobs */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 px-6 overflow-hidden"
      >
        {/* Green Gradient Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Pushed up to align with form */}
            <div className="text-center lg:text-left flex flex-col justify-start lg:justify-start">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={
                  heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-6xl lg:text-7xl font-bold mb-4 leading-tight"
              >
                Build Your Team. Build Your Project.
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={
                  heroInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }
                }
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-6 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold"
              >
                <span className="bg-gradient-to-r from-teal-600 to-green-700 text-white px-4 py-2 sm:px-6 sm:py-3 font-semibold whitespace-nowrap border-l-4 border-teal-400">
                  Hire Vetted Software
                </span>
                <span className="text-gray-900 px-1">
                  &
                </span>
                <span className="bg-gradient-to-r from-teal-600 to-green-700 text-white px-4 py-2 sm:px-6 sm:py-3 font-semibold whitespace-nowrap border-l-4 border-teal-400">
                  Data Engineers
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={
                  heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Experience world-class professionalism and expertise with remote tech talents from Africa.
Whether you&apos;re scaling a startup or building enterprise-grade solutions, our pre-vetted engineers
are ready to power your next big project.
              </motion.p>
            </div>
            
            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={
                heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
              }
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="flex justify-start"
            >
              <div className="w-full max-w-md">
                <ContactForm onSuccess={onFormSuccess} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialsRef} 
        id="testimonials"
        className="py-20 px-6 bg-gray-50"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Don&apos;t take our word for it
            </h2>
            <p className="text-xl text-gray-600">
              See what clients say about Moducode
            </p>
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    weight="fill"
                    className="text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">4.7 | 329 reviews</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={
                  testimonialsInView
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 50, scale: 0.95 }
                }
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="bg-white p-6 shadow-sm border-l-4 border-teal-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      weight="fill"
                      className="text-yellow-400"
                    />
                  ))}
                </div>
                <h4 className="font-bold mb-2 whitespace-pre-line">{testimonial.text.split("\n")[0]}</h4>
                <p className="text-sm text-gray-600 mb-4 whitespace-pre-line">{testimonial.text.split("\n").slice(1).join("\n")}</p>
                <div className="border-t pt-4">
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={
              processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            Hire Africa’s Top Tech Talent in 3 Steps.
          </motion.h2>
          <p className="text-center text-lg text-gray-600 mb-12">
            We handle recruitment, vetting, and management so you can focus on results.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "Book a Call",
                desc: "Talk to our team about your project.",
                color: "from-gray-900 to-black",
                iconColor: "text-white",
              },
              {
                icon: Users,
                title: "Get Talent",
                desc: "We match you with pre-vetted engineers.",
                color: "from-teal-600 to-teal-700",
                iconColor: "text-white",
              },
              {
                icon: Headphones,
                title: "Start Work",
                desc: "Talent starts immediately with our management support.",
                color: "from-green-600 to-green-700",
                iconColor: "text-white",
              },
            ].map(({ icon: Icon, title, desc, color, iconColor }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={
                  processInView
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 50, scale: 0.9 }
                }
                transition={{ delay: i * 0.2, duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="text-center p-8 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white border-l-4 border-teal-500"
              >
                <motion.div
                  className={`bg-gradient-to-br ${color} w-24 h-24 flex items-center justify-center mx-auto mb-6`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon size={40} className={iconColor} />
                </motion.div>
                <h3 className="font-bold text-xl mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
                <div className="mt-6 w-10 h-10 bg-gray-800 text-white flex items-center justify-center mx-auto font-bold text-lg">
                  {i + 1}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(20, 184, 166, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-teal-600 to-green-700 text-white px-8 py-4 font-semibold text-lg shadow-lg border-l-4 border-teal-400"
              onClick={openModal}
            >
              Book a Call
              <ArrowRight className="inline ml-2" size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              {/* Light logo for dark background - bigger size */}
              <Link href="/">
                <Image 
                  src="/images/logo-dark.png" 
                  alt="Moducode Logo" 
                  width={150} 
                  height={150} 
                  className="rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                />
              </Link>
            </div>

            <div className="text-gray-300 leading-relaxed space-y-2 mb-8">
              <p className="text-lg">Moducode Web App…Loading…</p>
              <p className="text-xl font-semibold">
                Africa&apos;s Digital Campus…Coming soon…
              </p>
            </div>

            {/* Social Media */}
            <div className="flex justify-center space-x-4 mb-8">
              <a href="https://www.linkedin.com/company/moducode/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 rounded">
                <LinkedinLogo size={24} />
              </a>
              <a href="https://www.instagram.com/joinmoducode?igsh=MWF4M3Jmc2swNTN1Zw==" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-all duration-300 rounded">
                <InstagramLogo size={24} />
              </a>
              <a href="#" className="w-12 h-12 bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 rounded">
                <FacebookLogo size={24} />
              </a>
              <a href="#" className="w-12 h-12 bg-gray-800 hover:bg-blue-400 flex items-center justify-center transition-all duration-300 rounded">
                <TwitterLogo size={24} />
              </a>
              <a href="#" className="w-12 h-12 bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300 rounded">
                <GithubLogo size={24} />
              </a>
              <a href="#" className="w-12 h-12 bg-gray-800 hover:bg-red-600 flex items-center justify-center transition-all duration-300 rounded">
                <YoutubeLogo size={24} />
              </a>
            </div>

            {/* Contact Info */}
            <div className="text-gray-400 text-sm space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <EnvelopeSimple size={16} />
                <span>contact@moducode.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin size={16} />
                <span>Global Remote Team</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Moducode. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Blob Animation Styles */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      {/* Calendly embed modal */}
      {showCalendlyModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white w-[90%] max-w-3xl h-[80vh] relative rounded-lg overflow-hidden">
            <button onClick={() => setShowCalendlyModal(false)} className="absolute right-3 top-3 z-50 bg-white rounded-full p-2 shadow">
              <X size={20} />
            </button>
            <div className="absolute inset-0 flex items-center justify-center" style={{ display: calendlyLoading ? 'flex' : 'none' }}>
              <div className="text-center">
                <div className="animate-spin h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4" />
                <div className="text-sm text-gray-700">Loading scheduling widget…</div>
              </div>
            </div>
            <div id="calendly-embed" className="w-full h-full">
              {/* Calendly inline widget will be loaded here */}
            </div>
          </div>
        </div>
      )}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var calendlyScriptLoaded = false;
          function loadScript(cb){
            if (window.Calendly){ calendlyScriptLoaded = true; return cb(); }
            if (calendlyScriptLoaded) return setTimeout(cb, 200);
            calendlyScriptLoaded = true;
            var s = document.createElement('script');
            s.src = 'https://assets.calendly.com/assets/external/widget.js';
            s.async = true;
            s.onload = cb;
            document.head.appendChild(s);
          }

          window.addEventListener('contact_form_submit', function(e){
            try{
              var detail = e && e.detail ? e.detail : {};
              var link = '${process.env.NEXT_PUBLIC_CALENDLY_LINK || ''}';
              if (!link) return;
              loadScript(function(){
                try{
                  var container = document.getElementById('calendly-embed');
                  if (!container) return;
                  container.innerHTML = '';
                  var prefill = {};
                  if (detail && detail.payload){
                    var p = detail.payload;
                    prefill = {
                      name: ((p.firstName||'') + ' ' + (p.lastName||'')).trim(),
                      email: p.email || undefined
                    };
                  }
                  if (window.Calendly && typeof window.Calendly.initInlineWidget === 'function'){
                    try { window.dispatchEvent(new CustomEvent('calendly_widget_loading')); } catch {}
                    window.Calendly.initInlineWidget({ url: link, parentElement: container, prefill: prefill, utm: {} });
                    try { window.dispatchEvent(new CustomEvent('calendly_widget_ready')); } catch {}
                  }
                }catch(err){console.error(err)}
              });
            }catch(err){console.error(err)}
          });
        })();
      `}} />
    </main>
  );
}
"use client";

import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState, useMemo } from "react";
import countryList from "react-select-country-list";
import {
  Users,
  Rocket,
  Headphones,
  Article,
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

export default function Home() {
  const { register, handleSubmit } = useForm();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showModal, setShowModal] = useState(false);

  // React country list
  const countries = useMemo(() => countryList().getData(), []);

  // Intersection Observer hooks for scroll animations
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const [statsRef, statsInView] = useInView({
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

  const onSubmit = () => {
    window.location.href = "https://calendly.com/YOUR-CALENDLY-LINK/30min";
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const stats = [
    { number: "150K", label: "Top talent", subtitle: "highly skilled" },
    { number: "33%", label: "Faster project", subtitle: "delivery" },
    { number: "86%", label: "Faster time", subtitle: "to hire" },
  ];

  const testimonials = [
    {
      name: "Sarah K.",
      role: "CTO at TechFlow",
      rating: 5,
      text: "Exceptional partner with world-class talent. The engineers from Moducode have been instrumental in scaling our platform.",
    },
    {
      name: "James R.",
      role: "Head of Engineering",
      rating: 5,
      text: "Working with Moducode is great. They understand our needs and deliver quality solutions consistently.",
    },
    {
      name: "Peters B.",
      role: "Product Manager",
      rating: 5,
      text: "Great experience with Moducode! The way they help people realize their potential while building world-class products is amazing.",
    },
    {
      name: "Karl F.",
      role: "Startup Founder",
      rating: 5,
      text: "Moducode engineers are a valuable part of our team. Their technical expertise and dedication make all the difference.",
    },
  ];

  const FormComponent = ({ isModal = false }) => (
    <div
      className={`${
        isModal
          ? ""
          : "bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      }`}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WORK EMAIL *
          </label>
          <div className="relative">
            <input
              type="email"
              className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="your.email@company.com"
              required
            />
            <EnvelopeSimple
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              FIRST NAME *
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LAST NAME *
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            COMPANY NAME *
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            placeholder="Your Company"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            JOB TITLE *
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g. CTO, Engineering Manager"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            COUNTRY *
          </label>
          <Listbox value={selectedCountry} onChange={setSelectedCountry}>
            <div className="relative">
              <Listbox.Button className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between bg-white">
                <span
                  className={
                    selectedCountry === "" ? "text-gray-500" : "text-gray-900"
                  }
                >
                  {selectedCountry === ""
                    ? "Select Country"
                    : countries.find((c) => c.value === selectedCountry)?.label}
                </span>
                <div className="flex items-center space-x-2">
                  <Globe className="text-gray-400" size={18} />
                  <CaretDown className="text-gray-400" size={18} />
                </div>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {countries.map((country) => (
                    <Listbox.Option
                      key={country.value}
                      value={country.value}
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-3 pl-4 pr-9 ${
                          active ? "bg-teal-50 text-teal-900" : "text-gray-900"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between">
                          <span
                            className={selected ? "font-medium" : "font-normal"}
                          >
                            {country.label}
                          </span>
                          {selected && (
                            <CheckCircle className="text-teal-600" size={16} />
                          )}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PHONE NUMBER *
          </label>
          <div className="relative">
            <input
              type="tel"
              className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="+1 (555) 123-4567"
              required
            />
            <Phone
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            MESSAGE *
          </label>
          <div className="relative">
            <textarea
              className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              rows={4}
              placeholder="Do you have a specific goal for the Moducode demo? If there's an area you'd like us to cover, please include those details here so we can be prepared."
              required
            />
            <ChatCircle
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
              required
            />
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            I UNDERSTAND THAT MODUCODE WILL PROCESS MY INFORMATION IN ACCORDANCE
            WITH THEIR{" "}
            <a href="#" className="text-teal-600 underline hover:text-teal-700">
              TERMS OF USE.
            </a>{" "}
            I UNDERSTAND THAT I CAN UNSUBSCRIBE LINKS AT ANY TIME.
          </p>
        </div>

        <motion.button
          type="button"
          onClick={onSubmit}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 10px 25px rgba(20, 184, 166, 0.15)",
          }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg"
        >
          Submit
        </motion.button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Simplified Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl">moducode</span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              onClick={openModal}
              whileHover={{ scale: 1.05 }}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Hire Talent
            </motion.button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
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
              className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
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
              <FormComponent isModal={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - More Boxed and Centered */}
      <section
        ref={heroRef}
        className="pt-24 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Enhanced Content */}
            <div className="text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={
                  heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-6xl lg:text-7xl font-bold mb-8 leading-tight"
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
                <span className="bg-teal-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold whitespace-nowrap">
                  Hire Vetted Software
                </span>
                <span className="text-gray-900 px-1">
                  &
                </span>
                <span className="bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold whitespace-nowrap">
                  Data Engineers
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={
                  heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="text-xl text-gray-600 mb-12 leading-relaxed"
              >
                Experience world-class professionalism and expertise with remote tech talents from Africa.
Whether you’re scaling a startup or building enterprise-grade solutions, our pre-vetted engineers
are ready to power your next big project.

              </motion.p>

              {/* Stats */}
              <motion.div
                ref={statsRef}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="grid grid-cols-3 gap-8 mb-12"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-left border-l-4 border-teal-500 pl-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={
                      statsInView
                        ? { scale: 1, opacity: 1 }
                        : { scale: 0.8, opacity: 0 }
                    }
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                  >
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                    <div className="text-sm text-gray-500">{stat.subtitle}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced Badges */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={
                  statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                className="flex justify-center lg:justify-start space-x-4 mb-8"
              >
                {[
                  { color: "red", text: "Leader", subtext: "Enterprise" },
                  { color: "purple", text: "Leader", subtext: "EMEA" },
                  { color: "orange", text: "Leader", subtext: "FALL" },
                ].map((badge, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="text-center"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 ${
                        badge.color === "red"
                          ? "bg-red-100"
                          : badge.color === "purple"
                          ? "bg-purple-100"
                          : "bg-orange-100"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          badge.color === "red"
                            ? "bg-red-500"
                            : badge.color === "purple"
                            ? "bg-purple-500"
                            : "bg-orange-500"
                        }`}
                      >
                        <CheckCircle className="text-white" size={16} />
                      </div>
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        badge.color === "red"
                          ? "text-red-800"
                          : badge.color === "purple"
                          ? "text-purple-800"
                          : "text-orange-800"
                      }`}
                    >
                      {badge.text}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full mt-1 ${
                        badge.color === "red"
                          ? "bg-red-500 text-white"
                          : badge.color === "purple"
                          ? "bg-purple-500 text-white"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {badge.subtext}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Side - Form More Centered */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={
                heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
              }
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md">
                <FormComponent />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 px-6 bg-gray-50">
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
              See what clients say about Moducode on G2
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
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
                <h4 className="font-bold mb-2">
                  &quot;{testimonial.text.split(".")[0]}.&quot;
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {testimonial.text.split(".").slice(1).join(".")}
                </p>
                <div className="border-t pt-4">
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                  <button className="text-teal-600 text-sm mt-2 hover:underline flex items-center space-x-1">
                    <span>Read More</span>
                    <ArrowRight size={12} />
                  </button>
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
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
          >
            Your Talent Pipeline
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Article,
                title: "Fill Form",
                desc: "Complete our detailed requirements form",
                color: "from-blue-400 to-blue-600",
              },
              {
                icon: Phone,
                title: "Book a Call",
                desc: "Schedule a consultation with our team",
                color: "from-green-400 to-green-600",
              },
              {
                icon: Users,
                title: "Lock Talent",
                desc: "Select from pre-vetted candidates",
                color: "from-purple-400 to-purple-600",
              },
              {
                icon: Headphones,
                title: "Meet Manager",
                desc: "Get dedicated support throughout",
                color: "from-orange-400 to-orange-600",
              },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={
                  processInView
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 50, scale: 0.9 }
                }
                transition={{ delay: i * 0.2, duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="text-center p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border border-gray-100"
              >
                <motion.div
                  className={`bg-gradient-to-br ${color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon size={36} className="text-white" />
                </motion.div>
                <h3 className="font-bold text-xl mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>

                <div className="mt-6 w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto font-bold text-sm">
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
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300"
              onClick={openModal}
            >
              Get Started Today
              <ArrowRight className="inline ml-2" size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Updated Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              className="flex items-center justify-center space-x-2 mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-2xl">moducode</span>
            </motion.div>

            <motion.div
              className="text-gray-300 leading-relaxed space-y-2 mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="text-lg">Moducode Web App…Loading…</p>
              <p className="text-xl font-semibold">
                Africa&apos;s Digital Campus…Coming soon…
              </p>
            </motion.div>

            {/* Social Media */}
            <motion.div
              className="flex justify-center space-x-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {[
                {
                  icon: FacebookLogo,
                  hover: "hover:bg-blue-600",
                  name: "Facebook",
                },
                {
                  icon: TwitterLogo,
                  hover: "hover:bg-blue-400",
                  name: "Twitter",
                },
                {
                  icon: LinkedinLogo,
                  hover: "hover:bg-blue-700",
                  name: "LinkedIn",
                },
                {
                  icon: GithubLogo,
                  hover: "hover:bg-gray-700",
                  name: "GitHub",
                },
                {
                  icon: InstagramLogo,
                  hover: "hover:bg-pink-600",
                  name: "Instagram",
                },
                {
                  icon: YoutubeLogo,
                  hover: "hover:bg-red-600",
                  name: "YouTube",
                },
              ].map(({ icon: Icon, hover, name }, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 bg-gray-800 ${hover} rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300`}
                >
                  <Icon size={24} />
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="text-gray-400 text-sm space-y-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center justify-center space-x-2">
                <EnvelopeSimple size={16} />
                <span>contact@moducode.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin size={16} />
                <span>Global Remote Team</span>
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div
            className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p>&copy; 2024 Moducode. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </main>
  );
}

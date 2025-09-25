"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Users, Rocket, Headphones, FormInput } from "lucide-react";

export default function Home() {
  const { register, handleSubmit } = useForm();

  const onSubmit = () => {
    window.location.href = "https://calendly.com/YOUR-CALENDLY-LINK/30min";
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-r from-green-600 to-black text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Build Your Team. Build Your Project.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl mb-8 max-w-2xl"
        >
          Hire vetted Software & Data Engineers from Africa. Fast. Reliable. World-class.
        </motion.p>
        <motion.a 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          href="#request-form"
        >
          <button className="bg-white text-green-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100">
            Request Talent
          </button>
        </motion.a>
      </section>

      {/* Value Props */}
      <section className="py-20 px-6 max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        <motion.div whileHover={{ y: -5 }} className="p-6 rounded-2xl shadow border">
          <Users className="mx-auto mb-4 w-10 h-10 text-green-600" />
          <h3 className="font-bold mb-2">Vetted Engineers</h3>
          <p className="text-sm text-gray-600">Top 3% remote engineers ready to join your team.</p>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="p-6 rounded-2xl shadow border">
          <Rocket className="mx-auto mb-4 w-10 h-10 text-green-600" />
          <h3 className="font-bold mb-2">Flexible Engagement</h3>
          <p className="text-sm text-gray-600">Scale up or down with ease — startup to enterprise.</p>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="p-6 rounded-2xl shadow border">
          <Headphones className="mx-auto mb-4 w-10 h-10 text-green-600" />
          <h3 className="font-bold mb-2">Dedicated Support</h3>
          <p className="text-sm text-gray-600">Talent Manager for onboarding & performance tracking.</p>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="bg-gray-50 py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Your Talent Pipeline</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
          {[
            { icon: FormInput, title: "Fill Form" },
            { icon: Users, title: "Book a Call" },
            { icon: Rocket, title: "Lock Talent" },
            { icon: Headphones, title: "Meet Manager" }
          ].map(({ icon: Icon, title }, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-6 rounded-xl bg-white shadow hover:shadow-lg"
            >
              <Icon className="mx-auto mb-4 w-12 h-12 text-green-600" />
              <h3 className="font-semibold">{title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section id="request-form" className="py-20 px-6 bg-white">
        <div className="max-w-lg mx-auto bg-gray-50 p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Request a Demo</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input placeholder="Full Name" className="w-full p-3 border rounded" required />
            <input placeholder="Company Name" className="w-full p-3 border rounded" required />
            <input type="email" placeholder="Work Email" className="w-full p-3 border rounded" required />
            <input placeholder="Job Title / Role" className="w-full p-3 border rounded" />
            <input placeholder="Country" className="w-full p-3 border rounded" />
            <textarea placeholder="Tell us about your project..." className="w-full p-3 border rounded" />
            
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
            >
              Submit & Book Call
            </motion.button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 bg-black text-white">
        <p>© {new Date().getFullYear()} Moducode. All rights reserved.</p>
      </footer>
    </main>
  );
}

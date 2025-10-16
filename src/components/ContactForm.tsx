"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { motion } from 'framer-motion';
import {
  EnvelopeSimple,
  Phone,
  ChatCircle,
} from 'phosphor-react';

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

type Props = {
  isModal?: boolean;
  onSuccess?: (payload: FormPayload) => void;
};

export default function ContactForm({ isModal = false, onSuccess }: Props) {
  const { register, handleSubmit, reset, control } = useForm<FormPayload>();
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<null | { ok?: boolean; error?: string }>(null);

  type Country = { label: string; value: string };
  const countries: Country[] = useMemo(() => countryList().getData(), []);

  // react-select portal target (avoid overflow/clipping in modals)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(typeof document !== 'undefined' ? document.body : null);
  }, []);

  const onSubmitForm = async (data: FormPayload) => {
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const payload: FormPayload = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        jobTitle: data.jobTitle,
        country: data.country,
        phone: data.phone,
        message: data.message,
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok) {
        setSubmitResult({ ok: true });
        reset();
        // analytics + custom event
        try {
          const eventData = { category: 'Contact', action: 'submit', label: payload.email, payload };
          const w = window as unknown as Record<string, unknown>;
          if (Array.isArray(w['dataLayer'])) {
            (w['dataLayer'] as unknown[]).push({ event: 'contact_form_submit', ...eventData });
          }
          if (typeof w['gtag'] === 'function') {
            (w['gtag'] as (...args: unknown[]) => void)('event', 'contact_form_submit', eventData);
          }
          window.dispatchEvent(new CustomEvent('contact_form_submit', { detail: eventData }));
        } catch {}

        if (typeof onSuccess === 'function') onSuccess(payload);
      } else {
        setSubmitResult({ error: json.error || 'Failed to send message' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setSubmitResult({ error: message || 'Unexpected error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={`${isModal ? '' : 'bg-white p-8 shadow-xl border-l-4 border-teal-500'}`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">WORK EMAIL *</label>
          <div className="relative">
            <input {...register('email', { required: true })} type="email" className="w-full p-3 pl-10 border-b-2 border-gray-200 bg-transparent focus:border-teal-500 focus:outline-none transition-all duration-200" placeholder="your.email@company.com" />
            <EnvelopeSimple className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">FIRST NAME *</label>
            <input {...register('firstName', { required: true })} type="text" className="w-full p-3 border-b-2 border-gray-200 bg-transparent focus:border-teal-500 focus:outline-none transition-all duration-200" placeholder="John" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LAST NAME *</label>
            <input {...register('lastName', { required: true })} type="text" className="w-full p-3 border-b-2 border-gray-200 bg-transparent focus:border-teal-500 focus:outline-none transition-all duration-200" placeholder="Doe" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">COMPANY NAME</label>
          <input {...register('company')} type="text" className="w-full p-3 border-b-2 border-gray-200 bg-transparent focus:border-teal-500 focus:outline-none transition-all duration-200" placeholder="Your Company" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">JOB TITLE</label>
          <input {...register('jobTitle')} type="text" className="w-full p-3 border-b-2 border-gray-200 bg-transparent focus:border-teal-500 focus:outline-none transition-all duration-200" placeholder="e.g. CTO, Engineering Manager" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">COUNTRY</label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                inputId="country-select"
                instanceId="country-select"
                options={countries}
                isClearable
                isSearchable
                menuPortalTarget={portalTarget ?? undefined}
                  styles={{
                    container: (base) => ({ ...base, width: '100%' }),
                    control: (base) => ({ ...base, border: 'none', boxShadow: 'none', paddingLeft: 0, background: 'transparent' }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({ ...base, backgroundColor: '#ffffff', color: '#000000' }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#f0fdfa' : '#ffffff',
                      color: '#000000',
                    }),
                    singleValue: (base) => ({ ...base, color: '#000000' }),
                    placeholder: (base) => ({ ...base, color: '#6b7280' }),
                  }}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select country"
                onChange={(option: Country | null) => field.onChange(option ? option.value : '')}
                value={countries.find((c) => c.value === field.value) || null}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PHONE NUMBER</label>
          <div className="relative">
            <input {...register('phone')} type="tel" className="w-full p-3 pl-10 border-b-2 border-gray-200 bg-transparent focus:border-teal-500 focus:outline-none transition-all duration-200" placeholder="+1 (555) 123-4567" />
            <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">MESSAGE *</label>
          <div className="relative">
            <textarea {...register('message', { required: true })} className="w-full p-3 pl-10 border-b-2 border-gray-200 bg-transparent focus:border-teal-500 focus:outline-none transition-all duration-200" rows={4} placeholder="Briefly tell us what you have in mind" />
            <ChatCircle className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex items-center h-5">
            <input {...register('consent', { required: true })} type="checkbox" className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 focus:ring-teal-500 focus:ring-2" />
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">I UNDERSTAND THAT MODUCODE WILL PROCESS MY INFORMATION IN ACCORDANCE WITH THEIR <a href="#" className="text-teal-600 underline hover:text-teal-700">TERMS OF USE.</a> I UNDERSTAND THAT I CAN UNSUBSCRIBE LINKS AT ANY TIME.</p>
        </div>

        <div>
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={submitting} className="w-full bg-gradient-to-r from-teal-600 to-green-700 text-white py-4 font-semibold text-lg transition-all duration-200 shadow-lg border-l-4 border-teal-400 disabled:opacity-60">
            {submitting ? 'Sending…' : 'Book a Call'}
          </motion.button>
        </div>

        {submitResult?.ok && <div className="text-sm text-green-600">Thanks — your message was sent. We will respond shortly.</div>}
        {submitResult?.error && <div className="text-sm text-red-600">Error: {submitResult.error}</div>}
      </div>
    </form>
  );
}

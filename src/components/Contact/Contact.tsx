"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <label
        className="font-victor text-[9px] tracking-[0.35em] uppercase mb-2 block transition-colors duration-200"
        style={{ color: focused ? "#d4af37" : "rgba(176,170,152,0.3)" }}
      >
        {label} {required && <span style={{ color: "#8b0000" }}>*</span>}
      </label>
      <div
        className="relative pb-0.5"
        style={{
          borderBottom: `1px solid ${
            focused ? "#d4af37" : "rgba(176,170,152,0.1)"
          }`,
          transition: "border-color 0.2s",
        }}
      >
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent py-2.5 font-victor text-xs outline-none"
          style={{
            color: "#b0aa98",
          }}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="font-victor text-[9px] tracking-[0.35em] uppercase mb-2 block transition-colors duration-200"
        style={{ color: focused ? "#d4af37" : "rgba(176,170,152,0.3)" }}
      >
        {label} {required && <span style={{ color: "#8b0000" }}>*</span>}
      </label>
      <div
        className="relative"
        style={{
          borderBottom: `1px solid ${
            focused ? "#d4af37" : "rgba(176,170,152,0.1)"
          }`,
          transition: "border-color 0.2s",
        }}
      >
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className="w-full bg-transparent py-2.5 font-victor text-xs outline-none appearance-none cursor-pointer"
          style={{ color: "#b0aa98", background: "transparent" }}
        >
          <option value="" style={{ background: "#1a1916" }}>
            select interest
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              style={{ background: "#1a1916" }}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-xs"
          style={{ color: "rgba(176,170,152,0.3)" }}
        >
          ▾
        </div>
      </div>
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="font-victor text-[9px] tracking-[0.35em] uppercase mb-2 block transition-colors"
        style={{ color: focused ? "#d4af37" : "rgba(176,170,152,0.3)" }}
      >
        {label}
      </label>
      <div
        style={{
          borderBottom: `1px solid ${
            focused ? "#d4af37" : "rgba(176,170,152,0.1)"
          }`,
          transition: "border-color 0.2s",
        }}
      >
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={4}
          className="w-full bg-transparent py-2.5 font-victor text-xs outline-none resize-none"
          style={{ color: "#b0aa98" }}
        />
      </div>
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1600));
    setSending(false);
    setSubmitted(true);
  };

  const interestOptions = [
    { value: "rings", label: "Rings & Signets" },
    { value: "chains", label: "Chains & Necklaces" },
    { value: "bracelets", label: "Bracelets" },
    { value: "custom", label: "Custom Commission" },
    { value: "vault", label: "Vault Collection" },
    { value: "wholesale", label: "Wholesale Inquiry" },
  ];

  return (
    <section className="relative py-24 md:py-36 overflow-hidden paper-light-bg">
      <div className="max-w-5xl mx-auto px-6">
        {/* ── Header ── */}
        <div ref={headingRef} className="mb-16 opacity-0">
          <p className="chapter-label tracking-[0.5em] mb-3">contact</p>
          <div
            className="h-px mb-6"
            style={{ background: "rgba(176,170,152,0.08)" }}
          />
          <p
            className="font-victor text-xs"
            style={{ color: "rgba(176,170,152,0.3)", lineHeight: 1.8 }}
          >
            we don&apos;t do cold calls. you reach out. we respond.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* ── Left: info ── */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="space-y-9">
              {[
                {
                  label: "showroom",
                  value: "by appointment only",
                  detail: "Little Italy, New York",
                },
                {
                  label: "phone",
                  value: "+1 (212) 000 — MAFIA",
                  detail: "Mon–Fri, 10am–7pm EST",
                },
                {
                  label: "mail",
                  value: "vault@mafiametal.com",
                  detail: "replies within 24h",
                },
              ].map(({ label, value, detail }) => (
                <div key={label}>
                  <p className="chapter-label text-[9px] mb-1.5">{label}</p>
                  <p
                    className="font-victor text-xs mb-1"
                    style={{ color: "#b0aa98" }}
                  >
                    {value}
                  </p>
                  <p
                    className="font-victor text-[10px]"
                    style={{ color: "rgba(176,170,152,0.3)" }}
                  >
                    {detail}
                  </p>
                </div>
              ))}

              <div className="gold-divider" />

              <div>
                <p className="chapter-label text-[9px] mb-4">channels</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "instagram", handle: "@mafiametal" },
                    { label: "telegram", handle: "@mafiametal_vault" },
                  ].map(({ label, handle }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-4 py-3 cursor-pointer group transition-all"
                      style={{
                        border: "1px solid rgba(176,170,152,0.06)",
                      }}
                      data-cursor-hover
                    >
                      <span className="chapter-label text-[9px]">{label}</span>
                      <span
                        className="font-victor text-[10px] tracking-widest group-hover:text-gold transition-colors"
                        style={{ color: "rgba(212,175,55,0.5)" }}
                      >
                        {handle}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="p-4"
                style={{
                  border: "1px solid rgba(139,0,0,0.2)",
                  background: "rgba(139,0,0,0.04)",
                }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "#8b0000" }}
                  />
                  <span
                    className="font-victor text-[9px] tracking-[0.3em] uppercase"
                    style={{ color: "#8b0000" }}
                  >
                    confidential
                  </span>
                </div>
                <p
                  className="font-victor text-[10px] leading-relaxed"
                  style={{ color: "rgba(176,170,152,0.3)" }}
                >
                  all communications treated with full discretion.
                  your information is never shared.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Right: form ── */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true }}
          >
            {submitted ? (
              <motion.div
                className="flex flex-col items-center justify-center text-center py-20 px-8"
                style={{ border: "1px solid rgba(212,175,55,0.12)" }}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-7"
                  style={{ border: "1px solid rgba(212,175,55,0.4)" }}
                >
                  <span style={{ color: "#d4af37" }}>✓</span>
                </div>
                <h3
                  className="font-victor font-bold text-lg mb-4 tracking-wide"
                  style={{ color: "#d4af37" }}
                >
                  message received
                </h3>
                <p
                  className="font-victor text-xs leading-relaxed max-w-xs"
                  style={{ color: "rgba(176,170,152,0.4)" }}
                >
                  your file has been added to our dossier.
                  expect contact within 24 hours.
                </p>
                <div className="mt-8 classified-stamp text-[10px]">
                  case opened
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div
                  className="flex items-center justify-between pb-4"
                  style={{ borderBottom: "1px solid rgba(212,175,55,0.07)" }}
                >
                  <span
                    className="font-victor text-[10px] tracking-[0.3em]"
                    style={{ color: "rgba(176,170,152,0.3)" }}
                  >
                    new case file
                  </span>
                  <span className="classified-stamp text-[9px]">
                    confidential
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <InputField
                    label="full name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="your name"
                    required
                  />
                  <InputField
                    label="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <InputField
                    label="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (000) 000 0000"
                  />
                  <SelectField
                    label="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    options={interestOptions}
                    required
                  />
                </div>

                <TextAreaField
                  label="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="tell us what you're looking for. be specific."
                />

                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid rgba(176,170,152,0.06)" }}
                >
                  <p
                    className="font-victor text-[9px]"
                    style={{ color: "rgba(176,170,152,0.2)" }}
                  >
                    * required
                  </p>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-10 py-3 font-victor text-xs tracking-[0.35em] transition-colors metal-shine disabled:opacity-50"
                    style={{ background: "#d4af37", color: "#0a0908" }}
                    data-cursor-hover
                  >
                    {sending ? (
                      <span className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border animate-spin"
                          style={{
                            borderColor: "rgba(10,9,8,0.3)",
                            borderTopColor: "#0a0908",
                          }}
                        />
                        sending...
                      </span>
                    ) : (
                      "submit"
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Footer ── */}
      <motion.div
        className="mt-24 px-6"
        style={{ borderTop: "1px solid rgba(176,170,152,0.05)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto pt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            className="font-victor font-bold text-sm tracking-[0.3em]"
            style={{ color: "#d4af37" }}
          >
            MAFIA METAL
          </div>
          <p
            className="font-victor text-[10px] text-center"
            style={{ color: "rgba(176,170,152,0.2)" }}
          >
            © {new Date().getFullYear()} mafia metal. all rights reserved.
            forged in new york.
          </p>
          <div className="flex items-center gap-4">
            <span className="chapter-label text-[9px]">est. mmxxiv</span>
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: "rgba(212,175,55,0.25)" }}
            />
            <span className="chapter-label text-[9px]">little italy</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

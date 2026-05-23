import React from "react";

export default function MaintenancePage() {
  return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center p-6 select-none font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Red Accent/Alert Indicator */}
        <div className="inline-block px-3 py-1 bg-[#cc2936]/10 border border-[#cc2936]/30 rounded text-[#cc2936] text-xs font-semibold uppercase tracking-widest">
          Offline
        </div>

        {/* Brand/Owner */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase">
          Mohak Kapoor
        </h1>

        {/* Message */}
        <div className="space-y-4">
          <p className="text-xl font-bold text-gray-100">
            This website is temporarily down.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            I am currently performing maintenance. The site will be back online shortly.
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-[2px] bg-[#cc2936] mx-auto my-6" />

        {/* Contact Info */}
        <div className="space-y-2">
          <span className="block text-xs uppercase tracking-wider text-gray-500 font-medium">
            Urgent Enquiries
          </span>
          <a
            href="mailto:contact.mohakapoor@gmail.com"
            className="inline-block text-[#cc2936] hover:text-white transition-colors duration-300 font-mono text-sm underline underline-offset-4"
          >
            contact.mohakapoor@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}

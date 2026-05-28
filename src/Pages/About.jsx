// src/Pages/About.jsx
import React, { useEffect, memo, useMemo } from "react";
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles, Server, Database, Brain, Users, GitMerge, Rocket, FileCheck, Cog, Shield, AlertTriangle, Network, FileText as FileTextIcon, Target } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import profilePic from '../assets/pic.png';
import { useGitHubRepos } from '../hooks/useGitHubRepos';

const Header = memo(() => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]">
    <div className="inline-block relative group">
      <h2
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0A66C2] to-[#ffffff]"
        data-aos="zoom-in-up"
        data-aos-duration="600"
      >
        About Me
      </h2>
    </div>
    <p
      className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      <Sparkles className="w-5 h-5 text-blue-400" />
      Turning concepts into impactful digital solutions.
      <Sparkles className="w-5 h-5 text-blue-400" />
    </p>
  </div>
));

const ProfileImage = memo(() => (
  <div className="flex justify-end items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2">
    <div
      className="relative group"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      {/* Gradient glows (desktop only) */}
      <div className="absolute -inset-6 opacity-[25%] z-0 hidden sm:block">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-600 rounded-full blur-2xl animate-spin-slower" />
        <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500 via-rose-500 to-pink-600 rounded-full blur-2xl animate-pulse-slow opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400 rounded-full blur-2xl animate-float opacity-50" />
      </div>

      <div className="relative">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(120,119,198,0.3)] transform transition-all duration-700 group-hover:scale-105">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-white/40 group-hover:scale-105" />

          {/* Subtle overlays (desktop only) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-blue-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block" />

          {/* ✅ Use imported asset; no leading slash */}
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            loading="lazy"
          />

          {/* Hover accents (desktop only) */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent transform translate-y-full group-hover:-translate-y-full transition-transform duration-1000 delay-100" />
            <div className="absolute inset-0 rounded-full border-8 border-white/10 scale-0 group-hover:scale-100 transition-transform duration-700 animate-pulse-slow" />
          </div>
        </div>
      </div>
    </div>
  </div>
));

const StatCard = memo(({ icon: Icon, color, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration={1300} className="relative group">
    <div className="relative z-10 bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 transition-transform group-hover:rotate-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <span
          className="text-4xl font-bold text-white"
          data-aos="fade-up-left"
          data-aos-duration="1500"
          data-aos-anchor-placement="top-bottom"
        >
          {value}
        </span>
      </div>

      <div>
        <p
          className="text-sm uppercase tracking-wider text-gray-300 mb-2"
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-anchor-placement="top-bottom"
        >
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p
            className="text-xs text-gray-400"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-anchor-placement="top-bottom"
          >
            {description}
          </p>
          <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  </div>
));

// =====================
// Page Component
// =====================

const AboutPage = () => {
  // Get GitHub repos data for project count
  const { repos } = useGitHubRepos();

  // Derived numbers from actual data sources
  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    const startDate = new Date("2022-02-12");
    const today = new Date();
    const experience =
      today.getFullYear() -
      startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

    return {
      totalProjects: repos.length, // Count from GitHub API
      totalCertificates: 28, // Total certificates added
      YearExperience: experience,
    };
  }, [repos]);

  // AOS init + light re-init on resize
  useEffect(() => {
    const initAOS = () => {
      AOS.init({ once: false });
    };
    initAOS();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAOS, 250);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const statsData = useMemo(
    () => [
      {
        icon: Code,
        color: "from-[#0A66C2] to-[#ffffff]",
        value: totalProjects,
        label: "Total Projects",
        description: "Innovative web solutions crafted",
        animation: "fade-right",
      },
      {
        icon: Award,
        color: "from-[#ffffff] to-[#0A66C2]",
        value: totalCertificates,
        label: "Certificates",
        description: "Professional skills validated",
        animation: "fade-up",
      },
      {
        icon: Globe,
        color: "from-[#0A66C2] to-[#ffffff]",
        value: YearExperience,
        label: "Years of Experience",
        description: "Continuous learning journey",
        animation: "fade-left",
      },
    ],
    [totalProjects, totalCertificates, YearExperience]
  );

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0"
      id="About"
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A66C2] to-[#ffffff]">
                Hello, I'm
              </span>
              <span
                className="block mt-2 text-gray-200"
                data-aos="fade-right"
                data-aos-duration="1300"
              >
                Harsh Kumar
              </span>
            </h2>

            <p
              className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
              OT Security Consultant & Pre-Sales Engineer at 63SATS (Cybersecurity SI/MSSP).
              Specializing in industrial control systems security, threat assessment, and
              delivering tailored cybersecurity solutions to enterprise clients.
            </p>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-4 lg:px-0 w-full">
              <a
                href="https://drive.google.com/file/d/16vTEuD00yMERguwGaWtVKLqcn3dggHTD/view?usp=sharing"
                className="w-full lg:w-auto"
              >
                <button
                  data-aos="fade-up"
                  data-aos-duration="800"
                  className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#0A66C2] to-[#ffffff] text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 shadow-lg hover:shadow-xl animate-bounce-slow"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Download CV
                </button>
              </a>

              <a href="#Portfolio" className="w-full lg:w-auto">
                <button
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg border border-[#ffffff]/50 text-[#ffffff] font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 hover:bg-[#ffffff]/10 animate-bounce-slow delay-200"
                >
                  <Code className="w-4 h-4 sm:w-5 sm:h-5" /> View Projects
                </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        <a href="#Portfolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>

        {/* OT Security & Cybersecurity Section */}
        <div className="mt-16">
          <h3
            className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#0A66C2] to-[#ffffff]"
            data-aos="fade-up"
          >
            Cybersecurity Expertise
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* OT/ICS Security */}
            <div data-aos="fade-up" className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-5 border border-red-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <h4 className="text-white font-semibold">OT/ICS Security</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Industrial Control Systems", "SCADA", "PLC Security", "Network Segmentation", "IEC 62443", "NERC CIP"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-300 border border-red-500/30">{skill}</span>
                ))}
              </div>
            </div>

            {/* Threat & Vulnerability */}
            <div data-aos="fade-up" data-aos-delay="100" className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-5 border border-orange-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <h4 className="text-white font-semibold">Threat & Vulnerability</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Penetration Testing", "Vulnerability Assessment", "Risk Analysis", "Threat Modeling", "CVSS", "CVE"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">{skill}</span>
                ))}
              </div>
            </div>

            {/* Network Security */}
            <div data-aos="fade-up" data-aos-delay="200" className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-5 border border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Network className="w-5 h-5 text-green-400" />
                </div>
                <h4 className="text-white font-semibold">Network Security</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Firewall Configuration", "IDS/IPS", "SIEM", "VPN", "Zero Trust", "MFA"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/30">{skill}</span>
                ))}
              </div>
            </div>

            {/* Compliance & Frameworks */}
            <div data-aos="fade-up" data-aos-delay="300" className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-5 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <FileTextIcon className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="text-white font-semibold">Compliance</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {["ISO 27001", "NIST CSF", "SOC 2", "GDPR", "HIPAA", "PIPEDA"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Pre-Sales & Consulting Skills */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-center mb-6 text-gray-300" data-aos="fade-up">Pre-Sales & Consulting</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Target, label: "Security Assessments" },
                { icon: FileCheck, label: "RFP/RFI Response" },
                { icon: Users, label: "Client Engagement" },
                { icon: Rocket, label: "Solution Architecture" },
                { icon: Network, label: "Vendor Selection" },
                { icon: Cog, label: "Technical Presentations" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} data-aos="zoom-in" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <Icon className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-300">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Development Skills Section */}
        <div className="mt-16">
          <h3
            className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#0A66C2] to-[#ffffff]"
            data-aos="fade-up"
          >
            Technical Skills
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Web & Frameworks */}
            <div data-aos="fade-up" className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Code className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-white font-semibold">Web & Frameworks</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {["C#", ".NET", "ASP.NET", "Node.js", "JavaScript", "TypeScript", "Angular", "React", "HTML", "CSS"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">{skill}</span>
                ))}
              </div>
            </div>

            {/* Cloud & DevOps */}
            <div data-aos="fade-up" data-aos-delay="100" className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Server className="w-5 h-5 text-green-400" />
                </div>
                <h4 className="text-white font-semibold">Cloud & DevOps</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {["GCP", "Kubernetes", "Docker", "Terraform", "CI/CD", "Linux"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/30">{skill}</span>
                ))}
              </div>
            </div>

            {/* Databases */}
            <div data-aos="fade-up" data-aos-delay="200" className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-yellow-400" />
                </div>
                <h4 className="text-white font-semibold">Databases</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {["MySQL", "MongoDB", "Firebase", "SQL", "PostgreSQL"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">{skill}</span>
                ))}
              </div>
            </div>

            {/* Analytics & AI */}
            <div data-aos="fade-up" data-aos-delay="300" className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="text-white font-semibold">Analytics & AI</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Python", "TensorFlow", "Data Analysis", "ML"].map(skill => (
                  <span key={skill} className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standard <style> works in Vite/React; styled-jsx does not */}
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-20px) } }
        @keyframes spin-slower { to { transform: rotate(360deg) } }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        .animate-pulse-slow { animation: pulse 3s infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-spin-slower { animation: spin-slower 8s linear infinite; }
      `}</style>
    </div>
  );
};

export default memo(AboutPage);

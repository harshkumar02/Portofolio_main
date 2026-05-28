import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import { Code, Award, Boxes, ExternalLink, Star, GitFork, Github, Loader2, Briefcase, Calendar } from "lucide-react";
import { useGitHubRepos, useGitHubStats } from "../hooks/useGitHubRepos";

// Experience data (shared with About.jsx)
const EXPERIENCE = [
  {
    title: "OT Security Consultant & Pre-Sales Engineer",
    company: "63SATS (Cybersecurity SI/MSSP)",
    period: "May 2025 – Present",
    highlights: [
      "Conducting OT security assessments and vulnerability assessments for industrial clients",
      "Preparing security proposals and RFP responses for enterprise clients",
      "Designing tailored cybersecurity solutions for critical infrastructure",
    ],
  },
  {
    title: "Software Engineer",
    company: "Synapsewave Innovation Pvt. Ltd. (Formerly 63Moons)",
    period: "Jan 2025 – May 2025",
    highlights: [
      "Executed features and UI using C#, .NET Framework, Angular and Ionic",
      "Created and optimized MySQL schemas and queries",
      "Participated in sprint planning, code reviews, and release verification",
    ],
  },
  {
    title: "Software Engineer",
    company: "63 Moons Technologies Ltd.",
    period: "Jul 2024 – Jan 2025",
    highlights: [
      "Developed backend services and CRUD APIs using ASP.NET MVC and MySQL",
      "Authored technical documentation for maintenance",
      "Improved release stability during sprint cycles",
    ],
  },
  {
    title: "Software Developer Intern",
    company: "RIDE EVEE",
    period: "Sep 2023 – Jan 2024",
    highlights: [
      "Built frontend components with React and server-side APIs in Node.js",
      "Planned MongoDB data models and collaborated with designers",
    ],
  },
];

// LinkedIn-style certificates data
const CERTIFICATES = [
  // Anthropic Certificates
  {
    title: "Introduction to Model Context Protocol",
    publisher: "Anthropic",
    issueDate: "May 2026",
    credentialId: "nqm8cd8xtcgi",
    credentialUrl: "https://verify.skilljar.com/c/nqm8cd8xtcgi",
    skills: ["Model Context Protocol"],
  },
  {
    title: "Certificate of Completion: Introduction to Agent Skills",
    publisher: "Anthropic",
    issueDate: "May 2026",
    credentialId: "egdaavum78hs",
    credentialUrl: "https://verify.skilljar.com/c/egdaavum78hs",
    skills: ["Agentic AI Development"],
  },
  {
    title: "Claude Code in Action",
    publisher: "Anthropic",
    issueDate: "May 2026",
    credentialId: "xft9no7yqos9",
    credentialUrl: "https://verify.skilljar.com/c/xft9no7yqos9",
    skills: ["Claude Code Subagents"],
  },
  {
    title: "Building with the Claude API",
    publisher: "Anthropic",
    issueDate: "May 2026",
    credentialId: "kniyvsmtjzbg",
    credentialUrl: "https://verify.skilljar.com/c/kniyvsmtjzbg",
    skills: ["API", "Claude Skills"],
  },
  {
    title: "Certificate of Completion: AI Fluency Framework & Foundations",
    publisher: "Anthropic",
    issueDate: "May 2026",
    credentialId: "xh2x2sgos4f5",
    credentialUrl: "https://verify.skilljar.com/c/xh2x2sgos4f5",
  },
  {
    title: "Certificate of Completion: Claude 101",
    publisher: "Anthropic",
    issueDate: "May 2026",
    credentialId: "kpvixoreo7jk",
    credentialUrl: "https://verify.skilljar.com/c/kpvixoreo7jk",
    skills: ["Prompt Engineering"],
  },

  // LinkedIn Certificates
  {
    title: "The Cybersecurity Threat Landscape",
    publisher: "LinkedIn",
    issueDate: "May 2026",
    credentialId: "-",
    credentialUrl: "https://www.linkedin.com/learning/certificates/",
    skills: ["Threat & Vulnerability Management"],
  },
  {
    title: "Cybersecurity Awareness: Social Engineering",
    publisher: "LinkedIn",
    issueDate: "Apr 2026",
    credentialId: "-",
    credentialUrl: "https://www.linkedin.com/learning/certificates/",
    skills: ["Security Awareness", "Social Engineering"],
  },
  {
    title: "Cybersecurity Awareness: Cybersecurity Terminology",
    publisher: "LinkedIn",
    issueDate: "Apr 2026",
    credentialId: "-",
    credentialUrl: "https://www.linkedin.com/learning/certificates/",
    skills: ["Information Security Awareness"],
  },
  {
    title: "Cybersecurity at Work",
    publisher: "LinkedIn",
    issueDate: "Apr 2026",
    credentialId: "-",
    credentialUrl: "https://www.linkedin.com/learning/certificates/",
    skills: ["Security Awareness"],
  },

  // edX Certificates
  {
    title: "Introduction to SQL",
    publisher: "edX",
    issueDate: "Jul 2023",
    credentialId: "149ed8851b56429983c54c8400ae54bb",
    credentialUrl: "https://courses.edx.org/certificates/149ed8851b56429983c54c8400ae54bb",
  },
  {
    title: "Google Cloud Computing Foundations: Cloud Computing Fundamentals",
    publisher: "edX",
    issueDate: "Jul 2023",
    credentialId: "a53180af79854c21aa091c64f47175da",
    credentialUrl: "https://courses.edx.org/certificates/a53180af79854c21aa091c64f47175da",
  },
  {
    title: "Introduction to Kubernetes",
    publisher: "edX",
    issueDate: "Sep 2023",
    credentialId: "c7bef0702070400480a42a00e26db75f",
    credentialUrl: "https://courses.edx.org/certificates/c7bef0702070400480a42a00e26db75f",
  },

  // Google Cloud Skills Boost
  {
    title: "Set Up and Configure a Cloud Environment in Google Cloud",
    publisher: "Google Cloud Skills Boost",
    issueDate: "Dec 2022",
    credentialId: "3063589",
    credentialUrl: "https://www.cloudskillsboost.google/",
  },
  {
    title: "Getting Started with Google Kubernetes Engine",
    publisher: "Google Cloud Skills Boost",
    issueDate: "Dec 2022",
    credentialId: "3063914",
    credentialUrl: "https://www.cloudskillsboost.google/",
  },
  {
    title: "Preparing for Your Associate Cloud Engineer Journey",
    publisher: "Google Cloud Skills Boost",
    issueDate: "Dec 2022",
    credentialId: "3030250",
    credentialUrl: "https://www.cloudskillsboost.google/",
  },

  // Virtual Cyber Labs
  {
    title: "Exploring Wide Scope of MITRE ATT&CK",
    publisher: "Virtual Cyber Labs",
    issueDate: "May 2023",
    credentialId: "NCY1QW3Y",
    credentialUrl: "#",
    skills: ["Cybersecurity"],
  },
  {
    title: "Cyber Security Internship (Beta Release)",
    publisher: "Virtual Cyber Labs",
    issueDate: "Oct 2022",
    credentialId: "2LCBEUTT",
    credentialUrl: "#",
  },

  // Qwiklabs
  {
    title: "Deploy to Kubernetes in Google Cloud",
    publisher: "Qwiklabs",
    issueDate: "Oct 2021",
    credentialId: "1506462",
    credentialUrl: "https://www.qwiklabs.com/",
    skills: ["Google Cloud Platform (GCP)"],
  },
  {
    title: "Set Up and Configure a Cloud Environment in Google Cloud",
    publisher: "Qwiklabs",
    issueDate: "Oct 2021",
    credentialId: "1497069",
    credentialUrl: "https://www.qwiklabs.com/",
  },
  {
    title: "Build and Secure Networks in Google Cloud",
    publisher: "Qwiklabs",
    issueDate: "Oct 2021",
    credentialId: "1487157",
    credentialUrl: "https://www.qwiklabs.com/",
  },
  {
    title: "Deploy and Manage Cloud Environments with Google Cloud",
    publisher: "Qwiklabs",
    issueDate: "Oct 2021",
    credentialId: "1445726",
    credentialUrl: "https://www.qwiklabs.com/",
  },
  {
    title: "Perform Foundational Infrastructure Tasks in Google Cloud",
    publisher: "Qwiklabs",
    issueDate: "Oct 2021",
    credentialId: "1299776",
    credentialUrl: "https://www.qwiklabs.com/",
  },
  {
    title: "Create and Manage Cloud Resources",
    publisher: "Qwiklabs",
    issueDate: "Oct 2021",
    credentialId: "1274968",
    credentialUrl: "https://www.qwiklabs.com/",
  },

  // Other Certificates
  {
    title: "Dev Code Core Team Tenure 2.0",
    publisher: "Dev Code Community",
    issueDate: "May 2023",
    credentialId: "53fd4b49-c042-4184-993f-78117ad1d6fc",
    credentialUrl: "#",
  },
  {
    title: "GCCP Completion",
    publisher: "Google Developers Group",
    issueDate: "Oct 2022",
    credentialId: "68310bf9-f616-419a-afe3-dd867efaa61c",
    credentialUrl: "#",
    skills: ["Cloud Computing"],
  },
  {
    title: "Android Kotlin Fundamentals",
    publisher: "Google Developers Group",
    issueDate: "Jan 2021",
    credentialId: "-",
    credentialUrl: "#",
    skills: ["Kotlin", "Android Development"],
  },
  {
    title: "Adobe UX Foundation",
    publisher: "Adobe",
    issueDate: "Aug 2021",
    credentialId: "FSP/2021/88512886",
    credentialUrl: "#",
  },
  {
    title: "Google Cloud Certified Professional Cloud Architect",
    publisher: "Google Developers Group",
    issueDate: "Oct 2021",
    credentialId: "-",
    credentialUrl: "#",
    skills: ["Google Cloud Platform (GCP)", "Cloud Computing"],
  },
];

// Manual projects (non-GitHub or featured projects)
const MANUAL_PROJECTS = [
  // Add projects here that shouldn't come from GitHub
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-white/20 backdrop-blur-sm group relative overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
];

const GitHubStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
      <a
        href={`https://github.com/harshkumar02`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
      >
        <Github className="w-5 h-5 text-white" />
        <span className="text-white font-medium">{stats.publicRepos}</span>
        <span className="text-gray-400 text-sm">Repos</span>
      </a>
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
        <Star className="w-5 h-5 text-yellow-400" />
        <span className="text-white font-medium">{stats.totalStars}</span>
        <span className="text-gray-400 text-sm">Stars</span>
      </div>
      <a
        href={`https://github.com/harshkumar02?tab=followers`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
      >
        <span className="text-white font-medium">{stats.followers}</span>
        <span className="text-gray-400 text-sm">Followers</span>
      </a>
    </div>
  );
};

export default function Portfolio() {
  const [value, setValue] = useState(0);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [manualProjects] = useState(MANUAL_PROJECTS);

  const { repos, loading: reposLoading, error: reposError } = useGitHubRepos();
  const { stats, loading: statsLoading } = useGitHubStats();

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = (type) => {
    if (type === "projects") {
      setShowAllProjects((prev) => !prev);
    } else {
      setShowAllCertificates((prev) => !prev);
    }
  };

  // Combine GitHub repos with manual projects
  const allProjects = [...manualProjects, ...repos];
  const displayedProjects = showAllProjects ? allProjects : allProjects.slice(0, 6);
  const displayedCertificates = showAllCertificates ? CERTIFICATES : CERTIFICATES.slice(0, 6);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#000000] overflow-hidden" id="Portfolio">
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#0A66C2] to-[#ffffff]">
          <span style={{
            color: '#0A66C2',
            backgroundImage: 'linear-gradient(45deg, #0A66C2 10%, #ffffff 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, and technical expertise.
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                padding: "20px 0",
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                },
              },
              "& .MuiTabs-indicator": { height: 0 },
              "& .MuiTabs-flexContainer": { gap: "8px" },
            }}
          >
            <Tab icon={<Code className="mb-2 w-5 h-5" />} label="Projects" {...a11yProps(0)} />
            <Tab icon={<Award className="mb-2 w-5 h-5" />} label="Certificates" {...a11yProps(1)} />
            <Tab icon={<Briefcase className="mb-2 w-5 h-5" />} label="Experience" {...a11yProps(2)} />
            <Tab icon={<Boxes className="mb-2 w-5 h-5" />} label="Tech Stack" {...a11yProps(3)} />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          {/* GitHub Stats */}
          {!statsLoading && stats && <GitHubStats stats={stats} />}

          {/* Loading State */}
          {reposLoading && (
            <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-gray-400">Loading GitHub repositories...</p>
            </div>
          )}

          {/* Error State */}
          {reposError && !reposLoading && (
            <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
              <p className="text-yellow-500">GitHub API rate limited. Showing cached data.</p>
            </div>
          )}

          {/* Projects Grid */}
          {!reposLoading && (
            <>
              <div className="container mx-auto flex justify-center items-center overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5 w-full">
                  {displayedProjects.map((project, index) => (
                    <div
                      key={project.id || index}
                      data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                      data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                    >
                      <CardProject
                        Title={project.title || project.Title}
                        Description={project.description || project.Description}
                        TechStack={project.topics || project.TechStack || []}
                        url={project.url || project.url}
                        stars={project.stars}
                        forks={project.forks}
                        language={project.language}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {allProjects.length > 6 && (
                <div className="mt-6 w-full flex justify-start">
                  <ToggleButton onClick={() => toggleShowMore("projects")} isShowingMore={showAllProjects} />
                </div>
              )}
            </>
          )}
        </TabPanel>

        {/* LinkedIn-style Certificates */}
        <TabPanel value={value} index={1}>
          <div className="container mx-auto flex justify-center items-center overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5 w-full">
              {displayedCertificates.map((cert, index) => (
                <div
                  key={index}
                  data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                  data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                >
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-6 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-xl transition-all duration-300 hover:shadow-blue-500/20 hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                          {cert.title}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">{cert.publisher}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="text-gray-500">Issued:</span>
                        <span>{cert.issueDate}</span>
                      </div>
                      {cert.credentialId && cert.credentialId !== "-" && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="text-gray-500">ID:</span>
                          <span className="font-mono text-xs bg-white/5 px-2 py-0.5 rounded">
                            {cert.credentialId}
                          </span>
                        </div>
                      )}
                    </div>

                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {cert.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <span className="inline-flex items-center gap-1 text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
                        Show credential
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          {CERTIFICATES.length > 6 && (
            <div className="mt-6 w-full flex justify-start">
              <ToggleButton onClick={() => toggleShowMore("certificates")} isShowingMore={showAllCertificates} />
            </div>
          )}
        </TabPanel>

        {/* Experience Tab */}
        <TabPanel value={value} index={2}>
          <div className="container mx-auto overflow-hidden pb-[5%]">
            <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-0">
              {EXPERIENCE.map((job, index) => {
                const isCurrent = job.period.includes("Present");
                return (
                  <div
                    key={index}
                    className={`relative bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border-l-4 ${
                      isCurrent ? "border-l-green-500" : "border-l-blue-500"
                    } transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10`}
                    data-aos={index % 2 === 0 ? "fade-up-right" : "fade-up-left"}
                    data-aos-duration="800"
                  >
                    {/* Current indicator */}
                    {isCurrent && (
                      <span className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 text-xs text-green-400 bg-green-500/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-green-500/30">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="hidden sm:inline">Current</span>
                      </span>
                    )}

                    <div className="flex flex-col gap-1 mb-3 sm:mb-4 pr-16">
                      <h4 className="text-base sm:text-xl font-semibold text-white pr-8 sm:pr-0">{job.title}</h4>
                      <p className="text-sm sm:text-base text-blue-400 font-medium">{job.company}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 bg-white/5 px-2 sm:px-3 py-1 rounded-full w-fit">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      {job.period}
                    </span>
                    <ul className="space-y-2 mt-3 sm:mt-4">
                      {job.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300 text-xs sm:text-sm">
                          <span className={`mt-0.5 ${isCurrent ? "text-green-400" : "text-blue-400"}`}>•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </TabPanel>

        <TabPanel value={value} index={3}>
          <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
              {techStacks.map((stack, index) => (
                <div
                  key={index}
                  data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                  data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                >
                  <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                </div>
              ))}
            </div>
          </div>
        </TabPanel>
      </Box>
    </div>
  );
}
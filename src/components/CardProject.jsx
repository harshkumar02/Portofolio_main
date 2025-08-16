import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';

const CardProject = ({ Title, Description, TechStack }) => {
  return (
    <div className="group relative w-full">
      <div className="relative p-5 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-blue-500/20">
        
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-200 via-white-200 to-pink-200 bg-clip-text text-transparent">
          {Title}
        </h3>
        
        <p className="text-gray-300/80 text-sm leading-relaxed mt-2">
          {Description || "No description provided."}
        </p>

        {TechStack && TechStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {TechStack.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CardProject;

import React from 'react';
import { ExternalLink, Star, GitFork, Code2 } from 'lucide-react';

const CardProject = ({ Title, Description, TechStack, url, stars, forks, language }) => {
  return (
    <div className="group relative w-full">
      <div className="relative p-5 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-blue-500/20">

        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-200 via-white-200 to-pink-200 bg-clip-text text-transparent">
              {Title}
            </h3>
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white" />
            </a>
          )}
        </div>

        <p className="text-gray-300/80 text-sm leading-relaxed mt-2">
          {Description || "No description available."}
        </p>

        {/* GitHub Stats */}
        {(stars !== undefined || forks !== undefined || language) && (
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
            {language && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                {language}
              </span>
            )}
            {stars !== undefined && stars > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {stars}
              </span>
            )}
            {forks !== undefined && forks > 0 && (
              <span className="flex items-center gap-1">
                <GitFork className="w-4 h-4" />
                {forks}
              </span>
            )}
          </div>
        )}

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

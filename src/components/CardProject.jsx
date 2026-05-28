import React from 'react';
import { ExternalLink, Star, GitFork, Code2 } from 'lucide-react';

const CardProject = ({ Title, Description, TechStack, url, stars, forks, language }) => {
  return (
    <div className="group relative w-full">
      <div className="relative p-4 sm:p-5 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-blue-500/20">

        <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
          <div className="flex items-start gap-2 min-w-0 flex-1">
            <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 sm:mt-0 flex-shrink-0" />
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white break-words hyphens-auto leading-tight">
              {Title}
            </h3>
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white" />
            </a>
          )}
        </div>

        <p className="text-gray-300/80 text-xs sm:text-sm leading-relaxed mt-2 line-clamp-2 sm:line-clamp-3">
          {Description || "No description available."}
        </p>

        {/* GitHub Stats */}
        {(stars !== undefined || forks !== undefined || language) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400">
            {language && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span className="truncate max-w-[80px] sm:max-w-[100px]">{language}</span>
              </span>
            )}
            {stars !== undefined && stars > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                {stars}
              </span>
            )}
            {forks !== undefined && forks > 0 && (
              <span className="flex items-center gap-1">
                <GitFork className="w-3 h-3 sm:w-4 sm:h-4" />
                {forks}
              </span>
            )}
          </div>
        )}

        {TechStack && TechStack.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
            {TechStack.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-0.5 sm:py-1 text-xs rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 truncate max-w-[120px]"
              >
                {tech}
              </span>
            ))}
            {TechStack.length > 4 && (
              <span className="px-2 py-0.5 sm:py-1 text-xs rounded-full bg-gray-500/10 text-gray-400">
                +{TechStack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardProject;

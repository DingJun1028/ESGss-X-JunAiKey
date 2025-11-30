import React, { useState, useEffect } from 'react';
import { getMockCourses, TRANSLATIONS } from '../constants';
import { PlayCircle, Award, Clock } from 'lucide-react';
import { Language } from '../types';
import { OmniEsgCell } from './OmniEsgCell';

interface AcademyProps {
  language: Language;
}

export const Academy: React.FC<AcademyProps> = ({ language }) => {
  const t = TRANSLATIONS[language].academy;
  const courses = getMockCourses(language);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Data Fetching
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
            <h2 className="text-3xl font-bold text-white">{t.title}</h2>
            <p className="text-gray-400">{t.subtitle}</p>
            </div>
            
            {/* OmniEsgCell as a Badge */}
            <OmniEsgCell 
                mode="badge" 
                value={t.levelInfo} 
                confidence="high" 
                color="gold" 
                verified={true}
                traits={['evolution']} // Infinite Evolution Trait for Learning
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading 
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="glass-panel rounded-2xl overflow-hidden animate-pulse h-[340px] flex flex-col">
                      <div className="h-48 bg-white/5 w-full" />
                      <div className="p-5 flex-1 flex flex-col justify-between">
                         <div className="space-y-3">
                             <div className="h-3 w-20 bg-white/5 rounded" />
                             <div className="h-6 w-full bg-white/5 rounded" />
                             <div className="h-2 w-full bg-white/5 rounded mt-4" />
                         </div>
                         <div className="flex justify-between items-center mt-4">
                             <div className="h-4 w-16 bg-white/5 rounded" />
                             <div className="h-4 w-20 bg-white/5 rounded" />
                         </div>
                      </div>
                  </div>
                ))
              : courses.map((course) => (
                <div key={course.id} className="glass-panel rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-celestial-purple/20 transition-all duration-300 border border-white/5 hover:border-white/20">
                    <div className="relative h-48 overflow-hidden">
                        <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                             {/* Level Badge using Tailwind for custom look, or could be an Omni Cell */}
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/10
                                ${course.level === 'Beginner' ? 'bg-emerald-500/60 text-white' : 
                                  course.level === 'Intermediate' ? 'bg-blue-500/60 text-white' : 'bg-purple-500/60 text-white'}`}>
                                {course.level}
                            </span>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="text-xs text-celestial-purple mb-2 font-medium tracking-wide">{course.category}</div>
                        <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 group-hover:text-celestial-gold transition-colors">{course.title}</h3>
                        
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{t.progress}</span>
                                <span>{course.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-celestial-emerald to-celestial-purple relative" style={{ width: `${course.progress}%` }}>
                                     {/* Performance Trait Effect */}
                                    <div className="absolute top-0 right-0 w-2 h-full bg-white/50 blur-[2px] animate-pulse" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span>2h 15m</span>
                            </div>
                            <button className="flex items-center gap-2 text-xs font-bold text-white bg-white/5 hover:bg-celestial-emerald/20 px-3 py-1.5 rounded-lg border border-white/10 hover:border-celestial-emerald/50 transition-all group/btn">
                                <PlayCircle className="w-4 h-4 text-celestial-emerald group-hover/btn:scale-110 transition-transform" />
                                {course.progress > 0 ? t.resume : t.start}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { getMockCourses, TRANSLATIONS } from '../constants';
import { PlayCircle, Award, Clock, Scale, Cpu, Users, Briefcase, Tag, Globe, Zap, ArrowRight, Calendar, Ticket } from 'lucide-react';
import { Language, Course } from '../types';
import { OmniEsgCell } from './OmniEsgCell';
import { CoursePlayer } from './CoursePlayer';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';

interface AcademyProps {
  language: Language;
}

export const Academy: React.FC<AcademyProps> = ({ language }) => {
  const t = TRANSLATIONS[language].academy;
  const isZh = language === 'zh-TW';
  const courses = getMockCourses(language);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'trends' | 'community'>('courses');
  const { addToast } = useToast();
  const { awardXp, tier } = useCompany();

  // Simulate Data Fetching
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartCourse = (course: Course) => {
      setActiveCourse(course);
  };

  const handleCourseComplete = () => {
      if (activeCourse) {
          awardXp(500);
          addToast('reward', `Course Completed: ${activeCourse.title} (+500 XP)`, 'Academy');
      }
      setActiveCourse(null);
  };

  const handleClaimOffer = (offer: string) => {
      addToast('success', isZh ? `已領取優惠：${offer}` : `Offer Claimed: ${offer}`, 'Consulting Perks');
  };

  const handleJoinEvent = (event: string) => {
      addToast('success', isZh ? `已報名活動：${event}` : `Registered for: ${event}`, 'Community');
  };

  // --- MOCK DATA ---
  const regulations = [
      { id: 'reg-1', title: 'IFRS S1/S2', desc: isZh ? '國際財務報導準則永續揭露準則完全解析' : 'Deep dive into IFRS Sustainability Disclosure Standards.', tag: 'Compliance', date: '2024.06.01' },
      { id: 'reg-2', title: 'EU ESRS & CSDDD', desc: isZh ? '歐盟供應鏈盡職調查指令對亞洲企業的衝擊' : 'Impact of EU CSDDD on Asian Supply Chains.', tag: 'Supply Chain', date: '2024.05.28' },
      { id: 'reg-3', title: 'GRI 2024 Update', desc: isZh ? '新版生物多樣性公報 (GRI 101) 實務指南' : 'Practical guide to GRI 101 Biodiversity Standard.', tag: 'Reporting', date: '2024.05.15' },
  ];

  const techTrends = [
      { id: 'tech-1', title: isZh ? 'AI 碳盤查自動化' : 'AI Carbon Accounting', desc: isZh ? '利用 LLM 自動解析發票與能耗數據。' : 'Automating Scope 1-3 via LLM invoice parsing.', icon: Cpu, color: 'text-purple-400' },
      { id: 'tech-2', title: isZh ? '區塊鏈產品護照' : 'Blockchain Product Passport', desc: isZh ? '符合歐盟 ESPR 法規的數位溯源技術。' : 'DPP technology compliant with EU ESPR.', icon: Globe, color: 'text-blue-400' },
      { id: 'tech-3', title: isZh ? 'IoT 即時監測' : 'IoT Real-time Monitoring', desc: isZh ? '工廠端 EMS 系統與 API 自動串接。' : 'Factory EMS integration via API.', icon: Zap, color: 'text-gold' },
  ];

  const communityEvents = [
      { id: 'evt-1', title: isZh ? '永續長早餐會 (CSO Breakfast)' : 'CSO Breakfast Meetup', date: 'June 15', type: 'Networking', slots: 5 },
      { id: 'evt-2', title: isZh ? '供應鏈減碳實戰工作坊' : 'Supply Chain Workshop', date: 'June 22', type: 'Workshop', slots: 12 },
  ];

  const consultingOffers = [
      { id: 'off-1', title: isZh ? 'SROI 專案評估' : 'SROI Assessment', discount: '20% OFF', desc: isZh ? '適用於社會影響力報告' : 'For Social Impact Reports' },
      { id: 'off-2', title: isZh ? '雙重重大性分析' : 'Double Materiality', discount: 'Enterprise Plan', desc: isZh ? '符合 CSRD/GRI 要求' : 'CSRD/GRI Compliant' },
  ];

  return (
    <>
        {/* Course Player Overlay */}
        {activeCourse && (
            <CoursePlayer 
                course={activeCourse} 
                onClose={() => setActiveCourse(null)} 
                onComplete={handleCourseComplete} 
            />
        )}

        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                    traits={['evolution']} 
                />
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-1 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('courses')}
                    className={`px-4 py-2 text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'courses' ? 'text-white border-b-2 border-emerald-500' : 'text-gray-500 hover:text-white'}`}
                >
                    {isZh ? '核心課程 (Courses)' : 'Core Courses'}
                </button>
                <button 
                    onClick={() => setActiveTab('trends')}
                    className={`px-4 py-2 text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'trends' ? 'text-white border-b-2 border-celestial-blue' : 'text-gray-500 hover:text-white'}`}
                >
                    {isZh ? '法規與趨勢 (Trends & Regs)' : 'Trends & Regs'}
                </button>
                <button 
                    onClick={() => setActiveTab('community')}
                    className={`px-4 py-2 text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'community' ? 'text-white border-b-2 border-celestial-gold' : 'text-gray-500 hover:text-white'}`}
                >
                    {isZh ? '社群與顧問 (Community)' : 'Community & Consulting'}
                </button>
            </div>

            {/* === TAB: COURSES === */}
            {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
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
                                            <div className="absolute top-0 right-0 w-2 h-full bg-white/50 blur-[2px] animate-pulse" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>2h 15m</span>
                                    </div>
                                    <button 
                                        onClick={() => handleStartCourse(course)}
                                        className="flex items-center gap-2 text-xs font-bold text-white bg-white/5 hover:bg-celestial-emerald/20 px-3 py-1.5 rounded-lg border border-white/10 hover:border-celestial-emerald/50 transition-all group/btn"
                                    >
                                        <PlayCircle className="w-4 h-4 text-celestial-emerald group-hover/btn:scale-110 transition-transform" />
                                        {course.progress > 0 ? t.resume : t.start}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* === TAB: TRENDS & REGS === */}
            {activeTab === 'trends' && (
                <div className="space-y-8 animate-fade-in">
                    {/* Regulatory Radar */}
                    <div className="glass-panel p-6 rounded-2xl border-white/10 bg-gradient-to-br from-celestial-blue/5 to-transparent">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Scale className="w-6 h-6 text-celestial-blue" />
                            {isZh ? '法規更新雷達 (Regulatory Radar)' : 'Regulatory Radar'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {regulations.map((reg) => (
                                <div key={reg.id} className="p-4 bg-white/5 rounded-xl border border-l-4 border-white/10 border-l-celestial-blue hover:bg-white/10 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-celestial-blue/20 text-blue-300 font-bold">{reg.tag}</span>
                                        <span className="text-[10px] text-gray-500">{reg.date}</span>
                                    </div>
                                    <h4 className="font-bold text-white mb-2 group-hover:text-celestial-blue transition-colors">{reg.title}</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">{reg.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tech Trends */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-purple-400" />
                            {isZh ? 'ESG 新科技與產業動態' : 'ESG Tech & Industry Trends'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {techTrends.map((tech) => (
                                <div key={tech.id} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all group">
                                    <div className="mb-4 p-3 bg-white/5 rounded-full w-fit group-hover:scale-110 transition-transform">
                                        <tech.icon className={`w-6 h-6 ${tech.color}`} />
                                    </div>
                                    <h4 className="font-bold text-white mb-2 text-lg">{tech.title}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{tech.desc}</p>
                                    <button className="text-xs text-purple-400 flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform">
                                        {isZh ? '了解更多' : 'Learn More'} <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* === TAB: COMMUNITY & CONSULTING === */}
            {activeTab === 'community' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    
                    {/* Community Exchange */}
                    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users className="w-6 h-6 text-emerald-400" />
                                {isZh ? 'ESG 社群交流 (Enterprise x Students)' : 'Community Exchange'}
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {communityEvents.map((evt) => (
                                <div key={evt.id} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all">
                                    <div className="flex flex-col items-center justify-center p-2 bg-white/5 rounded-lg min-w-[60px]">
                                        <Calendar className="w-5 h-5 text-emerald-400 mb-1" />
                                        <span className="text-xs font-bold text-white">{evt.date}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider mb-1">{evt.type}</div>
                                        <h4 className="font-bold text-white text-sm">{evt.title}</h4>
                                        <div className="text-xs text-gray-500 mt-1">{evt.slots} {isZh ? '個名額剩餘' : 'slots left'}</div>
                                    </div>
                                    <button 
                                        onClick={() => handleJoinEvent(evt.title)}
                                        className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                                    >
                                        {isZh ? '報名' : 'Join'}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/10 text-center">
                            <p className="text-xs text-gray-400 mb-2">{isZh ? '加入企業永續菁英俱樂部，拓展人脈。' : 'Join the Sustainability Elite Club to expand your network.'}</p>
                            <button className="text-emerald-400 text-xs font-bold hover:underline">{isZh ? '查看所有活動 ->' : 'View All Events ->'}</button>
                        </div>
                    </div>

                    {/* Consulting Discounts */}
                    <div className="glass-panel p-6 rounded-2xl border border-celestial-gold/30 bg-celestial-gold/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-celestial-gold" />
                                {isZh ? '顧問專案折扣 (Consulting Perks)' : 'Consulting Perks'}
                            </h3>
                            {tier !== 'Free' && <span className="px-2 py-1 bg-celestial-gold text-black text-xs font-bold rounded">PRO Access</span>}
                        </div>
                        <div className="space-y-4">
                            {consultingOffers.map((offer) => (
                                <div key={offer.id} className="relative p-5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl border border-celestial-gold/20 overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 bg-celestial-gold text-black text-xs font-bold rounded-bl-xl shadow-lg">
                                        {offer.discount}
                                    </div>
                                    <div className="relative z-10">
                                        <h4 className="font-bold text-white text-lg mb-1">{offer.title}</h4>
                                        <p className="text-xs text-gray-400 mb-4">{offer.desc}</p>
                                        <button 
                                            onClick={() => handleClaimOffer(offer.title)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-celestial-gold hover:text-black text-celestial-gold rounded-lg text-xs font-bold transition-all border border-celestial-gold/30"
                                        >
                                            <Ticket className="w-3 h-3" />
                                            {isZh ? '領取優惠' : 'Claim Offer'}
                                        </button>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-celestial-gold/10 rounded-full blur-2xl group-hover:bg-celestial-gold/20 transition-all" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-[10px] text-gray-500">{isZh ? '由 ESG Sunshine 顧問團隊提供專業支持。' : 'Professional support by ESG Sunshine Consulting Team.'}</p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    </>
  );
};

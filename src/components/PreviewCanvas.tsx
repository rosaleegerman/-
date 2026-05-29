/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WebsiteData, DeviceViewMode, CMSPost } from '../types';
import * as Icons from 'lucide-react';

interface PreviewCanvasProps {
  data: WebsiteData;
  viewMode: DeviceViewMode;
  onFocusSection: (section: 'theme' | 'hero' | 'features' | 'cms' | 'seo' | 'contact') => void;
}

// 아이콘 타입 안전 가드 및 동적 렌더링 도구
const DynamicIcon = ({ name, className, color }: { name: string; className?: string; color?: string }) => {
  // Lucide 아이콘 모음에서 이름에 해당하는 컴포넌트를 탐색
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className={className} style={{ color }} size={20} />;
};

export default function PreviewCanvas({ data, viewMode, onFocusSection }: PreviewCanvasProps) {
  const { theme, hero, features, contact, posts, seo } = data;
  const [selectedPost, setSelectedPost] = useState<CMSPost | null>(null);
  const [showCourseInfo, setShowCourseInfo] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [showTeachersPopup, setShowTeachersPopup] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeCourseTab, setActiveCourseTab] = useState<'regular' | 'certificate'>('regular');
  
  // 문의 양식 서브밋 상태 모의 테스트용
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryMessage) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
    }, 5000);
  };

  // 폰트 스타일 매핑
  const getFontClass = () => {
    switch (theme.fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  // 베이스 폰트 크기 매핑
  const getFontSizeClass = () => {
    switch (theme.fontSizeBase) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'base':
      default:
        return 'text-base';
    }
  };

  // 라운드 코너 반경 매핑
  const getRadiusClass = () => {
    switch (theme.borderRadius) {
      case 'none':
        return 'rounded-none';
      case 'full':
        return 'rounded-2xl';
      case 'md':
      default:
        return 'rounded-lg';
    }
  };

  // 디바이스별 레이아웃 크기 제어
  const getDeviceWidthClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-[375px] h-[720px] shadow-[0_0_0_12px_#27272a,_0_20px_50px_rgba(0,0,0,0.8)] rounded-[32px] overflow-y-auto border-4 border-zinc-800';
      case 'tablet':
        return 'w-[768px] h-[780px] shadow-[0_0_0_12px_#27272a,_0_25px_60px_rgba(0,0,0,0.8)] rounded-[24px] overflow-y-auto border-4 border-zinc-800';
      case 'desktop':
      default:
        return 'w-full h-full min-h-[750px] shadow-2xl overflow-y-visible';
    }
  };

  return (
    <div className="flex justify-center items-start p-4 transition-all duration-300 w-full min-h-full">
      <div 
        className={`${getDeviceWidthClass()} bg-zinc-950 transition-all duration-300 relative`}
        style={{ 
          backgroundColor: theme.backgroundColor, 
          color: theme.textColor,
          fontFamily: theme.fontFamily === 'serif' ? 'Georgia, Cambria, "Times New Roman", Times, serif' : theme.fontFamily === 'mono' ? 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace' : 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* 모의 모바일 상단 바 */}
        {viewMode === 'mobile' && (
          <div className="bg-zinc-950 text-white px-5 py-2 flex justify-between items-center text-xs border-b border-zinc-900 font-mono sticky top-0 z-50">
            <span>13:30</span>
            <div className="flex gap-1.5 items-center">
              <Icons.Wifi size={12} />
              <Icons.BatteryMedium size={14} />
            </div>
          </div>
        )}

        {/* 모의 태블릿 상단 바 */}
        {viewMode === 'tablet' && (
          <div className="bg-zinc-950 text-zinc-400 px-6 py-2 flex justify-between items-center text-xs border-b border-zinc-900 sticky top-0 z-50">
            <span className="font-mono">vollmond.co.kr</span>
            <div className="flex gap-2 items-center">
              <Icons.RotateCw size={12} />
              <Icons.Lock size={12} className="text-zinc-500" />
            </div>
          </div>
        )}

        {/* -------------------- 미리보기 네비게이션바 -------------------- */}
        <header 
          className="px-6 py-5 flex items-center justify-between border-b" 
          style={{ borderColor: `${theme.primaryColor}15` }}
          id="preview-nav"
        >
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onFocusSection('hero')}>
            <span className="text-xl font-black tracking-tight" style={{ color: theme.textColor }}>
              VOLLMOND<span className="text-xs ml-1 font-normal opacity-70">[폴몬트]</span><span style={{ color: theme.primaryColor }}>.</span>
            </span>
          </div>
          
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <a href="#about" className="hover:opacity-80 transition-opacity" style={{ color: theme.textColor }}>학원소개</a>
            <a 
              href="#courses" 
              onClick={(e) => {
                e.preventDefault();
                setShowCourseInfo(true);
              }}
              className="hover:opacity-80 transition-opacity" 
              style={{ color: theme.textColor }}
            >
              수업 정보
            </a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                setShowRegistrationPopup(true);
              }}
              className="hover:opacity-80 transition-opacity" 
              style={{ color: theme.textColor }}
            >
              수강 신청
            </a>
            <a 
              href="#preview-hero" 
              onClick={(e) => {
                e.preventDefault();
                setShowTeachersPopup(true);
              }}
              className="hover:opacity-80 transition-opacity" 
              style={{ color: theme.textColor }}
            >
              강사 소개
            </a>
            <a 
              href="#video-lectures" 
              onClick={(e) => {
                e.preventDefault();
                setShowVideoPopup(true);
              }}
              className="hover:opacity-80 transition-opacity" 
              style={{ color: theme.textColor }}
            >
              영상 강의
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* 소셜 퀵 연동 */}
            <div className="flex items-center gap-2">
              {seo.instagramLink && (
                <a href={seo.instagramLink} target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100 transition-opacity" style={{ color: theme.textColor }}>
                  <Icons.Instagram size={16} />
                </a>
              )}
              {seo.kakaoLink && (
                <a href={seo.kakaoLink} target="_blank" rel="noreferrer" className="opacity-70 hover:opacity-100 transition-opacity" style={{ color: theme.textColor }}>
                  <Icons.MessageSquareCode size={16} />
                </a>
              )}
            </div>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                setShowRegistrationPopup(true);
              }}
              className={`text-xs px-2.5 py-1.5 font-medium border transition-colors ${getRadiusClass()}`}
              style={{ 
                borderColor: theme.primaryColor, 
                color: theme.primaryColor,
              }}
            >
              수강 문의
            </a>
            <button
              onClick={() => setShowMobileMenu(true)}
              className="sm:hidden p-1 hover:opacity-80 transition-opacity"
              style={{ color: theme.textColor }}
              title="메뉴"
            >
              <Icons.Menu size={20} />
            </button>
          </div>
        </header>

        {/* -------------------- HERO SECTION -------------------- */}
        <section 
          className="relative px-6 py-16 md:py-24 overflow-hidden border-b cursor-pointer group"
          style={{ borderColor: `${theme.primaryColor}10` }}
          onClick={() => onFocusSection('hero')}
          id="preview-hero"
        >
          {/* 하이엔드 무드의 배경 반사 빛 무드 처리 */}
          <div 
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[140px] opacity-15 pointer-events-none transition-all duration-700" 
            style={{ backgroundColor: theme.primaryColor }}
          />

          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="flex-1 text-left">
              <h1 
                className={`text-3xl md:text-5xl font-extrabold leading-tight tracking-tight whitespace-pre-wrap ${getFontSizeClass()}`}
                style={{ color: theme.textColor }}
              >
                {hero.title}
              </h1>
              <p 
                className="mt-6 text-sm md:text-base leading-relaxed opacity-75 max-w-xl"
                style={{ color: theme.mutedTextColor }}
              >
                {hero.subtitle}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <a 
                  href="#courses"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCourseInfo(true);
                  }}
                  className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${getRadiusClass()}`}
                  style={{ 
                    backgroundColor: theme.primaryColor, 
                    color: theme.backgroundColor 
                  }}
                >
                  {hero.ctaText}
                  <Icons.ArrowRight size={16} />
                </a>
              </div>
            </div>

            {hero.imageUrl && (
              <div className="flex-1 w-full max-w-md">
                <div 
                  className={`overflow-hidden aspect-video md:aspect-square relative group/img cursor-pointer ${getRadiusClass()}`}
                  style={{ 
                    border: `1px solid ${theme.primaryColor}20`,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.6)`
                  }}
                >
                  <img 
                    src={hero.imageUrl && hero.imageUrl.startsWith('/') ? hero.imageUrl.substring(1) : hero.imageUrl} 
                    alt="Hero Graphics" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs bg-black/60 px-2 py-1 rounded">이미지 주소 편집하기</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* -------------------- STATS / INFO -------------------- */}
        <section 
          id="about"
          className="px-6 py-10 border-b cursor-pointer"
          style={{ borderColor: `${theme.primaryColor}10` }}
          onClick={() => onFocusSection('hero')}
        >
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
            {(data.stats || []).map((stat) => (
              <div key={stat.id} className="p-4 bg-opacity-20 rounded-lg" style={{ backgroundColor: `${theme.primaryColor}05` }}>
                <div className="text-2xl md:text-3xl font-black" style={{ color: theme.primaryColor }}>{stat.value}</div>
                <div className="text-xs mt-1 opacity-60" style={{ color: theme.mutedTextColor }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------- FEATURES (핵심분야) -------------------- */}
        <section 
          id="preview-features" 
          className="px-6 py-16 md:py-20 border-b cursor-pointer"
          style={{ borderColor: `${theme.primaryColor}10` }}
          onClick={() => onFocusSection('features')}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: theme.primaryColor }}>
                Vollmond Uniqueness
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: theme.textColor }}>
                폴몬트 학원만의 특별함
              </h2>
              <div className="w-12 h-1 mx-auto mt-4" style={{ backgroundColor: theme.primaryColor }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feat) => (
                <div 
                  key={feat.id}
                  className="p-6 transition-all border group/card hover:-translate-y-1 relative"
                  style={{ 
                    backgroundColor: theme.cardBgColor, 
                    borderColor: `${theme.primaryColor}15`,
                    borderRadius: theme.borderRadius === 'none' ? '0' : theme.borderRadius === 'full' ? '20px' : '8px'
                  }}
                >
                  <div className="mb-4 inline-flex p-3 rounded-lg" style={{ backgroundColor: `${theme.primaryColor}10` }}>
                    <DynamicIcon name={feat.iconName} color={theme.primaryColor} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: theme.textColor }}>
                    {feat.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: theme.mutedTextColor }}>
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* -------------------- CONTACT SECTION (문의하기) -------------------- */}
        <section 
          id="preview-contact" 
          className="px-6 py-16 md:py-20 cursor-pointer"
          onClick={() => onFocusSection('contact')}
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: theme.primaryColor }}>
                  Let's Connect
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold mt-2 leading-tight" style={{ color: theme.textColor }}>
                  {contact.title}
                </h2>
                <p className="mt-5 text-sm leading-relaxed opacity-75" style={{ color: theme.mutedTextColor }}>
                  {contact.description}
                </p>

                <div className="mt-8 space-y-4">
                  {contact.email && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <Icons.Mail size={16} />
                      </div>
                      <div className="text-sm">
                        <span className="block text-[10px] uppercase opacity-50 font-bold">EMAIL</span>
                        <a href={`mailto:${contact.email}`} className="font-semibold block hover:opacity-85" style={{ color: theme.textColor }}>{contact.email}</a>
                      </div>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <Icons.Phone size={16} />
                      </div>
                      <div className="text-sm">
                        <span className="block text-[10px] uppercase opacity-50 font-bold">PHONE</span>
                        <span className="font-semibold block" style={{ color: theme.textColor }}>{contact.phone}</span>
                      </div>
                    </div>
                  )}
                  {contact.address && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <Icons.MapPin size={16} />
                      </div>
                      <div className="text-sm">
                        <span className="block text-[10px] uppercase opacity-50 font-bold">OFFICE</span>
                        <span className="font-semibold block text-xs" style={{ color: theme.textColor }}>{contact.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 문의 제출 폼 */}
              {contact.showForm && (
                <div 
                  className="p-6 border relative"
                  style={{ 
                    backgroundColor: theme.cardBgColor, 
                    borderColor: `${theme.primaryColor}15`,
                    borderRadius: theme.borderRadius === 'none' ? '0' : theme.borderRadius === 'full' ? '24px' : '12px'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {formSubmitted ? (
                    <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500/10 text-green-400">
                        <Icons.CheckCircle size={28} />
                      </div>
                      <h3 className="text-lg font-bold text-white">상담 요청이 전송되었습니다.</h3>
                      <p className="text-xs max-w-[240px] text-zinc-400 leading-relaxed">
                        감사합니다. 입력하신 이메일({inquiryEmail})로 상담 디렉터가 곧 신속히 안내 드리겠습니다.
                      </p>
                      <button 
                        onClick={() => setFormSubmitted(false)}
                        className="text-xs transition-opacity mt-4 hover:opacity-80 px-4 py-1.5 rounded border border-zinc-800"
                        style={{ color: theme.primaryColor }}
                      >
                        다시 작성하기
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <h3 className="text-lg font-bold border-b pb-2 mb-3 text-white" style={{ borderColor: `${theme.primaryColor}10` }}>
                        실시간 간편 문의 상담
                      </h3>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">성함 (학부모 / 학생)</label>
                        <input 
                          type="text" 
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="성함을 입력해 주세요." 
                          className="w-full bg-zinc-900 border border-zinc-800 text-sm p-2.5 rounded text-white focus:outline-none focus:ring-1"
                          style={{ '--tw-ring-color': theme.primaryColor } as any}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1">이메일 주소 / 연락처</label>
                        <input 
                          type="text" 
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="연락받으실 연락처 혹은 이메일을 입력해 주세요." 
                          className="w-full bg-zinc-900 border border-zinc-800 text-sm p-2.5 rounded text-white focus:outline-none focus:ring-1"
                          style={{ '--tw-ring-color': theme.primaryColor } as any}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-400 mb-1 flex justify-between">
                          <span>문의 내용</span>
                        </label>
                        <textarea 
                          rows={3} 
                          required
                          value={inquiryMessage}
                          onChange={(e) => setInquiryMessage(e.target.value)}
                          placeholder="수업 등에 대한 문의사항을 입력해 주세요." 
                          className="w-full bg-zinc-900 border border-zinc-800 text-sm p-2.5 rounded text-white focus:outline-none focus:ring-1 resize-none"
                          style={{ '--tw-ring-color': theme.primaryColor } as any}
                        />
                      </div>

                      <button 
                        type="submit"
                        className={`w-full py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1 ${getRadiusClass()}`}
                        style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor }}
                      >
                        <Icons.Send size={12} /> 교육 상담 신청하기
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* -------------------- FOOTER (하단 바) -------------------- */}
        <footer 
          className="px-6 py-10 border-t text-xs text-center" 
          style={{ 
            borderColor: `${theme.primaryColor}10`,
            backgroundColor: `${theme.primaryColor}03`
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-lg font-black tracking-tight" style={{ color: theme.textColor }}>
                VOLLMOND<span className="text-xs ml-1 font-normal opacity-70">[폴몬트]</span><span style={{ color: theme.primaryColor }}>.</span>
              </span>
              <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] opacity-60 text-zinc-400">
                <span>대표: 이로사</span>
                <span className="opacity-30">|</span>
                <span>사업자 등록번호: 235-94-01846</span>
              </div>
              <p className="mt-1 opacity-50" style={{ color: theme.mutedTextColor }}>
                © 2026 {seo.metaTitle.split('|')[0].trim()}. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4 opacity-70">
              <span className="cursor-pointer hover:underline">이용약관</span>
              <span>•</span>
              <span className="cursor-pointer hover:underline">개인정보처리방침</span>
            </div>
          </div>
        </footer>

        {/* -------------------- 포스트 모달 레이어 (인사이트 전문 읽기) -------------------- */}
        {selectedPost && (
          <div className={`${viewMode === 'desktop' ? 'fixed' : 'absolute'} inset-0 bg-black/85 flex items-start md:items-center justify-center p-4 pt-10 md:pt-4 z-50 overflow-y-auto`}>
            <div 
              className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col max-h-[90%] shadow-2xl"
              style={{ fontFamily: theme.fontFamily === 'serif' ? 'Georgia, Cambria, serif' : 'system-ui, sans-serif' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 md:h-64">
                {selectedPost.imageUrl && (
                  <img 
                    src={selectedPost.imageUrl} 
                    alt={selectedPost.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent" />
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full transition-colors"
                >
                  <Icons.X size={16} />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-0.5 text-[10px] tracking-wider uppercase font-extrabold" style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor }}>
                    {selectedPost.category}
                  </span>
                  <h1 className="text-lg md:text-xl font-bold text-white mt-2 drop-shadow-md">
                    {selectedPost.title}
                  </h1>
                </div>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto flex-1 text-sm text-zinc-300 space-y-4 whitespace-pre-wrap leading-relaxed">
                <div className="flex justify-between text-xs text-zinc-500 font-mono pb-4 border-b border-zinc-800">
                  <span>작성자: 폴몬트 수석 에디터</span>
                  <span>배포 일자: {selectedPost.createdAt}</span>
                </div>
                {selectedPost.content}
              </div>

              <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-end">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-semibold"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- 수업 과목 상세 정보 및 수강료 안내 화면 (새로운 화면) -------------------- */}
        {showCourseInfo && (
          <div 
            className={`${viewMode === 'desktop' ? 'fixed' : 'absolute'} inset-0 bg-black/90 backdrop-blur-sm flex items-start md:items-center justify-center p-4 pt-10 md:pt-4 z-50 overflow-y-auto animate-fade-in`}
            onClick={() => setShowCourseInfo(false)}
          >
            <div 
              className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col max-h-[92%] shadow-2xl relative"
              style={{ fontFamily: theme.fontFamily === 'serif' ? 'Georgia, Cambria, serif' : 'system-ui, sans-serif' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 장식용 탑 디자인 바 */}
              <div className="h-1.5 w-full" style={{ backgroundColor: theme.primaryColor }} />

              {/* 닫기 헤더 물리 버튼 */}
              <button 
                onClick={() => setShowCourseInfo(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-850 hover:bg-zinc-800 p-2.5 rounded-full transition-all z-10"
              >
                <Icons.X size={16} />
              </button>

              <div className="p-6 md:p-8 border-b border-zinc-800 bg-zinc-900">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-yellow-500/10 text-yellow-500">
                    <Icons.Moon size={12} className="fill-yellow-500" />
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase text-yellow-500">
                    VOLLMOND SPECIAL PROGRAM
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  폴몬트 프리미엄 교육 과정 및 수강료 안내
                </h2>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  우리는 수강생 한 명 한 명을 집중 마스터 케어합니다. 평균 10년 이상, 확실히 검증된 명품 강사진과 함께하는 폴몬트 학습 전략 솔루션입니다.
                </p>
              </div>

              {/* 탭 네비게이션 */}
              <div className="flex border-b border-zinc-800 bg-zinc-900/60 px-6">
                <button
                  onClick={() => setActiveCourseTab('regular')}
                  className={`py-3 px-4 text-xs font-extrabold transition-all border-b-2 ${
                    activeCourseTab === 'regular'
                      ? 'text-white border-white'
                      : 'text-zinc-500 border-transparent hover:text-zinc-300'
                  }`}
                  style={{ borderBottomColor: activeCourseTab === 'regular' ? theme.primaryColor : 'transparent' }}
                >
                  내신 대비반
                </button>
                <button
                  onClick={() => setActiveCourseTab('certificate')}
                  className={`py-3 px-4 text-xs font-extrabold transition-all border-b-2 relative ${
                    activeCourseTab === 'certificate'
                      ? 'text-white border-white'
                      : 'text-zinc-500 border-transparent hover:text-zinc-300'
                  }`}
                  style={{ borderBottomColor: activeCourseTab === 'certificate' ? theme.primaryColor : 'transparent' }}
                >
                  자격증 대비반
                </button>
              </div>

              {/* 수업 목록 바디 (스크롤 가능) */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-zinc-950 space-y-6">
                {activeCourseTab === 'regular' ? (
                  <div>
                    <h3 className="text-xs font-bold tracking-wider text-zinc-400 mb-3 uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primaryColor }}></span>
                      내신 대비반 정규 시간표
                    </h3>
                    
                    <div className="space-y-3.5">
                      {[
                        {
                          subject: '영어',
                          teacher: '모니카 T',
                          desc: '[기말고사 대비] 대일43기- 토10-13시(+) / 이화33기- 일15-18시(+)',
                          price: '4회 350,000원',
                        },
                        {
                          subject: '수학',
                          teacher: '장은미 T',
                          desc: '[기말고사 대비] 토요일 16:30-19:30 / 월요일 18-21시 / 클리닉-화요일 19-22시',
                          price: '4주 450,000원',
                        },
                        {
                          subject: '독일어',
                          teacher: '이로사 T',
                          desc: '[기말고사 대비] 대일 43기 토14-17(+) / 대일42기 토 18:30-21:30(+) / 대일41기 월 19-22(+)',
                          price: '4회 350,000원',
                        },
                        {
                          subject: '스페인어',
                          teacher: '디오 T',
                          desc: '[기말고사 대비] 대일 43기 토 18:30-21:30(+) / 대일42기 토 13:30-16:30(+) / 대일41기 토 9:30-12:30(+)',
                          price: '4회 350,000원',
                        },
                        {
                          subject: '프랑스어',
                          teacher: '엠마 T',
                          desc: '[기말고사 대비] 대일 43기 토14-17(+) / 대일42기 토10-13(+) / 대일41기 토18-21(+)',
                          price: '4회 350,000원',
                        },
                        {
                          subject: '중국어',
                          teacher: '최수원 T',
                          desc: '[기말고사 대비] 대일43기 토14-17(+) / 이화35기 일14-17(+)',
                          price: '4회 350,000원',
                        },
                        {
                          subject: '러시아어',
                          teacher: '반성윤 T',
                          desc: '[기말고사 대비] 대일43기 토14-17(+) / 대일41기 토10-12(+)',
                          price: '4회 350,000원',
                        }
                      ].map((item, idx) => (
                        <div 
                          key={idx}
                          className="bg-zinc-900 border border-zinc-800/80 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-white">{item.subject}</span>
                              <span className="text-xs opacity-50">|</span>
                              <span className="text-xs font-semibold" style={{ color: theme.primaryColor }}>{item.teacher}</span>
                            </div>
                            <p className="text-xs text-zinc-400 break-keep">{item.desc}</p>
                          </div>
                          <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-zinc-800 sm:border-0 pt-2 sm:pt-0">
                            <span className="text-[10px] text-zinc-500 uppercase sm:mb-0.5 font-bold">수강 금액</span>
                            <span className="text-sm font-black text-white" style={{ color: theme.textColor }}>
                              {item.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xs font-bold tracking-wider text-zinc-400 mb-3 uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primaryColor }}></span>
                      자격증 대비반 시간 표 안내
                    </h3>
                    
                    <div className="space-y-3.5">
                      {[
                        {
                          subject: '독일어',
                          teacher: '이로사 T',
                          desc: '[B1 대비반] 매주 목요일 18-21시 (영상 수강 가능 / 자체 제작 교재)',
                          price: '4회 400,000원',
                        },
                        {
                          subject: '독일어',
                          teacher: '이로사 T',
                          desc: '[B2 대비반] 매주 금요일 18-21시 (영상 수강 가능 / 자체 제작 교재)',
                          price: '4회 400,000원',
                        }
                      ].map((item, idx) => (
                        <div 
                          key={idx}
                          className="bg-zinc-900 border border-zinc-800/80 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition-colors animate-fade-in"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-white">{item.subject}</span>
                              <span className="text-xs opacity-50">|</span>
                              <span className="text-xs font-semibold" style={{ color: theme.primaryColor }}>{item.teacher}</span>
                            </div>
                            <p className="text-xs text-zinc-400 break-keep">{item.desc}</p>
                          </div>
                          <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-zinc-800 sm:border-0 pt-2 sm:pt-0">
                            <span className="text-[10px] text-zinc-500 uppercase sm:mb-0.5 font-bold">수강 금액</span>
                            <span className="text-sm font-black text-white" style={{ color: theme.textColor }}>
                              {item.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 포함된 기본 혜택 가이드 삭제됨 */}
              </div>

              {/* 푸터 영역 */}
              <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5 text-[10.5px] text-zinc-500 leading-relaxed font-medium">
                  <span>* 정원 초과 시 영상 수강 가능</span>
                  <span>* 개인 별 대면 보강 불가능 - 영상으로 보강</span>
                  <span>* 수업 2회 이상 수강 시 환불 불가능 (서울시 교육청 환불 기준 준수)</span>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => setShowCourseInfo(false)}
                    className="flex-1 md:flex-none px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold transition-all"
                  >
                    닫기
                  </button>
                  <button 
                    onClick={() => {
                      setShowCourseInfo(false);
                      setShowRegistrationPopup(true);
                    }}
                    className="flex-2 md:flex-none px-5 py-2.5 rounded text-xs font-extrabold flex items-center justify-center gap-1 transition-all hover:brightness-110 shadow-lg"
                    style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor }}
                  >
                    <Icons.MessageSquare size={13} /> 수강 상담 신청하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showRegistrationPopup && (
          <div 
            className={`${viewMode === 'desktop' ? 'fixed' : 'absolute'} inset-0 bg-black/95 backdrop-blur-sm flex items-start md:items-center justify-center p-4 pt-10 md:pt-4 z-50 overflow-y-auto animate-fade-in`}
            onClick={() => setShowRegistrationPopup(false)}
          >
            <div 
              className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-2xl relative"
              style={{ fontFamily: theme.fontFamily === 'serif' ? 'Georgia, Cambria, serif' : 'system-ui, sans-serif' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 장식용 탑 디자인 바 */}
              <div className="h-1.5 w-full" style={{ backgroundColor: theme.primaryColor }} />

              {/* 닫기 헤더 물리 버튼 */}
              <button 
                onClick={() => setShowRegistrationPopup(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-850 hover:bg-zinc-800 p-2 rounded-full transition-all z-10"
              >
                <Icons.X size={15} />
              </button>

              <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-zinc-800">
                    <Icons.MessageSquare size={20} style={{ color: theme.primaryColor }} />
                  </div>
                </div>
                <h3 className="text-base font-black text-white mb-2">Vollmond 수강 신청 안내</h3>
                <p className="text-[11px] text-zinc-500 mb-5">아래 QR코드를 스캔하여 카카오톡 상담 채널로 연결할 수 있습니다.</p>

                {/* QR Code Container */}
                <div className="bg-white p-3 rounded-xl inline-block shadow-lg mx-auto mb-5">
                  <img 
                    src="https://rosaleegerman.github.io/-/assets/images/kakaotalk_qr_code_1779893911603.png" 
                    alt="KakaoTalk QR Code" 
                    className="w-44 h-44 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Instructions List */}
                <div className="text-left bg-zinc-950/60 border border-zinc-850 p-4 rounded-lg space-y-2.5">
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Icons.Info size={11} style={{ color: theme.primaryColor }} />
                    상담 신청 및 등원 절차
                  </h4>
                  <ol className="text-xs text-zinc-300 space-y-2.5 list-none pl-0">
                    <li className="flex gap-2.5 items-start">
                      <span className="font-extrabold text-xs mt-0.5" style={{ color: theme.primaryColor }}>1.</span>
                      <span className="break-keep leading-relaxed">채팅으로 수강 희망자의 이름, 학교, 학년, 과목을 기재해 보내 주세요.</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <span className="font-extrabold text-xs mt-0.5" style={{ color: theme.primaryColor }}>2.</span>
                      <span className="break-keep leading-relaxed">현강 or 영상 수강 여부를 꼭 알려 주세요.</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <span className="font-extrabold text-xs mt-0.5" style={{ color: theme.primaryColor }}>3.</span>
                      <span className="break-keep leading-relaxed">간단한 상담 및 재학생 인증 후 결제 링크를 통해 결제를 완료해 주세요.</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <span className="font-extrabold text-xs mt-0.5" style={{ color: theme.primaryColor }}>4.</span>
                      <span className="break-keep leading-relaxed">해당 수업 단체 채팅창에 초대되며 바로 등원 및 영상 수강이 가능합니다.</span>
                    </li>
                  </ol>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center gap-2">
                <button 
                  onClick={() => setShowRegistrationPopup(false)}
                  className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold transition-all"
                >
                  닫기
                </button>
                {seo.kakaoLink && (
                  <a 
                    href={seo.kakaoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 px-4 py-2.5 rounded text-xs font-extrabold text-center flex items-center justify-center gap-1.5 transition-all hover:brightness-110 shadow-lg"
                    style={{ backgroundColor: theme.primaryColor, color: theme.backgroundColor }}
                  >
                    <Icons.ExternalLink size={12} /> 카카오채널 연결
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {showTeachersPopup && (
          <div 
            className={`${viewMode === 'desktop' ? 'fixed' : 'absolute'} inset-0 bg-black/95 backdrop-blur-sm flex items-start md:items-center justify-center p-4 pt-10 md:pt-4 z-50 overflow-y-auto animate-fade-in`}
            onClick={() => setShowTeachersPopup(false)}
          >
            <div 
              className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-2xl relative max-h-[90vh]"
              style={{ fontFamily: theme.fontFamily === 'serif' ? 'Georgia, Cambria, serif' : 'system-ui, sans-serif' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 장식용 탑 디자인 바 */}
              <div className="h-1.5 w-full animate-pulse" style={{ backgroundColor: theme.primaryColor }} />

              {/* 닫기 버튼 */}
              <button 
                onClick={() => setShowTeachersPopup(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full transition-all z-10"
              >
                <Icons.X size={15} />
              </button>

              {/* 헤더 */}
              <div className="px-6 pt-6 pb-4 border-b border-zinc-850 text-left">
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: theme.primaryColor }}>
                  VOLLMOND FACULTY
                </span>
                <h3 className="text-lg font-black text-white mt-1">폴몬트 학원 최정예 강사진 소개</h3>
                <p className="text-[11px] text-zinc-500 mt-1">최고의 전문성과 검증된 교육 약력으로 학생들을 최우선 밀착 지도합니다.</p>
              </div>

              {/* 본문 콘텐츠 스크롤 영역 */}
              <div className="p-6 overflow-y-auto space-y-5 max-h-[60vh] md:max-h-[65vh]">
                {/* 1. 원장 이로사 T (독일어) - 단독 하이라이트 */}
                <div 
                  className="p-5 rounded-lg border relative overflow-hidden bg-zinc-950/40"
                  style={{ borderColor: `${theme.primaryColor}30` }}
                >
                  <div className="absolute top-0 right-0 px-3 py-1 text-[9px] font-black tracking-widest uppercase rounded-bl-lg text-white" style={{ backgroundColor: theme.primaryColor }}>
                    DIRECTOR
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-white">이로사 T</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300" style={{ color: theme.primaryColor }}>원장 · 독일어</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* 학력 정보 */}
                    <div className="space-y-1.5">
                      <h5 className="font-bold text-zinc-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <Icons.GraduationCap size={13} style={{ color: theme.primaryColor }} /> 학력 및 소지 자격
                      </h5>
                      <ul className="space-y-1 text-zinc-300 pl-4 list-disc list-outside">
                        <li>한국외국어대학교 독일어과 학사</li>
                        <li>서울대학교 독일어교육과 석사</li>
                        <li>Heidelberg대학교 정치/철학</li>
                        <li>중등정교사자격증2급 소지</li>
                        <li>Goethe Zertifikat C2 소지</li>
                        <li>DSH 3 소지</li>
                      </ul>
                    </div>

                    {/* 경력 정보 */}
                    <div className="space-y-1.5">
                      <h5 className="font-bold text-zinc-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <Icons.Award size={13} style={{ color: theme.primaryColor }} /> 강사 경력 사항
                      </h5>
                      <ul className="space-y-1 text-zinc-300 pl-4 list-disc list-outside">
                        <li className="font-semibold text-white">독일어 강사 경력 16년</li>
                        <li>영어 강사 경력 10년</li>
                        <li>일본어 능력시험 JLPT 1급 보유</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 2. 일반 강사진 2컬럼 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 디오 T (스페인어) */}
                  <div className="p-4 rounded-lg bg-zinc-950/20 border border-zinc-800/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-900">
                        <span className="font-bold text-sm text-white">디오 T</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-305">스페인어</span>
                      </div>
                      <ul className="text-xs text-zinc-400 space-y-1.5 pl-3.5 list-disc list-outside">
                        <li>한국외국어대학교 스페인어 전공</li>
                        <li>스페인어권 국가 초/중/고 졸업</li>
                        <li>스페인어 전문 통역가 자격</li>
                        <li>ECK교육 DELE 인터넷 강의 제작</li>
                      </ul>
                    </div>
                  </div>

                  {/* 엠마 T (프랑스어) */}
                  <div className="p-4 rounded-lg bg-zinc-950/20 border border-zinc-800/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-900">
                        <span className="font-bold text-sm text-white">엠마 T</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-305">프랑스어</span>
                      </div>
                      <ul className="text-xs text-zinc-400 space-y-1.5 pl-3.5 list-disc list-outside">
                        <li>프랑스 낭트상급예술대학교 졸업</li>
                        <li>시원스쿨 프랑스어 대표 강사</li>
                        <li>&lt;Go독학 프랑스어 단어장&gt; 저자</li>
                      </ul>
                    </div>
                  </div>

                  {/* 최수원 T (중국어) */}
                  <div className="p-4 rounded-lg bg-zinc-950/20 border border-zinc-800/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-900">
                        <span className="font-bold text-sm text-white">최수원 T</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-305">중국어</span>
                      </div>
                      <ul className="text-xs text-zinc-400 space-y-1.5 pl-3.5 list-disc list-outside">
                        <li>한국외국어대학교 중국어과 졸업</li>
                        <li>외고 중국어과 출신</li>
                        <li>前 해커스 연구원</li>
                      </ul>
                    </div>
                  </div>

                  {/* 반성윤 T (러시아어) */}
                  <div className="p-4 rounded-lg bg-zinc-950/20 border border-zinc-800/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-900">
                        <span className="font-bold text-sm text-white">반성윤 T</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-305">러시아어</span>
                      </div>
                      <ul className="text-xs text-zinc-400 space-y-1.5 pl-3.5 list-disc list-outside">
                        <li>서울대학교 노어노문학과 졸업</li>
                        <li>카자흐스탄 11년 거주</li>
                      </ul>
                    </div>
                  </div>

                  {/* 장은미 T (수학) */}
                  <div className="p-4 rounded-lg bg-zinc-950/20 border border-zinc-800/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-900">
                        <span className="font-bold text-sm text-white">장은미 T</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-emerald-400">수학</span>
                      </div>
                      <ul className="text-xs text-zinc-400 space-y-1.5 pl-3.5 list-disc list-outside">
                        <li>前 대치우리 수학 전문 강사</li>
                        <li>前 목동A학원 재수 종합반 수학 강사</li>
                        <li className="text-zinc-300 font-medium">現 폴몬트학원 수학 전임 강사</li>
                      </ul>
                    </div>
                  </div>

                  {/* 모니카 T (영어) */}
                  <div className="p-4 rounded-lg bg-zinc-950/20 border border-zinc-800/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-900">
                        <span className="font-bold text-sm text-white">모니카 T</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-indigo-400">영어</span>
                      </div>
                      <ul className="text-xs text-zinc-400 space-y-1.5 pl-3.5 list-disc list-outside">
                        <li>現 목동 재수종합반 영어 강사</li>
                        <li className="text-zinc-300 font-medium">現 폴몬트학원 외고 내신 전문</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 닫기 기능 바구니 */}
              <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-end">
                <button 
                  onClick={() => setShowTeachersPopup(false)}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold transition-all shadow-md"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {showVideoPopup && (
          <div 
            className={`${viewMode === 'desktop' ? 'fixed' : 'absolute'} inset-0 bg-black/90 backdrop-blur-sm flex items-start md:items-center justify-center p-4 pt-10 md:pt-4 z-[60] overflow-y-auto animate-fade-in`}
            onClick={() => setShowVideoPopup(false)}
          >
            <div 
              className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-2xl relative"
              style={{ fontFamily: theme.fontFamily === 'serif' ? 'Georgia, Cambria, serif' : 'system-ui, sans-serif' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 장식용 탑 디자인 바 */}
              <div className="h-1.5 w-full" style={{ backgroundColor: theme.primaryColor }} />

              {/* 닫기 헤더 물리 버튼 */}
              <button 
                onClick={() => setShowVideoPopup(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-850 hover:bg-zinc-800 p-2.5 rounded-full transition-all z-10"
              >
                <Icons.X size={15} />
              </button>

              <div className="p-8 text-center">
                <div className="flex justify-center mb-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 animate-pulse">
                    <Icons.Play size={26} className="text-red-500 fill-red-500 ml-1" />
                  </div>
                </div>
                
                <span className="inline-block text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/15 mb-3">
                  COMING SOON
                </span>
                
                <h3 className="text-lg font-black text-white mb-2 leading-tight">
                  온라인 영상 강의 서비스 준비 중
                </h3>
                
                <p className="text-xs text-zinc-400 leading-relaxed break-keep max-w-sm mx-auto mb-6">
                  폴몬트 학원 수강생분들을 위한 고품격 전문 인터넷 강의 서비스 런칭을 열심히 준비하고 있습니다. 조금만 더 기다려 주세요!
                </p>

                <div className="bg-zinc-950/60 border border-zinc-850 p-4 rounded-lg text-left space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 block uppercase tracking-wider">주요 제공 예정 서비스</span>
                  <div className="text-xs text-zinc-300 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Icons.Check size={12} className="text-emerald-500" />
                      <span>외고 내신 과외급 명품 녹화강의 제공</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icons.Check size={12} className="text-emerald-500" />
                      <span>수강생 복습을 위한 고화질 VOD 플레이어</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icons.Check size={12} className="text-emerald-500" />
                      <span>부족한 파트를 채워 주기 위한 보완 동영상 강의</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex justify-end">
                <button 
                  onClick={() => setShowVideoPopup(false)}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold transition-all w-full"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {showMobileMenu && (
          <div 
            className={`${viewMode === 'desktop' ? 'fixed' : 'absolute'} inset-0 bg-black/95 backdrop-blur-md flex flex-col p-6 z-[60] animate-fade-in`}
            style={{ fontFamily: theme.fontFamily === 'serif' ? 'Georgia, Cambria, serif' : 'system-ui, sans-serif' }}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-zinc-900">
              <span className="text-xl font-black tracking-tight text-white">
                VOLLMOND<span className="text-xs ml-1 font-normal opacity-70">[폴몬트]</span><span style={{ color: theme.primaryColor }}>.</span>
              </span>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="text-zinc-400 hover:text-white p-2 bg-zinc-900 rounded-full border border-zinc-800"
              >
                <Icons.X size={18} />
              </button>
            </div>

            {/* 메뉴 목록 */}
            <div className="flex-1 flex flex-col gap-6 justify-center max-w-sm mx-auto w-full text-center">
              <button 
                onClick={() => {
                  setShowMobileMenu(false);
                  const el = document.getElementById('about');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onFocusSection('hero');
                }}
                className="py-3 text-lg font-bold border-b border-zinc-900 text-zinc-300 hover:text-white flex items-center justify-between"
              >
                <span>학원 소개</span>
                <Icons.ChevronRight size={16} className="opacity-50" />
              </button>

              <button 
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowCourseInfo(true);
                }}
                className="py-3 text-lg font-bold border-b border-zinc-900 text-zinc-300 hover:text-white flex items-center justify-between"
              >
                <span>수업 정보</span>
                <Icons.ChevronRight size={16} className="opacity-50" />
              </button>

              <button 
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowTeachersPopup(true);
                }}
                className="py-3 text-lg font-bold border-b border-zinc-900 text-zinc-300 hover:text-white flex items-center justify-between"
              >
                <span>강사 소개</span>
                <Icons.ChevronRight size={16} className="opacity-50" />
              </button>

              <button 
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowVideoPopup(true);
                }}
                className="py-3 text-lg font-bold border-b border-zinc-900 text-zinc-300 hover:text-white flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  영상 강의
                  <span className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/15">
                    SOON
                  </span>
                </span>
                <Icons.ChevronRight size={16} className="opacity-50" />
              </button>
            </div>

            {/* 하단 CTA & SNS 연동 */}
            <div className="mt-auto max-w-sm mx-auto w-full space-y-6">
              <button 
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowRegistrationPopup(true);
                }}
                className="w-full py-4 text-sm font-bold text-black text-center transition-all flex items-center justify-center gap-1.5"
                style={{ 
                  backgroundColor: theme.primaryColor,
                  borderRadius: theme.borderRadius === 'none' ? '0px' : theme.borderRadius === 'full' ? '9999px' : '8px'
                }}
              >
                <Icons.CalendarDays size={16} />
                <span>지금 1:1 방문상담 예약하기</span>
              </button>

              {/* SNS 채널 연동 */}
              <div className="flex items-center justify-center gap-4 py-2 text-zinc-400 border-t border-zinc-900">
                {seo.instagramLink && (
                  <a href={seo.instagramLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs hover:text-white">
                    <Icons.Instagram size={14} />
                    <span>인스타그램</span>
                  </a>
                )}
                {seo.kakaoLink && (
                  <a href={seo.kakaoLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs hover:text-white">
                    <Icons.MessageSquareCode size={14} />
                    <span>카카오톡 채널</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

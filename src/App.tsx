/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Last Updated: 2026-05-27 - Trigger GitHub Save Button
 */

import React, { useState, useEffect } from 'react';
import { WebsiteData, DeviceViewMode } from './types';
import { DEFAULT_WEBSITE_DATA } from './defaultData';
import AdminPanel from './components/AdminPanel';
import PreviewCanvas from './components/PreviewCanvas';
import * as Icons from 'lucide-react';

const STORAGE_KEY = 'apricot_builder_standalone_data_v3';

export default function App() {
  // 로컬스토리지 복구 영속성 로직
  const [data, setData] = useState<WebsiteData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 사용자 요청에 맞춰 구글 AI 스튜디오의 데모 값이 저장되어 있다면 최신 정보로 마이그레이션합니다.
        if (parsed.contact) {
          if (parsed.contact.phone === '02-543-0900' || parsed.contact.address?.includes('강남구 테헤란로') || parsed.contact.address === '서울시 성북구 동소문로 71 청강빌딩 4층(1관)/ 서울시 성북구 동소문로13길 13 성환빌딩5층') {
            parsed.contact.phone = '02-6953-5443';
            parsed.contact.address = '서울시 성북구 동소문로 71 청강빌딩 4층(1관)/ 서울시 성북구 동소문로13길 13 성환빌딩5층(2관)';
          }
          if (parsed.contact.email === 'consulting@apricot-studio.com') {
            parsed.contact.email = 'rosa.lee.german@gmail.com';
          }
          if (parsed.contact.title === '브랜드 메이킹 시작하기') {
            parsed.contact.title = '교육 및 상담 신청하기';
            parsed.contact.description = 'Vollmond[폴몬트]만의 차별화된 맞춤식 명품 수업을 직접 경험해보세요. 성함과 연락처, 궁금하신 교육 수강 문의 내용을 간단히 남겨주시면 담당 선생님이 상세하게 상담을 진행해 드립니다.';
          }
        }
        if (parsed.seo && parsed.seo.emailLink === 'hello@apricot-studio.com') {
          parsed.seo.emailLink = 'rosa.lee.german@gmail.com';
        }
        // 과거 데이터에 stats 필드가 빠져있을 경우 디폴트 stats 데이터를 주입합니다.
        if (!parsed.stats || parsed.stats.length === 0) {
          parsed.stats = DEFAULT_WEBSITE_DATA.stats;
        }

        // 사용자 기업 명칭 변경에 따른 기존 '아프리콧/Apricot' 및 'LUNA/Luna' 데이터 Vollmond 마이그레이션
        if (parsed.seo) {
          if (parsed.seo.metaTitle?.includes('아프리콧') || parsed.seo.metaTitle?.includes('Apricot') || parsed.seo.metaTitle?.includes('브랜드 스튜디오')) {
            parsed.seo.metaTitle = '폴몬트 교육 디자인 | Vollmond Academy';
          }
          if (parsed.seo.metaDescription?.includes('아프리콧') || parsed.seo.metaDescription?.includes('Apricot') || parsed.seo.metaDescription?.includes('디자인 그룹')) {
            parsed.seo.metaDescription = '우리는 단순한 강사가 아닙니다, 결과를 증명하는 전략가입니다. 프리미엄 맞춤식 교육 전문 브랜드 Vollmond[폴몬트]입니다.';
          }
          if (parsed.seo.metaTitle) {
            parsed.seo.metaTitle = parsed.seo.metaTitle.replace(/LUNA/gi, 'VOLLMOND');
          }
          if (parsed.seo.metaDescription) {
            parsed.seo.metaDescription = parsed.seo.metaDescription.replace(/LUNA/gi, 'VOLLMOND');
          }
        }
        if (parsed.hero) {
          if (!parsed.hero.title || parsed.hero.title.includes('본질에서') || parsed.hero.title.includes('브랜딩 익스피리언스')) {
            parsed.hero.title = 'VOLLMOND\n우리가 확실히 잘합니다';
          } else {
            parsed.hero.title = parsed.hero.title.replace(/LUNA/gi, 'VOLLMOND');
          }
          if (parsed.hero.subtitle && (parsed.hero.subtitle.includes('아프리콧') || parsed.hero.subtitle.includes('Apricot') || parsed.hero.subtitle.includes('브랜드 아이덴티티'))) {
            parsed.hero.subtitle = '우리는 단순한 강사가 아닙니다. 결과를 증명하는 전략가입니다. 어두운 길 위에서 끝까지 올바른 공부 방향을 비추는 보름달[Vollmond-폴몬트]이 되겠습니다.';
          } else if (parsed.hero.subtitle) {
            parsed.hero.subtitle = parsed.hero.subtitle.replace(/LUNA/gi, 'VOLLMOND');
          }
          if (!parsed.hero.imageUrl || parsed.hero.imageUrl.includes('photo-1618005182384-a83a8bd57fbe') || parsed.hero.imageUrl.includes('hero_vollmond_full_moon_1779890984787.png') || parsed.hero.imageUrl.includes('/src/assets/images/')) {
            parsed.hero.imageUrl = '/assets/images/blue_sky_moon_1779892119976.png';
          }
        }
        // 기존의 브랜드 디자인으로 들어간 핵심 기능을 폴몬트 학원용 특화 기능으로 마이그레이션합니다.
        if (parsed.features && parsed.features.length > 0) {
          const firstFeat = parsed.features[0];
          if (firstFeat.title?.includes('브랜드') || firstFeat.title?.includes('컨설팅') || firstFeat.title?.includes('비주얼')) {
            parsed.features = [
              {
                id: 'feat-1',
                title: '소수정예 전략 케어',
                description: '최대 정원 6명 이하 소수정예로 수업을 구성하여, 대형 학원에서 놓치기 쉬운 개인별 학습 구멍과 취약 유형을 실시간 정밀 진단합니다.',
                iconName: 'Users'
              },
              {
                id: 'feat-2',
                title: '평균 10년 이상 검증된 강사진',
                description: '단순한 강의 전달자가 아닙니다. 수년간 대치/목동 등 교육 특구에서 눈부신 적중률과 성과로 스스로를 증명해낸 베테랑 전략가 레벨 강사단입니다.',
                iconName: 'Award'
              },
              {
                id: 'feat-3',
                title: '끝까지 책임지는 밀착 관리',
                description: '매 수업 후 1:1 오답 심층 피드백과 함께 정기 실전 훈련 피드백 레포트를 학부모님께 상시 피딩해 드립니다.',
                iconName: 'HeartHandshake'
              }
            ];
          }
        }
        return parsed;
      }
    } catch (e) {
      console.error('로컬스토리지를 해독할 수 없어 기본 테마 데이터를 로드합니다.', e);
    }
    return DEFAULT_WEBSITE_DATA;
  });

  // 실서비스 배포용 정적 호스팅 vs 로컬/AI 스튜디오 커스터마이징 워크스페이스 판별 가드 로직
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('admin') || params.has('edit')) {
        return true;
      }
      const hostname = window.location.hostname;
      if (
        hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.includes('run.app') || 
        hostname.includes('aistudio-preview') ||
        hostname.includes('aistudio.google')
      ) {
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<'theme' | 'hero' | 'features' | 'cms' | 'seo' | 'contact' | 'inquiries'>('theme');
  const [viewMode, setViewMode] = useState<DeviceViewMode>('desktop');
  const [showIntroToast, setShowIntroToast] = useState(true);

  // 로컬스토리지 직렬화 자동 저장 동기화
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('로컬스토리지 저장 실패', e);
    }

    // SEO 실시간 웹 도큐먼트 타이틀 피팅 연동
    if (data.seo.metaTitle) {
      document.title = data.seo.metaTitle;
    }
  }, [data]);

  // 샘플 데이터 완전 복구 핸들러
  const handleResetToDefault = () => {
    setData(DEFAULT_WEBSITE_DATA);
    setActiveTab('theme');
  };

  // 프리뷰 영역에서 특정 요소를 탭/ 더블클릭할 시 어드민 패널 탭을 포커스해 주는 심리스 가이드
  const handleFocusSection = (section: 'theme' | 'hero' | 'features' | 'cms' | 'seo' | 'contact') => {
    setActiveTab(section);
    
    // 모바일/태블릿 반응형 뷰 테스트 피드백 알림 
    const isMobileViewport = window.innerWidth < 1024;
    if (isMobileViewport) {
      // 뷰포트가 작다면 스무스 스크롤로 어드민 탭 영역으로 이동되도록 
      const sidebarEl = document.getElementById('admin-sidebar');
      if (sidebarEl) {
        sidebarEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (!isAdminMode) {
    return (
      <div 
        className="min-h-screen flex flex-col font-sans overflow-x-hidden antialiased"
        style={{ backgroundColor: data.theme.backgroundColor }}
      >
        {/* 일반 방문자용 100% 깔끔한 풀 스크린 랜딩 페이지 */}
        <div className="flex-1 w-full">
          <PreviewCanvas 
            data={data}
            viewMode="desktop"
            onFocusSection={() => {}}
          />
        </div>
        
        {/* 관리자를 위한 시크릿 백도어: 더블 클릭 시 관리 편집 기능이 활성화됩니다. */}
        <div 
          className="py-12 text-center text-[10px] text-zinc-400/25 bg-black border-t border-zinc-950 font-mono select-none cursor-default"
          onDoubleClick={() => {
            setIsAdminMode(true);
            try {
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.set('admin', 'true');
              window.history.pushState({}, '', newUrl);
            } catch (e) {
              console.error(e);
            }
          }}
          title="이 영역을 더블 클릭하면 관리자 에디터 기능이 재활성화됩니다."
        >
          © 2026 VOLLMOND EDU. All Rights Reserved. (Double-click to customize)
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070708] flex flex-col font-sans overflow-x-hidden antialiased text-zinc-200">
      
      {/* ------------------ 상단 통합 워크스페이스 제어 탑바 ------------------ */}
      <header className="bg-zinc-950/90 border-b border-zinc-900/90 text-xs py-2.5 px-4 flex justify-between items-center z-50 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-450 animate-pulse" />
          <span className="font-mono font-bold tracking-wider text-rose-300">STUDIO ACTIVE WORKSPACE</span>
          <span className="text-zinc-650">|</span>
          <span className="text-zinc-400 font-medium">노코드 포트폴리오 에디터 & 인사이트 CMS 빌더 (Netlify 연동 완벽 완료)</span>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-zinc-500 font-mono">
          <span>영속 포트: <strong className="text-zinc-300">LocalStorage</strong></span>
          <span>컨트라스트: <strong className="text-zinc-300">Pure Black High-End #000</strong></span>
          <span>보안: <strong className="text-green-500">HTTPS Safe Mode</strong></span>
        </div>
      </header>

      {/* ------------------ 메인 스튜디오 레이아웃 ------------------ */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 relative">
        
        {/* 사용 가이드 토스트 배너 (초기 안내용) */}
        {showIntroToast && (
          <div className="absolute top-4 right-4 bg-zinc-900 border border-rose-500/30 p-4 rounded-xl shadow-2xl max-w-sm z-50 animate-slide-up flex gap-3">
            <div className="p-2 bg-rose-500/10 text-rose-300 rounded-lg flex-shrink-0 self-start">
              <Icons.Sparkles size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">완벽 작동하는 노코드 익스피리언스</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                좌측 <strong>관리 세팅 패널</strong>에서 테마 배색, 서체, 메인 상세 콘텐츠와 블로그 CMS 게시글을 수정해 보세요. 우측 <strong>실시간 반응형 프리뷰</strong>에 즉각 렌더링 됩니다!
              </p>
              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setShowIntroToast(false)}
                  className="text-[10px] font-bold text-rose-300 hover:underline"
                >
                  에디터 시작하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. 좌측 어드민 대시보드 조절기 패널 (40%) */}
        <div className="w-full lg:w-[460px] xl:w-[480px] shrink-0 h-[600px] lg:h-full flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-900 bg-zinc-950 z-30">
          <AdminPanel 
            data={data}
            onChange={setData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onResetToDefault={handleResetToDefault}
          />
        </div>

        {/* 2. 우측 인터랙티브 프리뷰 캔버스 컨텍스트 영역 (60%) */}
        <div className="flex-1 bg-zinc-950/40 overflow-y-auto relative flex flex-col justify-start">
          {/* 가상 주소창 브라우저 바 */}
          <div className="bg-zinc-950/80 border-b border-zinc-900 text-[11px] py-2 px-5 flex justify-between items-center text-zinc-500 font-mono shrink-0 select-none backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-1.5 overflow-hidden max-w-[70%]">
              <Icons.Lock size={11} className="text-zinc-650 text-emerald-500" />
              <span className="text-zinc-300 truncate">https://{window.location.hostname}</span>
            </div>
            <div className="flex gap-2 items-center text-[10px]">
              <span className="bg-green-500/10 text-green-400 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">LIVE PREVIEW</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">뷰포트: {viewMode === 'desktop' ? 'PC 모드' : viewMode === 'tablet' ? '태블릿 768px' : '모바일 375px'}</span>
            </div>
          </div>

          <div className="flex-1 w-full bg-radial-grid py-8 md:py-12 overflow-y-auto">
            {/* 프리뷰 프레임 구성 */}
            <PreviewCanvas 
              data={data}
              viewMode={viewMode}
              onFocusSection={handleFocusSection}
            />
          </div>

          {/* 하단 단축 지름길 바 */}
          <div className="p-3 bg-zinc-950/60 border-t border-zinc-900 text-[10px] text-zinc-500 flex justify-between items-center font-mono px-6">
            <div className="flex items-center gap-1.5">
              <Icons.ShieldAlert size={12} className="text-rose-450" />
              <span>우측 사이트의 구성 요소를 직접 클릭해 보세요. 해당 편집 탭으로 가이드 포커스 됩니다.</span>
            </div>
            <span className="hidden sm:inline">Vollmond Creative Engine</span>
          </div>
        </div>

      </main>
    </div>
  );
}

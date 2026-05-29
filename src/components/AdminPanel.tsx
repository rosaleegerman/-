/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WebsiteData, CMSPost, FeatureItem, FontFamilyType, FontSizeBaseType, BorderRadiusType } from '../types';
import * as Icons from 'lucide-react';

interface AdminPanelProps {
  data: WebsiteData;
  onChange: (newData: WebsiteData) => void;
  activeTab: 'theme' | 'hero' | 'features' | 'cms' | 'seo' | 'contact' | 'inquiries';
  setActiveTab: (tab: 'theme' | 'hero' | 'features' | 'cms' | 'seo' | 'contact' | 'inquiries') => void;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  setViewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  onResetToDefault: () => void;
}

// 빌더 색상 테마 팔레트 프리셋 정의
const THEME_PRESETS = [
  {
    name: '살구빛 브랜드 (폴몬트 헤리티지)',
    primary: '#FFB2A7',
    background: '#000000',
    cardBg: '#121212',
    text: '#FFFFFF',
    desc: 'Pure Black & Vollmond Pink의 시그니처 미니멀 대비',
    font: 'serif' as FontFamilyType
  },
  {
    name: '포레스트 인테리어',
    primary: '#60A5FA',
    background: '#0B0F19',
    cardBg: '#161D30',
    text: '#F3F4F6',
    desc: '깊은 네이비와 오션 블루 톤의 차분한 테크 느낌',
    font: 'sans' as FontFamilyType
  },
  {
    name: '헤리티지 럭셔리 골드',
    primary: '#D4AF37',
    background: '#0F0E0C',
    cardBg: '#1A1815',
    text: '#FAF6F0',
    desc: '고급 골드 프레임과 다크 우디 질감의 조화',
    font: 'serif' as FontFamilyType
  },
  {
    name: '미니멀 사이버 세리프',
    primary: '#00F0FF',
    background: '#000000',
    cardBg: '#111111',
    text: '#FFFFFF',
    desc: '사이버펑크 한 스푼이 섞인 네온 하이콘트라스트',
    font: 'mono' as FontFamilyType
  }
];

// 프리셋 이미지 데이터셋
const UNAPLASH_PRESET_IMAGES = [
  { label: '폴몬트 푸른 하늘 보름달 (Vollmond Blue Moon)', url: 'assets/images/blue_sky_moon_1779892119976.png' },
  { label: '추상 실크 (Abstract Silk)', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
  { label: '건축 미니멀 (Minimalist Arch)', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { label: '디자인 목업 (Creative Studio)', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80' },
  { label: '모던 오피스 (Modern Office)', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
];

// 아이콘 선택 리스트 프리셋
const ICON_PRESETS = [
  'Compass', 'Palette', 'Cpu', 'Award', 'Briefcase', 'Layers', 
  'Activity', 'Shield', 'Sparkles', 'Anchor', 'Terminal', 'Maximize'
];

export default function AdminPanel({
  data,
  onChange,
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  onResetToDefault
}: AdminPanelProps) {
  // 모의 대시보드 상태들
  const [publishing, setPublishing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showIconSelectForFeatureId, setShowIconSelectForFeatureId] = useState<string | null>(null);

  // 게시판 작성 폼 로컬 임시 상태
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postFormTitle, setPostFormTitle] = useState('');
  const [postFormCategory, setPostFormCategory] = useState('');
  const [postFormExcerpt, setPostFormExcerpt] = useState('');
  const [postFormContent, setPostFormContent] = useState('');
  const [postFormImage, setPostFormImage] = useState('');
  const [postFormStatus, setPostFormStatus] = useState<'published' | 'draft'>('published');
  const [isCreatingNewPost, setIsCreatingNewPost] = useState(false);

  // 업데이트 핸들러 도구
  const updateSEO = (fields: Partial<typeof data.seo>) => {
    onChange({ ...data, seo: { ...data.seo, ...fields } });
  };

  const updateTheme = (fields: Partial<typeof data.theme>) => {
    onChange({ ...data, theme: { ...data.theme, ...fields } });
  };

  const updateHero = (fields: Partial<typeof data.hero>) => {
    onChange({ ...data, hero: { ...data.hero, ...fields } });
  };

  const updateContact = (fields: Partial<typeof data.contact>) => {
    onChange({ ...data, contact: { ...data.contact, ...fields } });
  };

  // 통계 아이템 수정 로직
  const handleStatChange = (id: string, field: 'value' | 'label', val: string) => {
    const updatedStats = (data.stats || []).map(s => {
      if (s.id === id) {
        return { ...s, [field]: val };
      }
      return s;
    });
    onChange({ ...data, stats: updatedStats });
  };

  // 피처 아이템 수정 로직
  const handleFeatureChange = (id: string, field: keyof FeatureItem, value: any) => {
    const updatedFeatures = data.features.map(f => {
      if (f.id === id) {
        return { ...f, [field]: value };
      }
      return f;
    });
    onChange({ ...data, features: updatedFeatures });
  };

  // 피처 추가 기능
  const handleAddFeature = () => {
    const newFeature: FeatureItem = {
      id: `feat-${Date.now()}`,
      title: '새로운 에센셜 서비스',
      description: '이 서비스 분야에서 제공할 상세 가치를 한 줄 정도로 명쾌하게 정하십시요.',
      iconName: 'Sparkles'
    };
    onChange({ ...data, features: [...data.features, newFeature] });
  };

  // 피처 삭제 기능
  const handleRemoveFeature = (id: string) => {
    if (data.features.length <= 1) {
      alert('최소 1개 이상의 코어 서비스 카드가 화면에 필요합니다.');
      return;
    }
    onChange({ ...data, features: data.features.filter(f => f.id !== id) });
  };

  // CMS 글 CRUD 실행기
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postFormTitle || !postFormContent) {
      alert('제목과 본문을 작성해 주세요.');
      return;
    }

    if (editingPostId) {
      // 기존 글 업데이트
      const updatedPosts = data.posts.map(p => {
        if (p.id === editingPostId) {
          return {
            ...p,
            title: postFormTitle,
            category: postFormCategory || 'Insight',
            excerpt: postFormExcerpt || postFormContent.slice(0, 100) + '...',
            content: postFormContent,
            imageUrl: postFormImage || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
            status: postFormStatus
          };
        }
        return p;
      });
      onChange({ ...data, posts: updatedPosts });
      setEditingPostId(null);
    } else {
      // 신규 글 추가
      const newPost: CMSPost = {
        id: `post-${Date.now()}`,
        title: postFormTitle,
        category: postFormCategory || 'Insight',
        excerpt: postFormExcerpt || postFormContent.slice(0, 100) + '...',
        content: postFormContent,
        imageUrl: postFormImage || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
        createdAt: new Date().toISOString().split('T')[0],
        status: postFormStatus
      };
      onChange({ ...data, posts: [newPost, ...data.posts] });
      setIsCreatingNewPost(false);
    }

    // 작성 폼 초기화
    clearPostForm();
  };

  const startEditPost = (post: CMSPost) => {
    setEditingPostId(post.id);
    setIsCreatingNewPost(false);
    setPostFormTitle(post.title);
    setPostFormCategory(post.category);
    setPostFormExcerpt(post.excerpt);
    setPostFormContent(post.content);
    setPostFormImage(post.imageUrl);
    setPostFormStatus(post.status);
    setActiveTab('cms');
  };

  const startCreateNewPost = () => {
    clearPostForm();
    setIsCreatingNewPost(true);
    setEditingPostId(null);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('이 포스트를 정말로 완전 삭제하시겠습니까?')) {
      onChange({ ...data, posts: data.posts.filter(p => p.id !== id) });
      if (editingPostId === id) {
        clearPostForm();
        setEditingPostId(null);
      }
    }
  };

  const clearPostForm = () => {
    setPostFormTitle('');
    setPostFormCategory('');
    setPostFormExcerpt('');
    setPostFormContent('');
    setPostFormImage('');
    setPostFormStatus('published');
  };

  // 모의 배포 트리거 액션
  const handlePublishMock = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      alert('🎉 맞춤형 디자인 빌드와 리포지토리가 성공적으로 동기화 되었습니다! (현재 모드: 로컬 브라우저 세션 영구 저장 활성화)');
    }, 1800);
  };

  // SEO 완성도 연산
  const calculateSEOScore = () => {
    let score = 20;
    if (data.seo.metaTitle.length > 10) score += 20;
    if (data.seo.metaDescription.length > 30) score += 20;
    if (data.seo.instagramLink || data.seo.kakaoLink) score += 20;
    if (data.posts.filter(p => p.status === 'published').length >= 2) score += 20;
    return score;
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 border-r border-zinc-900" id="admin-sidebar">
      {/* -------------------- 대시보드 탑 네비게이션 -------------------- */}
      <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-rose-500/15 rounded text-rose-400">
            <Icons.Layers size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              노코드 크레이티브 엔진
              <span className="text-[10px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-mono">v1.2</span>
            </h1>
            <p className="text-[10px] text-zinc-500">실시간 커스터마이징 및 원스탑 관리 패널</p>
          </div>
        </div>

        {/* 획기적인 샘플 초기화 버튼 */}
        <button 
          onClick={() => {
            if (confirm('작성 중이던 커스텀 상태가 초기화되고 수려한 한국어 샘플 미학 템플릿 데이터로 덮어씌워집니다. 진행하시겠습니까?')) {
              onResetToDefault();
            }
          }}
          className="p-1.5 hover:bg-zinc-900 rounded text-zinc-400 hover:text-white transition-all text-xs flex items-center gap-1 border border-zinc-850"
          title="템플릿 데모 복원"
        >
          <Icons.RefreshCcw size={12} />
          <span className="hidden leading-none xl:inline">샘플 초기화</span>
        </button>
      </div>

      {/* -------------------- 프리뷰 제어 디바이스 스위처 바 -------------------- */}
      <div className="p-3 bg-zinc-900/60 border-b border-zinc-900/80 flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-400">실시간 뷰 규격</span>
        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-850">
          <button 
            onClick={() => setViewMode('desktop')} 
            className={`p-1 px-2.5 rounded flex items-center gap-1.5 transition-colors ${viewMode === 'desktop' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Icons.Monitor size={12} /> <span className="text-[10px]">PC</span>
          </button>
          <button 
            onClick={() => setViewMode('tablet')} 
            className={`p-1 px-2.5 rounded flex items-center gap-1.5 transition-colors ${viewMode === 'tablet' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Icons.Tablet size={12} /> <span className="text-[10px]">T</span>
          </button>
          <button 
            onClick={() => setViewMode('mobile')} 
            className={`p-1 px-2.5 rounded flex items-center gap-1.5 transition-colors ${viewMode === 'mobile' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Icons.Smartphone size={12} /> <span className="text-[10px]">M</span>
          </button>
        </div>
      </div>

      {/* -------------------- 어드민 탭 디스플레이 선택 -------------------- */}
      <div className="grid grid-cols-4 border-b border-zinc-900 text-center text-xs font-semibold bg-zinc-950">
        <button 
          onClick={() => { setActiveTab('theme'); setIsCreatingNewPost(false); setEditingPostId(null); }}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${activeTab === 'theme' ? 'border-rose-400 bg-zinc-900/40 text-rose-300 font-bold' : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/20'}`}
        >
          <Icons.Paintbrush size={14} />
          <span>테마 디자인</span>
        </button>
        <button 
          onClick={() => { setActiveTab('hero'); setIsCreatingNewPost(false); setEditingPostId(null); }}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${activeTab === 'hero' ? 'border-rose-400 bg-zinc-900/40 text-rose-300 font-bold' : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/20'}`}
        >
          <Icons.FileText size={14} />
          <span>메인 레이아웃</span>
        </button>
        <button 
          onClick={() => { setActiveTab('cms'); }}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${activeTab === 'cms' ? 'border-rose-400 bg-zinc-900/40 text-rose-300 font-bold' : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/20'}`}
        >
          <Icons.Globe size={14} />
          <span>인사이트 CMS</span>
        </button>
        <button 
          onClick={() => { setActiveTab('seo'); setIsCreatingNewPost(false); setEditingPostId(null); }}
          className={`py-3 flex flex-col items-center gap-1 border-b-2 transition-all ${activeTab === 'seo' ? 'border-rose-400 bg-zinc-900/40 text-rose-300 font-bold' : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/20'}`}
        >
          <Icons.Sparkles size={14} />
          <span>마케팅/SEO</span>
        </button>
      </div>

      {/* -------------------- 실제 컨트롤러 리스트 영역 ------------- */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* ==================== 1. 테마 디자인 수정 패널 ==================== */}
        {activeTab === 'theme' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-zinc-900/40 p-3.5 rounded-lg border border-zinc-850 flex gap-2 items-start text-xs">
              <Icons.Info size={16} className="text-zinc-400 flex-shrink-0 mt-0.5" />
              <p className="text-zinc-400 leading-relaxed">
                클릭 단 한번으로 브랜드 시그니처 배색을 전환할 수 있습니다. 칠흑 같은 어둠 속에서 세련된 분홍빛 포인트를 감상해보세요.
              </p>
            </div>

            {/* 디자인 프리셋 리스트 */}
            <div className="space-y-2.5">
              <span className="block text-[11px] font-bold text-rose-300 tracking-wider uppercase">디자인 테마 프리셋</span>
              <div className="grid grid-cols-1 gap-2.5">
                {THEME_PRESETS.map((preset, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      updateTheme({
                        primaryColor: preset.primary,
                        backgroundColor: preset.background,
                        cardBgColor: preset.cardBg,
                        textColor: preset.text,
                        fontFamily: preset.font
                      });
                    }}
                    className="p-3 text-left bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all flex flex-col justify-between items-start cursor-pointer hover:bg-zinc-900/80"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-white">{preset.name}</span>
                      <div className="flex gap-1">
                        <span className="w-3.5 h-3.5 rounded-full border border-zinc-700" style={{ backgroundColor: preset.primary }} />
                        <span className="w-3.5 h-3.5 rounded-full border border-zinc-700" style={{ backgroundColor: preset.background }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-1">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 정교한 컬러 피커 기기 제어 */}
            <div className="space-y-4 border-t border-zinc-900 pt-4">
              <span className="block text-[11px] font-bold text-rose-300 tracking-wider">상세 수동 색상 세팅</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">포인트Accent색</label>
                  <div className="flex gap-1.5 items-center">
                    <input 
                      type="color" 
                      value={data.theme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent overflow-hidden cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={data.theme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 text-[10px] p-1.5 rounded w-full font-mono text-white text-center focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">배경색 (Background)</label>
                  <div className="flex gap-1.5 items-center">
                    <input 
                      type="color" 
                      value={data.theme.backgroundColor}
                      onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent overflow-hidden cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={data.theme.backgroundColor}
                      onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 text-[10px] p-1.5 rounded w-full font-mono text-white text-center focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">카드 배경색(Cards)</label>
                  <div className="flex gap-1.5 items-center">
                    <input 
                      type="color" 
                      value={data.theme.cardBgColor}
                      onChange={(e) => updateTheme({ cardBgColor: e.target.value })}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent overflow-hidden cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={data.theme.cardBgColor}
                      onChange={(e) => updateTheme({ cardBgColor: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 text-[10px] p-1.5 rounded w-full font-mono text-white text-center focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">텍스트 색상(Text)</label>
                  <div className="flex gap-1.5 items-center">
                    <input 
                      type="color" 
                      value={data.theme.textColor}
                      onChange={(e) => updateTheme({ textColor: e.target.value })}
                      className="w-7 h-7 rounded border border-zinc-700 bg-transparent overflow-hidden cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={data.theme.textColor}
                      onChange={(e) => updateTheme({ textColor: e.target.value })}
                      className="bg-zinc-900 border border-zinc-800 text-[10px] p-1.5 rounded w-full font-mono text-white text-center focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 타이포그래피 제어 */}
            <div className="space-y-4 border-t border-zinc-900 pt-4">
              <span className="block text-[11px] font-bold text-rose-300 tracking-wider">타이포그래피 및 서체 스킨</span>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5">대표 폰트 조합</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => updateTheme({ fontFamily: 'serif' })}
                    className={`p-2.5 rounded border text-xs text-center transition-colors ${data.theme.fontFamily === 'serif' ? 'border-rose-450 bg-rose-500/10 text-rose-300 font-bold' : 'border-zinc-855 bg-zinc-900/60 text-zinc-400 hover:text-white'}`}
                  >
                    <span className="block font-serif font-semibold text-sm">Serif</span>
                    <span className="text-[9px] block mt-0.5">명조 감각체</span>
                  </button>
                  <button 
                    onClick={() => updateTheme({ fontFamily: 'sans' })}
                    className={`p-2.5 rounded border text-xs text-center transition-colors ${data.theme.fontFamily === 'sans' ? 'border-rose-450 bg-rose-500/10 text-rose-300 font-bold' : 'border-zinc-855 bg-zinc-900/60 text-zinc-400 hover:text-white'}`}
                  >
                    <span className="block font-sans font-semibold text-sm">Sans</span>
                    <span className="text-[9px] block mt-0.5">고딕 깔끔체</span>
                  </button>
                  <button 
                    onClick={() => updateTheme({ fontFamily: 'mono' })}
                    className={`p-2.5 rounded border text-xs text-center transition-colors ${data.theme.fontFamily === 'mono' ? 'border-rose-450 bg-rose-500/10 text-rose-300 font-bold' : 'border-zinc-855 bg-zinc-900/60 text-zinc-400 hover:text-white'}`}
                  >
                    <span className="block font-mono font-semibold text-sm">Mono</span>
                    <span className="text-[9px] block mt-0.5">코딩 기계체</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 font-mono">기본 글꼴 척도 (Font Scale Base)</label>
                <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1.5 rounded-lg border border-zinc-850">
                  {(['sm', 'base', 'lg'] as FontSizeBaseType[]).map((sz) => (
                    <button 
                      key={sz}
                      onClick={() => updateTheme({ fontSizeBase: sz })}
                      className={`py-1 rounded text-xs transition-colors uppercase ${data.theme.fontSizeBase === sz ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-white'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 font-mono">코너 곡률 (Border Radius)</label>
                <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1.5 rounded-lg border border-zinc-850">
                  {(['none', 'md', 'full'] as BorderRadiusType[]).map((rad) => (
                    <button 
                      key={rad}
                      onClick={() => updateTheme({ borderRadius: rad })}
                      className={`py-1 rounded text-xs transition-colors capitalize ${data.theme.borderRadius === rad ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-white'}`}
                    >
                      {rad === 'none' ? '각진형' : rad === 'md' ? '부드러운형' : '둥근형'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. 메인 콘텐츠 및 피처 편집 패널 ==================== */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-fade-in">
            {/* 히어로 구문 영역 */}
            <div className="space-y-4">
              <span className="block text-[11px] font-bold text-rose-300 tracking-wider uppercase">메인 히어로 세션 편집</span>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">메인 오프닝 카피 (줄 바꿈 \n 지원)</label>
                <textarea 
                  value={data.hero.title}
                  onChange={(e) => updateHero({ title: e.target.value })}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded text-white focus:outline-none focus:border-rose-400 leading-normal"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">서브 설명구 (인포그래피 헬퍼)</label>
                <textarea 
                  value={data.hero.subtitle}
                  onChange={(e) => updateHero({ subtitle: e.target.value })}
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded text-zinc-300 focus:outline-none focus:border-rose-400 leading-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">동작 버튼(CTA) 문구</label>
                  <input 
                    type="text" 
                    value={data.hero.ctaText}
                    onChange={(e) => updateHero({ ctaText: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">앵커 타겟 링크</label>
                  <input 
                    type="text" 
                    value={data.hero.ctaLink}
                    onChange={(e) => updateHero({ ctaLink: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded text-white font-mono"
                  />
                </div>
              </div>

              {/* 이미지 가이드 및 Unsplash 프리셋 추출 기능 */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">메인 비주얼 이미지 에셋 주소</label>
                <input 
                  type="text" 
                  value={data.hero.imageUrl}
                  onChange={(e) => updateHero({ imageUrl: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-[10px] p-2.5 rounded text-zinc-200 font-mono mb-2"
                />
                
                {/* 퀵 프리셋 셀렉터 */}
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                  {UNAPLASH_PRESET_IMAGES.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => updateHero({ imageUrl: img.url })}
                      className="text-[9px] p-1.5 text-left bg-zinc-900 hover:bg-zinc-850 hover:text-white rounded border border-zinc-850 truncate leading-none text-zinc-400 cursor-pointer"
                    >
                      🏞️ {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 임팩트 통계 수치 관리 (Stats) */}
            <div className="space-y-4 border-t border-zinc-900 pt-5">
              <span className="block text-[11px] font-bold text-rose-300 tracking-wider uppercase">임팩트 통계 수치 관리 (STATS)</span>
              <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-850 flex gap-2 items-start text-xs mb-2">
                <Icons.Sparkles size={14} className="text-rose-300 flex-shrink-0 mt-0.5" />
                <p className="text-zinc-400 leading-relaxed">
                  메인 화면 중앙에 배치되는 3개의 핵심 통계 지표입니다. 수치(Value)와 레이블(Label)을 자유롭게 변경하여 브랜드 신뢰도를 소통하세요.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {(data.stats || []).map((stat, idx) => (
                  <div key={stat.id} className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-lg space-y-2">
                    <div className="text-[10px] font-mono font-bold text-zinc-500">INDICATOR 0{idx + 1}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-zinc-400 mb-1">핵심 수치 (예: 98%, 1위)</label>
                        <input 
                          type="text" 
                          value={stat.value}
                          onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded text-rose-300 font-bold focus:outline-none focus:border-rose-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-zinc-400 mb-1">수치 설명 (예: 재원생 수강 지속률)</label>
                        <input 
                          type="text" 
                          value={stat.label}
                          onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded text-zinc-200 focus:outline-none focus:border-rose-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 피처 섹션 관리 (핵심 역량 동적 바인더) */}
            <div className="space-y-4 border-t border-zinc-900 pt-5">
              <div className="flex justify-between items-center">
                <span className="block text-[11px] font-bold text-rose-300 tracking-wider">핵심 역량 서비스 카드 ({data.features.length})</span>
                <button 
                  onClick={handleAddFeature}
                  className="text-[10px] bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 px-2 py-1 rounded flex items-center gap-1 font-semibold"
                >
                  <Icons.Plus size={10} /> 서비스 추가
                </button>
              </div>

              <div className="space-y-4">
                {data.features.map((feat, index) => (
                  <div key={feat.id} className="p-3 bg-zinc-900/60 border border-zinc-850 rounded-lg space-y-2.5 relative">
                    <div className="flex justify-between items-center border-b border-zinc-800/80 pb-1.5">
                      <span className="text-[10px] font-mono font-bold text-zinc-500">CARD 0{index + 1}</span>
                      <button 
                        onClick={() => handleRemoveFeature(feat.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-zinc-850 transition-colors"
                        title="지우기"
                      >
                        <Icons.Trash2 size={12} />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      {/* 아이콘 수정기 */}
                      <div className="relative">
                        <button 
                          onClick={() => setShowIconSelectForFeatureId(showIconSelectForFeatureId === feat.id ? null : feat.id)}
                          className="w-9 h-9 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 flex items-center justify-center rounded text-rose-300 cursor-pointer"
                          title="아이콘 변경"
                        >
                          {React.createElement((Icons as any)[feat.iconName] || Icons.HelpCircle, { size: 16 })}
                        </button>
                        
                        {showIconSelectForFeatureId === feat.id && (
                          <div className="absolute left-0 top-10 bg-zinc-900 border border-zinc-800 p-2 rounded-lg grid grid-cols-4 gap-1 z-30 shadow-xl w-36">
                            {ICON_PRESETS.map(iconName => (
                              <button
                                key={iconName}
                                onClick={() => {
                                  handleFeatureChange(feat.id, 'iconName', iconName);
                                  setShowIconSelectForFeatureId(null);
                                }}
                                className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded flex items-center justify-center"
                              >
                                {React.createElement((Icons as any)[iconName] || Icons.HelpCircle, { size: 14 })}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 타이틀 편집 기기 */}
                      <input 
                        type="text"
                        value={feat.title}
                        onChange={(e) => handleFeatureChange(feat.id, 'title', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 text-xs p-2.5 rounded text-white font-bold"
                        placeholder="서비스명 (예: 브랜드 아이덴티티 구축)"
                      />
                    </div>

                    <textarea
                      value={feat.description}
                      onChange={(e) => handleFeatureChange(feat.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-950 border border-zinc-850 text-[11px] p-2 rounded text-zinc-400"
                      placeholder="서비스 상세 개요를 수려하게 기입해 주십시오."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. 인사이트 블로그 CMS CRUD 패글 ==================== */}
        {activeTab === 'cms' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="block text-[11px] font-bold text-rose-300 tracking-wider">포스트 관리 시스템 (CMS)</span>
              {!isCreatingNewPost && !editingPostId && (
                <button 
                  onClick={startCreateNewPost}
                  className="bg-rose-500 hover:bg-rose-600 text-black font-semibold text-[10px] px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Icons.Plus size={11} /> 새 콘텐츠 작성
                </button>
              )}
            </div>

            {/* 글 생성/수정 내부 양식 폼 */}
            {(isCreatingNewPost || editingPostId) && (
              <form onSubmit={handlePostSubmit} className="p-4 bg-zinc-900/60 border border-rose-500/20 rounded-xl space-y-4 animate-slide-up">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
                    <Icons.Edit2 size={12} /> {editingPostId ? '글 정보 수정하기' : '신규 지식 콘텐츠 포스트'}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => { setIsCreatingNewPost(false); setEditingPostId(null); clearPostForm(); }}
                    className="text-zinc-500 hover:text-white text-xs"
                  >
                    취소
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">게시글 카테고리 태그</label>
                  <input 
                    type="text"
                    value={postFormCategory}
                    onChange={(e) => setPostFormCategory(e.target.value)}
                    placeholder="Brand Insights, UI Design 등"
                    className="w-full bg-zinc-950 border border-zinc-850 text-xs p-2 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">게시글 제목</label>
                  <input 
                    type="text"
                    required
                    value={postFormTitle}
                    onChange={(e) => setPostFormTitle(e.target.value)}
                    placeholder="2026 트렌드: 뉴모더니즘 스캔..."
                    className="w-full bg-zinc-950 border border-zinc-850 text-xs p-2 rounded text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">대표 이미지 URL</label>
                  <input 
                    type="text"
                    value={postFormImage}
                    onChange={(e) => setPostFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-zinc-950 border border-zinc-850 text-[10px] p-2 rounded text-zinc-200 font-mono"
                  />
                  <div className="flex gap-1.5 mt-1">
                    <button
                      type="button"
                      onClick={() => setPostFormImage('https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80')}
                      className="text-[9px] bg-zinc-950 hover:bg-zinc-850 text-zinc-500 hover:text-white p-1 rounded"
                    >
                      샘플 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostFormImage('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80')}
                      className="text-[9px] bg-zinc-950 hover:bg-zinc-850 text-zinc-500 hover:text-white p-1 rounded"
                    >
                      샘플 2
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">포스트 요악문 (미리보기 발췌문)</label>
                  <textarea 
                    value={postFormExcerpt}
                    onChange={(e) => setPostFormExcerpt(e.target.value)}
                    rows={2}
                    placeholder="글의 매력적인 에센스를 한줄 요약해 카드 리스트 영역에 노출시킵니다."
                    className="w-full bg-zinc-950 border border-zinc-850 text-xs p-2 rounded text-zinc-300 leading-normal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">상세 원문 본문</label>
                  <textarea 
                    value={postFormContent}
                    onChange={(e) => setPostFormContent(e.target.value)}
                    rows={6}
                    placeholder="상세 정보를 독창적으로 기입하세요."
                    className="w-full bg-zinc-950 border border-zinc-850 text-xs p-2 rounded text-zinc-200 leading-relaxed font-sans"
                  />
                </div>

                {/* 발행 활성화 상태 지정 */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400">발행 노출 상태</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPostFormStatus('published')}
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${postFormStatus === 'published' ? 'bg-green-500/15 text-green-400 border border-green-500/35' : 'bg-zinc-950 text-zinc-500 border border-transparent'}`}
                    >
                      공개 발행 (Publish)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostFormStatus('draft')}
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${postFormStatus === 'draft' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/35' : 'bg-zinc-950 text-zinc-500 border border-transparent'}`}
                    >
                      임시 저장 (Draft)
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button 
                    type="submit"
                    className="bg-rose-400 hover:bg-rose-500 text-black font-semibold text-xs px-4 py-2 rounded cursor-pointer"
                  >
                    ✔ 저장 및 반영
                  </button>
                </div>
              </form>
            )}

            {/* 현재 저장된 모든 CMS 포스트 리스트 */}
            <div className="space-y-2.5">
              <span className="block text-[11px] font-bold text-zinc-400">데이터베이스 포스트 목록 ({data.posts.length})</span>
              <div className="space-y-2">
                {data.posts.map(post => (
                  <div 
                    key={post.id}
                    className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg flex items-center justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] uppercase tracking-wider font-semibold text-rose-300">{post.category}</span>
                        <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded ${post.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                          {post.status === 'published' ? '공개중' : '임시작성'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1 truncate">{post.title}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">{post.createdAt}</p>
                    </div>

                    <div className="flex gap-1">
                      <button 
                        onClick={() => startEditPost(post)}
                        className="p-1.5 bg-zinc-950 hover:bg-zinc-800 rounded border border-zinc-850 text-zinc-400 hover:text-white"
                        title="수정하기"
                      >
                        <Icons.Edit2 size={12} />
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 bg-zinc-950 hover:bg-zinc-800 rounded border border-zinc-850 text-zinc-500 hover:text-rose-400"
                        title="완전삭제"
                      >
                        <Icons.Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. SEO 및 마케팅 연동 패널 ==================== */}
        {activeTab === 'seo' && (
          <div className="space-y-6 animate-fade-in">
            {/* 가상 실시간 SEO 점수 매트릭스 */}
            <div className="p-4 bg-zinc-900 border border-zinc-850 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white">가상 SEO 마케팅 최적화 지수</span>
                <span className="text-lg font-mono font-black text-rose-300">{calculateSEOScore()}%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-400 to-green-400 transition-all duration-500" 
                  style={{ width: `${calculateSEOScore()}%` }}
                />
              </div>

              {/* 자가 검사 리스트 필드 */}
              <div className="text-[10.5px] space-y-1.5 text-zinc-400 font-sans">
                <div className="flex items-center gap-1.5">
                  <span className="text-green-400">✔</span>
                  <span>메인 타이틀 볼륨 설정 (완료)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={data.seo.metaTitle.length > 10 ? "text-green-400" : "text-zinc-650"}>
                    {data.seo.metaTitle.length > 10 ? "✔" : "○"}
                  </span>
                  <span className={data.seo.metaTitle.length > 10 ? "text-zinc-300" : "text-zinc-600"}>구체적인 포트폴리오 타이틀 메타 기입 (10글자 이상)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={data.seo.metaDescription.length > 30 ? "text-green-400" : "text-zinc-650"}>
                    {data.seo.metaDescription.length > 30 ? "✔" : "○"}
                  </span>
                  <span className={data.seo.metaDescription.length > 30 ? "text-zinc-300" : "text-zinc-600"}>메타 디스크립션 검색 노출 상세 기입 (30글자 이상)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={(data.seo.instagramLink || data.seo.kakaoLink) ? "text-green-400" : "text-zinc-650"}>
                    {(data.seo.instagramLink || data.seo.kakaoLink) ? "✔" : "○"}
                  </span>
                  <span className={(data.seo.instagramLink || data.seo.kakaoLink) ? "text-zinc-300" : "text-zinc-600"}>인스타그램 또는 카카오톡 외부 마케팅 링크 추가</span>
                </div>
              </div>
            </div>

            {/* 실제 메타 태그 입력 시스템 */}
            <div className="space-y-4">
              <span className="block text-[11px] font-bold text-rose-300 tracking-wider">포털 검색엔진 노출 (Meta Settings)</span>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">SEO 메타 타이틀 (Meta Title)</label>
                <input 
                  type="text"
                  value={data.seo.metaTitle}
                  onChange={(e) => updateSEO({ metaTitle: e.target.value })}
                  placeholder="포털 사이트 검색 창에 뜰 메인 타이틀을 적어 정하세요."
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">SEO 메타 디스크립션 (Meta Description)</label>
                <textarea 
                  value={data.seo.metaDescription}
                  onChange={(e) => updateSEO({ metaDescription: e.target.value })}
                  rows={4}
                  placeholder="네이버나 구글 등에 노출될 사이트의 핵심 설명을 정밀하게 2~3줄 기입하세요."
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded text-zinc-300 leading-relaxed"
                />
              </div>
            </div>

            {/* 외부 공유 채널 링크 (소셜 연동) */}
            <div className="space-y-4 border-t border-zinc-900 pt-5">
              <span className="block text-[11px] font-bold text-rose-300 tracking-wider">마케팅 채널 및 SNS 링크</span>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 flex items-center gap-1">
                    <Icons.MessageCircle size={12} className="text-yellow-400" /> 카카오톡 채널 상담 주소 (Kakao Link)
                  </label>
                  <input 
                    type="text"
                    value={data.seo.kakaoLink}
                    onChange={(e) => updateSEO({ kakaoLink: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded text-zinc-300 font-mono"
                    placeholder="https://pf.kakao.com/_xxxx"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 flex items-center gap-1">
                    <Icons.Instagram size={12} className="text-pink-400" /> 인스타그램 브랜드 링크 (Instagram Link)
                  </label>
                  <input 
                    type="text"
                    value={data.seo.instagramLink}
                    onChange={(e) => updateSEO({ instagramLink: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded text-zinc-300 font-mono"
                    placeholder="https://instagram.com/yourbrand"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 flex items-center gap-1">
                    <Icons.Youtube size={12} className="text-red-500" /> 유튜브 채널 연결 주소 (YouTube Link)
                  </label>
                  <input 
                    type="text"
                    value={data.seo.youtubeLink}
                    onChange={(e) => updateSEO({ youtubeLink: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded text-zinc-300 font-mono"
                    placeholder="https://youtube.com/@channel"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 flex items-center gap-1">
                    <Icons.Mail size={12} className="text-blue-400" /> 대외 메인 연락 이메일 주소
                  </label>
                  <input 
                    type="text"
                    value={data.seo.emailLink}
                    onChange={(e) => updateSEO({ emailLink: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2 rounded text-zinc-300 font-mono"
                    placeholder="hello@yourdomain.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== 5. 오프라인 정보 최적화 및 연락망 조절 ================= */}
        {activeTab === 'contact' && (
          <div className="space-y-6 animate-fade-in">
            <span className="block text-[11px] font-bold text-rose-300 tracking-wider">회사 정보 및 문의 폼 형태</span>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">문의 섹션 거부 카피 (Title)</label>
                <input 
                  type="text"
                  value={data.contact.title}
                  onChange={(e) => updateContact({ title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">섹션 정밀 요약 기획문 (Description)</label>
                <textarea 
                  value={data.contact.description}
                  onChange={(e) => updateContact({ description: e.target.value })}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded text-zinc-300 leading-normal"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1">네비게이션 본사 주소 (Address)</label>
                <input 
                  type="text"
                  value={data.contact.address}
                  onChange={(e) => updateContact({ address: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">오피스 연락 이메일</label>
                  <input 
                    type="text"
                    value={data.contact.email}
                    onChange={(e) => updateContact({ email: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded text-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">대표 번호 (Phone)</label>
                  <input 
                    type="text"
                    value={data.contact.phone}
                    onChange={(e) => updateContact({ phone: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs p-2.5 rounded text-zinc-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
                <div>
                  <span className="block text-xs font-bold text-white">실시간 간편 문의 폼 노출</span>
                  <span className="block text-[10px] text-zinc-500">문의 접수처 텍스트 필드를 보입니다.</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateContact({ showForm: !data.contact.showForm })}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${data.contact.showForm ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-zinc-900 text-zinc-500'}`}
                >
                  {data.contact.showForm ? '활성화 상태' : '숨기기'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== 6. 문의 이력 보관소 데이터베이스 모의 기능 =============== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-fade-in">
            <span className="block text-[11px] font-bold text-rose-300 tracking-wider">실시간 문의 접수 수신함 (Inquiry Sandbox)</span>
            
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-850 text-[11px] leading-relaxed text-zinc-400">
              우측 미리보기의 카디널 폼 영역에서 전송한 인바운드 문의 데이터가 즉시 LocalStorage 연결망을 통해 아래 가상 인박스에 저장됩니다!
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg relative">
                <div className="flex justify-between items-center text-[10px] text-zinc-500 border-b border-zinc-850 pb-1.5 mb-2">
                  <span className="font-mono text-rose-300 font-bold">인박스 수신 ID #24</span>
                  <span>14:15 수신</span>
                </div>
                <div className="text-xs font-bold text-white mb-1">이지은 (학부모)</div>
                <div className="text-[10px] font-mono text-zinc-400 mb-2">010-3453-2941 / jieun@naver.com</div>
                <p className="bg-zinc-950 p-2.5 rounded text-xs text-zinc-300 leading-normal">
                  중3 수학 집중 케어반 수강을 문의하고 싶습니다. 주말반이 개설되어 있는지, 그리고 평일반 시간표와 매주 개별 피드백이 어떻게 제공되는지 친절한 설명 부탁드립니다.
                </p>
              </div>

              <div className="p-3 bg-zinc-900/60 border border-zinc-850/60 rounded-lg opacity-60">
                <div className="flex justify-between items-center text-[10px] text-zinc-600 border-b border-zinc-850 pb-1.5 mb-2">
                  <span>인박스 수신 ID #23</span>
                  <span>어제 수신</span>
                </div>
                <div className="text-xs font-bold text-zinc-300 mb-1">김민준 (학생)</div>
                <div className="text-[10px] font-mono text-zinc-500 mb-2">010-9872-3553</div>
                <p className="bg-zinc-950 p-2 rounded text-xs text-zinc-400 leading-normal">
                  고등부 영어 모의고사 실전 모의반 수강 신청 자리가 아직 남아있나요? 다음 주 월요일 저녁에 수강 방문 상담 예약 가능한지 확인해 주세요.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* -------------------- 대시보드 고정 푸터 (저장 및 배포) -------------------- */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950/90 spacing-y-3 shrink-0">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button 
            type="button" 
            onClick={() => {
              setActiveTab('inquiries');
              setIsCreatingNewPost(false);
              setEditingPostId(null);
            }}
            className={`p-2 bg-zinc-900 hover:bg-zinc-850 text-[11px] rounded font-bold border border-zinc-800 hover:border-zinc-700 text-zinc-300 flex items-center justify-center gap-1`}
          >
            <Icons.Mail size={12} />
            <span>상담 수신함</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => setShowExportModal(true)}
            className="p-2 bg-zinc-900 hover:bg-zinc-850 text-[11px] rounded font-bold border border-zinc-800 hover:border-zinc-700 text-zinc-300 flex items-center justify-center gap-1"
          >
            <Icons.Download size={12} />
            <span>소스 코드 추출</span>
          </button>
        </div>

        <button 
          onClick={handlePublishMock}
          disabled={publishing}
          className="w-full bg-rose-450 text-black hover:bg-rose-500 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(255,178,167,0.25)] hover:scale-[1.01] cursor-pointer"
        >
          {publishing ? (
            <>
              <Icons.RefreshCcw className="animate-spin" size={14} />
              <span>빌드 정교화 동기화 중...</span>
            </>
          ) : (
            <>
              <Icons.Save size={14} />
              <span>브라우저 로컬 저장소 동기화</span>
            </>
          )}
        </button>
        <p className="text-[10px] text-zinc-650 text-center mt-2 font-mono">가장 완벽한 가치의 결과물은 본질의 미학에서 나옵니다.</p>
      </div>

      {/* -------------------- 소스 코드 추출 팝업 모달 영역 -------------------- */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[85%]">
            <div className="p-4 bg-zinc-950 border-b border-zinc-850 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Icons.Download size={16} className="text-rose-300" />
                <span className="text-sm font-bold text-white">크리에이티브 노코드 웹사이트 소스 코드 / 데이터 스킨 추적</span>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <Icons.X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <p className="text-zinc-400 leading-relaxed">
                현재 맞춤 렌더링된 테마 설정과 CMS 블로그 포스팅 원본 데이터를 아래 JSON 규격으로 확보 하였습니다. 본 데이터를 사용해 언제든 사이트를 그대로 복원/패키지화 제작 하실 수 있습니다.
              </p>

              <div>
                <span className="block font-mono font-bold text-rose-300 mb-1.5">[1] 빌더 백업용 메타데이터 정렬 (JSON State)</span>
                <div className="relative">
                  <pre className="bg-zinc-950 p-4 rounded-lg overflow-x-auto text-[10.5px] font-mono text-zinc-300 border border-zinc-850 select-all max-h-48 scrollbar-thin">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                      alert('JSON 백업 세팅이 성공적으로 클립보드 복사 되었습니다.');
                    }}
                    className="absolute top-2.5 right-2.5 bg-zinc-905 hover:bg-zinc-800 text-[10px] text-zinc-300 hover:text-white px-2 py-1 rounded border border-zinc-800"
                  >
                    복사
                  </button>
                </div>
              </div>

              <div>
                <span className="block font-mono font-bold text-rose-300 mb-1.5">[2] 단독 구동 포터블 HTML 컴파일 (Standalone Template)</span>
                <textarea 
                  readOnly
                  rows={6}
                  value={`<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.seo.metaTitle}</title>
    <meta name="description" content="${data.seo.metaDescription}">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: ${data.theme.backgroundColor}; color: ${data.theme.textColor}; font-family: sans-serif; }
    </style>
</head>
<body>
    <div class="max-w-4xl mx-auto px-6 py-20">
        <h1 class="text-5xl font-black mb-4" style="color: ${data.theme.primaryColor}">${data.hero.title}</h1>
        <p class="text-lg opacity-80 mt-4">${data.hero.subtitle}</p>
    </div>
</body>
</html>`}
                  className="w-full bg-zinc-950 p-3 rounded-lg text-zinc-400 font-mono text-[10px] border border-zinc-850 cursor-text select-all"
                />
              </div>
            </div>

            <div className="p-4 bg-zinc-950 border-t border-zinc-850 flex justify-between items-center text-xs">
              <span className="text-zinc-500 font-mono">Aprioct Builder standalone generator v1.2</span>
              <button 
                onClick={() => setShowExportModal(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-4 py-2 rounded"
              >
                빌더 화면으로 복귀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

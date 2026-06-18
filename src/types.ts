/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 사이트의 전체 설정을 정의하는 타입 인터페이스입니다.
export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  kakaoLink: string;
  instagramLink: string;
  youtubeLink: string;
  emailLink: string;
}

export type FontFamilyType = 'sans' | 'serif' | 'mono';
export type FontSizeBaseType = 'sm' | 'base' | 'lg';
export type BorderRadiusType = 'none' | 'md' | 'full';

export interface ThemeConfig {
  primaryColor: string;     // 예: #FFB2A7 (Apricot Pink)
  backgroundColor: string;  // 예: #000000 (Pure Black)
  textColor: string;        // 예: #FFFFFF (White)
  mutedTextColor: string;   // 예: #9CA3AF (Gray 400)
  cardBgColor: string;      // 예: #111111 (Dark Gray)
  fontFamily: FontFamilyType;
  fontSizeBase: FontSizeBaseType;
  borderRadius: BorderRadiusType;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // lucide-react 아이콘 이름
}

export interface ContactConfig {
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  showForm: boolean;
}

// 블로그 및 뉴스 포스트 (CMS) 아이템 타입
export interface CMSPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  status: 'published' | 'draft';
}

// 공부 질문 게시판 (Q&A Board) 아이템 타입
export interface BoardPost {
  id: string;
  title: string;
  author: string;
  email: string;
  content: string;
  passwordHash: string; // 확인/수정/삭제용 비밀번호 (단순 텍스트 저장)
  createdAt: string;
  replies?: string; // 학원 답변 (선택 사항)
}

// 첨부파일 및 공지사항 타입
export interface AttachmentItem {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface Notice {
  id: string;
  title: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  attachments?: AttachmentItem[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

// 전체 노코드 웹 빌더의 통합 데이터 상태 구조
export interface WebsiteData {
  seo: SEOConfig;
  theme: ThemeConfig;
  hero: HeroConfig;
  features: FeatureItem[];
  stats: StatItem[];
  contact: ContactConfig;
  posts: CMSPost[];
  boardPosts?: BoardPost[]; // 공부 질문 게시판 포스트 리스트
}

// 디바이스 미리보기 모드 설정
export type DeviceViewMode = 'desktop' | 'tablet' | 'mobile';

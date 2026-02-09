
export type PostCategory = 'NOTICE' | 'ACTIVITY' | 'SPONSORSHIP' | 'INQUIRY';

export type View = 'HOME' | 'ABOUT' | 'GALLERY' | 'NOTICES' | 'SPONSORSHIP' | 'CONTACT' | 'MEDIA';

export interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrls?: string[];
  category: PostCategory;
  author?: string; // 문의하기용 작성자명 추가
}

export interface SponsorshipAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface SiteSettings {
  siteName: string;
  slogan: string;
  primaryColor: string;
  themeBrightness: number;
  vision: string;
  mission: string;
  history: string;
  representativeGreeting: string;
  representativeName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  sponsorshipAccounts: SponsorshipAccount[];
  blogUrl7: string;
  blogUrl3: string;
  blogImage7: string;
  blogImage3: string;
}

export interface AppState {
  isAdmin: boolean;
  settings: SiteSettings;
  posts: Post[];
}

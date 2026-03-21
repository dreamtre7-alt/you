
export type PostCategory = 'SPONSORSHIP_NEWS' | 'SPONSORSHIP_REPORT' | 'NOTICES';

export type View = 'HOME' | 'ABOUT' | 'ACTIVITIES' | 'SPONSORSHIP_NEWS' | 'SPONSORSHIP_REPORT' | 'MEDIA' | 'NOTICES' | 'ADMIN';

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

export interface ActivityPhoto {
  id: string;
  title: string;
  imageUrl: string;
  date?: string;
  location?: string;
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
  representativePhoto: string;
  representativeBio: string;
  contactEmail: string;
  contactPhone: string;
  contactAddresses: string[];
  sponsorshipAccounts: SponsorshipAccount[];
  blogUrl7: string;
  blogUrl3: string;
  blogUrlMain: string;
  blogImage7: string;
  blogImage3: string;
  blogImageMain: string;
  heroImage: string;
  activityPhotos: ActivityPhoto[];
}

export interface AppState {
  isAdmin: boolean;
  settings: SiteSettings;
  posts: Post[];
}

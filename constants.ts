
import { Post, SiteSettings } from './types';

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: "꿈뜨레 지역공동체",
  slogan: "창원의 내일을 함께 심고 가꾸는 빛나는 공동체",
  primaryColor: "#5B21B6",
  themeBrightness: 100,
  vision: "모든 주민이 주인이 되어 서로를 돌보는 행복한 지역사회",
  mission: "창원시의 자생적 공동체 역량 강화와 도시 재생의 혁신을 선도합니다.",
  history: `2016.12.22 삼계대동 작은도서관 등록
2017.01.12 비영리단체 등록(마산세무서)/경남 우수봉사단체장려상수상
2018~21 운영평가 우수도서관선정/공동체활성화단체선정
2019~25 양성평등사업지원단체 선정
2021~23 우리마을 아이돌봄센터 운영
2023.05 꿈뜨레 단체명 변경 등록(삼계대동 작은도서관→꿈뜨레)
2023.11.08 꿈뜨레 지역공동체 비영리민간단체 변경등록(꿈뜨레→꿈뜨레지역공동체)
2024.02.28 창원시 다함께돌봄센터 7호점 위탁운영
2025 비영리민간단체 공익활동 지원사업 단체 선정
2026.01.01 창원시 다함께돌봄센터 3호점 위탁운영`,
  representativeGreeting: `" 함께 돌보고, 함께 살아가는 지역을 꿈꾸며 "

안녕하십니까? 지역의 일상속에서 아이와 어르신, 이웃이 함께 웃을 수 있는 공동체를 꿈꾸며 한 걸음 한 걸음 걸어온 꿈뜨레 지역공동체가 홈페이지를 통해 여러분께 인사를 드립니다.

늘 변함없는 관심과 응원으로 함께 해 주신 지역 주민 여러분께 깊은 감사를 드립니다. 꿈뜨레 지역공동체는 창원시 다함께돌봄센터 7호점을 운영하며, 아이들이 방과후에도 안전하고 따뜻한 돌봄 속에서 성장할 수 있도록 최선을 다하고 있습니다. 돌봄은 단순한 보호를 넘어 아이의 하루와 미래를 함께 책임지는 일이라는 믿음으로 배움과 쉼이 조화를 이루는 공간을 만들어가고 있습니다.

이러한 경험을 바탕으로, 2026년 1월부터는 창원시 다함께돌봄센터 3호점을 새롭게 운영하게 됩니다. 이는 꿈뜨레 지역공동체에게 또 하나의 책임이자 지역사회로부터 받은 신뢰의 결과라고 생각하며 더 많은 아이들과 가정이 질 높은 돌봄을 누릴 수 있도록 현장의 목소리에 더욱 귀 기울이겠습니다.

꿈뜨레 지역공동체는 양성평등사업, 비영리민간단체공익활동지원사업을 통해 세대와 세대를 잇고, 존중과 배려가 살아 있는 공동체문화를 만들어가고 있습니다. 앞으로도 꿈뜨레 지역공동체는 돌봄이 필요한 곳에 따뜻한 손길을 내밀고, 배움이 필요한 곳에 열린 마음으로 다가가며, 연대가 필요한 곳에 책임있는 주체로 서서, 아이가 안전하게 자라고, 어르신이 존중받으며, 이웃이 서로를 살피는 지속 가능한 지역사회를 향한 길을 흔들림 없이 걸어가겠습니다.

2025년 12월 20일`,
  representativeName: "이한기",
  contactEmail: "dreamtre7@gmail.com",
  contactPhone: "055-232-5412",
  contactAddress: "경상남도 창원시 마산회원구 내서읍 삼계6길40",
  sponsorshipAccounts: [
    { bankName: "경남은행", accountNumber: "207-0209-3456-04", accountHolder: "창원시 다함께돌봄센터 7호점" },
    { bankName: "농협은행", accountNumber: "계좌 준비 중", accountHolder: "꿈뜨레" },
    { bankName: "국민은행", accountNumber: "계좌 준비 중", accountHolder: "꿈뜨레" }
  ],
  blogUrl7: "https://m.blog.naver.com/zaminan",
  blogUrl3: "https://blog.naver.com/dadol3-5664",
  blogUrlMain: "https://blog.naver.com/dreamtr7",
  blogImage7: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
  blogImage3: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
  blogImageMain: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800"
};

export const INITIAL_POSTS: Post[] = [];

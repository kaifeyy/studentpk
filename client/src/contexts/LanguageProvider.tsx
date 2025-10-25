import { createContext, useContext, useState } from "react";

type Language = "en" | "ur";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Landing
    "landing.tagline": "Pakistan's Digital Campus",
    "landing.student": "Join as Student",
    "landing.admin": "Join as School Admin",
    "landing.subtitle": "Connect with students, share notes, and stay updated with your school community",
    
    // Navigation
    "nav.home": "Home",
    "nav.notes": "Notes",
    "nav.school": "School",
    "nav.profile": "Profile",
    
    // Feed
    "feed.school": "School",
    "feed.public": "Public",
    "feed.trending": "Trending",
    "feed.whatsOnMind": "What's on your mind?",
    "feed.post": "Post",
    "feed.noPostsYet": "No posts yet",
    "feed.startConversation": "Be the first to start a conversation",
    
    // Common
    "common.search": "Search",
    "common.logout": "Logout",
    "common.settings": "Settings",
    "common.edit": "Edit",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.loading": "Loading...",
  },
  ur: {
    // Landing
    "landing.tagline": "پاکستان کا ڈیجیٹل کیمپس",
    "landing.student": "طالب علم کے طور پر شامل ہوں",
    "landing.admin": "اسکول ایڈمن کے طور پر رجسٹر کریں",
    "landing.subtitle": "طلباء سے منسلک ہوں، نوٹس شیئر کریں، اور اپنی اسکول کمیونٹی کے ساتھ اپ ڈیٹ رہیں",
    
    // Navigation
    "nav.home": "ہوم",
    "nav.notes": "نوٹس",
    "nav.school": "اسکول",
    "nav.profile": "پروفائل",
    
    // Feed
    "feed.school": "اسکول",
    "feed.public": "عوامی",
    "feed.trending": "ٹرینڈنگ",
    "feed.whatsOnMind": "آپ کے ذہن میں کیا ہے؟",
    "feed.post": "پوسٹ",
    "feed.noPostsYet": "ابھی تک کوئی پوسٹ نہیں",
    "feed.startConversation": "بات چیت شروع کرنے والے پہلے شخص بنیں",
    
    // Common
    "common.search": "تلاش کریں",
    "common.logout": "لاگ آؤٹ",
    "common.settings": "ترتیبات",
    "common.edit": "ترمیم",
    "common.save": "محفوظ کریں",
    "common.cancel": "منسوخ کریں",
    "common.delete": "حذف کریں",
    "common.loading": "لوڈ ہو رہا ہے...",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("language");
    return (stored as Language) || "en";
  });

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ur" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

import type { Metadata, Viewport } from "next";
import { Inter, Newsreader, Noto_Serif_Devanagari, Tiro_Devanagari_Sanskrit } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { MobileNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { SettingsSync } from "@/components/settings-sync";
import { SearchProvider } from "@/components/search/search-provider";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
});
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const tiro = Tiro_Devanagari_Sanskrit({
  subsets: ["devanagari", "latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-tiro-sa",
  display: "swap",
});
const noto = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-deva",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Indian Philosophy OS — explore the ideas of Indian thought",
    template: "%s · Indian Philosophy OS",
  },
  description:
    "A connected, source-first way to explore Indian philosophy — questions, concepts, traditions, texts and thinkers — with the complete Bhagavad Gita and Sadhak Sanjivani.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5efe3" },
    { media: "(prefers-color-scheme: dark)", color: "#13110e" },
  ],
};

// Runs before first paint: apply saved theme + reader scale so there is no flash.
const bootScript = `(function(){try{var s=JSON.parse(localStorage.getItem('gita.v1')||'{}').settings||{};var d=document.documentElement;if(s.theme==='dark'||s.theme==='light')d.dataset.theme=s.theme;if(s.scale)d.style.setProperty('--reader-scale',String(s.scale));if(s.explain==='hi')d.dataset.explain='hi';d.dataset.level=s.level||'standard';var sh=s.show||{};if(sh.sa===false)d.setAttribute('data-hide-sa','');if(sh.iast!==true)d.setAttribute('data-hide-iast','');if(sh.hi===false)d.setAttribute('data-hide-hi','');if(sh.en===false)d.setAttribute('data-hide-en','');}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${newsreader.variable} ${inter.variable} ${tiro.variable} ${noto.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <SearchProvider>
          <SettingsSync />
          <SiteHeader />
          <main id="main" className="flex-1 pb-24 lg:pb-0">
            {children}
          </main>
          <SiteFooter />
          <MobileNav />
        </SearchProvider>
      </body>
    </html>
  );
}

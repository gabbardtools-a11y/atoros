import type { MetadataRoute } from 'next';

const BASE_URL = 'https://atoros.ru';

// Static routes with priorities and update frequencies
const routes: Array<{
  path: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastmod?: string;
}> = [
  // Main page
  { path: '/', priority: 1.0, changefreq: 'weekly' },

  // Key service pages
  { path: '/services', priority: 0.9, changefreq: 'monthly' },
  { path: '/tariffs', priority: 0.9, changefreq: 'monthly' },
  { path: '/verify', priority: 0.9, changefreq: 'monthly' },
  { path: '/registry', priority: 0.9, changefreq: 'daily' },

  // Legal & analytical (high SEO value)
  { path: '/legal-force', priority: 0.9, changefreq: 'monthly' },
  { path: '/laws', priority: 0.9, changefreq: 'monthly' },
  { path: '/blockchain-critique', priority: 0.9, changefreq: 'monthly' },
  { path: '/blockchain', priority: 0.8, changefreq: 'monthly' },
  { path: '/proof-court', priority: 0.8, changefreq: 'monthly' },
  { path: '/registration', priority: 0.8, changefreq: 'monthly' },
  { path: '/know-how', priority: 0.7, changefreq: 'monthly' },
  { path: '/trademark', priority: 0.7, changefreq: 'monthly' },
  { path: '/contracts', priority: 0.7, changefreq: 'monthly' },
  { path: '/what-is-not-protected', priority: 0.7, changefreq: 'monthly' },
  { path: '/consultation', priority: 0.7, changefreq: 'monthly' },

  // Deposit types
  { path: '/deposit-text', priority: 0.8, changefreq: 'monthly' },
  { path: '/deposit-music', priority: 0.8, changefreq: 'monthly' },
  { path: '/deposit-photo', priority: 0.8, changefreq: 'monthly' },
  { path: '/deposit-code', priority: 0.8, changefreq: 'monthly' },
  { path: '/deposit-design', priority: 0.8, changefreq: 'monthly' },
  { path: '/deposit-video', priority: 0.8, changefreq: 'monthly' },

  // For whom
  { path: '/for-designers', priority: 0.7, changefreq: 'monthly' },
  { path: '/for-developers', priority: 0.7, changefreq: 'monthly' },
  { path: '/for-musicians', priority: 0.7, changefreq: 'monthly' },
  { path: '/for-photographers', priority: 0.7, changefreq: 'monthly' },
  { path: '/for-writers', priority: 0.7, changefreq: 'monthly' },
  { path: '/for-business', priority: 0.7, changefreq: 'monthly' },

  // Services & features
  { path: '/publish', priority: 0.7, changefreq: 'monthly' },
  { path: '/claim', priority: 0.7, changefreq: 'monthly' },
  { path: '/anti-piracy', priority: 0.7, changefreq: 'monthly' },
  { path: '/block-piracy', priority: 0.7, changefreq: 'monthly' },
  { path: '/international', priority: 0.7, changefreq: 'monthly' },
  { path: '/marketplace', priority: 0.7, changefreq: 'monthly' },
  { path: '/protection-business', priority: 0.7, changefreq: 'monthly' },
  { path: '/protection-startup', priority: 0.7, changefreq: 'monthly' },

  // Info & content
  { path: '/blog', priority: 0.8, changefreq: 'weekly' },
  { path: '/blog/torrent-killer-feature', priority: 0.8, changefreq: 'monthly' },
  { path: '/blog/blockchain-critique-preview', priority: 0.7, changefreq: 'monthly' },
  { path: '/info', priority: 0.7, changefreq: 'monthly' },
  { path: '/cases', priority: 0.7, changefreq: 'monthly' },
  { path: '/reviews', priority: 0.6, changefreq: 'monthly' },

  // Contacts & legal
  { path: '/contacts', priority: 0.6, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.4, changefreq: 'yearly' },
  { path: '/terms', priority: 0.4, changefreq: 'yearly' },

  // Auth
  { path: '/auth/login', priority: 0.3, changefreq: 'yearly' },
  { path: '/auth/register', priority: 0.5, changefreq: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString().split('T')[0];

  return routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: r.lastmod ?? now,
    changeFrequency: r.changefreq,
    priority: r.priority,
  }));
}

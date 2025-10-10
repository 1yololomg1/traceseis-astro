/**
 * Scraper utilities for mirroring pages from https://www.traceseis.com
 *
 * Responsibilities
 * - Fetch remote HTML with a friendly User-Agent
 * - Extract meaningful main content from common WordPress selectors
 * - Rewrite links and media to work inside our mirrored Astro site
 * - Return SEO data (title, description) and sanitized HTML
 */
import { load, CheerioAPI } from 'cheerio';

const REMOTE_ORIGIN = 'https://www.traceseis.com';

/** Mapping of remote pathnames to local routes inside this Astro site */
const routeMap: Record<string, string> = {
  '/': '/',
  '/services/': '/services',
  '/software/': '/software',
  '/partners-page/': '/partners',
  '/about-traceseis/': '/about',
  '/contact-us-2/': '/contact',
  '/resources/': '/resources',
};

/**
 * Fetch remote HTML content
 */
async function fetchRemoteHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'TraceSeisMirrorBot/1.0 (+https://www.traceseis.com)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return await response.text();
}

/**
 * Try to select the main content element from a WordPress page.
 * Falls back to <body> if none of the selectors are found.
 */
function selectMainContent($: CheerioAPI) {
  const candidates = [
    'main',
    '#content',
    '#primary',
    '.site-content',
    '.content-area',
    'article .entry-content',
    '.entry-content',
  ];
  for (const selector of candidates) {
    const el = $(selector);
    if (el.length && el.text().trim().length > 40) return el.first();
  }
  return $('body');
}

/**
 * Normalize and rewrite links and media sources within the selected content.
 */
function rewriteLinksAndMedia($: CheerioAPI, baseUrl: URL) {
  // Helper to map remote absolute URL to local route if known
  const toLocalRoute = (href: string): string | null => {
    try {
      const u = new URL(href, baseUrl);
      if (u.origin !== REMOTE_ORIGIN) return null; // external to remote; keep absolute
      // Ensure pathname ends with slash to match map keys
      const normalized = u.pathname.endsWith('/') ? u.pathname : `${u.pathname}/`;
      if (routeMap[normalized] !== undefined) return routeMap[normalized];
      // Unknown internal path: keep absolute back to remote
      return null;
    } catch {
      return null;
    }
  };

  // Rewrite anchors
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    if (href.startsWith('#')) return; // anchor in-page
    // Convert protocol-relative URLs
    const resolvedHref = href.startsWith('//') ? `${baseUrl.protocol}${href}` : href;

    // If relative path, resolve against base
    let local = toLocalRoute(resolvedHref);
    if (!local && href.startsWith('/')) {
      const absolute = new URL(href, baseUrl).toString();
      local = toLocalRoute(absolute);
    }
    if (local) {
      $(el).attr('href', local);
    } else {
      // Ensure absolute to remote for other internal relative links
      try {
        const abs = new URL(resolvedHref, baseUrl).toString();
        $(el).attr('href', abs);
        $(el).attr('rel', 'noopener');
        $(el).attr('target', '_blank');
      } catch {
        // leave as-is
      }
    }
  });

  // Rewrite image src and srcset to absolute remote URLs
  const absolutizeSrc = (value?: string) => {
    if (!value) return value;
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) return value;
    try {
      return new URL(value, baseUrl).toString();
    } catch {
      return value;
    }
  };

  $('img[src]').each((_, el) => {
    const src = $(el).attr('src');
    $(el).attr('src', absolutizeSrc(src));
    $(el).attr('loading', 'lazy');
    $(el).attr('decoding', 'async');
  });

  // Handle srcset (multiple URLs)
  $('[srcset]').each((_, el) => {
    const srcset = $(el).attr('srcset');
    if (!srcset) return;
    const rewritten = srcset
      .split(',')
      .map(part => {
        const [url, descriptor] = part.trim().split(/\s+/);
        return [absolutizeSrc(url), descriptor].filter(Boolean).join(' ');
      })
      .join(', ');
    $(el).attr('srcset', rewritten);
  });

  // Remove scripts for safety
  $('script').remove();

  // Remove WordPress edit/share UI if present
  $('.edit-link, .sharedaddy, .jp-sharing-input-touch').remove();
}

/**
 * Extracts minimal SEO data from a page head.
 */
function extractSeo($: CheerioAPI): { title: string; description: string } {
  const title = ($('title').first().text() || 'TraceSeis').trim();
  const description = (
    $('meta[name="description"]').attr('content') ||
    'TraceSeis provides geoscience solutions through services, consulting and software.'
  ).trim();
  return { title, description };
}

/**
 * Scrape a remote page and return sanitized HTML and SEO metadata.
 * Errors are handled gracefully to avoid breaking static builds.
 */
export async function scrapeRemotePage(sourceUrl: string): Promise<{ title: string; description: string; html: string }> {
  const baseUrl = new URL(sourceUrl);
  try {
    const html = await fetchRemoteHtml(sourceUrl);
    const $ = load(html);
    const seo = extractSeo($);
    const contentEl = selectMainContent($);
    rewriteLinksAndMedia($, new URL('/', REMOTE_ORIGIN));
    const serialized = contentEl.html() ?? '';
    return { title: seo.title, description: seo.description, html: serialized };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const fallbackTitle = 'TraceSeis';
    const fallbackDesc = 'Mirror preview. Visit the live site for full content.';
    const fallbackHtml = `
      <div class="card">
        <p>We could not load content from the live site right now.</p>
        <p><a href="${sourceUrl}" target="_blank" rel="noopener">Open on traceseis.com</a></p>
        <p class="muted">${message}</p>
      </div>
    `;
    return { title: fallbackTitle, description: fallbackDesc, html: fallbackHtml };
  }
}

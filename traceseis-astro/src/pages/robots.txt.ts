/**
 * robots.txt – allow all and point to sitemap
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const site = (import.meta as any).env.SITE || 'https://www.traceseis.com';
  const body = `User-agent: *\nAllow: /\nSitemap: ${site.replace(/\/$/, '')}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

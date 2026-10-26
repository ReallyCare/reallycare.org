import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postPath, excerpt } from '../lib/blog';

// Served at the old Hexo feed URL so existing subscribers keep working
export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'ReallyCare CIC',
    description: 'News and thinking from ReallyCare CIC',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.description ?? excerpt(p, 300),
      link: postPath(p),
    })),
  });
}

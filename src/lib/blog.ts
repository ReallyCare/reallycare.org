import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

const pad = (n: number) => String(n).padStart(2, '0');

/** Old Hexo permalink: /:year/:month/:day/:title/ */
export function postPath(post: Post) {
  const d = post.data.date;
  return `/${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())}/${post.id}/`;
}

export async function getPosts() {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function postDate(post: Post) {
  return post.data.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Plain-text excerpt for listings and meta descriptions */
/** Listing summary: the description if it says something, otherwise an excerpt */
export function summary(post: Post) {
  const d = post.data.description;
  return d && d.length > 40 ? d : excerpt(post);
}

export function excerpt(post: Post, length = 180) {
  const text = (post.body ?? '')
    .replace(/^#.*$/gm, '') // headings would run into the first sentence
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > length ? text.slice(0, text.lastIndexOf(' ', length)) + '…' : text;
}

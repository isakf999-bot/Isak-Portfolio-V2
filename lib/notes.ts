import fs from "node:fs";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/components";

const ROOT = path.join(process.cwd(), "content", "write");

export type NoteMeta = {
  slug: string;
  title: string;
  date: string;
  minutes: number;
  lede: string;
};

function files(): string[] {
  return fs
    .readdirSync(ROOT)
    .filter((name) => name.endsWith(".mdx"))
    .sort()
    .reverse();
}

export function noteSlugs(): string[] {
  return files().map((name) => name.replace(/\.mdx$/, ""));
}

export async function listNotes(): Promise<NoteMeta[]> {
  const notes = await Promise.all(noteSlugs().map((slug) => getNote(slug)));
  return notes
    .filter((note): note is NonNullable<typeof note> => Boolean(note))
    .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1))
    .map((note) => note.meta);
}

export async function getNote(slug: string) {
  const file = path.join(ROOT, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, "utf8");
  const { content, frontmatter } = await compileMDX<Omit<NoteMeta, "slug">>({
    source,
    options: { parseFrontmatter: true },
    components: mdxComponents,
  });
  return {
    content,
    meta: {
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      minutes: frontmatter.minutes,
      lede: frontmatter.lede,
    } satisfies NoteMeta,
  };
}

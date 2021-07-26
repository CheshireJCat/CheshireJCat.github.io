import fs from "fs";
import matter from "gray-matter";
import path from "path";
import remark from "remark";
import html from "remark-html";
import highlight from "remark-highlight.js";

const blogsDir = path.join(process.cwd(), "blogs");

export function getSortedBlogsData(): Blog[] {
  const fileNames = fs.readdirSync(blogsDir);
  const allBlogsData: Blog[] = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(blogsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    const data = matterResult.data;
    return {
      id,
      ...data,
    };
  });
  return allBlogsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllBlogIds() {
  const fileNames = fs.readdirSync(blogsDir);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getBlogData(id: string): Promise<Blog> {
  const fullPath = path.join(blogsDir, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(highlight)
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  return {
    id,
    content: contentHtml,
    ...matterResult.data,
  };
}

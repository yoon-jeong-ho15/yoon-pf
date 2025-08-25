import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import breaks from "remark-breaks";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import { Blog, BlogData, Category } from "../definitions";

const blogsDirectory = path.join(process.cwd(), "blogs");

export function getCategoryTree(): {
  categories: Category[];
  categoryMap: { [key: string]: Category };
} {
  const allFolders: string[] = [];
  const _getAllFolders = (dirPath: string) => {
    const files = fs.readdirSync(dirPath);

    files.forEach(function (file) {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        if (file.startsWith("_")) return;
        allFolders.push(fullPath);
        _getAllFolders(fullPath);
      }
    });
  };

  _getAllFolders(blogsDirectory);

  const nodeMap = new Map<string, Category>();
  allFolders.forEach((folderPath) => {
    const relativePath = path.relative(blogsDirectory, folderPath);
    const pathSegments = relativePath.split(path.sep);
    const files = fs.readdirSync(folderPath);
    const blogs: Blog[] = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const title = file.replace(/\.md$/, "");
        const id = relativePath + "/" + title;
        const fullPath = path.join(folderPath, file);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);

        return {
          id,
          title,
          ...(matterResult.data as { date: string; tags: string[] }),
        };
      });

    nodeMap.set(relativePath, {
      path: pathSegments,
      name: path.basename(folderPath),
      children: [],
      blogs,
    });
  });

  const roots: Category[] = [];
  nodeMap.forEach((node, key) => {
    const parentPath = path.dirname(key);
    if (parentPath === ".") {
      roots.push(node);
    } else {
      const parentNode = nodeMap.get(parentPath);
      if (parentNode) {
        parentNode.children.push(node);
      }
    }
  });

  const categoryMapObject = Object.fromEntries(nodeMap);

  return { categories: roots, categoryMap: categoryMapObject };
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      if (file.startsWith("_")) return;
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      if (file.endsWith(".md")) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

export function getSortedBlogData(
  query: string,
  currentPage: number,
  blogsPerPage: number = 12
) {
  const filePaths = getAllFiles(blogsDirectory);

  const allBlogsData = filePaths.map((filePath) => {
    const id = path.relative(blogsDirectory, filePath).replace(/\.md$/, "");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const matterResult = matter(fileContents);
    const title = id.substring(id.lastIndexOf("/") + 1);
    const blogPath = id.split(path.sep);
    blogPath.pop();

    return {
      id,
      title,
      ...(matterResult.data as { date: string; tags: string[] }),
      path: blogPath,
    };
  });

  const sortedblogs = allBlogsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  const filteredBlogs = query
    ? sortedblogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query.toLowerCase()) ||
          blog.path.join("/").toLowerCase().includes(query.toLowerCase())
      )
    : sortedblogs;

  const startIndex = (currentPage - 1) * blogsPerPage;
  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + blogsPerPage
  );
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return {
    blogs: paginatedBlogs,
    totalPages,
    totalBlogs: filteredBlogs.length,
  };
}

export function getAllBlogIds() {
  const filePaths = getAllFiles(blogsDirectory);

  return filePaths.map((filePath) => {
    const id = path.relative(blogsDirectory, filePath).replace(/\.md$/, "");
    return {
      params: {
        id: id.split(path.sep),
      },
    };
  });
}

export async function getBlogData(id: string[]) {
  const decodedId = id.map((segment) => decodeURIComponent(segment));
  const fullPath = path.join(blogsDirectory, ...decodedId) + ".md";
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(breaks)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(matterResult.content);

  const contentHTML = processedContent.toString();
  const title = decodedId[decodedId.length - 1];

  return {
    id: decodedId.join("/"),
    title,
    contentHTML,
    ...(matterResult.data as { date: string; tags: string[] }),
  } as BlogData;
}

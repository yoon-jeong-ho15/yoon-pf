import fs from "fs";
import Path from "path";
import matter from "gray-matter";
import {
  Note,
  NoteFrontmatter,
  Domain,
  Subject,
  Series,
  CategoryFrontmatter,
} from "@/types";

const STUDY_NOTES_PATH = Path.join(process.cwd(), "md", "study-notes");

export function getDomains(): Domain[] {
  const files = fs
    .readdirSync(STUDY_NOTES_PATH)
    .filter((file) => !file.startsWith(".") && !file.startsWith("_"));

  const domains = files.map((file) => {
    const path = Path.join(STUDY_NOTES_PATH, file);
    return getDomain(path);
  });

  return domains;
}

function getDomain(path: string): Domain {
  const files = fs
    .readdirSync(path)
    .filter((file) => !file.startsWith(".") && !file.startsWith("_"));

  const currentSlug = Path.relative(STUDY_NOTES_PATH, path).split(Path.sep);
  const { indexPath, notePaths, folderPaths } = splitPath(files, path);
  const index = getIndex(indexPath);
  const notes = getNotes(notePaths);
  const subjects = folderPaths.map((folderPath) => getSubject(folderPath));

  return {
    frontmatter: index.frontmatter,
    description: index.description,
    slug: currentSlug,
    subjects,
    notes,
  };
}

function getSubject(path: string): Subject {
  const files = fs
    .readdirSync(path)
    .filter((file) => !file.startsWith(".") && !file.startsWith("_"));

  const currentSlug = Path.relative(STUDY_NOTES_PATH, path).split(Path.sep);
  const { indexPath, notePaths, folderPaths } = splitPath(files, path);
  const index = getIndex(indexPath);
  const notes = getNotes(notePaths);
  const series = folderPaths.map((folderPath) => getSeries(folderPath));

  return {
    frontmatter: index.frontmatter,
    description: index.description,
    slug: currentSlug,
    series,
    notes,
  };
}

function getSeries(path: string): Series {
  const files = fs
    .readdirSync(path)
    .filter((file) => !file.startsWith(".") && !file.startsWith("_"));

  const currentSlug = Path.relative(STUDY_NOTES_PATH, path).split(Path.sep);
  const { indexPath, notePaths } = splitPath(files, path);
  const index = getIndex(indexPath);
  const notes = getNotes(notePaths);

  return {
    frontmatter: index.frontmatter,
    description: index.description,
    slug: currentSlug,
    notes,
  };
}

function splitPath(files: string[], path: string) {
  let indexFile = files.find((file) => file.endsWith("index.md"));
  if (!indexFile) {
    const defaultIndexContent = `---
title: ${Path.basename(path)}
---
`;
    const newIndexPath = Path.join(path, "index.md");
    fs.writeFileSync(newIndexPath, defaultIndexContent);
    indexFile = "index.md";
  }
  const indexPath = Path.join(path, indexFile);

  const notePaths = files
    .filter((file) => file !== "index.md" && file.endsWith(".md"))
    .map((file) => Path.join(path, file));

  const folderPaths = files
    .filter((file) => file !== "index.md" && !file.endsWith(".md"))
    .map((file) => Path.join(path, file));

  return { indexPath, notePaths, folderPaths };
}

function getIndex(indexPath: string) {
  const { data, content } = matter(fs.readFileSync(indexPath, "utf8"));

  return {
    frontmatter: data as CategoryFrontmatter,
    description: content as string,
  };
}

function getNotes(notePaths: string[]): Note[] {
  return notePaths.map((path) => {
    const { data, content } = matter(fs.readFileSync(path, "utf8"));
    const slug = Path.relative(STUDY_NOTES_PATH, path)
      .replace(/\.md$/, "")
      .split(Path.sep);

    return {
      frontmatter: {
        ...data,
        date:
          data.date instanceof Date
            ? data.date.toISOString().split("T")[0]
            : data.date,
      } as NoteFrontmatter,
      slug,
      body: content,
    };
  });
}

export function getAllSlugs(): string[][] {
  const domains = getDomains();
  const slugs: string[][] = [];

  for (const domain of domains) {
    for (const note of domain.notes) slugs.push(note.slug);
    for (const subject of domain.subjects) {
      slugs.push(subject.slug);
      for (const note of subject.notes) slugs.push(note.slug);
      for (const series of subject.series) {
        slugs.push(series.slug);
        for (const note of series.notes) slugs.push(note.slug);
      }
    }
  }

  return slugs;
}

export function getAllNotes(): {
  frontmatter: NoteFrontmatter;
  slug: string[];
}[] {
  const domains = getDomains();
  const allNotes: { frontmatter: NoteFrontmatter; slug: string[] }[] = [];

  for (const domain of domains) {
    allNotes.push(...domain.notes);
    for (const subject of domain.subjects) {
      allNotes.push(...subject.notes);
      for (const series of subject.series) {
        allNotes.push(...series.notes);
      }
    }
  }

  return allNotes;
}

import { cache } from "react";

export const getCachedDomains = cache(() => getDomains());

export function getNoteBySlug(slug: string[]): {
  type: "domain" | "subject" | "series" | "note";
  data: {
    category: Domain | Subject | Series;
    note?: Note;
  };
} {
  const domains = getCachedDomains();
  const slugStr = slug.join("/");

  for (const domain of domains) {
    if (domain.slug.join("/") === slugStr) {
      return { type: "domain", data: { category: domain } };
    }
    const domainNote = domain.notes.find((n) => n.slug.join("/") === slugStr);
    if (domainNote) {
      return { type: "note", data: { category: domain, note: domainNote } };
    }

    for (const subject of domain.subjects) {
      if (subject.slug.join("/") === slugStr) {
        return { type: "subject", data: { category: subject } };
      }
      const subjectNote = subject.notes.find(
        (n) => n.slug.join("/") === slugStr,
      );
      if (subjectNote) {
        return { type: "note", data: { category: subject, note: subjectNote } };
      }

      for (const series of subject.series) {
        if (series.slug.join("/") === slugStr) {
          return { type: "series", data: { category: series } };
        }
        const seriesNote = series.notes.find(
          (n) => n.slug.join("/") === slugStr,
        );
        if (seriesNote) {
          return { type: "note", data: { category: series, note: seriesNote } };
        }
      }
    }
  }

  throw new Error(`File not found for path : ${slugStr}`);
}

export function getSubjectNotesBySlug(slug: string[]): Note[] {
  const domains = getCachedDomains();
  const slugStr = slug.join("/");
  const allNotes: Note[] = [];

  for (const domain of domains) {
    for (const subject of domain.subjects) {
      if (subject.slug.join("/") === slugStr) {
        allNotes.push(...subject.notes);
        for (const series of subject.series) {
          allNotes.push(...series.notes);
        }
      }
    }
  }

  return allNotes;
}

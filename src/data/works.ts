export interface WorkItem {
  title: string;
  year?: string;
  image: string;
}

export const WORKS: WorkItem[] = [
  {
    title: "또도가스",
    year: "2024",
    image: "/works/yoon.png",
  },
  {
    title: "화장실금연",
    year: "2023",
    image: "/works/nonsmoking.png",
  },
];

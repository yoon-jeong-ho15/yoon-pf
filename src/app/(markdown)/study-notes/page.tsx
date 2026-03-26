const ITEMS_PER_PAGE = 10;

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  return <div className="flex-1 flex flex-col min-h-screen"></div>;
}

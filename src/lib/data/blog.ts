import { supabase } from "../supabase";
import type {
  Blog,
  BlogInsertData,
  BlogUpdateData,
  Category,
  CategoryWithDetail,
} from "../definitions";

export async function fetchBlogs(query: string, currentPage: number) {
  const offset = (currentPage - 1) * 25;
  const { data, error } = await supabase
    .from("v_all_blog")
    .select("*")
    .or(`title.like.%${query}`)
    .eq("status", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + 24);
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return data as Blog[];
  }
}

export async function fetchBlogById(id: number) {
  const { data, error } = await supabase.from("blog").select("*").eq("id", id);

  if (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch the board");
  } else {
    return data[0] as Blog;
  }
}

export async function fetchCategories() {
  const { data, error } = await supabase.from("blog_category").select("*");
  if (error) {
    console.error("error fetching categories", error);
  } else {
    const categoryMap = new Map(
      data.map((item) => [item.id, { ...item, children: [] }])
    );
    // console.log(categoryMap);

    const categories: Category[] = [];

    // 객체 참조(Object Reference)
    for (const item of data) {
      if (item.parent_id) {
        const parent = categoryMap.get(item.parent_id);
        parent.children.push(categoryMap.get(item.id)!);
      } else {
        // 이 때 map에 들어있는 객체의 주소값을 넣어준다.
        // 그래서 다음 반복에 배열의 객체에 직접 자식을 넣어주지 않고,
        // Map에 있는 객체에 넣어줘도 배열 안의 객체에도 똑같이 자식이 들어가게 되는것.
        categories.push(categoryMap.get(item.id)!);
      }
    }

    return categories;
  }
}

export async function fetchCategoriesWithDetail() {
  const { data, error } = await supabase.from("v_blog_category").select("*");
  if (error) {
    console.error("error fetching categories with detail", error);
  } else {
    const categoryMap = new Map<number, CategoryWithDetail>();
    const categories: CategoryWithDetail[] = [];

    for (const item of data) {
      if (!categoryMap.has(item.id)) {
        const category: CategoryWithDetail = {
          id: item.id,
          name: item.name,
          parent_id: item.parent_id,
          level: item.level,
          description: item.description,
          children: [],
        };
        if (item.blog_id) {
          const blog = {
            blog_id: item.blog_id,
            blog_title: item.blog_title,
            blog_keyword: item.blog_keyword,
          };
          category.blog = [blog];
        }
        categoryMap.set(item.id, category);
      } else {
        if (item.blog_id) {
          const blog = {
            blog_id: item.blog_id,
            blog_title: item.blog_title,
            blog_keyword: item.blog_keyword,
          };
          const category = categoryMap.get(item.id)!;
          if (category.blog) {
            category.blog.push(blog);
          } else {
            category.blog = [blog];
          }
        }
      }
    }

    for (const category of categoryMap.values()) {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children?.push(category);
        }
      } else {
        categories.push(category);
      }
    }

    return categories;
  }
}

export async function insertBlog(data: BlogInsertData) {
  const { error } = await supabase.from("blog").insert({
    title: data.title,
    content: JSON.parse(data.content),
    category_id: data.category_id,
    length: data.length,
  });
  if (error) {
    console.error("Error inserting Data : ", error);
  }
}

export async function updateBlog(data: BlogUpdateData) {
  const { error } = await supabase
    .from("blog")
    .update({
      title: data.title,
      content: JSON.parse(data.content),
      updated_at: "now()",
      length: data.length,
    })
    .eq("id", data.id);
  if (error) {
    return error;
  }
}

export async function updateBlogStatus(id: number) {
  // console.log("deleting : ", id);
  const { error } = await supabase
    .from("blog")
    .update({
      status: false,
    })
    .eq("id", id);
  if (error) {
    return error;
  }
}

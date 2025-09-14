import React, { useEffect, useState } from 'react';

// 1. Define TypeScript interfaces
interface BlogPost {
  id: number;
  title: string;
  content: string;
}

interface BlogApiResponse {
  posts: BlogPost[];
}

// 2. Fetch function (simulating asynchronous API)
async function fetchBlogPosts(): Promise<BlogApiResponse> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate API response
  return {
    posts: [
      { id: 1, title: 'First Post', content: 'This is the first post.' },
      { id: 2, title: 'Second Post', content: 'This is the second post.' },
      { id: 3, title: 'Third Post', content: 'This is the third post.' },
    ],
  };
}

const BlogHome: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchBlogPosts()
      .then((resp) => {
        if (isMounted) {
          setPosts(resp.posts);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError('Failed to load blog posts.');
          setLoading(false);
        }
      });

    // Race condition cleanup
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1>Utkrusht Blog</h1>
      {loading && <p>Loading blog posts...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                marginBottom: 24,
                borderBottom: '1px solid #eee',
                paddingBottom: 16,
              }}
            >
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </li>
          ))}
          {posts.length === 0 && <p>No blog posts to display.</p>}
        </ul>
      )}
    </main>
  );
};

export default BlogHome;

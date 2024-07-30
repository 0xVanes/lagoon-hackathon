// pages/post/[id].js
import { useRouter } from 'next/router';

export default function Post({ post }) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch a list of posts from an API or file system
  const res = await fetch('https://example.com/api/posts');
  const posts = await res.json();

  // Generate the paths for each post
  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // Fetch the data for a single post based on the id
  const res = await fetch(`https://example.com/api/posts/${params.id}`);
  const post = await res.json();

  return {
    props: {
      post,
    },
  };
}

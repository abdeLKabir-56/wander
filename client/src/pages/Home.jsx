import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { ReactTyped } from "react-typed";
export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className='flex font-lexend flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
      <ReactTyped
        className='text-3xl font-bold lg:text-6xl '
        strings={[
          "Hi, I'm Wander ",
          
        ]}
        typeSpeed={30}
        backSpeed={50}
        loop
      />
        <p className='font-lexend text-slate-500 ${lexend.classname} font-medium sm:font-semibold text-base sm:text-lg'>
        Welcome to our Travel Blog! Here you'll find a variety of articles and guides on traveling, covering everything from destination highlights and travel tips to itineraries and cultural insights. Whether you're an experienced globetrotter or planning your first adventure, we have something for everyone. Dive in and start exploring the world with us!
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
      </div>
      

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

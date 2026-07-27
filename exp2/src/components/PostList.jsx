import { memo } from "react";
import { useSelector } from "react-redux";
import { selectAllPosts } from "../features/posts/postsSlice";
import { selectAllPlatforms } from "../features/platforms/platformsSlice";
import { PLATFORMS } from "../platformConfig";
import "./PostList.css";

/**
 * PostList component wrapped with React.memo to prevent unnecessary re-renders
 * Only re-renders when selectAllPosts or selectAllPlatforms selectors return new references
 */
const PostList = memo(function PostList() {
  const posts = useSelector(selectAllPosts);
  const platforms = useSelector(selectAllPlatforms);

  return (
    <div className="post-list-card">
      <h2>Published Posts</h2>
      {posts.length === 0 ? (
        <p className="empty-state">No posts yet. Create one to see it here.</p>
      ) : (
        <div className="post-list-grid">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-header">
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <p>{post.text}</p>
              <div className="post-tags">
                {post.platformIds.map((pid) => (
                  <span key={pid} className="post-tag">
                    {PLATFORMS[pid]?.icon} {PLATFORMS[pid]?.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
});

export default PostList;

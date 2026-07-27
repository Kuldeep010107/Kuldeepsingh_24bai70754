import { useDispatch, useSelector } from "react-redux";
import PostComposer from "./components/PostComposer";
import PostList from "./components/PostList";
import { selectPostCount, selectPostStats, clearAllPosts } from "./features/posts/postsSlice";
import "./App.css";

export default function App() {
  const dispatch = useDispatch();
  // Using memoized selector for post count - prevents unnecessary recomputation
  const postCount = useSelector(selectPostCount);
  // Using memoized selector for statistics - derived state
  const postStats = useSelector(selectPostStats);

  const handleClearAllPosts = () => {
    if (window.confirm("Are you sure you want to delete all posts? This cannot be undone.")) {
      dispatch(clearAllPosts());
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1>Redux Toolkit Experiment</h1>
            <p>Centralized state for posts, platforms, and drafts.</p>
            <p className="performance-note">🚀 Optimized with Memoized Selectors & Derived State</p>
          </div>
          <div className="post-counter">
            <div className="counter-badge">{postCount}</div>
            <p className="counter-label">Posts Created</p>
            {postCount > 0 && (
              <div className="platform-stats">
                <div className="stat">🐦 {postStats.twitter}</div>
                <div className="stat">📘 {postStats.facebook}</div>
                <div className="stat">📸 {postStats.instagram}</div>
                <div className="stat">💼 {postStats.linkedin}</div>
              </div>
            )}
          </div>
        </div>
        <div className="storage-info-container">
          <div className="storage-info">
            <strong>📦 Posts Storage:</strong> Redux Store (state.posts) with memoized selectors
            {postCount > 0 && (
              <span className="stats-detail">
                • Avg Length: {postStats.avgContentLength} chars • Media: {postStats.hasMedia}
              </span>
            )}
          </div>
          {postCount > 0 && (
            <button className="clear-btn" onClick={handleClearAllPosts}>
              🗑️ Clear All Posts
            </button>
          )}
        </div>
      </header>
      <main className="app-main">
        <PostComposer />
        <PostList />
      </main>
    </div>
  );
}

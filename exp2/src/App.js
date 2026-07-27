import PostComposer from "./components/PostComposer";
import PostList from "./components/PostList";
import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Redux Toolkit Experiment</h1>
        <p>Centralized state for posts, platforms, and drafts.</p>
      </header>
      <main className="app-main">
        <PostComposer />
        <PostList />
      </main>
    </div>
  );
}

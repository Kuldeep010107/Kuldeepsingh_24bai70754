import { createAsyncThunk, createEntityAdapter, createSlice, createSelector } from "@reduxjs/toolkit";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const mockInitialPosts = [
  {
    id: "post-1",
    text: "Launching our new content planner today!",
    platformIds: ["twitter", "facebook"],
    media: ["cover.jpg"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "post-2",
    text: "Ready to build scalable apps with Redux Toolkit.",
    platformIds: ["linkedin"],
    media: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export const fetchMockPosts = createAsyncThunk(
  "posts/fetchMockPosts",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return mockInitialPosts;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: postsAdapter.getInitialState({
    status: "idle",
    error: null,
    draft: {
      text: "",
      platformIds: [],
      media: [],
    },
  }),
  reducers: {
    setDraftText(state, action) {
      state.draft.text = action.payload;
    },
    setDraftPlatforms(state, action) {
      state.draft.platformIds = action.payload;
    },
    setDraftMedia(state, action) {
      state.draft.media = action.payload;
    },
    clearDraft(state) {
      state.draft = { text: "", platformIds: [], media: [] };
    },
    addPost(state, action) {
      const post = {
        ...action.payload,
        id: `post-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      postsAdapter.addOne(state, post);
    },
    clearAllPosts(state) {
      postsAdapter.removeAll(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMockPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMockPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchMockPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  setDraftText,
  setDraftPlatforms,
  setDraftMedia,
  clearDraft,
  addPost,
  clearAllPosts,
} = postsSlice.actions;

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);

export const selectDraft = (state) => state.posts.draft;
export const selectPostStatus = (state) => state.posts.status;
export const selectPostError = (state) => state.posts.error;

// ===== MEMOIZED SELECTORS FOR PERFORMANCE OPTIMIZATION =====

/**
 * Memoized selector to get post count
 * This prevents unnecessary recomputation when other state changes
 */
export const selectPostCount = createSelector(
  [selectAllPosts],
  (posts) => posts.length
);

/**
 * Memoized selector to get posts grouped by platform
 * Returns object with platform keys and arrays of posts as values
 */
export const selectPostsByPlatform = createSelector(
  [selectAllPosts],
  (posts) => {
    const grouped = {
      twitter: [],
      facebook: [],
      instagram: [],
      linkedin: [],
    };

    posts.forEach((post) => {
      post.platformIds.forEach((platformId) => {
        if (grouped[platformId]) {
          grouped[platformId].push(post);
        }
      });
    });

    return grouped;
  }
);

/**
 * Memoized selector to compute post statistics
 * Derived state showing counts per platform and total
 */
export const selectPostStats = createSelector(
  [selectAllPosts, selectPostsByPlatform],
  (allPosts, byPlatform) => ({
    total: allPosts.length,
    twitter: byPlatform.twitter.length,
    facebook: byPlatform.facebook.length,
    instagram: byPlatform.instagram.length,
    linkedin: byPlatform.linkedin.length,
    avgContentLength:
      allPosts.length > 0
        ? Math.round(allPosts.reduce((sum, p) => sum + p.text.length, 0) / allPosts.length)
        : 0,
    hasMedia: allPosts.filter((p) => p.media.length > 0).length,
  })
);

/**
 * Memoized selector to get filtered posts by platform
 */
export const selectPostsByPlatformId = (platformId) =>
  createSelector([selectAllPosts], (posts) =>
    posts.filter((post) => post.platformIds.includes(platformId))
  );

/**
 * Memoized selector for filtering posts by text search
 */
export const selectPostsBySearch = (searchTerm) =>
  createSelector([selectAllPosts], (posts) => {
    if (!searchTerm.trim()) return posts;
    const term = searchTerm.toLowerCase();
    return posts.filter((post) => post.text.toLowerCase().includes(term));
  });

export default postsSlice.reducer;

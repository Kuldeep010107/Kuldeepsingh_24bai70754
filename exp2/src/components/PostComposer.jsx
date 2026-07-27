import { useEffect, useMemo, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validate, PLATFORMS } from "../platformConfig";
import {
  addPost,
  clearDraft,
  fetchMockPosts,
  selectDraft,
  selectPostStatus,
  setDraftMedia,
  setDraftPlatforms,
  setDraftText,
} from "../features/posts/postsSlice";
import PlatformSelector from "./PlatformSelector";
import CharCounter from "./CharCounter";
import MediaUploader from "./MediaUploader";
import ValidationPanel from "./ValidationPanel";
import "./PostComposer.css";

/**
 * PostComposer component wrapped with React.memo
 * Uses useCallback to memoize event handlers and prevent unnecessary re-renders of child components
 * Leverages useMemo for expensive validation computations
 */
const PostComposer = memo(function PostComposer() {
  const dispatch = useDispatch();
  const draft = useSelector(selectDraft);
  const status = useSelector(selectPostStatus);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMockPosts());
    }
  }, [dispatch, status]);

  // Memoized handlers using useCallback to prevent unnecessary child re-renders
  const handleTextChange = useCallback((e) => {
    dispatch(setDraftText(e.target.value));
  }, [dispatch]);

  const handlePlatformChange = useCallback((val) => {
    dispatch(setDraftPlatforms(val));
  }, [dispatch]);

  const handleMediaChange = useCallback((files) => {
    dispatch(setDraftMedia(files));
  }, [dispatch]);

  // Memoized validation - computed only when dependencies change
  const { errors, warnings } = useMemo(
    () => validate(draft.text, draft.media, draft.platformIds),
    [draft.text, draft.media, draft.platformIds]
  );

  const hasErrors = Object.keys(errors).length > 0;
  const canPost = draft.platformIds.length > 0 && draft.text.trim().length > 0 && !hasErrors;

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    if (!canPost) return;

    dispatch(
      addPost({
        text: draft.text,
        platformIds: draft.platformIds,
        media: draft.media,
      })
    );
    dispatch(clearDraft());
  }, [canPost, dispatch, draft.text, draft.platformIds, draft.media]);

  return (
    <div className="composer-card">
      <h2 className="composer-title">Create Post</h2>
      <form onSubmit={handleSubmit}>
        <PlatformSelector selected={draft.platformIds} onChange={handlePlatformChange} />

        <div className="field-group">
          <label className="field-label">Content</label>
          <textarea
            className="composer-textarea"
            placeholder="What's on your mind?"
            value={draft.text}
            onChange={handleTextChange}
            rows={6}
          />
          <CharCounter text={draft.text} selectedPlatforms={draft.platformIds} />
        </div>

        <MediaUploader files={draft.media} onChange={handleMediaChange} />

        <ValidationPanel errors={errors} warnings={warnings} />

        <button type="submit" className="post-btn" disabled={!canPost}>
          {draft.platformIds.length === 0
            ? "Select a platform to post"
            : hasErrors
            ? "Fix errors to post"
            : "Publish Post"}
        </button>
      </form>
    </div>
  );
});

export default PostComposer;

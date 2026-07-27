import { useMemo } from "react";
import { PLATFORMS } from "../platformConfig";
import "./CharCounter.css";

export default function CharCounter({ text, selectedPlatforms }) {
  const summary = useMemo(() => {
    const trimmed = text.trim();
    const selected = selectedPlatforms.map((id) => PLATFORMS[id]).filter(Boolean);
    const counts = selected.map((platform) => ({
      id: platform.id,
      label: platform.name,
      remaining: platform.limit - trimmed.length,
    }));
    return counts;
  }, [text, selectedPlatforms]);

  if (selectedPlatforms.length === 0) {
    return <div className="char-summary">Select a platform to view limits.</div>;
  }

  return (
    <div className="char-summary">
      {summary.map((platform) => (
        <div key={platform.id}>{platform.label}: {platform.remaining} chars left</div>
      ))}
    </div>
  );
}

import { memo } from "react";
import { PLATFORMS } from "../platformConfig";
import "./PlatformSelector.css";

/**
 * PlatformSelector wrapped with React.memo
 * Only re-renders when selected or onChange props change
 */
const PlatformSelector = memo(function PlatformSelector({ selected, onChange }) {
  const toggle = (platformId) => {
    // If the platform is already selected, deselect it
    // Otherwise, select only this platform (replace any previous selection)
    onChange(
      selected.includes(platformId)
        ? []
        : [platformId]
    );
  };

  return (
    <div className="platform-selector">
      <label className="field-label">Publish to</label>
      <div className="platform-list">
        {Object.values(PLATFORMS).map((platform) => (
          <button
            key={platform.id}
            type="button"
            className={`platform-btn ${selected.includes(platform.id) ? "active" : ""}`}
            onClick={() => toggle(platform.id)}
          >
            <span className="platform-icon">{platform.icon}</span>
            {platform.name}
          </button>
        ))}
      </div>
    </div>
  );
});

export default PlatformSelector;

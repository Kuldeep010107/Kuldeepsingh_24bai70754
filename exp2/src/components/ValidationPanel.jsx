import { PLATFORMS } from "../platformConfig";
import "./ValidationPanel.css";

export default function ValidationPanel({ errors, warnings }) {
  const hasErrors = Object.keys(errors).length > 0;
  const hasWarnings = Object.keys(warnings).length > 0;

  if (!hasErrors && !hasWarnings) return null;

  return (
    <div className="validation-panel">
      {hasErrors && (
        <div className="validation-section errors">
          <strong>❌ Errors</strong>
          {Object.entries(errors).map(([platformId, items]) => (
            <div key={platformId} className="validation-group">
              <span className="v-platform">{PLATFORMS[platformId]?.name}</span>
              {items.map((item, index) => (
                <div className="v-msg" key={index}>{item}</div>
              ))}
            </div>
          ))}
        </div>
      )}
      {hasWarnings && (
        <div className="validation-section warnings">
          <strong>⚠️ Warnings</strong>
          {Object.entries(warnings).map(([platformId, items]) => (
            <div key={platformId} className="validation-group">
              <span className="v-platform">{PLATFORMS[platformId]?.name}</span>
              {items.map((item, index) => (
                <div className="v-msg" key={index}>{item}</div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

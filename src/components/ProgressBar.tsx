type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <footer
      className="progress-bar"
      aria-label={`Slide ${current} of ${total}`}
    >
      <span className="progress-track">
        <span style={{ width: `${(current / total) * 100}%` }} />
      </span>
      <span className="progress-count">
        <strong>{String(current).padStart(2, "0")}</strong>
        <span>/ {String(total).padStart(2, "0")}</span>
      </span>
    </footer>
  );
}

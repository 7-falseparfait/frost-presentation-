type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <footer
      className="progress-bar"
      role="progressbar"
      aria-label="Presentation progress"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
    >
      <span className="progress-track">
        <span style={{ width: `${(current / total) * 100}%` }} />
      </span>
    </footer>
  );
}

type CodeBlockProps = {
  code: string;
  label?: string;
  output?: string;
  outputLabel?: string;
};

export function CodeBlock({ code, label, output, outputLabel }: CodeBlockProps) {
  return (
    <figure className="code-block">
      {label && <figcaption>{label}</figcaption>}
      <pre>
        <code>{code}</code>
      </pre>
      {output && (
        <div className="code-output">
          <span>{outputLabel ?? "Output"}</span>
          <pre>
            <code>{output}</code>
          </pre>
        </div>
      )}
    </figure>
  );
}

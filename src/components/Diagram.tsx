type DiagramProps = {
  type:
    | "single-key"
    | "frost-network"
    | "wallet-recipe"
    | "frost-resolution"
    | "todo";
  label?: string;
};

function Node({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="diagram-node">
      <strong>{name}</strong>
      <span>{detail}</span>
    </div>
  );
}

export function Diagram({ type, label }: DiagramProps) {
  if (type === "frost-resolution") {
    return (
      <div
        className="diagram frost-resolution-diagram"
        aria-label="FROST threshold signing benefits"
      >
        {label && <div className="diagram-label">{label}</div>}
        <div className="frost-definition">
          <strong>FROST</strong>
          <span>Flexible Round-Optimized Schnorr Threshold Signatures</span>
        </div>
        <div className="frost-resolution-flow">
          <div className="frost-resolution-card">
            <strong>OFF-CHAIN AGGREGATION</strong>
            <span>
              2-of-3 threshold math runs between hardware devices before
              broadcast.
            </span>
          </div>
          <div className="frost-resolution-arrow" aria-hidden="true">
            →
          </div>
          <div className="frost-resolution-card">
            <strong>TAPROOT INTEGRATION</strong>
            <code>tr(FrostGroupXpub)</code>
            <span>
              Standard output descriptors. The spend looks like a single-key
              output on-chain.
            </span>
          </div>
          <div className="frost-resolution-arrow" aria-hidden="true">
            →
          </div>
          <div className="frost-resolution-card">
            <strong>SINGLE-SIG EFFICIENCY</strong>
            <span>
              Same low transaction size, low fees, and privacy footprint as a
              standard single-signature spend.
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "wallet-recipe") {
    return (
      <div className="diagram recipe-diagram" aria-label="Wallet recipe flow">
        {label && <div className="diagram-label">{label}</div>}
        <div className="recipe-inputs">
          <span>keys</span>
          <span>derivation paths</span>
          <span>spending policy</span>
          <span>output type</span>
        </div>
        <div className="recipe-connector" aria-hidden="true">
          <span>+</span>
          <span>+</span>
          <span>+</span>
          <i />
        </div>
        <div className="recipe-node">DESCRIPTOR</div>
        <div className="recipe-arrow" aria-hidden="true">
          ↓
        </div>
        <div className="recipe-node recipe-output">ADDRESSES</div>
      </div>
    );
  }

  if (type === "todo") {
    return (
      <div
        className="diagram diagram-placeholder"
        aria-label="Diagram placeholder"
      >
        <span>DIAGRAM / TODO</span>
      </div>
    );
  }

  return (
    <div
      className="diagram comparison-diagram"
      aria-label="Comparison of a single key and FROST shares"
    >
      {label && <div className="diagram-label">{label}</div>}
      <div className="diagram-column single-key-column">
        <span className="diagram-overline">TRADITIONAL SINGLE KEY</span>
        <Node name="ONE PRIVATE KEY" detail="complete signing secret" />
        <div className="diagram-arrow">↓</div>
        <Node name="ONE POINT OF FAILURE" detail="one compromise" />
      </div>
      <div className="diagram-divider" aria-hidden="true" />
      <div className="diagram-column frost-column">
        <span className="diagram-overline">FROST</span>
        <div className="participant-list">
          <Node name="Alice" detail="signing share" />
          <Node name="Bob" detail="signing share" />
          <Node name="Carol" detail="signing share" />
        </div>
        <div className="diagram-arrow">↓</div>
        <Node name="2-of-3" detail="threshold signing" />
        <div className="diagram-arrow">↓</div>
        <Node name="ONE SIGNATURE" detail="normal-looking spend" />
      </div>
    </div>
  );
}

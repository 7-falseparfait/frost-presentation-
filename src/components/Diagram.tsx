type DiagramProps = {
  type:
    | "single-key"
    | "frost-network"
    | "wallet-recipe"
    | "frost-resolution"
    | "taproot-tweak"
    | "taproot-paths"
    | "frost-taproot-bridge"
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

  if (type === "taproot-tweak") {
    return (
      <div
        className="diagram taproot-tweak-diagram"
        aria-label="Taproot key tweak flow"
      >
        {label && <div className="diagram-label">{label}</div>}
        <div className="taproot-tweak-step">
          <strong>FROST DKG JOINT KEY (P)</strong>
          <span>x-only internal key</span>
        </div>
        <div className="taproot-tweak-arrow" aria-hidden="true">
          ↓
        </div>
        <div className="taproot-tweak-step">
          <strong>COMPUTE TAPROOT TWEAK</strong>
          <code>t = Hash_TapTweak(P || merkle_root)</code>
        </div>
        <div className="taproot-tweak-arrow" aria-hidden="true">
          ↓
        </div>
        <div className="taproot-tweak-step taproot-tweak-math">
          <strong>APPLY CURVE ADDITION</strong>
          <code>Q = P + t·G</code>
        </div>
        <div className="taproot-tweak-arrow" aria-hidden="true">
          ↓
        </div>
        <div className="taproot-tweak-step">
          <strong>32-BYTE OUTPUT KEY (Q)</strong>
          <span>x-only Taproot output key</span>
        </div>
        <div className="taproot-tweak-arrow" aria-hidden="true">
          ↓
        </div>
        <div className="taproot-tweak-step taproot-tweak-address">
          <strong>P2TR ADDRESS</strong>
          <code>bc1p... · Regtest / Mainnet</code>
        </div>
      </div>
    );
  }

  if (type === "taproot-paths") {
    return (
      <div
        className="diagram taproot-paths-diagram"
        aria-label="Taproot key path and script path comparison"
      >
        {label && <div className="diagram-label">{label}</div>}
        <section className="taproot-path-card taproot-key-path">
          <span>01 / KEY PATH</span>
          <strong>Signature for output key Q</strong>
          <p>One Schnorr signature. The committed script tree stays hidden.</p>
          <code>key spend</code>
        </section>
        <section className="taproot-path-card">
          <span>02 / SCRIPT PATH</span>
          <strong>Execute a committed condition</strong>
          <p>
            Reveal the selected script and witness data when this path is used.
          </p>
          <code>script + witness</code>
        </section>
      </div>
    );
  }

  if (type === "frost-taproot-bridge") {
    return (
      <div
        className="diagram frost-taproot-bridge"
        aria-label="FROST threshold signing into a Taproot key-path spend"
      >
        {label && <div className="diagram-label">{label}</div>}
        <div className="frost-bridge-flow">
          <section className="frost-bridge-step">
            <span>OFF-CHAIN / POLICY</span>
            <strong>2 of 3 shares</strong>
            <p>Alice + Bob sign; Carol is not required.</p>
          </section>
          <span className="frost-bridge-arrow" aria-hidden="true">
            →
          </span>
          <section className="frost-bridge-step">
            <span>INTERACTIVE / FROST</span>
            <strong>Threshold rounds</strong>
            <p>Shares combine into one valid Schnorr signature.</p>
          </section>
          <span className="frost-bridge-arrow" aria-hidden="true">
            →
          </span>
          <section className="frost-bridge-step frost-bridge-result">
            <span>ON-CHAIN / KEY PATH</span>
            <strong>One signature for Q</strong>
            <p>Standard-looking P2TR spend; no quorum script revealed.</p>
          </section>
        </div>
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

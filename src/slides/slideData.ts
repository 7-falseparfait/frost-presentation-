export type SlideKind = "title" | "content" | "placeholder" | "comparison";

export type SlideData = {
  id: number;
  section: string;
  kind: SlideKind;
  title: string;
  subtitle?: string;
  supportingText?: string;
  supportingNote?: string;
  kicker?: string;
  content?: string[];
  comparison?: {
    dimension: string;
    traditional: string;
    frost: string;
  }[];
  quote?: string;
  code?: string;
  codeLabel?: string;
  output?: string;
  outputLabel?: string;
  image?: { src: string; alt: string; caption?: string };
  diagram?:
    | "single-key"
    | "frost-network"
    | "wallet-recipe"
    | "frost-resolution"
    | "taproot-tweak"
    | "todo";
  diagramLabel?: string;
  speakerNotes: string;
};

export const slides: SlideData[] = [
  {
    id: 1,
    section: "Opening",
    kind: "title",
    kicker: "Bitcoin developer talk",
    title: "Frostsnap:\nBeyond Single Signers",
    subtitle: "FROST, threshold signing, and spending Bitcoin with Taproot",
    speakerNotes: `Today we're talking about Frostsnap, but before we get into Frostsnap itself, we're going to start with FROST.

We'll look at how FROST changes the way multiple people can sign, and eventually spend, Bitcoin.

We'll also briefly look at how it works and how it differs from the traditional multisig approach we're used to, where the spending conditions are expressed directly in the Bitcoin script.`,
  },
  {
    id: 2,
    section: "The problem",
    kind: "content",
    kicker: "01 / The problem",
    title: "One key, one point of failure",
    subtitle: "Signing authority does not have to live in one place.",
    quote: "Signing authority is distributed across participant shares.",
    diagram: "single-key",
    diagramLabel: "A different trust model",
    speakerNotes: `A few months ago, we saw what happened with COLDCARD and the seed-generation issue.

The problem wasn't someone remotely taking over the device. The problem was that affected firmware could generate weak seeds, which meant an attacker could recover the corresponding private keys offline.

With a traditional single-key setup, control ultimately comes down to one private key. If that key is compromised, you've got a single point of failure.

FROST changes that model. Signing authority is distributed across participant shares, so two of three participants can cooperate without any one participant holding the complete private key.

When FROST is used with a Taproot key-path spend, the blockchain sees a normal-looking Taproot key-path spend, not three separate signatures and not the word FROST in the transaction.

This is not an argument that hardware wallets are bad. Hardware wallets provide important protections. The point is that a single signer concentrates trust in one device, one implementation, and potentially one vendor.

Open source helps, but it does not automatically make an implementation secure. We still have to ask whether it can be verified, reproduced, and isolated when it fails.

With compatible implementations, a threshold quorum could also distribute trust across vendors. FROST does not make devices interoperable automatically; implementations still need compatible protocol rules, identifiers, ciphersuites, and key-package handling.

The goal is not simply to have multiple devices. The goal is to reduce concentrated trust.`,
  },
  {
    id: 16,
    section: "The problem",
    kind: "content",
    kicker: "01b / The problem",
    title: "The trust surface is bigger than the key",
    subtitle:
      "One device can concentrate hardware, firmware, entropy, and vendor risk.",
    code: `device
  + implementation
  + entropy
  + vendor
          |
          v
    concentrated trust`,
    codeLabel: "Security model",
    speakerNotes: `Hardware wallets are extremely useful, but a single signer asks us to trust more than a private key.

We trust the physical device, the firmware, the cryptographic implementation, the entropy source, and the vendor's build and supply chain.

Open source helps because we can inspect the code, but open source does not automatically mean secure. We still have to ask whether the implementation can be verified and reproduced.

This is why compatible implementations from different vendors are interesting. FROST does not make those devices interoperable automatically, but a threshold quorum can reduce the consequences of one vendor or one implementation failing.

The goal is not simply to have more devices. The goal is to reduce concentrated trust.`,
  },
  {
    id: 3,
    section: "Foundations",
    kind: "content",
    kicker: "02 / Foundations",
    title: "Multisig distributes authority",
    subtitle:
      "A 2-of-3 policy means one lost or compromised key does not decide the wallet's fate.",
    code: `2-of-3

Alice
Bob
Carol

Any 2 can spend`,
    codeLabel: "Bitcoin spending policy",
    speakerNotes: `With a single signer, one private key controls the Bitcoin. Multisig distributes that authority across multiple keys.

In a 2-of-3 policy, Alice, Bob, and Carol each control one key. Any two can satisfy the spending policy. Losing one key does not automatically lose the funds, and compromising one key does not automatically give an attacker spend authority.

This solves the single-signer problem, but it introduces a new engineering problem: every participant must agree on exactly how the wallet is constructed.`,
  },
  {
    id: 4,
    section: "Foundations",
    kind: "content",
    kicker: "03 / Foundations",
    title: "Multisig needs a precise wallet recipe",
    subtitle:
      "It is not enough to keep the keys. The wallet also needs to know how those keys are supposed to work together.",
    supportingText:
      "In a multisig setup, this recovery information has to be coordinated and backed up alongside the keys.",
    diagram: "wallet-recipe",
    diagramLabel: "Wallet coordination layer",
    speakerNotes: `Multisig participants need to coordinate the keys, derivation paths, spending policy, and output type that describe the same wallet.

A descriptor is a precise wallet recipe. Descriptors are not unique to multisig, but multisig makes the coordination burden more noticeable because multiple keys and wallet details all have to produce the same addresses.

Recovery therefore needs more than the private keys. The recipe has to be coordinated and backed up alongside them.`,
  },
  {
    id: 5,
    section: "Foundations",
    kind: "content",
    kicker: "04 / Foundations",
    title: "FROST resolves the multisig tradeoff",
    subtitle: "Moving Threshold Math Off-Chain",
    diagram: "frost-resolution",
    diagramLabel: "Flexible Round-Optimized Schnorr Threshold Signatures",
    speakerNotes: `FROST stands for Flexible Round-Optimized Schnorr Threshold Signatures.

It resolves the main legacy multisig tradeoff by doing the threshold signing math off-chain. In a 2-of-3 setup, the participating hardware devices coordinate before broadcast and produce one Schnorr signature.

With Taproot integration, the wallet can use a standard output descriptor such as tr(FrostGroupXpub). To chain analysis and Bitcoin nodes, the spend is indistinguishable from a single-key output: the threshold coordination does not appear on-chain.

That keeps the transaction size, fees, and privacy footprint of a standard single-signature spend while distributing signing authority across devices.`,
  },
  {
    id: 6,
    section: "Protocol",
    kind: "content",
    kicker: "05 / Protocol",
    title: "Trusted dealer or DKG?",
    subtitle:
      "Both create a 2-of-3 group. Only DKG removes the dealer from the trust model.",
    code: `let (max_signers, min_signers) = (3, 2);

  let (shares, group_public_key) =
    frost::keys::generate_with_dealer(
      max_signers,
      min_signers,
      IdentifierList::Default,
      rng,
    )?;`,
    codeLabel: "Rust / Trusted dealer setup",
    output: `2-of-3 threshold configured
  Alice, Bob, and Carol receive one share each
  One group public key is returned`,
    outputLabel: "What this creates",
    speakerNotes: `This is the simplest way to introduce the shape of the system: three participants, two required signers, and one common group public key.

  This particular API uses a trusted dealer. The dealer creates the shares and must deliver each secret share securely, then should not retain the signing material. That is different from DKG, where Alice, Bob, and Carol jointly create the shares and no dealer ever holds the whole secret.

  The important audience-level point is that this is not one private key split into three text fragments. Each participant gets a signing share, while the group gets one public verification key.`,
  },
  {
    id: 6,
    section: "Protocol",
    kind: "content",
    kicker: "05 / Protocol",
    title: "What the output means",
    subtitle:
      "Keep the useful cryptographic signal. Hide the serialization noise and every signing share.",
    code: `GROUP PUBLIC KEY
  verifying_key:
    0331393186b9ff65d77586cf93762b96d3433aab91832fd5345661888aab2ad5ac

  VERIFYING SHARES
  Alice  035507ad3da1bd897db4b8bc4901281da12c5dd789f27aa915880058d6c33b2f35
  Bob    02532e45e939d1303c941b1f3392ead6467ac6f55f3314682dc1bfce8a2a1511b4
  Carol  032608f3fb9ee02fa348faa83dc1be6d80bdfb04ccd73b9aba75c70419b05edacb`,
    codeLabel: "PublicKeyPackage / the part worth showing",
    output: `Alice signing share: <redacted>
  Bob signing share:   <redacted>
  Carol signing share: <redacted>

  All participants agree on the same group key.`,
    outputLabel: "Program output",
    speakerNotes: `The raw Rust output contains headers, ciphersuite types, identifiers, commitments, and serialized values. We do not need to read all of that on stage.

  The useful distinction is simple: the PublicKeyPackage contains the group verifying key and public verification shares. The KeyPackage contains one participant's private signing share. The redacted values are not placeholders to reveal; they are the material that must remain with that participant.

  The group verifying key is a compressed secp256k1 public key. To use it with Taproot, the integration takes its x-only form as the internal key and applies the Taproot tweak to derive the output key. So it is Taproot-compatible as an input to that conversion, not itself the final P2TR output key.`,
  },
  {
    id: 7,
    section: "Protocol",
    kind: "content",
    kicker: "06 / Protocol",
    title: "FROST signing flow",
    subtitle: "Fresh nonces first. Signature shares second.",
    code: `let (alice_nonces, alice_commitments) =
    frost::round1::commit(
        alice_key_package.signing_share(),
        rng,
    );`,
    codeLabel: "Rust / Round 1",
    output: `Alice created her signing nonces and commitments.
Bob created his signing nonces and commitments.`,
    outputLabel: "Program output",
    speakerNotes: `Alice and Bob are the two signers for this 2-of-3 session. Each uses their private signing share and fresh randomness to create private nonces and public commitments.

The nonces are session-specific and must never be reused. The commitments can be shared. Those commitments are collected with the message to create a SigningPackage, which describes this exact signing session.`,
  },
  {
    id: 8,
    section: "Protocol",
    kind: "content",
    kicker: "07 / Protocol",
    title: "The final Schnorr signature",
    subtitle:
      "Shares combine into one signature that verifies under the group key.",
    code: `let group_signature =
    frost::aggregate(
        &signing_package,
        &signature_shares,
        &alice_pubkey_package,
    )?;`,
    codeLabel: "Rust / Aggregate",
    output: `=== FINAL GROUP SIGNATURE ===
Signature(...)
Signature verified successfully!`,
    outputLabel: "Program output",
    speakerNotes: `Round 2 creates one signature share per signer. A signature share is not the final signature; it is one participant's contribution for this message and this signing package.

The aggregate function combines Alice's and Bob's shares into one Schnorr signature. The PublicKeyPackage provides the group verifying key. Verification checks the message, the final signature, and that common group key.`,
  },
  {
    id: 9,
    section: "Comparison",
    kind: "comparison",
    kicker: "08 / Comparison",
    title: "FROST vs traditional multisig",
    comparison: [
      {
        dimension: "Policy",
        traditional: "Enforced on-chain via Bitcoin Script",
        frost: "Enforced off-chain via threshold math",
      },
      {
        dimension: "Coordination",
        traditional: "Asynchronous PSBT passing",
        frost: "Interactive signing rounds; interactive DKG setup",
      },
      {
        dimension: "Privacy",
        traditional: "Leaky: exposes all public keys and script rules",
        frost: "Looks like a standard single-key Taproot spend (tr())",
      },
      {
        dimension: "On-chain footprint",
        traditional:
          "Large and expensive: multiple keys and signatures in the script path",
        frost: "Small and cheap: same key-path signature size as single-sig",
      },
    ],
    speakerNotes: `Traditional script multisig encodes the spending policy in Bitcoin Script. The witness reveals the script and participating public keys, and the script-path spend is larger than a single-signature key-path spend.

FROST keeps the threshold policy in the signing process. Participants coordinate interactively to produce one Schnorr signature, and a Taproot key-path spend looks like a standard single-key spend on-chain. DKG is an interactive setup step; signing also requires interactive rounds.`,
  },
  {
    id: 10,
    section: "Taproot",
    kind: "content",
    kicker: "09 / Taproot",
    title: "Taproot & Key Tweaking",
    subtitle:
      "Converting the abstract FROST joint key P into a valid Bitcoin Taproot Output Key Q.",
    supportingNote:
      "A raw FROST key is P. Only use dangerous_assume_tweaked when the FROST-TR ciphersuite has already produced Q.",
    diagram: "taproot-tweak",
    diagramLabel: "From FROST group key to P2TR address",
    code: `fn create_taproot_address(
    group_pubkey_package: &frost::keys::PublicKeyPackage,
) -> Result<bitcoin::Address, Box<dyn std::error::Error>> {
    let frost_key_bytes = group_pubkey_package.verifying_key().serialize()?;
    let bitcoin_pubkey = bitcoin::secp256k1::PublicKey::from_slice(&frost_key_bytes)?;
    let (x_only_key, _parity) = bitcoin_pubkey.x_only_public_key();

    // Valid only when the FROST-TR ciphersuite has already produced Q.
    let output_key = bitcoin::key::TweakedPublicKey::dangerous_assume_tweaked(x_only_key);
    let address = bitcoin::Address::p2tr_tweaked(
        output_key,
        bitcoin::address::KnownHrp::Regtest,
    );

    Ok(address)
}`,
    codeLabel: "Rust / FROST-TR output key to regtest address",
    speakerNotes: `Taproot does not use the untweaked FROST group key directly as the output key. The x-only internal key P is tweaked with the TapTweak hash and optional script-tree merkle root, producing Q = P + tG.

The Rust example is specifically for an integration where the FROST-TR ciphersuite has already incorporated the Taproot tweak and its verifying key represents Q. dangerous_assume_tweaked only changes the type's interpretation; it does not calculate the tweak. With a generic FROST key P, calculate the BIP341 tweak and derive Q before constructing the address.

The resulting P2TR address encodes the 32-byte x-only output key. The example uses Regtest; use the intended network for a real wallet.`,
  },
  {
    id: 11,
    section: "Taproot",
    kind: "placeholder",
    kicker: "10 / Taproot",
    title: "Key path vs script path",
    subtitle: "TODO: show the two ways a Taproot output can be spent.",
    diagram: "todo",
    speakerNotes: "TODO: Add key path and script path notes.",
  },
  {
    id: 12,
    section: "Taproot",
    kind: "placeholder",
    kicker: "11 / Taproot",
    title: "FROST + Taproot",
    subtitle: "TODO: connect a FROST group key to a Taproot key-path spend.",
    diagram: "todo",
    speakerNotes: "TODO: Add FROST and Taproot connection notes.",
  },
  {
    id: 13,
    section: "Implementation",
    kind: "content",
    kicker: "12 / Implementation",
    title: "From Rust to a Taproot output",
    subtitle: "The protocol result can become a normal-looking P2TR address.",
    code: `let output_key =
    bitcoin::key::TweakedPublicKey::
        dangerous_assume_tweaked(x_only_key);

let address = bitcoin::Address::p2tr_tweaked(
    output_key,
    bitcoin::address::KnownHrp::Regtest,
);`,
    codeLabel: "Rust / Taproot output",
    output: `=== FROST TAPROOT OUTPUT KEY ===
< x-only output key >

=== TAPROOT ADDRESS ===
< regtest P2TR address >`,
    outputLabel: "Program output",
    speakerNotes: `The demo converts the FROST verifying key into the Bitcoin public-key type, takes its x-only representation, and uses the Taproot output key to create a regtest P2TR address.

This is the payoff for the audience: the coordination happens among the signers, but the resulting Bitcoin output can look like a normal Taproot output. The ciphersuite and tweak handling must match the library and integration being used.`,
  },
  {
    id: 14,
    section: "Frostsnap",
    kind: "content",
    kicker: "13 / Frostsnap",
    title: "Frostsnap makes the protocol physical",
    subtitle:
      "Devices contribute shares. A phone coordinates. No single device holds the wallet secret.",
    image: {
      src: "/images/frostsnap-devices-phone.png",
      alt: "Three Frostsnap devices connected to a phone for threshold signing",
      caption: "A 2-of-3 signing visit, coordinated by a phone",
    },
    speakerNotes: `This is where the cryptographic protocol becomes a user-facing Bitcoin system.

Frostsnap describes three practical steps: generate keys collaboratively, distribute the devices geographically, and visit the required number of devices to sign a transaction.

The coordinator can contribute entropy, detect malicious behavior, aggregate partial signatures, and connect the wallet to the Bitcoin network. It does not access secret keys.

The devices generate secret material through DKG, keep their own secrets, and create partial signatures. The result is a system that can protect against device compromise, weak or malicious entropy, and some supply-chain risks.

This is the case study for the talk: FROST is not only a cryptographic primitive. Frostsnap uses the primitive to redesign how a Bitcoin wallet is assembled, distributed, and used.`,
  },
  {
    id: 15,
    section: "Close",
    kind: "placeholder",
    kicker: "14 / Close",
    title: "Key takeaways",
    subtitle: "TODO: close with the ideas the audience should remember.",
    speakerNotes: "TODO: Add closing notes and questions prompt.",
  },
];

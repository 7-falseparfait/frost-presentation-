import type { SlideData } from "../slides/slideData";
import { CodeBlock } from "./CodeBlock";
import { Diagram } from "./Diagram";

export function Slide({
  slide,
  isActive,
}: {
  slide: SlideData;
  isActive: boolean;
}) {
  const titleLines = slide.title.split("\n");

  return (
    <article
      className={`slide slide-${slide.kind} ${slide.diagram ? `slide-diagram-${slide.diagram}` : ""} ${isActive ? "is-active" : ""}`}
      aria-hidden={!isActive}
    >
      <div className="slide-inner">
        <header className="slide-header">
          <span className="slide-kicker">{slide.kicker}</span>
          <span className="slide-section">{slide.section}</span>
        </header>

        <div className="slide-body">
          <div className="slide-copy">
            <h1>
              {titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            {slide.subtitle && (
              <p className="slide-subtitle">{slide.subtitle}</p>
            )}
            {slide.supportingText && (
              <p className="slide-supporting-text">{slide.supportingText}</p>
            )}
            {slide.supportingNote && (
              <p className="slide-supporting-note">{slide.supportingNote}</p>
            )}
            {slide.quote && <p className="slide-quote">{slide.quote}</p>}
            {slide.content && (
              <ul className="slide-points">
                {slide.content.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {slide.comparison && (
            <div className="comparison-table-wrap">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Dimension</th>
                    <th scope="col">Traditional Script Multisig (2-of-3)</th>
                    <th scope="col">FROST Threshold Multisig (2-of-3)</th>
                  </tr>
                </thead>
                <tbody>
                  {slide.comparison.map((row) => (
                    <tr key={row.dimension}>
                      <th scope="row">{row.dimension}</th>
                      <td data-label="Traditional Script Multisig (2-of-3)">
                        {row.traditional}
                      </td>
                      <td data-label="FROST Threshold Multisig (2-of-3)">
                        {row.frost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(slide.diagram || slide.code || slide.image) && (
            <div className="slide-visual">
              {slide.diagram && (
                <Diagram type={slide.diagram} label={slide.diagramLabel} />
              )}
              {slide.code && (
                <CodeBlock
                  code={slide.code}
                  label={slide.codeLabel}
                  output={slide.output}
                  outputLabel={slide.outputLabel}
                />
              )}
              {slide.image && (
                <figure className="slide-image">
                  <img src={slide.image.src} alt={slide.image.alt} />
                  {slide.image.caption && (
                    <figcaption>{slide.image.caption}</figcaption>
                  )}
                </figure>
              )}
            </div>
          )}
        </div>

        <div className="slide-mark" aria-hidden="true">
          <span>FS</span>
          <i />
        </div>
      </div>
    </article>
  );
}

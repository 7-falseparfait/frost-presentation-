import { useEffect, useState } from "react";
import { ProgressBar } from "./components/ProgressBar";
import { Slide } from "./components/Slide";
import { SpeakerNotes } from "./components/SpeakerNotes";
import { slides } from "./slides/slideData";
import "./styles/presentation.css";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const currentSlide = slides[currentIndex];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        setCurrentIndex((index) => Math.min(index + 1, slides.length - 1));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setCurrentIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key.toLowerCase() === "n") setShowNotes((visible) => !visible);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className={`presentation-shell ${showNotes ? "notes-visible" : ""}`}>
      <div className="stage">
        {slides.map((slide, index) => (
          <Slide
            key={slide.id}
            slide={slide}
            isActive={index === currentIndex}
          />
        ))}
      </div>
      <button
        className="notes-toggle"
        type="button"
        onClick={() => setShowNotes((visible) => !visible)}
      >
        {showNotes ? "Hide notes" : "Show notes"}
      </button>
      {showNotes && <SpeakerNotes notes={currentSlide.speakerNotes} />}
      <ProgressBar current={currentIndex + 1} total={slides.length} />
    </main>
  );
}

export default App;

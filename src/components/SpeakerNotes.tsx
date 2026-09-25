type SpeakerNotesProps = {
  notes: string;
};

export function SpeakerNotes({ notes }: SpeakerNotesProps) {
  return (
    <aside className="speaker-notes">
      <span className="notes-label">Speaker notes</span>
      <p>{notes}</p>
    </aside>
  );
}

import type { Note } from "./PostIt";

export type Line = { note1: string; note2: string };

export const Line = ({
  startNote,
  endNote,
}: {
  startNote: Note | undefined;
  endNote: Note | undefined;
}) => {
  if (!startNote || !endNote) {
    return null;
  }

  const minX = Math.min(startNote.position.x, endNote.position.x);
  const minY = Math.min(startNote.position.y, endNote.position.y);

  const maxX = Math.max(startNote.position.x, endNote.position.x);
  const maxY = Math.max(startNote.position.y, endNote.position.y);

  const width = maxX - minX;
  const height = Math.max(100, maxY - minY) + 50;

  return (
    <svg
      className="absolute pointer-events-none"
      style={{ top: minY, left: minX }}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={`M${startNote.position.x - minX} ${startNote.position.y - minY} Q
        ${width / 2} ${height / 2 + 100},
        ${endNote.position.x - minX} ${endNote.position.y - minY}`}
        stroke="red"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};

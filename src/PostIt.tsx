import { useRef } from "react";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import { IoClose } from "react-icons/io5";

export type Note = {
  title: string;
  text: string;
  imageUrl?: string;
  position: { x: number; y: number };
};

export const PostIt = ({
  note,
  setNote,
  removeNote,
}: {
  note: Note;
  setNote: (note: Note) => void;
  removeNote: (title: string) => void;
}) => {
  const myRef = useRef<HTMLDivElement>(null);

  const onDrag = (_: DraggableEvent, data: DraggableData) => {
    setNote({ ...note, position: { x: data.x, y: data.y } });
  };

  const handleRemove = () => {
    removeNote(note.title);
  };

  return (
    <Draggable nodeRef={myRef} position={note.position} onDrag={onDrag}>
      <div
        ref={myRef}
        id={note.title}
        className="bg-yellow-200 p-4 rounded shadow-md aspect-square absolute min-w-[200px] min-h-[200px]"
      >
        <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full"></div>
        <div className="flex gap-2 justify-between">
          <h3 className="text-lg font-bold mb-2">{note.title}</h3>
          <button className="cursor-pointer" onClick={handleRemove}>
            <IoClose />
          </button>
        </div>
        <p className="text-md mb-2">{note.text}</p>

        {note.imageUrl && (
          <img
            src={note.imageUrl}
            alt={note.title}
            className="max-h-[80px] object-contain pointer-events-none"
          />
        )}
      </div>
    </Draggable>
  );
};

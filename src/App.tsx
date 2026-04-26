import { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import type { Line as LineType } from "./Line";
import { Line } from "./Line";
import type { Note } from "./PostIt";
import { PostIt } from "./PostIt";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [lines, setLines] = useState<LineType[]>([]);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isAddLineModalOpen, setIsAddLineModalOpen] = useState(false);
  const [newNote, setNewNote] = useState<Note>({
    title: "",
    text: "",
    position: { x: 0, y: 0 },
  });
  const [newLine, setNewLine] = useState<Line>({ note1: "", note2: "" });

  useEffect(() => {
    const savedNotes = localStorage.getItem("conspiracyBoardNotes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    const savedLines = localStorage.getItem("conspiracyBoardLines");
    if (savedLines) {
      setLines(JSON.parse(savedLines));
    }
  }, []);

  const addNoteToBoard = (note: Note) => {
    setNotes((prevNotes) => [
      ...prevNotes,
      { ...note, position: { x: 0, y: 0 } },
    ]);
    setIsAddNoteModalOpen(false);
    setNewNote({ title: "", text: "", position: { x: 0, y: 0 } });
    localStorage.setItem(
      "conspiracyBoardNotes",
      JSON.stringify([...notes, { ...note, position: { x: 0, y: 0 } }]),
    );
  };

  const addLineToBoard = (line: Line) => {
    setLines((prevLines) => [...prevLines, line]);
    setIsAddLineModalOpen(false);
    setNewLine({ note1: "", note2: "" });
    localStorage.setItem(
      "conspiracyBoardLines",
      JSON.stringify([...lines, line]),
    );
  };

  return (
    <>
      <div className="p-3">
        <h1 className="text-4xl font-bold mb-2">Conspiracy board creator</h1>

        <span className="text-lg mb-1 text-gray-600">
          <p className="mb-1">
            Haven't discovered any juicy conspiracies yet? 👀🕵️🤫
          </p>
          <p>
            I heard that <WikiLink /> and <WikiLink /> {randomPhraseGenerator()}
          </p>
        </span>

        <div className="flex items-center gap-3 mt-4 mb-6">
          <button
            onClick={() => setIsAddNoteModalOpen(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Add note to the board
          </button>
          <button
            onClick={() => setIsAddLineModalOpen(true)}
            className="bg-amber-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Add line between notes
          </button>
          <button
            onClick={() => {
              setNotes([]);
              localStorage.removeItem("conspiracyBoardNotes");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Clear board
          </button>
        </div>

        <div className="relative">
          {notes.length === 0 ? (
            <p className="text-gray-500">
              No conspiracy items added yet. Start by adding one!
            </p>
          ) : (
            <div className="grid grid-cols-6 gap-4">
              {notes.map((note) => (
                <PostIt
                  key={note.title}
                  removeNote={() => {
                    setNotes((prevNotes) =>
                      prevNotes.filter((n) => n.title !== note.title),
                    );
                    localStorage.setItem(
                      "conspiracyBoardNotes",
                      JSON.stringify(
                        notes.filter((n) => n.title !== note.title),
                      ),
                    );
                  }}
                  note={note}
                  setNote={(updatedNote) => {
                    setNotes((prevNotes) =>
                      prevNotes.map((n) =>
                        n.title === updatedNote.title ? updatedNote : n,
                      ),
                    );
                    localStorage.setItem(
                      "conspiracyBoardNotes",
                      JSON.stringify(
                        notes.map((n) =>
                          n.title === updatedNote.title ? updatedNote : n,
                        ),
                      ),
                    );
                  }}
                />
              ))}

              {lines.map((line) => (
                <Line
                  key={`${line.note1}-${line.note2}`}
                  startNote={notes.find((note) => note.title === line.note1)}
                  endNote={notes.find((note) => note.title === line.note2)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isAddNoteModalOpen}
        onRequestClose={() => setIsAddNoteModalOpen(false)}
        contentLabel="Add a note"
        style={customModalStyles}
      >
        <div className="flex justify-between items-center mb-2">
          <div></div>
          <h2 className="text-2xl font-bold">Add a note</h2>
          <button onClick={() => setIsAddNoteModalOpen(false)}>
            <IoClose />
          </button>
        </div>

        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <input
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
            type="text"
            value={newNote.title}
            onChange={(e) =>
              setNewNote((oldNote) => ({ ...oldNote, title: e.target.value }))
            }
            placeholder="Title"
          />
          <textarea
            placeholder="Enter your note text"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full resize-none min-h-[200px]"
            value={newNote.text}
            onChange={(e) =>
              setNewNote((oldNote) => ({ ...oldNote, text: e.target.value }))
            }
          />
          <input
            className="w-fit rounded p-2 bg-amber-500 text-white mb-4 cursor-pointer"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setNewNote((oldNote) => ({
                  ...oldNote,
                  imageUrl: URL.createObjectURL(file),
                }));
              }
            }}
            id="imageUpload"
            accept="image/*"
          />
          <button
            onClick={() => addNoteToBoard(newNote)}
            className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Add to board
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isAddLineModalOpen}
        onRequestClose={() => setIsAddLineModalOpen(false)}
        contentLabel="Add a line"
        style={customModalStyles}
      >
        <div className="flex justify-between items-center mb-2">
          <div></div>
          <h2 className="text-2xl font-bold">Add a line</h2>
          <button onClick={() => setIsAddLineModalOpen(false)}>
            <IoClose />
          </button>
        </div>

        <p className="text-gray-500 mb-2">
          Make a connection between two items on the board.
        </p>

        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label className="text-md font-medium">
            Choose the starting point:
          </label>
          <select
            id="line1"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
            onChange={(e) => setNewLine({ ...newLine, note1: e.target.value })}
          >
            <option value="">Select a note</option>
            {notes.map((note) => (
              <option key={note.title} value={note.title}>
                {note.title}
              </option>
            ))}
          </select>

          <label className="text-md font-medium">
            Choose the ending point:
          </label>
          <select
            id="line2"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-full"
            onChange={(e) => setNewLine({ ...newLine, note2: e.target.value })}
          >
            <option value="">Select a note</option>
            {notes.map((note) => (
              <option key={note.title} value={note.title}>
                {note.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => addLineToBoard(newLine)}
            disabled={newLine.note1 === "" || newLine.note2 === ""}
            className="disabled:bg-orange-200 bg-orange-500 text-white px-4 py-2 rounded disabled:cursor-not-allowed cursor-pointer"
          >
            Add to board
          </button>
        </form>
      </Modal>
    </>
  );
}

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "0 5px 15px rgba(0,0,0,.3)",
    border: "none",
    borderRadius: "12px",
    maxWidth: "80vw",
  },
};

const WikiLink = () => {
  return (
    <a
      className="font-bold underline"
      target="_blank"
      rel="noopener noreferrer"
      href="https://en.wikipedia.org/wiki/Special:Random"
    >
      this
      <FaExternalLinkAlt className="inline ml-1" />
    </a>
  );
};

const randomPhraseGenerator = () => {
  const phrases = [
    "are part of a secret government plot to keep us distracted from the truth.",
    "have never been seen in the same room at once... Coincidence?",
    "are connected to each other through the Illuminati, and they don't want us to know.",
    "are both controlled by the same popular brand, and you won't believe which one it is!",
    "are run by lizard people, but not the SAME lizard people that run the government.",
    "are involved with a secret society that meets in underground bunkers to eat chips and hang.",
    "are part of a huge conspiracy to conquer the world.",
    "were part of a huge cover-up related to the moon landing.",
    "never existed, and all the photos of them are fake.",
    "were built by aliens as a way to control our minds through subliminal messaging.",
    "are involved with Big Pharma in a way you wouldn't believe.",
  ];

  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
};

export default App;

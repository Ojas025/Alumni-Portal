import { IoArrowBack } from "react-icons/io5";
import { StickyNote } from "./StickyNote";
import { Dispatch, RefObject, SetStateAction, useState } from "react";

export const StickyNoteForm = ({ setFormVisibility, handleAddNote, containerRef, handleDeleteNote } : { setFormVisibility: Dispatch<SetStateAction<boolean>>, handleDeleteNote: (noteId: string) => void, containerRef: RefObject<HTMLDivElement | null>, handleAddNote: (content: string) => void }) => {
    const [inputText, setInputText] = useState("");

  return (
    <div className="w-full min-h-screen z-50 bg-black/60 fixed top-0 left-0 flex items-center justify-center">
      <div className="w-3/4 max-w-2xl max-h-[80vh] bg-white grid grid-cols-2 shadow-md shadow-black rounded-md overflow-hidden">
        
        <div className="col-span-1 h-full w-full px-10 py-8 flex flex-col justify-between relative">
            <IoArrowBack onClick={() => setFormVisibility(prev => !prev)} className="w-5 cursor-pointer h-5 absolute top-4 left-4 text-black" /> 

          <div>
            <h3 className="text-lg text-black font-semibold mb-4">
              Suggestion, Feedback, or Review
            </h3>
            <form className="w-full">
              <textarea
              onChange={(e) => setInputText(e.target.value)}
              value={inputText}
                name="note-content"
                placeholder="Max 30 words.."
                required
                className="border border-black rounded-sm text-black w-full resize-none h-40 p-4"
              ></textarea>
            </form>
          </div>

          <div className="mt-6">
            <button onClick={() => {
                handleAddNote(inputText);
                setInputText("");
            }} className="px-4 py-2 bg-[#32636e] font-semibold text-white w-full text-sm rounded-sm cursor-pointer">
              Add Note
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="col-span-1 bg-[#e6e9da] h-full text-black p-10">
            <h3 className="text-lg text-black font-semibold mb-2"> 
                Preview
            </h3>
          <StickyNote handleDeleteNote={handleDeleteNote} randomPosition={false} containerRef={containerRef}  content={inputText} owner="" _id="" />
        </div>
      </div>
    </div>
  );
};

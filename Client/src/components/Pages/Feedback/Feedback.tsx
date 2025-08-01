import { useEffect, useRef, useState } from "react";
import { StickyNote } from "./StickyNote";
import { StickyNoteForm } from "./StickyNoteForm";
import axios from "axios";
import { useNotification } from "@/hooks/useNotification";

export interface StickyNoteI {
  _id: string;
  author: string;
  content: string;
}

export const Feedback = () => {

    const [formVisibility, setFormVisibility] = useState(false);
    const  [ notes, setNotes ] = useState<StickyNoteI[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { notify } = useNotification();

    const noteMatrix = Array(3).fill(null).map(() => Array(4).fill(0))

    const fetchRandomRowCol = () => {
      let row: number | null = null;
      let col: number | null = null;
      let tries = 0; 

      do {
        row = Math.round(Math.random() * 2);
        col = Math.round(Math.random() * 3);
        tries += 1;
      } 
      while (tries < 1000 && row !== null && col !== null && noteMatrix[row][col] !== 0)

      return { row: row, col: col };    
    };  

    useEffect(() => {

      const handleFetchNotes = async () => {
        try {
          
          const result = await axios.get(
              `http://localhost:3000/api/feedback`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
              }
            );

            if (result.data.data){
              setNotes(result.data.data);
            }  
              

        } catch (error) {
          console.error("Error fetching note", error); 
          notify({ id: 'feedback-toast', type: 'error', content: 'Error fetching note' });
        }
      };


      handleFetchNotes();
    }, []);

    const handleAddNote = async (content: string) => {
        if (!content) return;
        try {
          
          const result = await axios.post(
              `http://localhost:3000/api/feedback`,
              { content: content },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
              }
            );

            console.log(result);

            if (result.data.data){
              const newNote: StickyNoteI = result.data.data;
              setNotes(prev => [...prev, { _id: newNote._id, author: newNote.author, content: newNote.content }]);
              notify({ id: 'feedback-toast', type: 'success', content: 'Posted note successfully' });
            };

        } catch (error) {
          console.error("Error posting note", error); 
          notify({ id: 'feedback-toast', type: 'error', content: 'Error posting note' });
        }
        finally{
          setFormVisibility(false);
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        if (!noteId) return;
        try {
          
          await axios.delete(
              `http://localhost:3000/api/feedback/${noteId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
              }
            );

            notify({ id: 'feedback-toast', type: 'success', content: 'Posted deleted successfully' });
            setNotes(prev => prev.filter(note => note._id !== noteId));

        } catch (error) {
          console.error("Error deleting note", error); 
          notify({ id: 'feedback-toast', type: 'error', content: 'Error deleting note' });
        }
    };

  return (
    <div style={{backgroundImage: "url('/src/assets/wood-bg-2.jpg')"}}  className="w-full bg-center min-h-screen flex flex-col items-center justify-center py-6 dark:text-white text-black relative">

        {/* Header + Add Btn */}
      <div className="w-2/3 max-w-3xl py-8 px-6 md:px-16 mb-10 bg-[#32636e] shadow-md shadow-black rounded-xl text-white">
        <h1 className="text-3xl font-bold mb-2">Share Your Thoughts 💬</h1>

        <p className="text-md font-semibold max-w-2xl">
          Got feedback, suggestions, or a cool idea? We’d love to hear from you!
          Drop a note below and help us improve the Alumni Portal experience for
          everyone. 🚀
        </p>

        <button className="mt-4 px-4 py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-300 cursor-pointer duration-200" onClick={() => setFormVisibility(prev => !prev)}>
          ➕ Add Note
        </button>
      </div>

        {
            formVisibility &&
            <StickyNoteForm handleDeleteNote={handleDeleteNote} containerRef={containerRef} setFormVisibility={setFormVisibility} handleAddNote={handleAddNote} />
        }

            <div ref={containerRef} className="w-full py-2 gap-4 px-4 min-h-screen overflow-hidden grid grid-rows-3 grid-cols-4 text-black relative">
                {
                    notes.map(note => {
                      const  { row, col } = fetchRandomRowCol();
                      noteMatrix[row][col] = 1;

                      return (
                        <div key={note._id} className={`col-start-${col + 1} row-start-${row + 1}`}>
                          <StickyNote handleDeleteNote={handleDeleteNote} randomPosition={true} containerRef={containerRef} content={note.content} _id={note._id} owner={note.author} />
                        </div>
                    )}
                    )
                }
            </div>
    </div>
  );
};

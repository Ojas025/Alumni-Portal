// import { useDraggable } from "@dnd-kit/core";
// import { CSS } from "@dnd-kit/utilities";
import { RootState } from "@/store/Store";
import { RefObject, useEffect, useRef, useState } from "react"
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";

export const StickyNote = ({ content, _id, owner, containerRef, randomPosition = false, handleDeleteNote }: { content: string, _id: string, owner: string, containerRef: RefObject<HTMLDivElement | null>, randomPosition: boolean, handleDeleteNote: (noteId: string) => void }) => {

    const noteRef = useRef<HTMLDivElement>(null); 
    // const [ position, setPosition ] = useState({ left: 0, top: 0 });
    const [ rotation, setRotation ] = useState(`0deg`);
    const [ color, setColor ] = useState(`red-400`);
    const user =  useSelector((state: RootState) => state.user.user);
    console.log(_id, owner);

    
    useEffect(() => {
        const colors = ["#f87171", "#2f855a", "#1e40af"];
        const placeNote = () => {
            if (!randomPosition) return;
            const randomRotation = `${Math.floor(Math.random() * 25) - 12}deg`;
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            setRotation(randomRotation)
            setColor(randomColor);


            // if (containerRef.current && noteRef.current){
            //     const containerRect = containerRef.current.getBoundingClientRect(); 
            //     const noteRect = noteRef.current.getBoundingClientRect();
    
            //     const maxTop = containerRect.height - noteRect.height;
            //     const maxWidth = containerRect.width - noteRect.width;
                
            //     const randomTop = Math.floor(Math.random() * maxTop);
            //     const randomLeft = Math.floor(Math.random() * maxWidth);
    
            //     setPosition({ top: randomTop, left: randomLeft });
            // }
        }

        requestAnimationFrame(placeNote);
    }, [randomPosition, containerRef]);


  return (
    <div ref={noteRef} 
        style={ {
            // top: position.top,
            // left: position.left, 
            // position: "absolute",
            transform: `rotate(${rotation})` 
        // } : {}} 
  }}
        className="w-60 h-64 shadow-md shadow-black bg-[#fed945] py-2 text-sm font-semibold px-4"
    >
        <div className="w-full h-6 flex items-center justify-center mb-4">
            {/* Note header */}
            <span style={{ backgroundColor: `${color}` }} className={`w-5 h-5 rounded-full border shadow-md shadow-black border-black`}></span>
        </div>
        <p className="">
            {content}
        </p>

        { 
            owner === user?._id &&
            <RxCross2 onClick={() => handleDeleteNote(_id)} className="w-4 cursor-pointer h-4 absolute top-2 right-2" />
        }           


    </div>
  )
}

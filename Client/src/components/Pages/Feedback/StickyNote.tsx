import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { RefObject, useEffect, useRef, useState } from "react"

export const StickyNote = ({ content, _id, owner, containerRef, randomPosition = false }: { content: string, _id: string, owner: string, containerRef: RefObject<HTMLDivElement | null>, randomPosition: boolean }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: _id });
    const noteRef = useRef<HTMLDivElement>(null); 
    const [ position, setPosition ] = useState({ left: 0, top: 0 });
    console.log(_id, owner);

    const style = {
        transform: CSS.Translate.toString(transform),
        position: "absolute",
        top: 0,
        left: 0,
        cursor: "grab",
    };

    useEffect(() => {
        const placeNote = () => {
            if (!randomPosition) return;

            if (containerRef.current && noteRef.current){
                const containerRect = containerRef.current.getBoundingClientRect(); 
                const noteRect = noteRef.current.getBoundingClientRect();
    
                const maxTop = containerRect.height - noteRect.height;
                const maxWidth = containerRect.width - noteRect.width;
                
                const randomTop = Math.floor(Math.random() * maxTop);
                const randomLeft = Math.floor(Math.random() * maxWidth);
    
                setPosition({ top: randomTop, left: randomLeft });
            }
        }

        requestAnimationFrame(placeNote);
    }, []);

  return (
    <div ref={noteRef} style={ randomPosition ? {top: position.top, left: position.left, position: "absolute"} : {}} className="w-60 h-64 shadow-md shadow-black bg-[#fed945] py-2 text-sm font-semibold px-4">
        <div className="w-full h-6 flex items-center justify-center mb-4">
            {/* Note header */}
            <span className="w-5 h-5 rounded-full bg-red-400 border shadow-md shadow-black border-black"></span>
        </div>
        <p className="">
            {content}
        </p>


    </div>
  )
}

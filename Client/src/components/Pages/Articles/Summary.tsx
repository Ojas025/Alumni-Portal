import { Dispatch, SetStateAction } from "react"
import { IoClose } from "react-icons/io5"

export const Summary = ({ setSummaryVisibility }: { setSummaryVisibility: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <div className="bg-yellow-50 rounded-lg w-[40%] h-max absolute top-30 p-6 text-black font-semibold">
        <div>
            <IoClose className="w-12 h-12 absolute top-2 text-white cursor-pointer left-[-4rem]" onClick={() => setSummaryVisibility(prev => !prev)}/>
        </div>
        Summary
    </div>
  )
}

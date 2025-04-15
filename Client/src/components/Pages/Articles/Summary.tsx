import { Dispatch, SetStateAction } from "react"
import { IoClose } from "react-icons/io5"

export const Summary = ({ setSummaryVisibility, text, setSummaryText }: { setSummaryVisibility: Dispatch<SetStateAction<boolean>>, text: string, setSummaryText: Dispatch<SetStateAction<string>> }) => {
  return (
    <div className="bg-gray-700 rounded-lg px-12 py-12 w-[60%] h-max absolute top-30 text-sky-300 font-semibold">
        <div>
            <IoClose className="w-12 h-12 absolute top-2 text-white cursor-pointer left-[-4rem]" onClick={() => {
              setSummaryVisibility(prev => !prev)
              setSummaryText("")
              }}/>
        </div>
        <div>
          <h3 className="text-2xl mb-2 text-blue-200 font-bold">Summary:</h3>
          <p>
            {text}
          </p>
        </div>
    </div>
  )
}

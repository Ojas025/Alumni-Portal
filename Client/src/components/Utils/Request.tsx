import { IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

interface RequestProps {
  senderName: string;
  type: string;
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
  _id: string;
}

export const Request = ({ senderName, type, onAccept, onReject, _id }: RequestProps) => {
    console.log(_id);

  return (
    <div className="flex justify-between items-center px-6 text-sm bg-white dark:hover:bg-gray-700 hover:bg-gray-100 dark:bg-gray-800 w-70">
      <div className="py-1">
        <p className="text-black dark:text-sky-300">{senderName}</p>
        <p className=" text-gray-600 dark:text-gray-400">{type} request</p>
      </div>
      <div className="flex gap-4">
        <IoCheckmark onClick={() => onAccept(_id)} className="text-lime-400 cursor-pointer" />
        <RxCross2 onClick={() => onReject(_id)} className="text-red-500 cursor-pointer" />
      </div>
    </div>
  );
};

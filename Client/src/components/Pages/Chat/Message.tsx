import { RootState } from "@/store/Store";
import { IMessage } from "./Chat";
import { useSelector } from "react-redux";

export const Message = ({ message }: {message: IMessage}) => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div
      className={`max-w-[65%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
        message?.sender?._id === user?._id
          ? "bg-[#9cb5f0] dark:text-white text-black dark:bg-blue-900 self-end"
          : "bg-gray-200 dark:bg-neutral-800 self-start text-gray-800 dark:text-gray-100"
      }`}
    >
      {message.content}
    </div>
  );
};

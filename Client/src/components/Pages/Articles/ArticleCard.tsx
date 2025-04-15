import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Article } from "./Articles";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

interface ArticleCardInterface {
  title: string;
  _id: string;
  content: string;
  author: {
    firstName: string;
    lastName: string;
    profileImageURL: string; 
    _id: string;
    role: string;
  };
  createdAt: string;
  summary: string;
  likes: number;
  deleteArticle: (articleId: string) => void;
  setArticleToEdit: Dispatch<SetStateAction<string>>;
  setArticleToView: Dispatch<SetStateAction<Article | null>>;
  setFormVisibility: Dispatch<SetStateAction<boolean>>;
  setArticleVisibility: Dispatch<SetStateAction<boolean>>;
}

export const ArticleCard = ({
  _id,
  title,
  author,
  createdAt,
  summary,
  likes,
  content,
  deleteArticle,
  setArticleToView,
  setArticleToEdit,
  setFormVisibility,
  setArticleVisibility,
}: ArticleCardInterface) => {
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const isAuthor = user?._id === author._id;

  const handleLike = () => {
    console.log("Like clicked for article:", _id);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`#dropdown-${author._id}`) && !target.closest(`#dropdown-trigger-${_id}`)) {
         setDropdownVisibility(false);
      }
    };

    if (dropdownVisibility) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownVisibility, author._id, _id]); 

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formattedDate = formatDate(createdAt);

  const handleUpdateArticle = () => {
    setArticleToEdit(_id);
    setFormVisibility(true);
    setDropdownVisibility(false); 
  };

  const handleDeleteArticle = () => {
    deleteArticle(_id);
    setDropdownVisibility(false); 
  };

  const handleViewArticle = () => {
    setArticleVisibility(true);
    setArticleToView({ title, content, summary, author, createdAt: formattedDate, _id, likes });
  };

  return (
    <div className="col-span-12 md:col-span-6 p-3">
      <div className="border shadow-sm rounded-xl hover:shadow-lg transition h-[30rem] flex flex-col justify-between overflow-hidden bg-white dark:bg-[#151515] relative">
        <div className="w-full rounded-t-xl h-56 bg-gray-300 flex-shrink-0" />

        <div className="p-4 flex flex-col justify-between flex-grow"> 

          <div>
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-[1.05rem] font-semibold break-words line-clamp-2 dark:text-white text-black leading-snug mr-2"> 
                {title}
              </h2>
              {isAuthor && (
                  <button id={`dropdown-trigger-${_id}`} onClick={() => setDropdownVisibility(prev => !prev)} className="focus:outline-none">
                     <BsThreeDotsVertical className="cursor-pointer mt-1 text-gray-500 dark:text-gray-400" />
                  </button>
              )}

              {dropdownVisibility && isAuthor && (
                <div
                  id={`dropdown-${author._id}`} 
                  className="absolute mt-6 right-5 z-20 w-20 rounded-sm border border-black bg-white text-black text-xs shadow-lg dark:bg-black dark:border-white dark:text-white"
                >
                  <div
                    className="text-center w-full py-1 dark:hover:bg-white dark:hover:text-black hover:bg-black hover:text-white cursor-pointer"
                    onClick={handleUpdateArticle}
                  >
                    Edit
                  </div>
                  <div
                    className="cursor-pointer py-1 text-center dark:hover:bg-white hover:bg-black hover:text-white dark:hover:text-black"
                    onClick={handleDeleteArticle}
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center text-[0.85rem] text-gray-500 gap-2 mb-4 dark:text-white">
              <div className="w-6 h-6 rounded-full bg-gray-300" />
              <span>{author.firstName} {author.lastName}</span>
              <span className="text-gray-400">•</span>
              <span>{formattedDate}</span>
            </div>

            <p className="text-gray-700 text-[0.95rem] mb-2 dark:text-gray-400 line-clamp-3 leading-snug">
              {summary}
            </p>
          </div>

          <div className="flex justify-between items-center pt-1 cursor-pointer"> 
            <button
               onClick={handleLike}
               className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
               aria-label={`Like article, current likes: ${likes}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likes}
            </button>
            <button
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer transition-colors duration-200"
              onClick={handleViewArticle}
            >
              Read more <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
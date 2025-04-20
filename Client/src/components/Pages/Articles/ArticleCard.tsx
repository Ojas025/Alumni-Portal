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
  thumbnail: string;
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
  thumbnail,
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
    setArticleToView({ title, content, summary, author, createdAt: formattedDate, _id, likes, thumbnail });
  };

  return (
    <div className="col-span-12 md:col-span-6 p-3">
  <div className="border shadow-sm rounded-xl hover:shadow-lg transition flex flex-col overflow-hidden bg-white dark:bg-[#151515] relative h-[30rem]">

    <div className="w-full h-[15rem] bg-gray-200 overflow-hidden">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="Thumbnail"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 dark:bg-gray-700" />
      )}
    </div>

    <div className="p-4 flex flex-col justify-between flex-grow">

      <div className="flex items-start justify-between mb-1">
        <h2 className="text-base font-semibold break-words line-clamp-2 dark:text-white text-black leading-snug mr-2">
          {title}
        </h2>
        {isAuthor && (
          <div className="relative">
            <button
              id={`dropdown-trigger-${_id}`}
              onClick={() => setDropdownVisibility(prev => !prev)}
              className="focus:outline-none"
            >
              <BsThreeDotsVertical className="cursor-pointer text-gray-500 dark:text-gray-400" />
            </button>

            {dropdownVisibility && (
              <div
                id={`dropdown-${author._id}`}
                className="absolute mt-2 right-0 z-20 w-24 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-sm shadow-lg"
              >
                <div
                  className="py-2 px-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer"
                  onClick={handleUpdateArticle}
                >
                  Edit
                </div>
                <div
                  className="py-2 px-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer"
                  onClick={handleDeleteArticle}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center text-xs text-gray-600 gap-2 mb-2 dark:text-gray-400">
        <img src={user?.profileImageURL} className="w-5 h-5 rounded-full border border-black" />
        <span>{author.firstName} {author.lastName}</span>
        <span className="text-gray-400">•</span>
        <span>{formattedDate}</span>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
        {summary}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center mt-auto">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          aria-label={`Like article, current likes: ${likes}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {likes}
        </button>
        <button
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
          onClick={handleViewArticle}
        >
          Read more →
        </button>
      </div>
    </div>
  </div>
</div>

  );
};
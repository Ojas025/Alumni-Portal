import { Dispatch, SetStateAction, useState } from "react";
import { Article } from "./Articles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Summary } from "./Summary";

interface ArticleProps {
  article: Article | null;
  setArticleVisibility: Dispatch<SetStateAction<boolean>>; 
}

export const ViewArticle = ({ article, setArticleVisibility }: ArticleProps) => {
  const [summaryVisibility, setSummaryVisibility] = useState(false)

  if (!article) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        No article found.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-8 md:px-24 py-12 bg-[#f5f5f5] dark:bg-[#121212] text-black dark:text-white relative">
      
      { 
        summaryVisibility &&
        <div className="w-full min-h-screen flex items-center justify-center bg-black/60 absolute top-0 left-0 h-full">
          <Summary setSummaryVisibility={setSummaryVisibility}/>
        </div>
      }

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
        <button 
          onClick={() => setArticleVisibility(false)} 
          className="mb-4 text-sm font-semibold text-blue-600 dark:text-blue-400 cursor-pointer"
        >
          ← Back to Articles
        </button>
        <h1 className="text-4xl font-bold">{article.title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          By {article.author.firstName} {article.author.lastName} |{" "}
          {new Date(article.createdAt).toLocaleDateString()}
        </p>
        </div>
        
        <button onClick={() => setSummaryVisibility(prev => !prev)} className="bg-white py-2 px-3 rounded-lg shadow-xl cursor-pointer hover:bg-gray-100 dark:shadow-none font-semibold font-serif text-yellow-400">
          ✨Generate Summary
        </button>

      </div>

      {/* Article */}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content || ""}
        </ReactMarkdown>
      </div>

        {/* Footer */}
      <div className="mt-12">
      </div>
    </div>
  );
};

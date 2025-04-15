import { Dispatch, SetStateAction, useState } from "react";
import { Article } from "./Articles";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Summary } from "./Summary";
import { useNotification } from "@/hooks/useNotification";
import axios from "axios";

interface ArticleProps {
  article: Article | null;
  setArticleVisibility: Dispatch<SetStateAction<boolean>>;
}

export const ViewArticle = ({
  article,
  setArticleVisibility,
}: ArticleProps) => {
  const [summaryVisibility, setSummaryVisibility] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const { notify } = useNotification();

  if (!article) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        No article found.
      </div>
    );
  }

  const handleGetSummary = async () => {
    
    try {
      const result = await axios.post(
        "http://localhost:3000/api/article/summarize",
        { text: article.content },
        {
         headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
         } 
        }
      );

      if (!result) {
        notify({ id: 'summary-toast', type: 'error', content: 'Error generating summary' })
      }
      
      console.log(result);
      const summary = result.data.data;

      if (!summary || !summary.summary || summary.error){
        if (summary.error) console.error("Error generating summary", summary.error);
        notify({ id: 'summary-toast', type: 'error', content: 'Error generating summary' })
      }
      
      setSummaryVisibility(true);
      setSummaryText(summary?.summary ?? ""); 
      notify({ id: 'summary-toast', type: 'success', content: 'Successfully generated summary' })
      
    } catch (error) {
      console.error('Error generating summary', error);
      notify({ id: 'summary-toast', type: 'error', content: 'Error generating summary' })
    }
  };

  return (
    <div className="w-full min-h-screen px-8 md:px-24 py-12 bg-[#f5f5f5] dark:bg-[#121212] text-black dark:text-white relative">
      {summaryVisibility && (summaryText !== "") && (
        <div className="w-full min-h-screen flex items-center justify-center bg-black/60 absolute top-0 left-0 h-full">
          <Summary setSummaryVisibility={setSummaryVisibility} text={summaryText} setSummaryText={setSummaryText} />
        </div>
      )}

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

        <button
          onClick={handleGetSummary}
          className="bg-white py-2 px-3 rounded-lg shadow-xl cursor-pointer hover:bg-gray-100 dark:shadow-none font-semibold font-serif text-yellow-400"
        >
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
      <div className="mt-12"></div>
    </div>
  );
};

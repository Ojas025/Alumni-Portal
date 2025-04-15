import { SearchbarTemplate } from "@/components/Utils/SearchbarTemplate"
import { ArticleCard } from "./ArticleCard"
import { useEffect, useState } from "react";
import { Pagination } from "@/components/Utils/Pagination";
import { useAuthorize } from "@/hooks/useAuthorize";
import { ArticleForm } from "./ArticleForm";
import axios from "axios";
import { useNotification } from "@/hooks/useNotification";
import { Spinner } from "@/components/ui/Spinner";
import { useLocation } from "react-router";
import { ViewArticle } from "./ViewArticle";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

export interface Article {
  title: string;
  _id: string;
  content: string;
  author: {
    firstName: string;
    lastName: string;
    role: string;
    _id: string;
    profileImageURL: string;
  };
  summary: string;
  likes: number;
  createdAt: string;
}


export const Articles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formVisibility, setFormVisibility] = useState(false);
  const [articleVisibility, setArticleVisibility] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState("");
  const [articleToView, setArticleToView] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const { notify } = useNotification(); 
  const { user, loading } = useSelector((state: RootState) => state.user); 
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useAuthorize();

  const location = useLocation();
  const isOnArticlesPage = location.pathname === "/articles";

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);


  useEffect(() => {
    if (!isOnArticlesPage) return;
    if (!user && !loading) return;

    const handleFetchArticles = async () => {
      try {
        setLoading(true);
            const result = await axios.get(`http://localhost:3000/api/article?page=${currentPage}&limit=10&search=${searchQuery}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('accessToken')}`
              }
          });
  
         setArticles(result.data?.data.articles);
         setTotalPages(result.data?.data.totalPages);
  
      if (result.data?.data){
        notify({ id: "article-toast", type: "success", content: "Articles fetched successfully" });
      }
  
      } 
      catch (error) {
        console.error("Error fetching articles", error);
  
        notify({ id: "article-toast", type: "error", content: "Could not fetch articles" });
      }
  
      setLoading(false);
    };

    handleFetchArticles();    
  }, [currentPage, searchQuery]);
  
  const deleteArticle = async (articleId: string) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/article/${articleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
  
      setArticles(prev => prev.filter(article => article._id !== articleId));
      notify({ id: "article-toast", type: "success", content: "Article deleted successfully" });
  
    } catch (error) {
      console.error("Error deleting article", error);
      notify({ id: "article-toast", type: "error", content: "Could not delete article" });
    }
    setLoading(false);
  };
  
  return (
    <div className="dark:bg-[#000000] bg-[#e6e9da] w-full min-h-screen flex flex-col items-center pb-6">

    {
      formVisibility ?
      <ArticleForm setArticles={setArticles} setFormVisibility={setFormVisibility} articleId={articleToEdit} />
      : articleVisibility ? <ViewArticle  setArticleVisibility={setArticleVisibility} article={articleToView}/>
      : <>
      <div className="space-y-2 flex justify-between py-6 w-full bg-gray-50 px-12 dark:bg-[#151515] items-center">
        <div>
          <h2 className="text-3xl font-bold dark:text-white text-black">Articles</h2>
          <p className="dark:text-gray-300 text-gray-700">Insights, experiences, and advice from our alumni community</p>
        </div>

        <button className="text-sm dark:text-black text-white dark:bg-white bg-black px-2 py-1 rounded-sm cursor-pointer font-semibold" onClick={() => setFormVisibility(prev => !prev)}>
          Post Article
        </button>
      </div>

      <SearchbarTemplate placeholder="Search articles by title, author or description" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

      <div className="w-full grid grid-cols-6 md:grid-cols-12 gap-x-6 gap-y-12 px-4 md:px-10 py-6">
          {
            articles.length === 0 ? <p className="col-span-3 text-center text-lg text-gray-500 dark:text-gray-300">No Articles found</p>
            : Loading ? <Spinner />
            : articles.map((article, index) => (
              <ArticleCard key={index}
                title={article.title}
                _id={article._id}
                content={article.content}                                
                author={{
                  firstName: article.author.firstName,
                  lastName: article.author.lastName,
                  profileImageURL: article.author.profileImageURL,
                  _id: article.author._id,
                  role: article.author.role
                }}
                summary={article.summary}
                likes={article.likes}
                deleteArticle={deleteArticle}
                createdAt={article.createdAt}
                setArticleToEdit={setArticleToEdit}
                setArticleVisibility={setArticleVisibility}
                setArticleToView={setArticleToView}
                setFormVisibility={setFormVisibility}
              />               
            ))
          }
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      </>
    }


  </div>
  )
}


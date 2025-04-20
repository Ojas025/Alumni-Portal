import { Badge } from "@/components/Utils/Badge";
import { useNotification } from "@/hooks/useNotification";
import { RootState } from "@/store/Store";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Article } from "./Articles";
import { IoArrowBackOutline } from "react-icons/io5";
import { Spinner } from "@/components/ui/Spinner";
import { useDropzone } from "react-dropzone";

interface articleProps {
  setArticles: Dispatch<SetStateAction<Article[]>>;
  setFormVisibility: Dispatch<SetStateAction<boolean>>;
  articleId?: string | null;
}

export const ArticleForm = ({
  setArticles,
  setFormVisibility,
  articleId,
}: articleProps) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();
  const { user } = useSelector((state: RootState) => state.user);

  // Fetch existing article data if editing
  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/article/${articleId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const data = res.data?.data;
        if (data) {
          setTitle(data.title);
          setTags(data.tags || []);
          setContent(data.content);
          setSummary(data.summary);
        }
      } catch (error) {
        console.error("Error fetching article", error);
        notify({
          id: "article error",
          type: "error",
          content: "Failed to fetch article data for editing",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag) return;
    setTags((prev) => [...prev, trimmedTag]);
    setNewTag("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("summary", summary);
        if (!articleId) formData.append("author", String(user?._id));
        tags.forEach((tag) => formData.append("tags[]", tag));
        if (thumbnail) formData.append("thumbnail", thumbnail);

      if (articleId) {
        // Update article
        const result = await axios.put(
          `http://localhost:3000/api/article/${articleId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        notify({
          id: "article-toast",
          type: "success",
          content: "Article updated successfully",
        });

        setArticles((prev) =>
          prev.map((article) =>
            article._id === articleId ? result.data.data : article
          )
        );
      } else {
        // New article
        
        const result = await axios.post(
          "http://localhost:3000/api/article",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        notify({
          id: "article-toast",
          type: "success",
          content: "Article posted successfully",
        });

        setArticles((prev) => [...prev, result.data?.data]);
      }
    } catch (error) {
      console.error("Error saving article", error);
      notify({
        id: "article-toast",
        type: "error",
        content: "Could not save article",
      });
    } finally {
      setLoading(false);
      setFormVisibility(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length) {
        setThumbnail(acceptedFiles[0]);
      }
    },
    multiple: false,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  return (
    <div className="w-full min-h-screen">
      <div className="w-[80%] mx-auto m-6 p-6 rounded-md dark:bg-[#222] bg-white shadow-lg text-white space-y-6">
        <div className="flex items-center gap-4">
          <IoArrowBackOutline
            className="w-8 cursor-pointer h-8 dark:text-white text-black"
            onClick={() => {
              setFormVisibility((prev) => !prev);
              articleId = null;
            }}
          />
          <h2 className="text-3xl font-semibold dark:text-white text-black">
            {articleId ? "Edit Article" : "Post Article"}
          </h2>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="col-span-1 space-y-2">
            <label
              htmlFor="title"
              className="text-lg font-semibold block dark:text-white text-black"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              className="rounded-sm px-2 py-2 text-sm bg-neutral-900 dark:bg-white dark:text-black text-white w-full focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="col-span-1 space-y-2">
            <label
              htmlFor="tags"
              className="text-lg font-semibold block dark:text-white text-black"
            >
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="tags"
                className="rounded-sm w-full px-2 py-2 text-sm bg-neutral-900 dark:bg-white text-white dark:text-black focus:outline-none focus:ring-2 dark:focus:ring-white focus:ring-black"
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button
                className="text-sm dark:text-black text-white dark:bg-white bg-neutral-900 px-3 py-1 rounded-sm cursor-pointer font-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddTag();
                }}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} value={tag} />
              ))}
            </div>
          </div>

          {/* Thumbnail (dropzone) */}
          <div className="col-span-1 space-y-2">
            <label
              htmlFor="thumbnail"
              className="text-lg font-semibold block dark:text-white text-black"
            >
              Thumbnail
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-6 cursor-pointer transition ${
                isDragActive
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "bg-neutral-900 dark:bg-white"
              }`}
            >
              <input {...getInputProps()} />
              <p
                className={`text-sm text-center ${
                  isDragActive
                    ? "text-black dark:text-white"
                    : "text-white dark:text-black"
                }`}
              >
                {thumbnail
                  ? thumbnail.name
                  : "Drag and drop a file here, or click to select a file"}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="col-span-1 space-y-2">
            <label
              htmlFor="summary"
              className="text-lg font-semibold block dark:text-white text-black"
            >
              Summary
            </label>
            <textarea
              rows={3}
              className="rounded-sm p-4 text-sm bg-neutral-900 dark:bg-white text-white dark:text-black focus:outline-none focus:ring-2 resize-none dark:focus:ring-white focus:ring-black w-full"
              placeholder="Enter summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            ></textarea>
          </div>

          {/* Content (full width) */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label
              htmlFor="content"
              className="text-lg font-semibold block dark:text-white text-black"
            >
              Content
            </label>
            <textarea
              rows={10}
              className="rounded-sm p-4 text-sm bg-neutral-900 dark:bg-white text-white dark:text-black focus:outline-none focus:ring-2 resize-none dark:focus:ring-white focus:ring-black w-full"
              placeholder="Enter content (in markdown format)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>

          {/* Submit (full width) */}
          <div className="col-span-1 md:col-span-2">
            {loading ? (
              <Spinner />
            ) : (
              <button
                className="dark:text-black text-white dark:bg-white bg-neutral-900 px-3 py-2 rounded-sm cursor-pointer font-semibold w-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                {articleId ? "Update" : "Post"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

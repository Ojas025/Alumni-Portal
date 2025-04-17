import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { UserProfileCard } from "./UserProfileCard";
import { Post } from "./Post";
import { PostForm } from "./PostForm";
import { UpcomingEvents } from "./UpcomingEvents";
import { Connections } from "./Connections";
import { useAuthorize } from "@/hooks/useAuthorize";
import { useNotification } from "@/hooks/useNotification";
import axios from "axios";
import { Spinner } from "@/components/ui/Spinner";

export interface Post {
  _id: string;
  author: {
    firstName: string;
    lastName: string;
    profileImageURL: string;
    _id: string;
    role: string;
  };
  content: string;
  likes: number;
}

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [Loading, setLoading] = useState(false);
  useAuthorize();
  const { notify } = useNotification();

  const { user, loading } = useSelector((state: RootState) => state.user);

  const handlePost = async (content: string) => {
    if (!loading && !user) return;

    try {
      setLoading(true);
      const result = await axios.post(
        "http://localhost:3000/api/tweets",
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("Tweet posted", result);
      const tweet = result.data.data;

      if (tweet) {
        setPosts((prev) => [tweet, ...prev]);
        notify({
          id: "post-toast",
          type: "success",
          content: "Tweet posted successfully",
        });
      }
    } catch (error) {
      console.error("Error posting post", error);
      notify({
        id: "post-toast",
        type: "error",
        content: "Error posting tweet",
      });
    }
    setLoading(false);
  };

  const deletePost = async (tweetId: string) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/tweets/tweet/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setPosts((prev) => prev.filter((post) => post._id !== tweetId));
      notify({
        id: "post-toast",
        type: "success",
        content: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Error fetching posts", error);

      notify({
        id: "post-toast",
        type: "error",
        content: "Could not delete post",
      });
    }

    setLoading(false);
  };

  const updatePost = async (content: string, tweetId: string) => {
    try {
      setLoading(true);
      console.log(content);
      const result = await axios.put(
        `http://localhost:3000/api/tweets/tweet/${tweetId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("Tweet updated", result);
      const tweet = result.data.data;

      if (tweet) {
        setPosts((prev) =>
          prev.map((post) => (post._id === tweetId ? tweet : post))
        );
        notify({
          id: "post-toast",
          type: "success",
          content: "Tweet updated successfully",
        });
      }
    } catch (error) {
      console.error("Error posting post", error);
      notify({
        id: "post-toast",
        type: "error",
        content: "Error updating tweet",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      notify({ id: "welcome-toast", type: "info", content: "Welcome!" });
    }

    const fetchPosts = async () => {
      if (!loading && !user) return;

      try {
        setLoading(true);
        const result = await axios.get(
          "http://localhost:3000/api/tweets?page=1&limit=10",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setPosts(result.data?.data.tweets);

        if (posts.length > 0) {
          notify({
            id: "post-toast",
            type: "success",
            content: "Posts fetched successfully",
          });
        }
      } catch (error) {
        console.error("Error fetching posts", error);

        notify({
          id: "post-toast",
          type: "error",
          content: "Could not fetch posts",
        });
      }

      setLoading(false);
    };

    fetchPosts();
  }, [loading]);

  return (
    <div className="w-full min-h-screen px-6 md:px-0 dark:bg-[#000000] bg-[#e6e9da] dark:text-white text-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-center md:justify-end gap-x-8 gap-y-6 px-4 md:px-10 py-6">
        {/* Left Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <UserProfileCard />
        </div>

        {/* Center Feed */}
        <div className="col-span-2 justify-center items-center space-y-6 order-3 md:order-2">
          <PostForm handlePost={handlePost} />

          {Loading ? (
            <Spinner />
          ) : (
            posts.map((post) => (
              <Post
                key={post._id}
                _id={post._id}
                owner={{
                  firstName: post?.author?.firstName,
                  lastName: post?.author?.lastName,
                  _id: post?.author?._id,
                  profileImageURL: post?.author?.profileImageURL,
                  role: post?.author?.role,
                }}
                content={post?.content}
                likes={post?.likes}
                deletePost={deletePost}
                updatePost={updatePost}
              />
            ))
          )}
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-1 space-y-6 order-2 md:order-3">
          <UpcomingEvents />
          <Connections />
        </div>
      </div>
    </div>
  );
};

// {}

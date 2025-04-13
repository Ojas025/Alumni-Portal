import { useAuthorize } from "@/hooks/useAuthorize"
import axios from "axios";
import { useEffect, useState } from "react";

export const Mentor = () => {
  useAuthorize();
  const [message, setMessage] = useState("");

  useEffect(() => {

    const makePythonBackendRequest = async () => {
      const result = await axios.get(
        'http://127.0.0.1:8000/api/mentor',
      ) 

      setMessage(result.data.message);
      console.log(result);
    };

    makePythonBackendRequest();
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center text-4xl font-semibold">
      {message ? message : "Not yet"}
    </div>
  )
}

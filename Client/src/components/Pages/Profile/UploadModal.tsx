import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";
import { IoIosClose } from "react-icons/io";

export const UploadModal = ({
  setModalVisibility,
  handleSelectFile,
  imageSrc,
  error,
  handleImageUpload,
}: {
  setModalVisibility: Dispatch<SetStateAction<boolean>>;
  handleSelectFile: (e: ChangeEvent<HTMLInputElement>) => void;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  error: string;
  imageSrc: string;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="z-100 bg-black/70 flex w-screen my-8 justify-center min-h-screen items-center top-0 fixed">
      <div className="bg-[#222] max-w-[60%] h-max max-h-[85vh]  rounded-lg overflow-y-scroll">
        <div className="w-full py-4 px-6 relative">
          <IoIosClose
            className="w-8 h-8 text-blue-300 cursor-pointer absolute top-2 right-2"
            onClick={() => setModalVisibility((prev) => !prev)}
          />

          <label htmlFor="image" className="block mb-8">
            <span className="sr-only">Choose profile image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleSelectFile}
              className="text-sm text-slate-500 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600 file:cursor-pointer"
            />
          </label>

          {error && <p className="text-red-400 terxt-xs">{error}</p>}

          {imageSrc && (
            <div className="flex items-center flex-col">
              <img
                src={imageSrc}
                alt="Upload"
                className="max-h-[50vh] w-[50vw] object-contain"
              />

              <button
                className="px-4 py-1 bg-gray-700 text-sky-300 hover:bg-gray-600 rounded-full mt-4 cursor-pointer font-semibold"
                onClick={handleImageUpload}
              >
                Upload
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

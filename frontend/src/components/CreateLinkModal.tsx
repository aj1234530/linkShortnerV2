import axios from "axios";
import { FormEvent, useState } from "react";
import { ToastContainer } from "react-toastify";
import { triggerToast } from "../libs/toasthelperFunction";
function CreateLinkModal({
  createLinkModalOpen,
  setCreateLinkModalOpen,
}: {
  createLinkModalOpen: boolean;
  setCreateLinkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [destinationUrl, setDestinationUrl] = useState<null | string>(null);
  const [tags, setTags] = useState<null | string>(null);
  const [comments, setComments] = useState<null | string>(null);

  const handleLinkCreation = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://4096-115-245-205-158.ngrok-free.app/api/v1/user/authorised/createshortlinks",
        {
          originalUrlFromBody: destinationUrl,
          tags: tags,
          comments: comments,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response);
      if (response.status == 200) {
        triggerToast("link created", "success");
        setMessage("link created ");
        setTimeout(() => setCreateLinkModalOpen(false), 1000);
      }
    } catch (error) {
      setMessage("Link creationg failed,try again");
      console.log(error);
    }
  };

  return (
    <div
      aria-hidden="true"
      className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm"
    >
      <ToastContainer />
      <div className="relative p-4 w-full max-w-xl max-h-full border rounded-lg ">
        <form
          onSubmit={handleLinkCreation}
          className="flex flex-col gap-5 justify-center w-full"
        >
          <div className="flex flex-col">
            <label>Enter Destination Link</label>
            <input
              onChange={(e) => setDestinationUrl(e.target.value)}
              type="text"
              placeholder="Enter Destination Link"
              className="border rounded-lg !p-2"
            />
          </div>
          <div className="flex flex-col">
            <label>Enter tags separated by comma</label>
            <input
              onChange={(e) => setTags(e.target.value)}
              type="text"
              placeholder="optional"
              className="border rounded-lg !p-2"
            />
          </div>
          <div className="flex flex-col">
            <label>Comments</label>
            <input
              onChange={(e) => setComments(e.target.value)}
              type="text"
              placeholder="optional"
              className="border rounded-lg !p-2"
            />
          </div>
          <div className="flex justify-between">
            <button
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={() => setCreateLinkModalOpen(false)}
            >
              Close
            </button>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>
        </form>
        {message && <div>{message}</div>}
      </div>
    </div>
  );
}

export default CreateLinkModal;

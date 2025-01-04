import axios from "axios";
import { useEffect, useState } from "react";
//on mouting this coomponet it runs
//CAN WE CREATE CUSTOM HOOK OUT OF THIS
function CreateShortLink({ longLink }: { longLink: string | null }) {
  const [shortenedLink, setshortenedLink] = useState<string | null>(null);
  const createShortLink = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/createshortlinks",
        {
          originalUrlFromBody: longLink,
          
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setshortenedLink(response.data.shortenedUrl);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    createShortLink();
    return () => setshortenedLink(null); //setting the shortened link to null on unmounting
  }, []);
  return (
    <div className="short-link-input-output">
      <a target="blank" href={`http://${shortenedLink}`}>
        {shortenedLink}
      </a>
    </div>
  );
}

export default CreateShortLink;

//goal is to make a custom hook that fetches the shortened link when passed a lonk link

//this hook is return (giving ) two things - 1. function 2. shortened link
//when the fucntion is called it makes call to backend(with url set to the hook) and set shortendlin which is initially null
//i don't know if there should be an useEffect here

//this hook has been at 1. root page  2.
import axios from "axios";
import { useState } from "react";
const useShortLink = (longLink: string | null) => {
  const [shortendUrl, setShortenedLink] = useState<string | null>(null);

  const fetchShortLink = async () => {
    try {
      if (longLink) {
        const response = await axios.post(longLink);
        setShortenedLink(response.data.shortenedLink);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return { shortendUrl, fetchShortLink };
};
export default useShortLink;

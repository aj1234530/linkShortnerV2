import { useState } from "react";
import axios from "axios";
export let urls: Map<string, string> = new Map(); //TODO - notice the type definition
export let counterForUrl: Map<string, number> = new Map(); //will store the url counter
// export let v: number[] = [];
// v.push(2);
function CreateLink() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const shortenedUrl = linkShortnerEngine(originalUrl); //call the fxn with the url (store in use state);
    setShortUrl(shortenedUrl);
    const response = await axios.post(
      "http://localhost:8080/createshortlinks", //backend route changing  -- change here also
      {
        shortenedUrl: shortenedUrl,
        originalUrl: originalUrl,
      }
    );
    console.log(response);
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="url-input"
          onChange={(e) => setOriginalUrl(e.target.value)}
        ></input>
        <button className="submit-button" type="submit">
          {" "}
          Shorten Your Url
        </button>
        {shortUrl && (
          <p>
            Your short-link: <div className="short-url-box">{shortUrl}</div>
          </p>
        )}
      </form>
    </>
  );
}

//will take string
const linkShortnerEngine = (url: string) => {
  const shortenedUrl = "localhost:5173/dub/" + Date.now();
  urls.set(shortenedUrl, url);
  return shortenedUrl;
};

export default CreateLink;

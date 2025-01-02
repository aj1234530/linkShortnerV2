import CreateShortLink from "../components/CreateShortLink";
import Navbar from "../components/Navbar";
import "../App.css";
import { useState } from "react";
function Root() {
  const [showLink, setShowLink] = useState(false);
  const [linkInput, setLinkInput] = useState<null | string>(null);
  const handleClick = () => {
    setShowLink(true);
  };
  return (
    <div>
      <Navbar />
      <div className="content">
        <h1>Short Links with</h1>
        <h2>superpowers</h2>
        <p>Dub.co is the open-source link management</p>
        <p>infrastructure for modern marketing teams</p>
        <div className="short-link-container">
          <div className="input-area">
            <input
              placeholder="Shorten any link"
              onChange={(e) => setLinkInput(e.target.value)}
              className="link-input"
            />
            <button onClick={handleClick} className="shorten-btn">
              Short Now
            </button>
          </div>
          <div className="root-page-short-link-area">
            <div>
              Your Short Link:{" "}
              {showLink && <CreateShortLink longLink={linkInput} />}
            </div>
          </div>
        </div>
        <div className="cta-info">
          <div>Want to claim your links, edit, or view their analytics?</div>
          <div>Create a free account to get started</div>
        </div>
      </div>
    </div>
  );
}

export default Root;

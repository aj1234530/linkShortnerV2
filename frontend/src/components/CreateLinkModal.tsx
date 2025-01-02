import { useState } from "react";
import "../App.css";
import axios from "axios";
function CreateLinkModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [destinationUrl, setDestinationUrl] = useState<null | string>(null);
  const [shortenedLink, setshortenedLink] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      console.log(shortenedLink);
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/createshortlinks",
        {
          originalUrlFromBody: destinationUrl,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setshortenedLink(response.data.shortenedUrl); //not showing shortened url , it will show on refresh
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="modal-container">
      {/* Button to open the modal */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="open-modal-btn">
          Create Link
        </button>
      )}

      {/* Modal Overlay and Form */}
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Close Button */}
            <button onClick={() => setIsOpen(false)} className="close-btn">
              &times;
            </button>

            <form onSubmit={handleSubmit}>
              <h2 className="modal-title">Create a New Link</h2>

              <div className="form-group">
                <label htmlFor="destination-url">Destination URL</label>
                <input
                  id="destination-url"
                  type="url"
                  required
                  placeholder="Enter URL"
                  className="input-field"
                  onChange={(e) => setDestinationUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  id="tags"
                  placeholder="Optional"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="comments">Comments</label>
                <input
                  id="comments"
                  placeholder="Add comments"
                  className="input-field"
                />
              </div>

              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateLinkModal;

import { useEffect, useState } from "react";
import axios from "axios";

interface fetchedLink {
  id: string;
  userId: string;
  shortenedUrlUniqueSlug: string;
  originalUrl: string;
  clicksCount: number; //be careful here may be coming as string
}
function Links() {
  const [fetchedLinks, setFectchedLinks] = useState<fetchedLink[]>([]);
  //fetch call to backedn //we can cache it ()
  const fetchAllLinks = async () => {
    const response = await axios.get(
      "http://localhost:3001/api/v1/user/links",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    if (response.status === 200) {
      setFectchedLinks(response.data.urlsArray);
    }
    console.log(response);
  };
  useEffect(() => {
    try {
      fetchAllLinks();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="page-container">
      <div className="main-content">
        <h1 className="page-title">Links</h1>
        <div className="link-cards">
          {fetchedLinks.length > 0 ? (
            fetchedLinks.map((link) => (
              <div key={link.id} className="link-card-horizontal">
                <div className="link-card-left">
                  <a href={link.originalUrl} className="link-original">
                    {link.originalUrl}
                  </a>
                </div>
                <div className="link-card-right">
                  <a
                    href={`http://localhost:5173/user/${link.shortenedUrlUniqueSlug}`}
                    className="link-shortened"
                  >
                    {`localhost:5173/user/${link.shortenedUrlUniqueSlug}`}
                  </a>
                  <span className="clicks-count">
                    Clicks: {link.clicksCount}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-links">No Links Found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Links;

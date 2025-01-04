import { useEffect, useState } from "react";
import LoggedInNavbar from "../components/LoggedInNavbar";
import CreateLinkModal from "../components/CreateLinkModal";
import axios from "axios";
import LinkWrapperCard from "../components/LinkWrapperCard";
function Dashboard() {
  interface fetchedLinks {
    clicksCount: number; //may need to parse
    originalUrl: string;
    shortenedUrlUniqueSlug: string;
    comments: string;
    tags: string[];
  }
  interface response {
    data: {
      urlsArray: fetchedLinks[];
    };
    status: number;
  }
  const [createlinkModalOpen, setCreateLinkModalOpen] = useState(false);
  const [fetchedLinks, setFetchedLinks] = useState<null | fetchedLinks[]>(null);
  useEffect(() => {
    async function fetchAllLinks() {
      const response: response = await axios.get(
        "http://localhost:3000/api/v1/user/links",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setFetchedLinks(response.data.urlsArray);
      console.log(response);
    }
    fetchAllLinks();
  }, [createlinkModalOpen]);

  return (
    <div>
      <LoggedInNavbar setCreateLinkModalOpen={setCreateLinkModalOpen} />
      {createlinkModalOpen && (
        <CreateLinkModal
          createLinkModalOpen={createlinkModalOpen}
          setCreateLinkModalOpen={setCreateLinkModalOpen}
        />
      )}
      {fetchedLinks ? (
        <div>
          {fetchedLinks.map((el, index) => (
            <LinkWrapperCard
              originalUrl={el.originalUrl}
              shortUrl={`localhost:5173/user/${el.shortenedUrlUniqueSlug}`}
              clicksCount={el.clicksCount}
            />
          ))}
        </div>
      ) : (
        <div>No Links to Show, create new or try logging again</div>
      )}
    </div>
  );
}

export default Dashboard;

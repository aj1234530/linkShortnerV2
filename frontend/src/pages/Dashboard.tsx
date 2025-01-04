import { useState } from "react";
import LoggedInNavbar from "../components/LoggedInNavbar";
import CreateLinkModal from "../components/CreateLinkModal";
function Dashboard() {
  const [createlinkModalOpen, setCreateLinkModalOpen] = useState(false);
  return (
    <div>
      <LoggedInNavbar setCreateLinkModalOpen={setCreateLinkModalOpen} />
      {createlinkModalOpen && (
        <CreateLinkModal
          createLinkModalOpen={createlinkModalOpen}
          setCreateLinkModalOpen={setCreateLinkModalOpen}
        />
      )}
      
    </div>
  );
}

export default Dashboard;

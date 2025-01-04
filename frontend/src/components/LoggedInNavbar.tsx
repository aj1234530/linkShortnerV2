import { Link } from "react-router-dom";
function LoggedInNavbar({
  setCreateLinkModalOpen,
}: {
  setCreateLinkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function handleCreateLinkModal() {
    setCreateLinkModalOpen(true);
  }

  return (
    <nav className="sticky top-0 bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <Link
          to="/user/dashboard"
          className="text-blue-600 font-medium hover:underline"
        >
          Dashboard
        </Link>
        <button
          onClick={handleCreateLinkModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Link
        </button>
      </div>
    </nav>
  );
}

export default LoggedInNavbar;

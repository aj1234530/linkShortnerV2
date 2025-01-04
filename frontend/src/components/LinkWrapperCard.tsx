import "../index.css";
function LinkWrapperCard({
  originalUrl,
  shortUrl,
  clicksCount,
}: {
  originalUrl: string;
  shortUrl: string;
  clicksCount: number;
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white">
      <div>
        <p className="text-sm text-gray-600">{shortUrl}</p>
        <p className="text-xs text-gray-400">{originalUrl}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">
          {clicksCount} click{clicksCount !== 1 && "s"}
        </p>
      </div>
    </div>
  );
}

export default LinkWrapperCard;

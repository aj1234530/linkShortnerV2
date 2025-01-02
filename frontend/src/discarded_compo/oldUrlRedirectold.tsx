import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { urls } from "../CreateLink";
import axios from "axios";
function UrlRedirect() {
  console.log(urls); //why map is becoming reset in this call
  const location = useLocation();
  useEffect(() => {
    const shortenedUrl = `localhost:5173${location.pathname}`;
    console.log("sent", shortenedUrl);
    const response = axios
      .get("http://localhost:8080/getoriginallink")
      .then((response) => {
        console.log(response.data.originalUrl);
        window.location.href = response.data.originalUrl;
        return;
      })
      .catch((err) => console.log(err));
    console.log(response);
  }, []);

  return <div>{location.pathname}</div>;
}

export default UrlRedirect;

//we won't use window.location.href
//we will try to use useNavigate() from rrd
//set path /dub/* to this componet
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NotFound from "./NotFound";

function UrlRedirectnew() {
  const location = useLocation();
  const [redirectMessage, setRedirectMessage] = useState<null | string>(null);
  const [notFoundMessage, setNotFoundMessage] = useState<null | boolean>(false);

  console.log(location);
  const handleRedirect = async () => {
    const uniqueSlugForBackend = location.pathname.split("").slice(6).join(""); //using slice to cut the (/user/)
    try {
      setRedirectMessage("redirecting");
      const response = await axios.post(
        "https://4096-115-245-205-158.ngrok-free.app/api/v1/user/accessoriginallink",
        {
          //sending the body , to be cofiremed if reachers(diff synatax than axios post)
          shortenedUrlUniqueSlug: uniqueSlugForBackend,
        }
      );
      console.log(response);
      console.log(response.data);
      if (response.status === 200) {
        const orignalUrl = response.data.originalUrl;
        //   //if the url doesnot start with http or https , it won't be directed ans browser also express, just place  link it after the url directing ,and hence error (eg- chatpt.com - becomes localhot:3000/xyz/chatgpt.com and if http://chatgpt.com it is redirected )
        //   //good new is if http prefixed it will work for https also and but vv
        window.location.href = `${orignalUrl}`;
      }
    } catch (err) {
      setRedirectMessage(null);
      setNotFoundMessage(true);
      console.log("invalid");
    }
  };
  useEffect(() => {
    //just calling the fxn
    handleRedirect();
  }, []);
  return (
    <>
      {redirectMessage && <div>{redirectMessage}</div>}
      {notFoundMessage && <NotFound />}
    </>
  );
}

export default UrlRedirectnew;

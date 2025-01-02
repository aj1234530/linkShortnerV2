//we won't use window.location.href
//we will try to use useNavigate() from rrd
//set path /dub/* to this componet
import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function UrlRedirectnew() {
  const location = useLocation();
  const handleRedirect = async () => {
    const uniqueSlugForBackend = location.pathname.split("").slice(6).join(""); //using slice to cut the (/user/)
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/accessoriginallink",
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
      console.log("invalid");
    }
  };
  useEffect(() => {
    //just calling the fxn
    handleRedirect();
  }, []);
  return (
    <>
      <div>Redirecting Please Wait</div>
    </>
  );
}

export default UrlRedirectnew;

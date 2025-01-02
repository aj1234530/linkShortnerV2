import { useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const navigate = useNavigate(); //for redirect;
  const [email, setEmail] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);
  const [message, setMessage] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //call to backend
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3001/api/v1/auth/login",
        {
          email: email,
          password: password,
        }
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setIsLoading(false);
        setMessage(response.data?.message || "Login  success");
        //redirect logic
        navigate(`/${response.data?.username}/dashboard`); //will navigate to the (use / at start for absoulte path otherwise it willrelate)/ak12/dashboard(but how to maintain it )
      }
      //fix the any here
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      console.log(error?.response?.data?.message);
      setMessage(error?.response?.data?.message || "Some error occured"); //fallback
    }
  };
  return (
    <>
      <Navbar />
      <div className="parent-login-signup-form-container">
        <div className="login-signup-formContainer">
          <form onSubmit={handleSubmit}>
            <div className="form-inputs">
              <label htmlFor="email-input">Email</label>{" "}
              <input
                className="input-box"
                id="email-input"
                placeholder="enter you email"
                required
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <label htmlFor="password-input">Password</label>
              <input
                className="input-box"
                id="password-input"
                placeholder="enter you email"
                required
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <button className="login-signup-submit-button" type="submit">
                Submit
              </button>
            </div>
          </form>{" "}
          {isLoading && <div>Loading...please wait</div>}
          {message && <div>{message}</div>}
        </div>
      </div>
    </>
  );
}

export default LoginPage;

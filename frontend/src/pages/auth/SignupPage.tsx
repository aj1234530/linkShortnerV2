import { useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<null | string>(null);
  const [email, setEmail] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<null | string>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //call to backend
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3001/api/v1/auth/signup",
        {
          username: username,
          email: email,
          password: password,
        }
      );
      console.log(response);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setIsLoading(false);
        setMessage(
          response?.data?.message ||
            "Signup Successful, you will be redirecting to the dashboard"
        );
        //redirect logic

        navigate(`/${response?.data?.username})/dashboard`); //yet the session to be maintained on frontend
      }
    } catch (error: any) {
      setIsLoading(false);
      setMessage(
        error?.response?.data?.message ||
          "some error occured, retry a bit later"
      );
      console.log(error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="parent-login-signup-form-container">
        <div className="login-signup-formContainer">
          <form onSubmit={handleSubmit}>
            <div className="form-inputs">
              <label htmlFor="username-input">Username</label>{" "}
              <input
                className="input-box"
                id="username-input"
                placeholder="enter you username"
                required
                onChange={(e) => setUsername(e.target.value)}
              ></input>
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
                placeholder="enter you password"
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>{" "}
              <button type="submit" className="login-signup-submit-button">
                Submit
              </button>
            </div>
          </form>
          {isLoading && <div>Loading...Please wait </div>}
          {message && <div>{message}</div>}
        </div>
      </div>
    </>
  );
}
export default SignupPage;

import { useEffect, useState } from "react";
import yhteys from "./yhteys";
import loginService from "../services/login.js";
import Notification from "../../components/notification.jsx";
import blogService from "../services/blogs.js";
import "./index.css";
import BlogForm from "../../components/blogForm.jsx";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [blogit, setBlogit] = useState([]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
      setSuccessMessage("Kirjautuminen onnistui!");
      setMessageType("success");
      setTimeout(() => {
        setSuccessMessage(null);
        setMessageType("");
      }, 5000);
    } catch (exception) {
      setErrorMessage("Virheellinen käyttäjätunnus tai salasana");
      setMessageType("error");
      setTimeout(() => {
        setErrorMessage(null);
        setMessageType("");
      }, 5000);
    }
  };

  const logOut = () => {
    window.localStorage.removeItem("loggedBlogUser");
    setUser(null);
    setSuccessMessage("Kirjauduttu ulos!");
    setMessageType("success");
    setTimeout(() => {
      setSuccessMessage(null);
      setMessageType("");
    }, 5000);
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    yhteys
      .getAll()
      .then((response) => {
        setBlogit(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleClick = (blogi) => {
    yhteys.remove(blogi);
    yhteys
      .getAll()
      .then((response) => {
        setBlogit(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div>
      <h1>Blogitekstisovellus!! Wuhuu!</h1>
      {user === null ? (
        <div>
          <h2>Kirjaudu sisään</h2>
          <div>
            Käyttäjänimi
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Salasana
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" onClick={handleLogin}>
            Kirjaudu
          </button>
          <Notification message={errorMessage || successMessage} type={messageType} />
        </div>
      ) : (
        <div>
          Kirjautuneena käyttäjänä {user.username}
          <button onClick={logOut}>Kirjaudu ulos</button>
          <Notification message={successMessage} type="success" />
          <h3>Siistit Blogit!!</h3>
          <ul>
            {blogit.map((blogi) => (
              <li key={blogi.id}>
                {blogi.title} - {blogi.author} - {blogi.likes} tykkäystä
                <button onClick={() => handleClick(blogi.id)}>Delete</button>
              </li>
            ))}
          </ul>
          <BlogForm 
            setBlogit={setBlogit} 
            blogit={blogit} 
            setSuccessMessage={setSuccessMessage} 
            setMessageType={setMessageType}
          /> 
        </div>
      )}
    </div>
  );
};

export default App;

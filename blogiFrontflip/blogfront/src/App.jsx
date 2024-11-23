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
  const [visibleDetails, setVisibleDetails] = useState({});
  const [visibleCreation, setVisibleCreation] = useState(false);

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

  const toggleDetails = (id) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const toggleCreation = () => {
    setVisibleCreation((prevState) => !prevState);
  };

  const handleLike = async (blogi) => {
    try {
      const updatedBlog = {
        user: blogi.user.id || blogi.user, // Backend vaatii pelkän user ID:n
        likes: blogi.likes + 1,
        author: blogi.author,
        title: blogi.title,
        url: blogi.url,
      };
      const response = await blogService.update(blogi.id, updatedBlog);

      setBlogit(blogit.map((b) => (b.id === blogi.id ? response : b)));
      setSuccessMessage(`Tykkäsit blogista "${blogi.title}"!`);
      setMessageType("success");
      setTimeout(() => {
        setSuccessMessage(null);
        setMessageType("");
      }, 5000);
    } catch (error) {
      console.error("Error updating likes:", error);
      setErrorMessage("Tykkäyksen päivitys epäonnistui.");
      setMessageType("error");
      setTimeout(() => {
        setErrorMessage(null);
        setMessageType("");
      }, 5000);
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 2,
    borderColor: "black",
    marginBottom: 5,
    marginTop: 5,
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
              <li key={blogi.id} style={blogStyle}>
                {blogi.title}{" "}
                <button onClick={() => toggleDetails(blogi.id)}>
                  {visibleDetails[blogi.id] ? "Pienennä" : "Näytä Lisää"}
                </button>
                {visibleDetails[blogi.id] && (
                  <div>
                    <p>Tekijä: {blogi.author}</p>
                    <p>URL: {blogi.url}</p>
                    <p>
                      Tykkäykset: {blogi.likes}{" "}
                      <button onClick={() => handleLike(blogi)}>Tykkää</button>
                    </p>
                    <button onClick={() => handleClick(blogi.id)}>Poista</button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <button onClick={toggleCreation}>{visibleCreation ? "Peruuta" : "Luo Blogi"}</button>
          {visibleCreation && (
            <BlogForm
              setBlogit={setBlogit}
              blogit={blogit}
              setSuccessMessage={setSuccessMessage}
              setMessageType={setMessageType}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;

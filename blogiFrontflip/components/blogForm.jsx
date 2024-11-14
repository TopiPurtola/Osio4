import { useState } from "react";
import blogService from "../blogfront/services/blogs";

const BlogForm = ({ setBlogit, blogit, setSuccessMessage, setMessageType }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const createBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
      likes: 0,
    };
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogit(blogit.concat(returnedBlog));
      setNewBlog({ title: "", author: "", url: "" });
      setSuccessMessage(`Blogi "${returnedBlog.title}" tekijältä "${returnedBlog.author}" lisätty onnistuneesti!`);
      setMessageType("success");
      setTimeout(() => {
        setSuccessMessage(null);
        setMessageType("");
      }, 5000);
    });
  };

  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  return (
    <div>
      <h3>Luo uusi blogi</h3>
      <form onSubmit={createBlog}>
        Otsikko:{" "}
        <input
          type="text"
          value={newBlog.title}
          name="title"
          onChange={handleBlogChange}
        />{" "}
        <br />
        Tekijä:{" "}
        <input
          type="text"
          value={newBlog.author}
          name="author"
          onChange={handleBlogChange}
        />{" "}
        <br />
        Url:{" "}
        <input
          type="text"
          value={newBlog.url}
          name="url"
          onChange={handleBlogChange}
        />{" "}
        <br />
        <button type="submit">Postaa Blogi</button>
      </form>
    </div>
  );
};

export default BlogForm;
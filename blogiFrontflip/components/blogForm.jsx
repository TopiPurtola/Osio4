const BlogForm = ({ createBlog, newBlog, handleBlogChange, naytaLoki }) => {
    return (
        <div>
            <h3>Luo uusi blogi</h3>
            <form onSubmit={createBlog}>
                Otsikko: <input type="text" value={newBlog.title} name='title' onChange={handleBlogChange} /> <br />
                Tekijä: <input type="text" value={newBlog.author} name='author' onChange={handleBlogChange} /> <br />
                Url: <input type="text" value={newBlog.url} name='url' onChange={handleBlogChange} /> <br />
                <button type="submit">Postaa Blogi</button>
                <button type="button" onClick={naytaLoki}>Perruuta</button>
            </form>
        </div>
    );
};

export default BlogForm;

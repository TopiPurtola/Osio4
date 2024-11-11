import { useEffect, useState } from "react"
import yhteys from "./yhteys"
import loginService from '../services/login.js'
import Notification from "../../components/notification.jsx"
import blogService from "../services/blogs.js"
import "./index.css"
import BlogForm from "../../components/blogForm.jsx"

const App = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [messageType, setMessageType] = useState('')
  const [visibleCreation, setVisibleCreation] =useState(null)
  
  const [blogit, setBlogit] = useState([]); // Alustetaan tyhjä taulukko
  
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })


const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })


      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('Kirjautuminen onnistui!')
      setMessageType('success')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Virheellinen käyttäjätunnus tai salasana')
      setMessageType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const createBlog = (event) =>{
    event.preventDefault()
    
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
      likes: 0
    }
    blogService.create(blogObject).then(returnedBlog => {
      setBlogit(blogit.concat(returnedBlog))
      setNewBlog({title: '', author: '', url: ''});
    }) 

    setSuccessMessage('Blogi "'+ newBlog.title + '" tekijältä "' +newBlog.author + '" lisätty onnistuneesti!' )
    setMessageType('success')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      
      setVisibleCreation(false)
  }

  const handleBlogChange = (event) =>{
    const {name, value} = event.target;
    setNewBlog({...newBlog, [name]: value}) 
  }

  const logOut = () =>{
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null);
    setSuccessMessage('Kirjauduttu ulos!')
    setMessageType('success')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    yhteys.getAll()
      .then(response => {
        setBlogit(response.data)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
      });
  }, [])

  const handleClick = (blogi) =>{
    yhteys.remove(blogi)
    yhteys.getAll()
      .then(response => {
        setBlogit(response.data)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
      });
  }

  const naytaLoki = () =>{
    if(visibleCreation === true){
      setVisibleCreation(false)
    }
    else{
      setVisibleCreation(true)
    }
    
  }

  const lokinLuonti = () =>{
    if(visibleCreation === true){
      return(
        <BlogForm
                createBlog={createBlog}
                newBlog={newBlog}
                handleBlogChange={handleBlogChange}
                naytaLoki={naytaLoki}
            />
      )
    }
    else{
      return(
        <div>
          <button onClick={naytaLoki}>Luo Blogi</button>
        </div>
      )
    }
  }
  if (user === null){
    return(
      <div>
        <h2>Kirjaudu ineen</h2>
      <div>
        Käyttäjänimi 
        <input type="text" value={username} name="Username" onChange={({target}) => setUsername(target.value)}/>
      </div>
      <div>
        Salasana
        <input type="password" value={password} name="Password" onChange={({target}) => setPassword(target.value)}/> 
      </div>
      <div>
        <button type="submit" onClick={handleLogin}>Kirjaudu</button>
      </div>
      <Notification message={errorMessage} type={messageType}/>
      <Notification message={successMessage} type={messageType}/>
      </div>
    )
  }

  return (
    <div>
      <h1>Blogitekstisovellus!! Wuhuu!</h1>
      Kirjauduttu sisään käyttäjällä {user.username}<br/>
      <Notification message={successMessage} type={messageType}/>
      <button onClick={logOut}>Kirjaudu Ulos</button>
      <h3>Siistit Blogit!!</h3>
      <ul>
        {blogit.map(blogi => (
          <li key={blogi.id}>{blogi.title} - {blogi.author} - {blogi.likes} tykkäystä <button onClick={() => handleClick(blogi.id)}>Delete</button></li>
        ))}
      </ul>
      {lokinLuonti()}
    </div>
  )
}

export default App

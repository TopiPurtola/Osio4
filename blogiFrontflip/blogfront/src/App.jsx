import { useEffect, useState } from "react"
import yhteys from "./yhteys"
import loginService from '../services/login.js'

const App = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [blogit, setBlogit] = useState([]); // Alustetaan tyhjä taulukko
  


const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

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
      </div>
    )
  }

  return (
    <div>
      <h1>Blogitekstisovellus!! Wuhuu!</h1>
      Kirjauduttu sisään käyttäjällä {user.username}
      <h3>Siistit Blogit!!</h3>
      <ul>
        {blogit.map(blogi => (
          <li key={blogi.id}>{blogi.title} - {blogi.author} - {blogi.likes} tykkäystä <button onClick={() => handleClick(blogi.id)}>Delete</button></li>
        ))}
      </ul>
    </div>
  )
}

export default App

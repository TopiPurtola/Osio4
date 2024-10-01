import { useEffect, useState } from "react"
import yhteys from "./yhteys"

const App = () => {
  const [blogit, setBlogit] = useState([]); // Alustetaan tyhjä taulukko
  


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

  return (
    <div>
      <h1>Blogitekstisovellus!! Wuhuu!</h1>
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

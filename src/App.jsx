import { useState } from 'react'
import Header from './Components/Header'
import Cards from './Components/Cards'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <Cards/>
    </>
  )
}

export default App

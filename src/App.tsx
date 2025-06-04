import './App.css'
import HomePage from './components/home-page/home-page'


import { BrowserRouter as Router } from "react-router-dom";


const App = () => {
  return(
    <>
      <Router>
        <HomePage />
    </Router>
    </>
  )
}

export default App

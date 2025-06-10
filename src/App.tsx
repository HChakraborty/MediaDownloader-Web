import './App.css'
import HomePage from './pages/home-page/home-page'


import { BrowserRouter as Router } from "react-router-dom";


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();





const App = () => {
  return(
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
            <HomePage />
        </Router>
      </QueryClientProvider>
    </>
  )
}

export default App

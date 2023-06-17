import { Header } from './Components/Header'
import { Liste } from './Pages/Liste'
import { SearchByTitle } from './Components/SearchByTitle'
import { Check } from './Components/Check'
import { Up } from "./Components/Up"
import Infos from './Pages/Infos'
import Post from './Pages/Post'
import SetManga from './Pages/SetManga'
import Home from './Pages/Home'
import {Route, Routes, useLocation} from 'react-router-dom'

function App() {
  const location = useLocation()

  const showHeaderAndUp = location.pathname !== '/'

  return (
    <div style={{width: '100%', height: '100%'}}>
      <Routes>
        <Route path='/' element={<Home />}></Route>
      </Routes>
      
      {showHeaderAndUp && <Header />}
      {showHeaderAndUp && <Up />}
      
      <Routes>
        <Route path='/liste' element={<Liste />}></Route>
        <Route name='search' path='/searchTitle/:uid' element={<SearchByTitle />}></Route>
        <Route path='/post' element={<Post />}></Route>
        <Route path='/check' element={<Check />}></Route>
        <Route path='/infos/:uid' element={<Infos />}></Route>
        <Route path='/SetManga/:uid' element={<SetManga />}></Route>
      </Routes>
    </div>
  )
}

export default App


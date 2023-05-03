import './css/App.css'
import { Header } from './Components/Header'
import { Liste } from './Components/Liste'
import { Search } from './Components/Search'
import { Check } from './Components/Check'
import { Up } from "./Components/Up"
import Infos from './Pages/Infos'
import Post from './Pages/Post'
import {Route, Routes} from 'react-router-dom'


function App() {
  return (
    <div>
      <Header />
      <Up />
      <Routes>
        <Route path='/' element={<Liste />}></Route>
        <Route name='search' path='/search/:uid' element={<Search />}></Route>
        <Route path='/post' element={<Post />}></Route>
        <Route path='/check' element={<Check />}></Route>
        <Route path='/infos/:uid' element={<Infos />}></Route>
      </Routes>
    </div>
  )
}

export default App

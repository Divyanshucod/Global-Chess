import {BrowserRouter,Route,Routes} from 'react-router-dom'
import './App.css';
import { Landing } from './screens/landing.tsx';
import { Game } from './screens/game.tsx';
import LoginPage from './screens/LoginPage.tsx';



function App() {
  return (
    <div className='h-full bg-gray-900 text-white p-2 sm:p-10'>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/landing' element={<Landing/>}/>
      <Route path='/game' element={<Game/>}/>
    </Routes> 
    </BrowserRouter>
    </div>
  );
}

export default App;

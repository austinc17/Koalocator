import { useState } from 'react'

import './App.css'
import Header from './Components/Header'
import Map from './Components/Map'
import 'leaflet/dist/leaflet.css';
import Koala from './Components/Koala';
import Quiz from './Components/Quiz';

function App() {
  

  return (
    <>
      <Header/>
      <Map/>
      <Koala/>
      <Quiz/>
    </>
  )
}

export default App

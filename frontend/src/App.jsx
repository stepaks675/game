import { useState } from 'react'
import { Game } from './Game'


function App() {
  

  return (
    <div className="w-screen h-screen flex justify-center items-center"
    style={{backgroundImage: "url('/assets/bg.webp')"}}>
      <Game/>
    </div>
  )
}

export default App

import React, { useState } from 'react'
import Scene from './components/3d/Scene'
import './index.css'

function App() {
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <Scene onIntroComplete={() => setIntroComplete(true)} />
    </div>
  )
}

export default App

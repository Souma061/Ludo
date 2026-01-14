import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import LudoBoard from './components/Board/BoardGrid'
import Dice from './components/Game/Dice'

function App() {
  const [diceValue, setDiceValue] = useState<number | null>(null);

  return (
    <div className='min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-8 py-8'>
      <h1 className='text-4xl font-bold text-white tracking-widest '> LUDO <span className='text-yellow-400'>GAME</span></h1>
      <LudoBoard />
      <div className='bg-slate-800 p-6 rounded-xl shadow-xl flex flex-col items-center gap-4'>
        <h2 className='text-white text-xl'>Current Roll: <span className='text-yellow-400 font-bold text-2xl '>{diceValue ?? "-"}</span></h2>
        <Dice onRoll={(value) => setDiceValue(value)} />
      </div>
    </div>
  )
}

export default App

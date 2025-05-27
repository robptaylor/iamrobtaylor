import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UKEnergy from './components/pages/UKEnergy'
import { Navbar } from './components/Navbar'

import { 
    GetGenerationPctLatest, 
    GetGenerationGWLast24h,
    GetGenerationPctLast24h,
    GetPriceLast24h,
    GetEmissionsLast24h,
    GetPriceLastWeek,
    GetEmissionsLastWeek
  } from './components/pages/UKEnergyAPI'

const ukEnergy = (
    <UKEnergy 
    getGenerationPctLatest={GetGenerationPctLatest}
    getGenerationGWLast24h={GetGenerationGWLast24h}
    getGenerationPctLast24h={GetGenerationPctLast24h}
    getPriceLast24h={GetPriceLast24h}
    getPriceLastWeek={GetPriceLastWeek}
    getEmissionsLast24h={GetEmissionsLast24h}
    getEmissionsLastWeek={GetEmissionsLastWeek}/>
)

function App() {
  return (
    <main>
      <BrowserRouter>
        <Navbar />
        <div className='min-h-screen w-full flex items-center justify-center'>
          <Routes>
            <Route path='/ukenergy' element={ukEnergy} />
          </Routes>
        </div>
      </BrowserRouter>
    </main>
  )
}
export default App
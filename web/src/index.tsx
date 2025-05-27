import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { 
  GetGenerationPctLatest, 
  GetGenerationGWLast24h,
  GetGenerationPctLast24h,
  GetPriceLast24h,
  GetEmissionsLast24h,
  GetPriceLastWeek,
  GetEmissionsLastWeek
} from './AppAPI'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App 
      getGenerationPctLatest={GetGenerationPctLatest}
      getGenerationGWLast24h={GetGenerationGWLast24h}
      getGenerationPctLast24h={GetGenerationPctLast24h}
      getPriceLast24h={GetPriceLast24h}
      getPriceLastWeek={GetPriceLastWeek}
      getEmissionsLast24h={GetEmissionsLast24h}
      getEmissionsLastWeek={GetEmissionsLastWeek}
      />
  </StrictMode>,
)

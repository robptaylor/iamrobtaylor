import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { GetGenerationPctLatest, GetGenerationGWLast24h, GetGenerationPctLast24h } from './AppAPI'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App 
      getGenerationPctLatest={GetGenerationPctLatest}
      getGenerationGWLast24h={GetGenerationGWLast24h}
      getGenerationPctLast24h={GetGenerationPctLast24h}
      />
  </StrictMode>,
)

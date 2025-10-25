import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { LoadingProvider } from './context/LoadingContext'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LoadingProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </LoadingProvider>
  </BrowserRouter>,
)

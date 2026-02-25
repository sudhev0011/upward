import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from './components/ui/sonner.tsx'
import AuthProvider from './components/common/AuthProvider.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* <AuthProvider> */}
        <App />
        <Toaster
          position="top-right"
          visibleToasts={5}
          richColors= {true}
          expand
          offset={{ top: '70px', right: "16px" }}
          
        />
        {/* </AuthProvider> */}
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)

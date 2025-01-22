import './App.css'
import LoginPage from './components/pages/login-page/LoginPage'
import RecoveryCodePage from './components/pages/recovery-code-page/RecoveryCodePage'
import RecoveryPasswordPage from './components/pages/recovery-password-page/RecoveryPasswordPage'
import RegistrationPage from './components/pages/registration-page/RegistrationPage'
import MainPage from './components/pages/main-page/MainPage'
import CategoryPage from './components/pages/category-page/CategoryPage'
import ReviewPage from './components/pages/review-page/ReviewPage'
import ResultPage from './components/pages/result-page/ResultPage'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { CategoryProvider } from './components/context/categoryContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './components/pages/landing-page/LandingPage'
import RequireNoAuth from './components/require-no-auth/RequireNoAuth'
import RequireAuth from './components/require-auth/RequireAuth'

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <CategoryProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{
              fontSize: '14px',
              maxWidth: '200px',
            }}
          />
          <Routes>
            <Route path='/' element={
              localStorage.getItem('token') ? <Navigate to='/main' replace /> : <LandingPage />
            } />
            <Route path="/register" element={
              <RequireNoAuth>
                <RegistrationPage />
              </RequireNoAuth>
            } />
            <Route path='/recovery-code' element={
              <RequireNoAuth>
                <RecoveryCodePage />
              </RequireNoAuth>
            } />
            <Route path='/login' element={
              <RequireNoAuth>
                <LoginPage />
              </RequireNoAuth>
            } />
            <Route path='/recovery-password' element={
              <RequireNoAuth>
                <RecoveryPasswordPage />
              </RequireNoAuth>
            } />


            <Route path='/main' element={
              <RequireAuth>
                <MainPage />
              </RequireAuth>
            } />
            <Route path='/category/:categoryId' element={
              <RequireAuth>
                <CategoryPage />
              </RequireAuth>
            } />
            <Route path='/review/:categoryId' element={
              <RequireAuth>
                <ReviewPage />
              </RequireAuth>
            } />
            <Route path='/result' element={
              <RequireAuth>
                <ResultPage />
              </RequireAuth>
            } />
          </Routes>
        </CategoryProvider>
      </BrowserRouter>
    </div>
  )
}

export default App

import './App.css'
import LoginPage from './components/pages/login-page/LoginPage'
import RecoveryCodePage from './components/pages/recovery-code-page/RecoveryCodePage'
import RecoveryPasswordPage from './components/pages/recovery-password-page/RecoveryPasswordPage'
import RegistrationPage from './components/pages/registration-page/RegistrationPage'
import MainPage from './components/pages/main-page/MainPage'
import CategoryPage from './components/pages/category-page/CategoryPage'
import WordPage from './components/pages/word-page/WordPage'
import ReviewPage from './components/pages/review-page/ReviewPage'
import NewPasswordPage from './components/pages/new-password-page/NewPasswordPage'
import ResultPage from './components/pages/result-page/ResultPage'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { CategoryProvider } from './components/context/categoryContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
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
            maxWidth: '200px'
          }}
        />
        <Routes>
          <Route path="/register" element={<RegistrationPage />} />
          <Route path='/recovery-code' element={<RecoveryCodePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/recovery-password' element={<RecoveryPasswordPage />} />
          {/* <Route path='/new-password' element={<NewPasswordPage />} /> */}
          <Route path='/main' element={<MainPage />} />
          <Route path='/category/:categoryId' element={<CategoryPage />} />
          <Route path='/word' element={<WordPage />} />
          <Route path='/review/:categoryId' element={<ReviewPage />} />
          <Route path='/result' element={<ResultPage />} />
        </Routes>
      </CategoryProvider>
    </BrowserRouter>
  )
}

export default App

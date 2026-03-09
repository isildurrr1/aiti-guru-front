import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from 'pages/login'
import { ProductsPage } from 'pages/products'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

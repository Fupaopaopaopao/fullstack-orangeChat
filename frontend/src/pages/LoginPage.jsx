import LogoSignUp from '../components/LogoSignUp'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthImagePattern from '../components/AuthImagePattern'
import { useAuthStore } from '../store/useAuthStore'
import LoginForm from '../components/login/LoginForm'
const LoginPage = () => {
  const { login } = useAuthStore()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const LoginSubmit = (e) => {
    e.preventDefault()
    login(formData)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <LogoSignUp />

          {/* login from */}
          <LoginForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={LoginSubmit}
          />
        </div>
        <div className="text-center mt-4">
          <p className="text-base-content/60">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="link link-primary">
              Create account
            </Link>
          </p>
        </div>
      </div>
      <AuthImagePattern
        title={'Welcome back!'}
        subtitle={
          "Lady Orange miss you so much. Don't forget to bring some snacks home."
        }
      />
    </div>
  )
}

export default LoginPage

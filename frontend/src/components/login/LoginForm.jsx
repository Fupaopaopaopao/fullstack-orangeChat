import { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Loader2 } from 'lucide-react'

const LoginForm = ({ formData, setFormData, handleSubmit }) => {
  const [showPassword, setShowPassword] = useState(false)
  const { isLoggingIn } = useAuthStore()

  return (
    <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
      {/* email imput */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Email</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Mail className="size-5 text-base-content/40" />
          </div>
          <input
            autoComplete="email"
            name="email"
            required
            type="email"
            className={`input input-bordered w-full pl-10`}
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
      </div>
      {/* password input */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Password</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Lock className="size-5 text-base-content/40" />
          </div>
          <input
            required
            autoComplete="current-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            className={`input input-bordered w-full pl-10`}
            placeholder={showPassword ? 'your password' : '••••••••'}
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => {
              setShowPassword((prev) => !prev)
            }}
          >
            {showPassword ? (
              <EyeOff className="size-5 text-base-content/40" />
            ) : (
              <Eye className="size-5 text-base-content/40" />
            )}
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary w-full "
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Loading...
          </>
        ) : (
          'Login'
        )}
      </button>
    </form>
  )
}

export default LoginForm

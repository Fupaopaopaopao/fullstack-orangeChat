import { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Loader2 } from 'lucide-react'

const SignupForm = ({ formData, setFormData, handleSubmit }) => {
  const [showPassword, setShowPassword] = useState(false)
  const { isSigningUp } = useAuthStore()

  return (
    <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
      {/* name input */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Full Name</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <User className="size-5 text-base-content/40" />
          </div>
          <input
            required
            type="text"
            className="input input-bordered w-full pl-10"
            placeholder="Your Full Name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />
        </div>
      </div>
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
            type={showPassword ? 'text' : 'password'}
            className={`input input-bordered w-full pl-10`}
            placeholder={showPassword ? 'your password' : '••••••••'}
            value={formData.password}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
            title="Must be more than 6 characters, including number, lowercase letter, uppercase letter"
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
        disabled={isSigningUp}
      >
        {isSigningUp ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Loading...
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  )
}

export default SignupForm

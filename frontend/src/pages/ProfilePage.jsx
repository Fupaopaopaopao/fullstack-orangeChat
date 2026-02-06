import { Camera, Mail, User } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useState } from 'react'

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore()
  const [selectedImage, setSelectedImage] = useState()

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = async () => {
      const base64Image = reader.result

      await updateProfile({ profilePic: base64Image })
      setSelectedImage(base64Image)
    }
  }

  return (
    <div className="pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          {/* title */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>
          {/* image upload */}

          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={selectedImage || authUser.profilePic || '/man.png'}
                className="rounded-full border-2 object-cover size-32"
              />

              {/* upload btn */}
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpdateProfile}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-base-content/40 mt-2">
              click the camera icon to upload profile image
            </p>
          </div>

          {/* TODO: make it editable */}
          <div>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
              <legend className="fieldset-legend">User details</legend>

              <label className="label">
                <span>
                  <User className='w-4 h-4"' />
                </span>
                Full name
              </label>
              <input
                type="text"
                name="name"
                className="input"
                value={authUser.fullName}
                disabled
              />

              <label className="label">
                <span>
                  <Mail className='w-4 h-4"' />
                </span>
                Email Address
              </label>

              <input
                type="text"
                name="email"
                className="input"
                value={authUser.email}
                disabled
              />
            </fieldset>
          </div>
        </div>
        <div className="mt-6 bg-base-300 rounded-xl p-6">
          <h2 className="text-lg font-medium  mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Member Since</span>
              <span>{authUser.createdAt?.split('T')[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

import React from 'react'
import AuthPage from './AuthPage'
import { useAuth } from '../../infrastructure/authentication/authContext'

const LoginForm = () => {
  const { login } = useAuth()
  console.log('loginloginlogin', login)
  return (
    <AuthPage>
      <div className="xl:col-span-3 lg:col-span-2 lg:mx-10 my-auto text-sky-700">
        <div>
          <h1 className="text-2xl/tight mb-3">Sign In</h1>
          <p className="text-lg font-medium leading-relaxed">We are here to help you to connect with you.</p>
        </div>

        <div className="space-y-5 mt-10">
          <div>
            <label className="font-medium text-sm block mb-2 text-sky-700" htmlFor="email">
              Email
            </label>
            <input
              className="text-gray-500 border-none focus:outline-none bg-white/30 focus:ring-0 focus:bg-white/50 text-sm rounded-lg py-2.5 px-4 w-full"
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium text-sm text-sky-700" htmlFor="pwd">
                Password
              </label>
              <a href="forgot-password-1.html" className="font-medium text-sky-700 text-sm ">
                Forget your password?
              </a>
            </div>
            <input
              className="text-sky-300 bg-white/30 focus:outline-none border-none focus:ring-0 focus:bg-white/50 text-sm rounded-lg py-2.5 px-4 w-full"
              type="password"
              id="pwd"
              name="pwd"
              placeholder="Enter Your Password"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 mt-8">
          <button className="bg-sky-600 text-white text-sm rounded-lg px-6 py-2.5" onClick={login}>
            Sign In
          </button>
          <p className="text-sm text-sky-700">
            Dont have an account?{' '}
            <a href="signup-1.html" className="ms-2 underline text-sky-600">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </AuthPage>
  )
}

export default LoginForm

import PasswordIcon from 'components/Icons/PasswordIcon'
import SigmaredLogo from '../../assets/company-logo.png'
import EmailIcon from 'components/Icons/EmailIcon'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import DotLoader from 'react-spinners/DotLoader'
export default function LoginPage() {
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = () => {
    setLoading(true)
    if (email === 'admin@sigmared.ai' && password === 'admin') {
      setTimeout(() => {
        setLoading(false)
        localStorage.setItem('auth', 'true')
        navigate('/')
      }, 2000)
    } else {
      toast.error('Please verify your email or password!', {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce
      })
    }
  }
  return (
    <div className="flex h-screen w-screen  items-center justify-center  bg-[#F5F6FA]">
      <ToastContainer />
      <div className="flex h-screen w-fit flex-col items-center justify-center gap-4 rounded-lg bg-white px-20 py-4">
        <img src={SigmaredLogo} width="300" className="mb-5" />
        <div className="text-xl font-semibold">Welcome back ! </div>
        <div className="mb-10 text-slate-500">
          Sign in to continue to Sigmared
        </div>
        <div className="flex items-center justify-start gap-4 rounded-lg bg-[#e8f0fe] p-4">
          <EmailIcon width="28" height="28" fill="rgb(100 116 139)" />
          <input
            type="text"
            className="min-w-60 bg-[#e8f0fe]  focus:outline-none "
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </div>
        <div className="flex items-center justify-start gap-4 rounded-lg bg-[#e8f0fe] p-4">
          <PasswordIcon width="28" height="28" fill="rgb(100 116 139)" />
          <input
            type={type}
            className="min-w-60 bg-[#e8f0fe]  focus:outline-none "
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </div>
        <div className="mb-10 flex w-full items-center justify-start gap-2 px-2">
          <input
            type="checkbox"
            name="show-password"
            checked={checked}
            onChange={() => {
              if (!checked) {
                setType('text')
              } else {
                setType('password')
              }
              setChecked(!checked)
            }}
          />
          Show password
        </div>
        <button
          className="flex w-full items-center justify-center rounded-lg bg-[#1a73e8] p-4 text-center text-white"
          onClick={handleLogin}
        >
          {loading ? <DotLoader color="#36d7b7" size={20} /> : 'LOGIN'}
        </button>
      </div>
    </div>
  )
}

import PasswordIcon from "components/Common/Icons/PasswordIcon";
import SigmaredLogo from "../../assets/company-logo.png";
import EmailIcon from "components/Common/Icons/EmailIcon";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import DotLoader from "react-spinners/DotLoader";
import Footer from "components/layout/footer";
import { useAuth0 } from "@auth0/auth0-react";

export default function LoginPage() {
  const navigate = useNavigate();
  // const [checked, setChecked] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [type, setType] = useState('password');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const { loginWithPopup, isAuthenticated, getIdTokenClaims } = useAuth0();
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await getIdTokenClaims();
        const token = response?.__raw;
        localStorage.setItem('token', token);
      } catch (error) {
        console.error(error);
      }
    };
    if (isAuthenticated) {
      fetchToken();
      navigate("/");
    }
  }, [isAuthenticated, navigate, getIdTokenClaims]);

  async function handleLogin() {
    // setLoading(true);
    loginWithPopup();

    // try {
    //   const response = await fetch(
    //     `https://2w24txr2ecpc36zqwk4v4vdmva0ohppf.lambda-url.eu-north-1.on.aws/dashboard/get_authenticated_cymeda/?user_id=${encodeURIComponent(
    //       email,
    //     )}&password=${encodeURIComponent(password)}`,
    //     {
    //       method: 'POST',
    //       body: {},
    //       headers: {
    //         Accept: 'application/json',
    //       },
    //     },
    //   );
    //   if (response.ok) {
    //     const data = await response.json();
    //     // Assuming the API returns a JSON object with a key "authenticated" that is true if credentials are valid
    //     if (data) {
    //       localStorage.setItem('user_id', email);
    //       localStorage.setItem('client_id', 'coforge');
    //       localStorage.setItem('auth', 'true');
    //       navigate('/');
    //     } else {
    //       throw new Error('Invalid credentials');
    //     }
    //   } else {
    //     throw new Error('Network response was not ok');
    //   }
    // } catch (error) {
    //   toast.error('Please verify your email or password!', {
    //     position: 'bottom-right',
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: 'light',
    //     transition: Bounce, // Ensure the Bounce transition is properly imported if it's being used
    //   });
    // } finally {
    //   setLoading(false);
    // }
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex grow flex-col items-center justify-center bg-[#F5F6FA]">
        <ToastContainer />
        <div className="mx-auto py-24 flex w-fit flex-col items-center shadow-2xl justify-center gap-2 rounded-lg bg-white px-16">
          <img src={SigmaredLogo} width="250" className="mb-8" alt="Logo" />
          <div className="text-xl font-semibold">Welcome to CyRapid</div>
          <div className="text-slate-500 mb-12">
            Sign in to continue to CyRapid
          </div>
          {/* <div className="flex items-center justify-start gap-4 rounded-lg bg-[#e8f0fe] p-4">
            <EmailIcon width="28" height="28" fill="rgb(100 116 139)" />
            <input
              type="text"
              className="min-w-60 bg-[#e8f0fe] focus:outline-none"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="flex items-center justify-start gap-4 rounded-lg bg-[#e8f0fe] p-4">
            <PasswordIcon width="28" height="28" fill="rgb(100 116 139)" />
            <input
              type={type}
              className="min-w-60 bg-[#e8f0fe] focus:outline-none"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
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
                  setType('text');
                } else {
                  setType('password');
                }
                setChecked(!checked);
              }}
            />
            Show password
          </div> */}
          <button
            className="flex w-full text-md font-bold items-center justify-center rounded-lg bg-[#1a73e8] p-4 text-center text-white"
            onClick={handleLogin}
          >
            {/* {loading ? <DotLoader color="#36d7b7" size={20} /> : 'LOGIN'} */}
            Sign In
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

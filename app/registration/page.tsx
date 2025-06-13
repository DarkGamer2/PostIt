"use client";
import { Inter, Bebas_Neue, Lobster } from "next/font/google";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
const inter = Inter({ subsets: ["latin"] });
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const lobster = Lobster({
  variable: "--font-lobster",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
type FormData = {
  fullName: string;
  email: string;
  username: string;
  phoneNumber: string;
  dob: string;
  password: string;
  confirmPassword: string;
};

export default function Registration() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    username: "",
    phoneNumber: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setSuccess(false);
  setError(false);

  try {
    const response = await fetch("/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        username: "",
        phoneNumber: "",
        dob: "",
        password: "",
        confirmPassword: "",
      });
    } else {
      setError(true);
    }
  } catch (err) {
    setError(true); // Server cannot be reached or network error
  } finally {
    setIsLoading(false);
    setTimeout(() => {
      setSuccess(false);
      setError(false);
    }, 2000);
  }
};
  return (
    <div>
      <h1 className={`${lobster.className} text-blue-500 text-center text-4xl`}>
        PostIt
      </h1>
      <h3 className={`text-center ${inter.className} text-xl`}>
        Create An Account
      </h3>
      <div className="flex justify-center  h-screen">
        <form onSubmit={handleSubmit}>
          <label className={`${inter.className} text-center block`}>
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="rounded-md border border-gray-300 p-2 w-full"
          />
          <br />
          <label className={`${inter.className} text-center block`}>
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="rounded-md border border-gray-300 p-2 w-full"
          />
          <br />
          <label className={`${inter.className} text-center block`}>
            Username
          </label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="rounded-md border border-gray-300 p-2 w-full"
          />
          <br />
          <label className={`${inter.className} text-center block`}>
            Mobile Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            required
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            className="rounded-md border border-gray-300 p-2 w-full"
          />
          <br />
          <label className={`${inter.className} text-center block`}>
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            required
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className="rounded-md border border-gray-300 p-2 w-full"
          />
          <br />
          <label className={`${inter.className} text-center block`}>
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="rounded-md border border-gray-300 p-2 w-full"
          />
          <br />
          <label className={`${inter.className} text-center`}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="rounded-md border border-gray-300 p-2 w-full"
          />
          <br />
          {showCaptcha && (
  <div className="mb-4">
    <ReCAPTCHA
      sitekey="YOUR_RECAPTCHA_SITE_KEY"
      onChange={(token) => setCaptchaToken(token)}
    />
  </div>
)}
          <div className="text-center mt-2">
            <motion.button
                             type="submit"
                             className={`flex items-center justify-center gap-2 rounded-md text-white px-4 py-2 transition-all duration-300 ${
                               isLoading
                                 ? "bg-gray-500 cursor-not-allowed"
                                 : success
                                 ? "bg-green-500"
                                 : error
                                 ? "bg-red-500"
                                 : "bg-blue-500"
                             }`}
                            
                             disabled={isLoading}
                             whileTap={{ scale: 0.95 }}
                             animate={{ scale: isLoading ? 1.1 : 1 }}
                             transition={{ duration: 0.3 }}
                           >
                             {isLoading ? (
                               <motion.span
                                 animate={{ rotate: 360 }}
                                 transition={{ repeat: Infinity, duration: 1 }}
                               >
                                 <RestartAltIcon className="animate-spin" />
                               </motion.span>
                             ) : success ? (
                               <CheckCircleOutlineIcon />
                             ) : error ? (
                               <HighlightOffIcon />
                             ) : null}
                             {isLoading ? "Creating..." : success ? "Account Created" : error ? "Error" : "Register"}
                           </motion.button>
          </div>
          <br />
          <span> Already have an account?</span>
          <Link href="/login" className="text-blue-500">
            {" "}
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { auth } from "/src/features/auth/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Only initialize RecaptchaVerifier after window + auth are ready
    if (typeof window !== "undefined" && auth && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved", response);
          },
        },
        auth
      );

      // ✅ Explicit render to avoid lazy loading issues
      window.recaptchaVerifier.render().catch((err) =>
        console.error("reCAPTCHA render failed:", err)
      );
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phone.startsWith("+")) {
      alert("Enter phone like +1XXXXXXXXXX");
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmation(confirmationResult);
      alert("OTP sent!");
    } catch (error) {
      console.error("Failed to send OTP:", error);
      alert("Failed to send OTP: " + error.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmation) return alert("Request OTP first");

    try {
      await confirmation.confirm(otp);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login with Phone</h2>

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+1XXXXXXXXXX"
        className="border rounded p-2 w-full mb-4"
      />

      <button
        onClick={handleSendOtp}
        className="bg-blue-500 text-white p-2 w-full mb-4 rounded"
      >
        Send OTP
      </button>

      {confirmation && (
        <>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="border rounded p-2 w-full mb-4"
          />

          <button
            onClick={handleVerifyOtp}
            className="bg-green-500 text-white p-2 w-full rounded"
          >
            Verify OTP
          </button>
        </>
      )}

      <div id="recaptcha-container"></div>
    </div>
  );
}

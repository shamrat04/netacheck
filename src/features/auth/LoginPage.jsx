// src/LoginPage.jsx
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved:", response);
          },
          "expired-callback": () => {
            console.warn("reCAPTCHA expired. Resetting...");
            window.recaptchaVerifier.render().then((widgetId) => {
              grecaptcha.reset(widgetId);
            });
          }
        },
        auth
      );

      window.recaptchaVerifier.render().then(() => {
        setRecaptchaReady(true);
        console.log("reCAPTCHA rendered");
      });
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phone.startsWith("+") || phone.length < 10) {
      alert("Enter a valid phone number with country code, e.g., +1234567890");
      return;
    }

    if (!recaptchaReady) {
      alert("reCAPTCHA is not ready yet. Please wait a moment and try again.");
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmation(confirmationResult);
      alert("OTP sent!");
    } catch (error) {
      console.error("Error during signInWithPhoneNumber:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmation) {
      alert("Please request an OTP first.");
      return;
    }

    try {
      const result = await confirmation.confirm(otp);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      alert("Logged in successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during OTP verification:", error);
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login with Phone Number</h2>
      <input
        type="text"
        placeholder="+1234567890"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <br />
      <button onClick={handleSendOtp} disabled={!recaptchaReady}>
        Send OTP
      </button>

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <br />
        <button onClick={handleVerifyOtp} disabled={!confirmation}>
          Verify OTP
        </button>
      </div>

      <div id="recaptcha-container"></div>
    </div>
  );
}

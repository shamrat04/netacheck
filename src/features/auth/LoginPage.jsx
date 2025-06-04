import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const setupRecaptcha = async () => {
      const { RecaptchaVerifier } = await import("firebase/auth");

      try {
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
              size: "invisible",
              callback: (response) => {
                console.log("✅ reCAPTCHA solved", response);
              },
            },
            auth
          );

          await window.recaptchaVerifier.render();
          console.log("✅ reCAPTCHA rendered");
        }
      } catch (error) {
        console.error("❌ RecaptchaVerifier setup failed:", error);
      }
    };

    setupRecaptcha();
  }, []);

  const handleSendOtp = async () => {
  if (!phone.startsWith("+") || phone.length < 10) {
    alert("Please enter a valid phone number including country code (e.g., +1...)");
    return;
  }

  if (!window.recaptchaVerifier) {
    alert("reCAPTCHA not ready yet. Please wait a moment and try again.");
    return;
  }

  try {
    const appVerifier = window.recaptchaVerifier;
    const result = await signInWithPhoneNumber(auth, phone, appVerifier);
    setConfirmation(result);
    alert("OTP sent!");
  } catch (error) {
    console.error("❌ signInWithPhoneNumber FAILED:", error);
    alert("Error sending OTP: " + error.message);
  }
};

  const handleVerifyOtp = async () => {
    try {
      const result = await confirmation.confirm(otp);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      alert("Logged in!");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ OTP verification failed:", error);
      alert("Invalid OTP");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login with Phone Number</h2>
      <input
        type="text"
        placeholder="+1XXXXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <br />
      <button onClick={handleSendOtp}>Send OTP</button>

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

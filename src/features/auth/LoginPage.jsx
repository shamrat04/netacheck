import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();

  // ✅ Register RecaptchaVerifier ONCE when component loads
  useEffect(() => {
    const loadRecaptcha = async () => {
      try {
        const { RecaptchaVerifier } = await import("firebase/auth");

        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
              size: "invisible",
              callback: (response) => {
                console.log("✅ reCAPTCHA solved:", response);
              },
            },
            auth
          );

          await window.recaptchaVerifier.render();
          console.log("✅ reCAPTCHA initialized");
        }
      } catch (error) {
        console.error("❌ RecaptchaVerifier FAILED:", error);
      }
    };

    loadRecaptcha();
  }, []); // ✅ empty dependency array = run only once

  const handleSendOtp = async () => {
    if (!phone.startsWith("+")) {
      alert("Please enter the phone number in international format, e.g. +1XXXXXXXXXX");
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmation(result);
      alert("OTP sent to " + phone);
    } catch (error) {
      console.error("❌ signInWithPhoneNumber FAILED:", error);
      alert("Error sending OTP: " + error.message);
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
      alert("Logged in!");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ OTP Verification Failed:", error);
      alert("Invalid OTP. Please try again.");
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

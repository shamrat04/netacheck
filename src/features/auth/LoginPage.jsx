import { useState } from "react";
import { auth, RecaptchaVerifier } from "./firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    return new Promise((resolve, reject) => {
      if (!window.recaptchaVerifier) {
        try {
          const verifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
              size: "invisible",
              callback: (response) => {
                console.log("✅ reCAPTCHA solved:", response);
              },
            },
            auth
          );

          verifier.render().then((widgetId) => {
            window.recaptchaVerifier = verifier;
            console.log("✅ reCAPTCHA rendered:", widgetId);
            resolve(verifier);
          });
        } catch (err) {
          console.error("❌ RecaptchaVerifier FAILED:", err);
          alert("reCAPTCHA failed to load. Please reload the page.");
          reject(err);
        }
      } else {
        resolve(window.recaptchaVerifier);
      }
    });
  };

  const handleSendOtp = async () => {
    if (!phone.startsWith("+")) {
      alert("Enter phone in international format. E.g., +1XXXXXXXXXX");
      return;
    }

    try {
      const appVerifier = await setupRecaptcha();
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
      alert("First request an OTP.");
      return;
    }

    try {
      const result = await confirmation.confirm(otp);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      alert("✅ Logged in!");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ OTP Verification Failed:", error);
      alert("Invalid OTP. Try again.");
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

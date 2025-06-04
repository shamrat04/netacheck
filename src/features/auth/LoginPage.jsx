import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./firebase";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      try {
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

        window.recaptchaVerifier.render().then(() => {
          console.log("✅ reCAPTCHA rendered");
          setRecaptchaReady(true);
        });
      } catch (err) {
        console.error("❌ RecaptchaVerifier setup failed:", err);
      }
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phone.startsWith("+")) {
      alert("Phone number must start with +");
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
    if (!confirmation) {
      alert("Please request an OTP first.");
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

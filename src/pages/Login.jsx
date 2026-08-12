import { useState } from "react";
import { Smartphone, ShieldCheck } from "lucide-react";
import { sendOtp, verifyOtp } from "../api/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const [countryCode, setCountryCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const fullPhoneNumber = `${countryCode}${phone}`.replace(/[^\d]/g, "");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!otpGenerated) {
        await sendOtp(fullPhoneNumber);
        setOtpGenerated(true);
        toast.success("OTP sent on WhatsApp");
        return;
      }

      await verifyOtp(fullPhoneNumber, otp);
      toast.success("Login successful");

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center">Welcome</h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          Sign in using your mobile number
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Mobile Number
            </label>

            <div className="flex gap-3">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="border rounded-xl px-3 py-3 bg-white"
              >
                <option value="+971">🇦🇪 +971</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>

              <div className="relative flex-1">
                <Smartphone
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="501234567"
                  required
                  className="w-full border rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {otpGenerated && (
            <div>
              <label className="block text-sm font-medium mb-2">OTP</label>

              <div className="relative">
                <ShieldCheck
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />

                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="1234"
                  required={otpGenerated}
                  className="w-full border rounded-xl py-3 pl-10 pr-4 tracking-[0.5em] text-center text-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 transition"
          >
            {loading
              ? "Please wait..."
              : otpGenerated
              ? "Validate OTP"
              : "Generate OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

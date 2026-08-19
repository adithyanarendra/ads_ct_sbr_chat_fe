import {
  ArrowRight,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { checkPhone, sendOtp, verifyOtp } from "../api/authService";

const Login = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(null);

  const fullPhoneNumber = `${countryCode}${phone}`.replace(/[^\d]/g, "");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (!otpGenerated) {
        if (!fullPhoneNumber) {
          toast.error("Please enter your mobile number.");
          return;
        }

        if (isExistingUser === null) {
          const { exists } = await checkPhone(fullPhoneNumber);

          setIsExistingUser(exists);

          if (exists) {
            await sendOtp(fullPhoneNumber);
            setOtpGenerated(true);
            toast.success("OTP sent on WhatsApp");
            return;
          }

          toast.success("Please enter your name to continue.");
          return;
        }

        if (!isExistingUser) {
          if (!name.trim()) {
            toast.error("Please enter your full name.");
            return;
          }

          await sendOtp(fullPhoneNumber, name.trim());
          setOtpGenerated(true);
          toast.success("OTP sent on WhatsApp");
          return;
        }

        if (isExistingUser) {
          await sendOtp(fullPhoneNumber);
          setOtpGenerated(true);
          toast.success("OTP sent on WhatsApp");
          return;
        }
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f8fc] px-4 py-8">
      {/* =========================================================
          Ambient background
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main ambient glow */}
        <div
          className="
            absolute left-1/2 top-1/2
            h-[700px] w-[700px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full
            bg-blue-200/20
            blur-[120px]
          "
        />

        {/* Top-right blue glow */}
        <div
          className="
            absolute -right-40 -top-40
            h-[500px] w-[500px]
            rounded-full
            bg-blue-300/20
            blur-[100px]
          "
        />

        {/* Bottom-left indigo glow */}
        <div
          className="
            absolute -bottom-48 -left-48
            h-[600px] w-[600px]
            rounded-full
            bg-indigo-300/15
            blur-[120px]
          "
        />

        {/* Very subtle top-left glow */}
        <div
          className="
            absolute -left-32 top-1/4
            h-[300px] w-[300px]
            rounded-full
            bg-sky-200/10
            blur-[90px]
          "
        />

        {/* =====================================================
            Fine grid
        ====================================================== */}

        <div
          className="
            absolute inset-0 opacity-[0.035]
            [background-image:linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        {/* =====================================================
            Radial highlight behind card
        ====================================================== */}

        <div
          className="
            absolute left-1/2 top-1/2
            h-[520px] w-[520px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full
            border border-white/60
            bg-white/20
            blur-[1px]
          "
        />

        {/* =====================================================
            Subtle geometric accents
        ====================================================== */}

        <div className="absolute left-[8%] top-[20%] hidden lg:block">
          <div className="h-20 w-20 rotate-45 rounded-2xl border border-blue-200/20" />
          <div className="absolute left-5 top-5 h-20 w-20 rounded-2xl border border-indigo-200/10" />
        </div>

        <div className="absolute bottom-[18%] right-[8%] hidden lg:block">
          <div className="h-24 w-24 rounded-full border border-blue-200/20" />
          <div className="absolute left-6 top-6 h-12 w-12 rounded-full border border-indigo-200/15" />
        </div>

        {/* Fine decorative lines */}
        <div className="absolute left-[4%] top-[38%] hidden h-px w-32 rotate-[-25deg] bg-gradient-to-r from-transparent via-blue-300/25 to-transparent lg:block" />

        <div className="absolute right-[4%] top-[32%] hidden h-px w-36 rotate-[25deg] bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent lg:block" />

        <div className="absolute bottom-[28%] left-[12%] hidden h-px w-24 rotate-[35deg] bg-gradient-to-r from-transparent via-blue-300/20 to-transparent lg:block" />

        {/* Small ambient points */}
        <div className="absolute left-[14%] top-[30%] hidden h-1.5 w-1.5 rounded-full bg-blue-400/30 lg:block" />

        <div className="absolute right-[15%] top-[22%] hidden h-2 w-2 rounded-full bg-indigo-400/25 lg:block" />

        <div className="absolute bottom-[25%] right-[18%] hidden h-1.5 w-1.5 rounded-full bg-blue-400/25 lg:block" />
      </div>

      {/* =========================================================
          Login container
      ========================================================== */}

      <div className="relative z-10 w-full max-w-[430px]">
        <div
          className="
            overflow-hidden
            rounded-[28px]
            border border-white/80
            bg-white/90
            shadow-[0_25px_80px_rgba(15,23,42,0.10)]
            backdrop-blur-xl
          "
        >
          {/* Card header */}
          <div className="px-6 pb-5 pt-7 text-center sm:px-9 sm:pt-9">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <LockKeyhole size={12} />
              Secure sign in
            </div>

            <h1 className="text-[30px] font-bold tracking-[-0.03em] text-slate-900">
              Welcome back
            </h1>

            <p className="mx-auto mt-2 max-w-[300px] text-sm leading-6 text-slate-500">
              {otpGenerated
                ? "Enter the verification code sent to your WhatsApp."
                : "Sign in securely using your mobile number."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="px-6 pb-7 sm:px-9 sm:pb-9">
            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Mobile number
              </label>

              <div className="flex gap-2.5">
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    aria-label="Country code"
                    className="
                      h-[52px] w-[105px]
                      cursor-pointer appearance-none
                      rounded-2xl
                      border border-slate-200
                      bg-slate-50
                      px-3 pr-7
                      text-sm font-medium text-slate-700
                      outline-none
                      transition-all
                      hover:border-slate-300
                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                  >
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400">
                    ▼
                  </div>
                </div>

                <div className="group relative flex-1">
                  <Smartphone
                    size={18}
                    strokeWidth={1.8}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-slate-400
                      transition-colors
                      group-focus-within:text-blue-500
                    "
                  />

                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="501234567"
                    required
                    className="
                      h-[52px] w-full
                      rounded-2xl
                      border border-slate-200
                      bg-slate-50
                      py-3 pl-11 pr-4
                      text-[15px] text-slate-900
                      outline-none
                      transition-all
                      placeholder:text-slate-400
                      hover:border-slate-300
                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            {isExistingUser === false && (
              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full name
                </label>

                <div className="group relative">
                  <UserRound
                    size={18}
                    strokeWidth={1.8}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500"
                  />

                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required={!isExistingUser}
                    disabled={otpGenerated}
                    className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-[15px] text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>
            )}

            {/* OTP */}
            {otpGenerated && (
              <div className="mt-5 animate-[fadeIn_0.25s_ease-out]">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Verification code
                  </label>

                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <MessageCircle size={13} />
                    Sent via WhatsApp
                  </span>
                </div>

                <div className="group relative">
                  <ShieldCheck
                    size={19}
                    strokeWidth={1.8}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-slate-400
                      transition-colors
                      group-focus-within:text-blue-500
                    "
                  />

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                    required={otpGenerated}
                    className="
                      h-[58px] w-full
                      rounded-2xl
                      border border-slate-200
                      bg-slate-50
                      py-3 pl-12 pr-4
                      text-center
                      text-xl font-semibold
                      tracking-[0.7em]
                      text-slate-900
                      outline-none
                      transition-all
                      placeholder:tracking-[0.5em]
                      placeholder:text-slate-300
                      hover:border-slate-300
                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-500/10
                    "
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loading || !phone || (isExistingUser === false && !name.trim())
              }
              className=" group mt-6 flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(15,23,42,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-[0_14px_30px_rgba(37,99,235,0.22)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Please wait...
                </>
              ) : (
                <>
                  {otpGenerated ? "Validate OTP" : "Continue"}

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>

            {/* Security note */}
            <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Your login is protected and secure</span>
            </div>
          </form>
        </div>

        {/* Bottom text */}
        <p className="mt-5 text-center text-xs text-slate-400">
          Secure authentication · No password required
        </p>
      </div>
    </div>
  );
};

export default Login;

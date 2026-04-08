import { useState, useEffect, useRef } from "react";
import { ArrowLeft, User, Phone, ChevronDown, ArrowRight, Info, CheckCircle } from "lucide-react";

const COUNTRIES = [
  { flag: "🇮🇳", code: "+91", len: 10, name: "India" }
];

/* ─── Step indicator ─── */
function StepDots({ step }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`w-2 h-2 rounded-full ${step >= 1 ? "bg-emerald-400" : "bg-white/15"}`} />
      <div className={`flex-1 h-px ${step >= 2 ? "bg-emerald-400" : "bg-white/8"}`} />
      <div className={`w-2 h-2 rounded-full ${step >= 2 ? "bg-emerald-400" : "bg-white/15"}`} />
    </div>
  );
}

/* ─── OTP box grid ─── */
// function OtpGrid({ value, length = 6 }) {
//   return (
//     <div className="grid grid-cols-6 gap-2 mb-2">
//       {Array.from({ length }, (_, i) => (
//         <div
//           key={i}
//           className={`h-12 flex items-center justify-center rounded-xl border text-lg font-bold font-mono transition-all ${
//             value.length === i
//               ? "border-emerald-400 bg-[#1e2130] text-emerald-400"
//               : value.length > i
//               ? "border-emerald-400/40 bg-[#1a1d27] text-emerald-400"
//               : "border-white/8 bg-[#1a1d27] text-white"
//           }`}
//         >
//           {value[i] || ""}
//         </div>
//       ))}
//     </div>
//   );
// }

export default function LoginPage({ onLogin }) {
  const [step, setStep] = useState(1); // 1=form, 2=otp, 3=success
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryIdx, setCountryIdx] = useState(0);
  const [checked, setChecked] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [showCountryDrop, setShowCountryDrop] = useState(false);
  const otpInputRef = useRef(null);

  const country = COUNTRIES[countryIdx];
  const nameOk = name.trim().length >= 2;
  const phoneOk = phone.replace(/\D/g, "").length === country.len;
  const formReady = nameOk && phoneOk && checked;

  function formatPhone(num) {
    const d = num.replace(/\D/g, "");
    if (d.length <= 5) return d;
    return d.slice(0, 5) + " " + d.slice(5);
  }

  function getInitials(n) {
    return n.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }

  useEffect(() => {
    let t;
    if (timerActive && timer > 0) {
      t = setTimeout(() => setTimer((p) => p - 1), 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearTimeout(t);
  }, [timerActive, timer]);

//   function startOtp() {
//     setStep(2);
//     setTimer(30);
//     setTimerActive(true);
//     setOtp("");
//     setTimeout(() => otpInputRef.current?.focus(), 100);
//   }

//   function resend() {
//     setOtp("");
//     setTimer(30);
//     setTimerActive(true);
//     otpInputRef.current?.focus();
//   }

  function verify() {
    setStep(3);
    onLogin?.({ name: name.trim(), phone: country.code + " " + formatPhone(phone) });
  }

  /* ─── Screen 3: Success ─── */
  if (step === 3) {
    const firstName = name.trim().split(" ")[0];
    return (
      <div className="min-h-screen bg-[#0f1117] flex flex-col">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-sm mx-auto w-full">
          <div className="relative mb-5">
            <div className="w-24 h-24 rounded-full border-2 border-emerald-400/30 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/50 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">You're in!</h2>
          <p className="text-sm text-gray-400 mb-8 text-center">
            Welcome to TurfBook, <span className="text-white font-semibold">{firstName}</span>. Find your next game.
          </p>
          <div className="w-full bg-[#1a1d27] rounded-2xl border border-white/5 p-4 flex items-center gap-4 mb-6">
            <div className="w-11 h-11 rounded-full bg-emerald-400/12 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
              {getInitials(name)}
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">{name.trim()}</div>
              <div className="text-gray-500 text-xs">{country.code} {formatPhone(phone)}</div>
            </div>
            <div className="bg-emerald-400/10 border border-emerald-400/25 rounded-lg px-2.5 py-1 text-[10px] font-bold text-emerald-400 tracking-wide">
              VERIFIED
            </div>
          </div>
          <button
            onClick={() => onLogin?.({ name: name.trim(), phone })}
            className="w-full bg-emerald-400 text-black font-bold rounded-xl py-4 text-sm flex items-center justify-center gap-2 hover:bg-emerald-300 active:scale-95 transition-all"
          >
            Explore Turfs <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  /* ─── Screen 2: OTP ─── */
//   if (step === 2) {
//     return (
//       <div className="min-h-screen bg-[#0f1117] flex flex-col">
//         <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
//         <div className="flex-1 max-w-sm mx-auto w-full px-6 pt-14 pb-8">
//           <div className="flex items-center gap-3 mb-6">
//             <button
//               onClick={() => setStep(1)}
//               className="w-9 h-9 rounded-xl bg-[#1a1d27] border border-white/8 flex items-center justify-center hover:border-white/20 transition-all"
//             >
//               <ArrowLeft className="w-4 h-4 text-gray-400" />
//             </button>
//             <div>
//               <h2 className="text-lg font-bold text-white">Verify your number</h2>
//             </div>
//           </div>

//           <StepDots step={2} />
//           <p className="text-xs text-gray-500 mb-8">
//             OTP sent to{" "}
//             <span className="text-white font-semibold">
//               {country.code} {formatPhone(phone)}
//             </span>
//           </p>

//           <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
//             Enter 6-digit OTP
//           </label>

//           <div onClick={() => otpInputRef.current?.focus()} className="cursor-text">
//             <OtpGrid value={otp} />
//           </div>

//           {/* Hidden real input */}
//           <input
//             ref={otpInputRef}
//             type="tel"
//             inputMode="numeric"
//             maxLength={6}
//             value={otp}
//             onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
//             className="absolute opacity-0 pointer-events-none"
//           />

//           <div className="flex items-center justify-between mb-7">
//             {timerActive ? (
//               <p className="text-xs text-gray-500">
//                 Resend in <span className="text-white font-bold">{timer}s</span>
//               </p>
//             ) : (
//               <p className="text-xs text-gray-600">Didn't receive it?</p>
//             )}
//             <button
//               onClick={resend}
//               disabled={timerActive}
//               className={`text-xs font-bold text-emerald-400 transition-opacity ${timerActive ? "opacity-30 cursor-default" : "opacity-100 hover:text-emerald-300"}`}
//             >
//               Resend OTP
//             </button>
//           </div>

//           <button
//             onClick={verify}
//             disabled={otp.length !== 6}
//             className="w-full bg-emerald-400 disabled:bg-[#1a3d2b] disabled:text-[#2d6b4f] text-black font-bold rounded-xl py-4 text-sm flex items-center justify-center gap-2 hover:bg-emerald-300 active:scale-95 transition-all mb-5"
//           >
//             Verify & Continue <ArrowRight className="w-4 h-4" />
//           </button>

//           <div className="flex gap-3 bg-[#1a1d27] border border-emerald-400/12 rounded-xl p-4">
//             <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
//             <p className="text-[11px] text-gray-500 leading-relaxed">
//               Never share your OTP with anyone. TurfBook will never call to ask for your OTP.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

  /* ─── Screen 1: Login form ─── */
  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      {/* Pitch hero */}
      <div className="relative h-52 bg-[#0d2318] overflow-hidden flex-shrink-0">
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 360 208" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="10" width="320" height="188" rx="4" stroke="#34d399" strokeWidth="1.5" />
          <line x1="180" y1="10" x2="180" y2="198" stroke="#34d399" strokeWidth="1" />
          <circle cx="180" cy="104" r="36" stroke="#34d399" strokeWidth="1" />
          <circle cx="180" cy="104" r="3" fill="#34d399" />
          <rect x="20" y="69" width="50" height="70" rx="2" stroke="#34d399" strokeWidth="1" />
          <rect x="290" y="69" width="50" height="70" rx="2" stroke="#34d399" strokeWidth="1" />
          <rect x="20" y="84" width="22" height="40" rx="2" stroke="#34d399" strokeWidth="1" />
          <rect x="318" y="84" width="22" height="40" rx="2" stroke="#34d399" strokeWidth="1" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-[#0f1117]/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full border-2 border-emerald-400/50 flex items-center justify-center bg-emerald-400/8">
            <div className="w-11 h-11 rounded-full bg-emerald-400/15 border border-emerald-400/40 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white tracking-tight">TurfBook</h1>
            <p className="text-[10px] text-emerald-400/70 font-bold tracking-[3px] mt-0.5">BOOK · PLAY · WIN</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 max-w-sm mx-auto w-full px-6 pt-7 pb-8">
        <StepDots step={1} />
        <h2 className="text-2xl font-black text-white tracking-tight mb-1">Let's get you in</h2>
        <p className="text-sm text-gray-500 mb-7">Enter your details to book your next match</p>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-[#1a1d27] border border-white/8 rounded-2xl pl-11 pr-4 py-4 text-white text-sm placeholder-gray-700 outline-none focus:border-emerald-400 focus:bg-[#1e2130] transition-all"
            />
          </div>
          {name.length > 0 && (
            <p className={`text-[11px] mt-2 pl-1 ${nameOk ? "text-emerald-400" : "text-gray-500"}`}>
              {nameOk ? "Looks good!" : "Enter at least 2 characters"}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-5">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
          <div className="flex gap-2">
            {/* Country selector */}
            <div className="relative">
              <button
                onClick={() => setShowCountryDrop(!showCountryDrop)}
                className="h-full bg-[#1a1d27] border border-white/8 rounded-2xl px-3 py-4 flex items-center gap-1.5 hover:border-white/18 transition-all"
              >
                <span className="text-base">{country.flag}</span>
                <span className="text-sm font-bold text-gray-400">{country.code}</span>
                <ChevronDown className="w-3 h-3 text-gray-600" />
              </button>
              {showCountryDrop && (
                <div className="absolute top-full mt-1 left-0 z-20 bg-[#1a1d27] border border-white/10 rounded-xl overflow-hidden w-44">
                  {COUNTRIES.map((c, i) => (
                    <button
                      key={c.code}
                      onClick={() => { setCountryIdx(i); setShowCountryDrop(false); setPhone(""); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-all ${i === countryIdx ? "text-emerald-400 bg-emerald-400/5" : "text-gray-300"}`}
                    >
                      <span className="text-base">{c.flag}</span>
                      <span className="flex-1 text-left">{c.name}</span>
                      <span className="text-xs text-gray-500">{c.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              maxLength={country.len}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder={"98765 43210"}
              className="flex-1 bg-[#1a1d27] border border-white/8 rounded-2xl px-4 py-4 text-white text-sm font-mono placeholder-gray-700 outline-none focus:border-emerald-400 focus:bg-[#1e2130] tracking-wide transition-all"
            />
          </div>
          {phone.length > 0 && (
            <p className={`text-[11px] mt-2 pl-1 ${phoneOk ? "text-emerald-400" : "text-gray-500"}`}>
              {phoneOk ? "Number looks valid" : `Enter a valid ${country.len}-digit number`}
            </p>
          )}
          {phone.length === 0 && (
            <p className="text-[11px] text-gray-600 mt-2 pl-1">We'll send an OTP to verify your number</p>
          )}
        </div>

        {/* Terms */}
        <div className="flex gap-3 bg-[#1a1d27] border border-white/5 rounded-2xl p-4 mb-6">
          <button
            onClick={() => setChecked(!checked)}
            className={`w-5 h-5 rounded-md border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${
              checked ? "bg-emerald-400 border-emerald-400" : "bg-transparent border-white/20"
            }`}
          >
            {checked && (
              <svg className="w-3 h-3" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            I agree to the{" "}
            <a href="#" className="text-emerald-400">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-emerald-400">Privacy Policy</a>.
            I consent to receive booking updates via SMS.
          </p>
        </div>

        <button
        //   onClick={startOtp}
          disabled={!formReady}
          className="w-full bg-emerald-400 disabled:bg-[#1a3d2b] disabled:text-[#2d6b4f] text-black font-bold rounded-2xl py-4 text-sm flex items-center justify-center gap-2 hover:bg-emerald-300 active:scale-95 transition-all mb-5"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>

        {/* Divider */}
        {/* <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/6" />
          <span className="text-[11px] text-gray-600">or continue with</span>
          <div className="flex-1 h-px bg-white/6" />
        </div> */}

        {/* Social */}
        {/* <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: "Google", icon: "G" },
            { label: "Apple", icon: "" },
          ].map((s) => (
            <button
              key={s.label}
              className="bg-[#1a1d27] border border-white/8 rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-semibold text-gray-300 hover:border-white/18 hover:bg-[#1e2130] transition-all"
            >
              <span className="text-sm">{s.icon === "G" ? "🔵" : "🍎"}</span>
              {s.label}
            </button>
          ))}
        </div> */}

        {/* <p className="text-center text-xs text-gray-600">
          Already have an account?{" "}
          <span className="text-emerald-400 font-bold cursor-pointer hover:text-emerald-300">
            Sign in
          </span>
        </p> */}
      </div>
    </div>
  );
}
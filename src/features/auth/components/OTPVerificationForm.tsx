import { Button } from "@/components/ui/button";
import { useCheckOtpStatus, useVerifyOtp, useResendOtp } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const OTPVerificationForm = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  // Initialize auth state with lazy evaluation to avoid effect
  const [authState, setAuthState] = useState(() => {
    const storedIdentifier = sessionStorage.getItem("otp_identifier");
    const storedPassword = sessionStorage.getItem("otp_password");
    const storedResendAvailableAt = sessionStorage.getItem(
      "otp_resend_available_at"
    );

    // Calculate initial countdown based on stored timestamps
    let initialCountdown = 0;
    let initialResendActive = true;

    if (storedResendAvailableAt) {
      const resendAvailableTime = parseInt(storedResendAvailableAt);
      const currentTime = Date.now();
      const remainingTime = Math.max(
        0,
        Math.floor((resendAvailableTime - currentTime) / 1000)
      );

      initialCountdown = remainingTime;
      initialResendActive = remainingTime === 0;
    }

    return {
      countdown: initialCountdown,
      isResendActive: initialResendActive,
      identifier: storedIdentifier || "",
      password: storedPassword || "",
    };
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const checkOtpStatusMutation = useCheckOtpStatus();

  // Check OTP status on mount and redirect if no active session
  useEffect(() => {
    if (!authState.identifier || !authState.password) {
      toast.error("Sesi login tidak valid. Silakan login kembali.");
      navigate("/auth/login");
      return;
    }

    checkOtpStatusMutation.mutate(
      { identifier: authState.identifier },
      {
        onSuccess: (data) => {
          if (!data.hasActiveOtp) {
            toast.error("Sesi OTP tidak valid. Silakan login kembali.");
            sessionStorage.removeItem("otp_identifier");
            sessionStorage.removeItem("otp_password");
            sessionStorage.removeItem("otp_expires_at");
            sessionStorage.removeItem("otp_resend_available_at");
            navigate("/auth/login");
          } else if (data.resendAvailableAt) {
            // Update countdown if server provides different time
            const currentTime = Date.now();
            const remainingTime = Math.max(
              0,
              Math.floor((data.resendAvailableAt - currentTime) / 1000)
            );

            setAuthState((prev) => ({
              ...prev,
              countdown: remainingTime,
              isResendActive: remainingTime === 0,
            }));

            if (remainingTime > 0) {
              sessionStorage.setItem(
                "otp_resend_available_at",
                data.resendAvailableAt.toString()
              );
            }
          }
        },
        onError: () => {
          toast.error("Terjadi kesalahan. Silakan login kembali.");
          sessionStorage.removeItem("otp_identifier");
          sessionStorage.removeItem("otp_password");
          sessionStorage.removeItem("otp_expires_at");
          sessionStorage.removeItem("otp_resend_available_at");
          navigate("/auth/login");
        },
      }
    );
  }, []);

  // Countdown timer with persistence
  useEffect(() => {
    if (authState.countdown > 0) {
      const timer = setTimeout(() => {
        const newCountdown = authState.countdown - 1;

        setAuthState((prev) => ({
          ...prev,
          countdown: newCountdown,
          isResendActive: newCountdown === 0,
        }));

        // Update sessionStorage with new countdown
        if (newCountdown > 0) {
          const newResendAvailableAt = Date.now() + newCountdown * 1000;
          sessionStorage.setItem(
            "otp_resend_available_at",
            newResendAvailableAt.toString()
          );
        } else {
          sessionStorage.removeItem("otp_resend_available_at");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [authState.countdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Allow both digits and letters (alphanumeric)
    if (!/^[a-zA-Z0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1).toUpperCase(); // Only take last character and convert to uppercase
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "") // Allow alphanumeric
      .toUpperCase()
      .slice(0, 6);

    if (pastedData.length > 0) {
      const newOtp = [...otp];
      pastedData.split("").forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);

      // Focus on the next empty input or last input
      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const verifyOtpMutation = useVerifyOtp({
    onSuccess: () => {
      toast.success("Verifikasi berhasil! Selamat datang kembali.");
      // Clear OTP data from sessionStorage
      sessionStorage.removeItem("otp_identifier");
      sessionStorage.removeItem("otp_password");
      sessionStorage.removeItem("otp_expires_at");
      sessionStorage.removeItem("otp_resend_available_at");
      navigate("/dashboard");
    },
  });

  const resendOtpMutation = useResendOtp({
    onSuccess: (data) => {
      toast.success(
        data.message || "Kode OTP baru telah dikirim ke email Anda"
      );

      // Calculate countdown from resendAvailableAt
      const currentTime = Date.now();
      const remainingTime = Math.max(
        0,
        Math.floor((data.resendAvailableAt - currentTime) / 1000)
      );

      setAuthState((prev) => ({
        ...prev,
        countdown: remainingTime,
        isResendActive: false,
      }));

      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();

      // Update sessionStorage with new timestamps
      sessionStorage.setItem("otp_expires_at", data.expiresAt.toString());
      sessionStorage.setItem(
        "otp_resend_available_at",
        data.resendAvailableAt.toString()
      );
    },
  });

  const handleResendCode = () => {
    if (!authState.identifier) {
      toast.error("Identifier tidak ditemukan. Silakan login kembali.");
      navigate("/auth/login");
      return;
    }

    resendOtpMutation.mutate({ identifier: authState.identifier });
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Mohon masukkan 6 digit kode OTP");
      return;
    }

    if (!authState.identifier || !authState.password) {
      toast.error("Sesi login tidak valid. Silakan login kembali.");
      navigate("/auth/login");
      return;
    }

    verifyOtpMutation.mutate({
      identifier: authState.identifier,
      otp_code: otpCode,
      password: authState.password,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const isOtpComplete = otp.every((digit) => digit !== "");
  const isVerifying = verifyOtpMutation.isPending;
  const isResending = resendOtpMutation.isPending;

  return (
    <>
      {/* OTP Input */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border-2 rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all uppercase"
            disabled={isVerifying}
          />
        ))}
      </div>

      {/* Countdown Timer */}
      <div className="text-center mb-6">
        {!authState.isResendActive ? (
          <p className="text-sm text-muted-foreground">
            Kirim ulang kode dalam{" "}
            <span className="font-semibold text-foreground">
              {formatTime(authState.countdown)}
            </span>
          </p>
        ) : (
          <button
            onClick={handleResendCode}
            disabled={isResending}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? "Mengirim..." : "Kirim Ulang Kode"}
          </button>
        )}
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleVerify}
        disabled={!isOtpComplete || isVerifying}
        className="w-full h-12 text-base font-medium"
      >
        {isVerifying ? "Memverifikasi..." : "Verifikasi"}
      </Button>

      {/* Back Link */}
      <div className="text-center mt-6">
        <button
          onClick={() => {
            // Clear session data when going back
            sessionStorage.removeItem("otp_identifier");
            sessionStorage.removeItem("otp_password");
            sessionStorage.removeItem("otp_expires_at");
            sessionStorage.removeItem("otp_resend_available_at");
            navigate("/auth/login");
          }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          disabled={isVerifying}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke halaman login
        </button>
      </div>
    </>
  );
};

export default OTPVerificationForm;

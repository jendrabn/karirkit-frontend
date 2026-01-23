import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { paths } from "@/config/paths";
import { useCheckOtpStatus, useVerifyOtp, useResendOtp } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const OTPVerificationForm = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

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

  const { mutate: checkOtpStatus } = useCheckOtpStatus();

  const resolveOtpFieldError = useCallback((error: unknown) => {
    const fieldErrors = (error as { response?: { data?: { errors?: unknown } } })
      ?.response?.data?.errors;
    if (!fieldErrors || typeof fieldErrors !== "object") {
      return null;
    }

    const candidates = ["otp_code", "identifier", "password"];
    for (const key of candidates) {
      const value = (fieldErrors as Record<string, unknown>)[key];
      if (Array.isArray(value) && typeof value[0] === "string") {
        return value[0];
      }
      if (typeof value === "string") {
        return value;
      }
    }

    return null;
  }, []);

  const toastGeneralErrors = useCallback((error: unknown) => {
    const generalErrors = (error as { response?: { data?: { errors?: unknown } } })
      ?.response?.data?.errors;
    if (!generalErrors || typeof generalErrors !== "object") {
      return false;
    }

    const messages = (generalErrors as { general?: unknown }).general;
    if (Array.isArray(messages)) {
      messages
        .filter((message): message is string => typeof message === "string")
        .forEach((message) => toast.error(message));
      return messages.length > 0;
    }

    if (typeof messages === "string") {
      toast.error(messages);
      return true;
    }

    return false;
  }, []);

  // Check OTP status on mount and redirect if no active session
  useEffect(() => {
    if (!authState.identifier || !authState.password) {
      toast.error("Sesi login tidak valid. Silakan login kembali.");
      navigate(paths.auth.login.getHref());
      return;
    }

    checkOtpStatus(
      { identifier: authState.identifier },
      {
        onSuccess: (data) => {
          if (!data.has_active_otp) {
            toast.error("Sesi OTP tidak valid. Silakan login kembali.");
            sessionStorage.removeItem("otp_identifier");
            sessionStorage.removeItem("otp_password");
            sessionStorage.removeItem("otp_expires_at");
            sessionStorage.removeItem("otp_resend_available_at");
            navigate(paths.auth.login.getHref());
          } else if (data.resend_available_at) {
            // Update countdown if server provides different time
            const currentTime = Date.now();
            const remainingTime = Math.max(
              0,
              Math.floor((data.resend_available_at - currentTime) / 1000)
            );

            setAuthState((prev) => ({
              ...prev,
              countdown: remainingTime,
              isResendActive: remainingTime === 0,
            }));

            if (remainingTime > 0) {
              sessionStorage.setItem(
                "otp_resend_available_at",
                data.resend_available_at.toString()
              );
            }
          }
        },
        onError: (error) => {
          toastGeneralErrors(error);
          toast.error("Terjadi kesalahan. Silakan login kembali.");
          sessionStorage.removeItem("otp_identifier");
          sessionStorage.removeItem("otp_password");
          sessionStorage.removeItem("otp_expires_at");
          sessionStorage.removeItem("otp_resend_available_at");
          navigate(paths.auth.login.getHref());
        },
      }
    );
  }, [
    authState.identifier,
    authState.password,
    checkOtpStatus,
    navigate,
    toastGeneralErrors,
  ]);

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

  const handleOtpChange = (value: string) => {
    const normalized = value.toUpperCase();
    setOtp(normalized);
    if (otpError) {
      setOtpError(null);
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
      setOtpError(null);
      navigate("/dashboard");
    },
  });

  const resendOtpMutation = useResendOtp({
    onSuccess: (data) => {
      toast.success(
        data.message || "Kode OTP baru telah dikirim ke email Anda"
      );

      // Calculate countdown from resend_available_at
      const currentTime = Date.now();
      const remainingTime = Math.max(
        0,
        Math.floor((data.resend_available_at - currentTime) / 1000)
      );

      setAuthState((prev) => ({
        ...prev,
        countdown: remainingTime,
        isResendActive: false,
      }));

      setOtp("");
      setOtpError(null);

      // Update sessionStorage with new timestamps
      sessionStorage.setItem("otp_expires_at", data.expires_at.toString());
      sessionStorage.setItem(
        "otp_resend_available_at",
        data.resend_available_at.toString()
      );
    },
  });

  const handleResendCode = () => {
    if (!authState.identifier) {
      toast.error("Identifier tidak ditemukan. Silakan login kembali.");
      navigate(paths.auth.login.getHref());
      return;
    }

    resendOtpMutation.mutate(
      { identifier: authState.identifier },
      {
        onError: (error) => {
          toastGeneralErrors(error);
        },
      }
    );
  };

  const handleVerify = () => {
    const otpCode = otp;
    if (otpCode.length !== 6) {
      const message = "Mohon masukkan 6 digit kode OTP";
      setOtpError(message);
      toast.error(message);
      return;
    }

    if (!authState.identifier || !authState.password) {
      toast.error("Sesi login tidak valid. Silakan login kembali.");
      navigate(paths.auth.login.getHref());
      return;
    }

    setOtpError(null);
    verifyOtpMutation.mutate({
      identifier: authState.identifier,
      otp_code: otpCode,
      password: authState.password,
    }, {
      onError: (error) => {
        toastGeneralErrors(error);
        const fieldError = resolveOtpFieldError(error);
        if (fieldError) {
          setOtpError(fieldError);
        }
      },
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const isOtpComplete = otp.length === 6;
  const isVerifying = verifyOtpMutation.isPending;
  const isResending = resendOtpMutation.isPending;

  return (
    <>
      {/* OTP Input */}
      <FieldSet disabled={isVerifying}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 mb-6">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              inputMode="text"
              autoFocus
              pattern="^[a-zA-Z0-9]*$"
            >
              <InputOTPGroup className="gap-2 sm:gap-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-12 w-11 text-xl font-semibold uppercase sm:h-14 sm:w-12 bg-background text-foreground border-2 rounded-lg first:rounded-lg last:rounded-lg"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <FieldError>{otpError}</FieldError>
          </div>
        </FieldGroup>
      </FieldSet>

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
            navigate(paths.auth.login.getHref());
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

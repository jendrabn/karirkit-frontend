import { useGoogleAuth } from "@/features/auth/api/google-auth";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { userQueryKey } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import googleLogo from "@/assets/images/google_g_logo.png";
import { paths } from "@/config/paths";

type GoogleLoginButtonProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  text?: string;
};

const GoogleLoginButton = ({
  onSuccess,
  onError,
  disabled = false,
  text = "Lanjutkan dengan Google",
}: GoogleLoginButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hiddenButtonRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const googleAuthMutation = useGoogleAuth({
    mutationConfig: {
      onSuccess: (user) => {
        queryClient.setQueryData(userQueryKey, user);
        toast.success("Login dengan Google berhasil");
        onSuccess?.();

        const from =
          location.state?.from?.pathname || paths.dashboard.getHref();

        setTimeout(() => {
          navigate(from, { replace: true });
        }, 100);
        setIsSubmitting(false);
      },
      onError: (error) => {
        console.error("Error: ", error);
        onError?.(error);
        setIsSubmitting(false);
      },
    },
  });

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      setIsSubmitting(true);
      googleAuthMutation.mutate({
        id_token: credentialResponse.credential,
      });
    }
  };

  const handleGoogleError = () => {
    toast.error("Terjadi kesalahan saat login dengan Google");
    setIsSubmitting(false);
  };

  const handleCustomButtonClick = () => {
    // Cari dan klik button Google yang tersembunyi
    const googleButton = hiddenButtonRef.current?.querySelector(
      'div[role="button"]',
    ) as HTMLElement;
    if (googleButton) {
      googleButton.click();
    }
  };

  // Monitor untuk memastikan Google button sudah render
  useEffect(() => {
    if (hiddenButtonRef.current) {
      const observer = new MutationObserver(() => {
        const googleButton =
          hiddenButtonRef.current?.querySelector('div[role="button"]');
        if (googleButton) {
          observer.disconnect();
        }
      });

      observer.observe(hiddenButtonRef.current, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="w-full h-12 text-base font-medium gap-3"
        onClick={handleCustomButtonClick}
        disabled={disabled || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <img src={googleLogo} alt="Google" className="w-5 h-5" />
            {text}
          </>
        )}
      </Button>

      {/* Hidden Google Login Button */}
      <div ref={hiddenButtonRef} className="hidden">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
        />
      </div>
    </>
  );
};

export default GoogleLoginButton;

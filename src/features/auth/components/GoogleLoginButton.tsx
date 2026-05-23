import { useGoogleAuth } from "@/features/auth/api/google-auth";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { syncAuthenticatedUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { paths } from "@/config/paths";

const googleLogoSrc =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Google_%22G%22_logo.svg";

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
      onSuccess: async () => {
        await syncAuthenticatedUser(queryClient);
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
    const googleButton = hiddenButtonRef.current?.querySelector(
      'div[role="button"]'
    ) as HTMLElement;
    if (googleButton) {
      googleButton.click();
    }
  };

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
        variant="auth"
        size="default"
        className="relative w-full justify-center"
        onClick={handleCustomButtonClick}
        disabled={disabled || isSubmitting}
      >
        <span className="absolute left-4 inline-flex size-4 items-center justify-center">
          {isSubmitting ? (
            <Spinner size="sm" />
          ) : (
            <img
              src={googleLogoSrc}
              alt=""
              aria-hidden="true"
              className="size-4 shrink-0"
            />
          )}
        </span>
        <span>{isSubmitting ? "Memproses..." : text}</span>
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

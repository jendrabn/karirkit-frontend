import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { syncAuthenticatedUser } from "@/lib/auth";
import { useFacebookAuth } from "@/features/auth/api/facebook-auth";
import {
  getSocialAuthErrorMessage,
  isFacebookAuthConfigured,
  loadFacebookSdk,
} from "@/features/auth/lib/social-auth";

const facebookLogoSrc = "/images/auth/facebook.svg";

type FacebookLoginButtonProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  text?: string;
};

const FacebookLoginButton = ({
  onSuccess,
  onError,
  disabled = false,
  text = "Lanjutkan dengan Facebook",
}: FacebookLoginButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const isMountedRef = useRef(true);

  const facebookAuthMutation = useFacebookAuth({
    mutationConfig: {
      onSuccess: async () => {
        await syncAuthenticatedUser(queryClient);
        toast.success("Login dengan Facebook berhasil");
        onSuccess?.();

        const from =
          location.state?.from?.pathname || paths.dashboard.getHref();

        setTimeout(() => {
          navigate(from, { replace: true });
        }, 100);
        setIsSubmitting(false);
      },
      onError: (error) => {
        const message = getSocialAuthErrorMessage(
          error,
          "Terjadi kesalahan saat login dengan Facebook",
        );
        console.error("Facebook auth error:", error);
        toast.error(message);
        onError?.(new Error(message));
        setIsSubmitting(false);
      },
    },
  });

  useEffect(() => {
    isMountedRef.current = true;

    if (!isFacebookAuthConfigured(env.FACEBOOK_APP_ID)) {
      return () => {
        isMountedRef.current = false;
      };
    }

    void loadFacebookSdk(env.FACEBOOK_APP_ID)
      .then(() => {
        if (isMountedRef.current) {
          setIsSdkReady(true);
        }
      })
      .catch((error) => {
        console.error("Failed to load Facebook SDK:", error);
      });

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleFacebookSuccess = (accessToken: string) => {
    setIsSubmitting(true);
    facebookAuthMutation.mutate({
      access_token: accessToken,
    });
  };

  const handleCustomButtonClick = () => {
    if (!isFacebookAuthConfigured(env.FACEBOOK_APP_ID)) {
      toast.error("Facebook login belum dikonfigurasi");
      return;
    }

    if (!isSdkReady || !window.FB) {
      toast.error("Facebook login sedang dimuat ulang");
      return;
    }

    window.FB.login(
      (response) => {
        const accessToken = response.authResponse?.accessToken;
        if (accessToken) {
          handleFacebookSuccess(accessToken);
          return;
        }

        if (response.status === "not_authorized") {
          const message = "Akses Facebook tidak diizinkan";
          toast.error(message);
          onError?.(new Error(message));
        }
      },
      {
        scope: "public_profile,email",
        return_scopes: true,
      },
    );
  };

  return (
    <Button
      variant="auth"
      size="auth"
      className="relative w-full justify-center"
      onClick={handleCustomButtonClick}
      disabled={disabled || isSubmitting || !isSdkReady}
      title={
        !isFacebookAuthConfigured(env.FACEBOOK_APP_ID)
          ? "Facebook login belum dikonfigurasi"
          : undefined
      }
    >
      <span className="absolute left-4 inline-flex size-4 items-center justify-center">
        {isSubmitting ? (
          <Spinner size="sm" />
        ) : (
          <img
            src={facebookLogoSrc}
            alt=""
            aria-hidden="true"
            className="size-4 shrink-0"
          />
        )}
      </span>
      <span>{isSubmitting ? "Memproses..." : text}</span>
    </Button>
  );
};

export default FacebookLoginButton;

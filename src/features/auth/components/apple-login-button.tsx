import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { syncAuthenticatedUser } from "@/lib/auth";
import { useAppleAuth } from "@/features/auth/api/apple-auth";
import {
  buildAppleDisplayName,
  createSecurityState,
  getSocialAuthErrorMessage,
  isAppleAuthConfigured,
  initAppleAuth,
  loadAppleSdk,
} from "@/features/auth/lib/social-auth";

const appleLogoSrc = "/images/auth/apple.svg";

type AppleLoginButtonProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  text?: string;
};

const AppleLoginButton = ({
  onSuccess,
  onError,
  disabled = false,
  text = "Lanjutkan dengan Apple",
}: AppleLoginButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const isMountedRef = useRef(true);

  const appleAuthMutation = useAppleAuth({
    mutationConfig: {
      onSuccess: async () => {
        await syncAuthenticatedUser(queryClient);
        toast.success("Login dengan Apple berhasil");
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
          "Terjadi kesalahan saat login dengan Apple",
        );
        console.error("Apple auth error:", error);
        toast.error(message);
        onError?.(new Error(message));
        setIsSubmitting(false);
      },
    },
  });

  useEffect(() => {
    isMountedRef.current = true;

    if (
      !isAppleAuthConfigured(env.APPLE_CLIENT_ID, env.APPLE_REDIRECT_URI)
    ) {
      return () => {
        isMountedRef.current = false;
      };
    }

    void loadAppleSdk()
      .then(() => {
        if (isMountedRef.current) {
          setIsSdkReady(true);
        }
      })
      .catch((error) => {
        console.error("Failed to load Apple SDK:", error);
      });

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleAppleSuccess = (idToken: string, name?: string) => {
    setIsSubmitting(true);
    appleAuthMutation.mutate({
      id_token: idToken,
      ...(name ? { name } : {}),
    });
  };

  const handleCustomButtonClick = async () => {
    if (!isAppleAuthConfigured(env.APPLE_CLIENT_ID, env.APPLE_REDIRECT_URI)) {
      toast.error("Apple login belum dikonfigurasi");
      return;
    }

    if (!isSdkReady || !window.AppleID?.auth) {
      toast.error("Apple login sedang dimuat ulang");
      return;
    }

    try {
      const state = createSecurityState();
      const nonce = createSecurityState();
      initAppleAuth({
        clientId: env.APPLE_CLIENT_ID,
        redirectURI: env.APPLE_REDIRECT_URI,
        state,
        nonce,
      });

      const response = await window.AppleID.auth.signIn();
      const idToken = response.authorization?.id_token;
      if (idToken) {
        handleAppleSuccess(idToken, buildAppleDisplayName(response.user));
        return;
      }

      const message = "Terjadi kesalahan saat login dengan Apple";
      toast.error(message);
      onError?.(new Error(message));
    } catch (error) {
      const errorCode =
        typeof error === "object" && error && "error" in error
          ? String((error as { error?: unknown }).error)
          : "";

      if (
        errorCode === "user_cancelled_authorize" ||
        errorCode === "popup_closed_by_user"
      ) {
        return;
      }

      const message = getSocialAuthErrorMessage(
        error,
        "Terjadi kesalahan saat login dengan Apple",
      );
      console.error("Apple sign-in error:", error);
      toast.error(message);
      onError?.(new Error(message));
    }
  };

  return (
    <Button
      variant="auth"
      size="auth"
      className="relative w-full justify-center"
      onClick={handleCustomButtonClick}
      disabled={disabled || isSubmitting || !isSdkReady}
      title={
        !isAppleAuthConfigured(env.APPLE_CLIENT_ID, env.APPLE_REDIRECT_URI)
          ? "Apple login belum dikonfigurasi"
          : undefined
      }
    >
      <span className="absolute left-4 inline-flex size-4 items-center justify-center">
        {isSubmitting ? (
          <Spinner size="sm" />
        ) : (
          <img
            src={appleLogoSrc}
            alt=""
            aria-hidden="true"
            className="size-4 shrink-0 dark:invert"
          />
        )}
      </span>
      <span>{isSubmitting ? "Memproses..." : text}</span>
    </Button>
  );
};

export default AppleLoginButton;

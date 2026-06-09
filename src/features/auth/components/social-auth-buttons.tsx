import GoogleLoginButton from "./google-login-button";
import FacebookLoginButton from "./facebook-login-button";
import AppleLoginButton from "./apple-login-button";

type SocialAuthButtonsProps = {
  disabled?: boolean;
  googleText?: string;
  facebookText?: string;
  appleText?: string;
};

export function SocialAuthButtons({
  disabled = false,
  googleText = "Lanjutkan dengan Google",
  facebookText = "Lanjutkan dengan Facebook",
  appleText = "Lanjutkan dengan Apple",
}: SocialAuthButtonsProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <GoogleLoginButton disabled={disabled} text={googleText} />
      <FacebookLoginButton disabled={disabled} text={facebookText} />
      <AppleLoginButton disabled={disabled} text={appleText} />
    </div>
  );
}

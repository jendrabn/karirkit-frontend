import GoogleLoginButton from "./GoogleLoginButton";
import FacebookLoginButton from "./FacebookLoginButton";
import AppleLoginButton from "./AppleLoginButton";

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

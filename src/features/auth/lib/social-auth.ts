import { isAxiosError } from "axios";

type FacebookAuthResponse = {
  status?: "connected" | "not_authorized" | "unknown";
  authResponse?: {
    accessToken?: string;
    expiresIn?: string | number;
    signedRequest?: string;
    userID?: string;
  };
};

type FacebookLoginOptions = {
  scope?: string;
  return_scopes?: boolean;
};

type FacebookSdk = {
  init: (config: {
    appId: string;
    cookie?: boolean;
    xfbml?: boolean;
    version?: string;
  }) => void;
  login: (
    callback: (response: FacebookAuthResponse) => void,
    options?: FacebookLoginOptions,
  ) => void;
};

type AppleAuthResponse = {
  authorization?: {
    code?: string;
    id_token?: string;
    state?: string;
  };
  user?: {
    email?: string;
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
};

type AppleAuthSdk = {
  init: (config: {
    clientId: string;
    scope?: string;
    state?: string;
    nonce?: string;
    redirectURI: string;
    usePopup?: boolean;
  }) => void;
  signIn: () => Promise<AppleAuthResponse>;
};

declare global {
  interface Window {
    FB?: FacebookSdk;
    AppleID?: {
      auth: AppleAuthSdk;
    };
  }
}

const FACEBOOK_SDK_ID = "facebook-jssdk";
const APPLE_SDK_ID = "appleid-auth-sdk";

let facebookSdkPromise: Promise<void> | null = null;
let appleSdkScriptPromise: Promise<void> | null = null;
const scriptPromises = new Map<string, Promise<HTMLScriptElement>>();

const loadScript = (id: string, src: string) => {
  if (typeof document === "undefined") {
    return Promise.reject(
      new Error(`Cannot load script outside of the browser: ${src}`),
    );
  }

  const existingPromise = scriptPromises.get(id);
  if (existingPromise) {
    return existingPromise;
  }

  const existingScript = document.getElementById(id) as HTMLScriptElement | null;

  if (existingScript) {
    const promise = new Promise<HTMLScriptElement>((resolve, reject) => {
      if (existingScript.dataset.loaded === "true") {
        resolve(existingScript);
        return;
      }

      existingScript.addEventListener(
        "load",
        () => {
          existingScript.dataset.loaded = "true";
          resolve(existingScript);
        },
        { once: true },
      );
      existingScript.addEventListener(
        "error",
        () => reject(new Error(`Failed to load script: ${src}`)),
        { once: true },
      );
    });

    const trackedPromise = promise.catch((error) => {
      scriptPromises.delete(id);
      throw error;
    });

    scriptPromises.set(id, trackedPromise);
    return trackedPromise;
  }

  const promise = new Promise<HTMLScriptElement>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve(script);
    };
    script.onerror = () =>
      reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });

  const trackedPromise = promise.catch((error) => {
    scriptPromises.delete(id);
    throw error;
  });

  scriptPromises.set(id, trackedPromise);
  return trackedPromise;
};

const hasConfiguredValue = (value: string) =>
  value.trim().length > 0 && !value.startsWith("YOUR_");

export const isFacebookAuthConfigured = (appId: string) =>
  hasConfiguredValue(appId);

export const isAppleAuthConfigured = (clientId: string, redirectURI: string) =>
  hasConfiguredValue(clientId) && hasConfiguredValue(redirectURI);

export const loadFacebookSdk = async (appId: string) => {
  if (!isFacebookAuthConfigured(appId)) {
    throw new Error("Facebook auth is not configured");
  }

  if (typeof window === "undefined") {
    throw new Error("Facebook auth can only be initialized in the browser");
  }

  if (window.FB) {
    window.FB.init({
      appId,
      cookie: true,
      xfbml: false,
      version: "v22.0",
    });
    return;
  }

  if (!facebookSdkPromise) {
    facebookSdkPromise = loadScript(
      FACEBOOK_SDK_ID,
      "https://connect.facebook.net/en_US/sdk.js",
    )
      .then(() => {
        if (!window.FB) {
          throw new Error("Facebook SDK failed to initialize");
        }

        window.FB.init({
          appId,
          cookie: true,
          xfbml: false,
          version: "v22.0",
        });
      })
      .catch((error) => {
        facebookSdkPromise = null;
        throw error;
      });
  }

  return facebookSdkPromise;
};

export const loadAppleSdk = async () => {
  if (typeof window === "undefined") {
    throw new Error("Apple auth can only be initialized in the browser");
  }

  if (!appleSdkScriptPromise) {
    appleSdkScriptPromise = loadScript(
      APPLE_SDK_ID,
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js",
    )
      .then(() => undefined)
      .catch((error) => {
        appleSdkScriptPromise = null;
        throw error;
      });
  }

  return appleSdkScriptPromise;
};

export const initAppleAuth = ({
  clientId,
  redirectURI,
  state,
  nonce,
}: {
  clientId: string;
  redirectURI: string;
  state: string;
  nonce: string;
}) => {
  if (!isAppleAuthConfigured(clientId, redirectURI)) {
    throw new Error("Apple auth is not configured");
  }

  if (typeof window === "undefined") {
    throw new Error("Apple auth can only be initialized in the browser");
  }

  if (!window.AppleID?.auth) {
    throw new Error("Apple SDK failed to initialize");
  }

  window.AppleID.auth.init({
    clientId,
    scope: "name email",
    redirectURI,
    usePopup: true,
    state,
    nonce,
  });
};

export const buildAppleDisplayName = (user?: AppleAuthResponse["user"]) => {
  const firstName = user?.name?.firstName?.trim() || "";
  const lastName = user?.name?.lastName?.trim() || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return fullName || undefined;
};

export const getSocialAuthErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as
      | {
          message?: string;
          errors?: Record<string, string[] | string | undefined>;
        }
      | undefined;

    const message = responseData?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }

    const errors = responseData?.errors;
    if (errors && typeof errors === "object") {
      for (const value of Object.values(errors)) {
        if (Array.isArray(value) && value[0]) {
          return value[0];
        }

        if (typeof value === "string" && value.trim()) {
          return value;
        }
      }
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
};

export const createSecurityState = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

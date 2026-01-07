export interface LoginOtpData {
  message: string;
  requires_otp: boolean;
  expires_at: number;
  expires_in: number;
  resend_available_at: number;
}

export type LoginOtpResponse = LoginOtpData;

export type AuthUserResponse = import("./user").User;

export type LoginResponse = LoginOtpResponse | AuthUserResponse;

export interface OtpData {
  message: string;
  expires_at: number;
  expires_in: number;
  resend_available_at: number;
}

export type OtpResponse = OtpData;

export interface OtpStatusData {
  has_active_otp: boolean;
  expires_at?: number;
  expires_in?: number;
  resend_available_at?: number;
}

export type OtpStatusResponse = OtpStatusData;

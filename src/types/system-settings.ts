export type SystemSettingPrimitive = boolean | number | string | null;

export type SystemSettingValue =
  | SystemSettingPrimitive
  | Record<string, unknown>
  | unknown[];

export type SystemSettingType =
  | "boolean"
  | "string"
  | "text"
  | "number"
  | "integer"
  | "float"
  | "decimal"
  | "json"
  | (string & {});

export interface SystemSetting {
  id: string;
  key: string;
  group: string;
  type: SystemSettingType;
  value: SystemSettingValue;
  default_value: SystemSettingValue;
  description: string | null;
  is_public: boolean;
  is_editable: boolean;
  source: string;
  updated_by: string | null;
  updated_at: string;
  created_at: string;
}

export interface SystemSettingsListResponse {
  items: SystemSetting[];
}

export type UpdateSystemSettingsPayload = Record<string, SystemSettingValue>;

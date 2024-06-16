export interface User {
  username: string;
  user_id: string;
  verification: boolean;
  thematics: Thematic[];
  trusted_sources: TrustedSource[];
}

export interface Thematic {
  id: string;
  value: string;
  niches: string[];
}

export interface TrustedSource {
  title: string;
  url: string;
  isDefault: boolean;
  authEnabled: boolean;
  login?: string;
  password?: string;
}

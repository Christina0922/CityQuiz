export type CountryCode = 'KR' | 'OTHER';

export interface CountryInfo {
  code: CountryCode;
  detected: boolean;
  source: 'localStorage' | 'navigator' | 'api';
}


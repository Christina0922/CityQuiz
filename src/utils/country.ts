import { CountryCode, CountryInfo } from '../types/country';

const COUNTRY_STORAGE_KEY = 'cityQuiz_countryCode';

/**
 * navigator.language를 기반으로 국가 코드를 추론
 */
function detectCountryFromNavigator(): CountryCode {
  const lang = navigator.language || (navigator as any).userLanguage || 'en';
  const langCode = lang.toLowerCase().substring(0, 2);
  
  // 한국어 관련 언어 코드 감지
  if (langCode === 'ko') {
    return 'KR';
  }
  
  return 'OTHER';
}

/**
 * ipapi.co API를 통해 국가 코드 조회
 */
async function detectCountryFromAPI(): Promise<CountryCode> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    const countryCode = data.country_code || '';
    
    if (countryCode === 'KR') {
      return 'KR';
    }
    
    return 'OTHER';
  } catch (error) {
    console.warn('Failed to detect country from API:', error);
    // API 실패 시 navigator 기반으로 폴백
    return detectCountryFromNavigator();
  }
}

/**
 * localStorage에서 저장된 국가 코드 조회
 */
function getCountryFromStorage(): CountryCode | null {
  try {
    const stored = localStorage.getItem(COUNTRY_STORAGE_KEY);
    if (stored === 'KR' || stored === 'OTHER') {
      return stored as CountryCode;
    }
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
  }
  return null;
}

/**
 * 국가 코드를 localStorage에 저장
 */
export function saveCountryCode(countryCode: CountryCode): void {
  try {
    localStorage.setItem(COUNTRY_STORAGE_KEY, countryCode);
  } catch (error) {
    console.warn('Failed to save country code to localStorage:', error);
  }
}

/**
 * 국가 정보 감지 (우선순위: localStorage > navigator > API)
 */
export async function detectCountry(): Promise<CountryInfo> {
  // 1. localStorage에서 먼저 확인
  const stored = getCountryFromStorage();
  if (stored) {
    return {
      code: stored,
      detected: true,
      source: 'localStorage',
    };
  }
  
  // 2. navigator.language로 빠르게 감지 시도
  const navCountry = detectCountryFromNavigator();
  
  // navigator로 KR이 감지되면 바로 반환 (한국 사용자는 빠르게 처리)
  if (navCountry === 'KR') {
    saveCountryCode('KR');
    return {
      code: 'KR',
      detected: true,
      source: 'navigator',
    };
  }
  
  // 3. API로 정확한 국가 정보 조회 시도
  try {
    const apiCountry = await detectCountryFromAPI();
    saveCountryCode(apiCountry);
    return {
      code: apiCountry,
      detected: true,
      source: 'api',
    };
  } catch (error) {
    // API 실패 시 navigator 결과 사용
    saveCountryCode(navCountry);
    return {
      code: navCountry,
      detected: true,
      source: 'navigator',
    };
  }
}

/**
 * 현재 저장된 국가 코드 조회 (동기)
 */
export function getCurrentCountryCode(): CountryCode {
  const stored = getCountryFromStorage();
  if (stored) {
    return stored;
  }
  
  // 저장된 값이 없으면 navigator 기반으로 추정
  return detectCountryFromNavigator();
}


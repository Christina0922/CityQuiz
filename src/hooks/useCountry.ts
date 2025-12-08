import { useState, useEffect } from 'react';
import { CountryCode } from '../types/country';
import { detectCountry, getCurrentCountryCode } from '../utils/country';

interface UseCountryReturn {
  countryCode: CountryCode;
  isKR: boolean;
  isLoading: boolean;
}

/**
 * 국가 정보를 관리하는 훅
 * 앱 시작 시 자동으로 국가를 감지하고, localStorage에 저장된 값을 우선 사용
 */
export function useCountry(): UseCountryReturn {
  const [countryCode, setCountryCode] = useState<CountryCode>(() => {
    // 초기값: localStorage에서 읽거나 navigator 기반으로 추정
    return getCurrentCountryCode();
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCountry() {
      try {
        const countryInfo = await detectCountry();
        if (isMounted) {
          setCountryCode(countryInfo.code);
        }
      } catch (error) {
        console.warn('Failed to detect country:', error);
        // 에러 발생 시 현재 저장된 값 사용
        if (isMounted) {
          setCountryCode(getCurrentCountryCode());
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    // 저장된 값이 없거나 오래된 경우에만 API 호출
    const stored = localStorage.getItem('cityQuiz_countryCode');
    if (!stored) {
      loadCountry();
    } else {
      // 저장된 값이 있으면 즉시 사용하고, 백그라운드에서 업데이트 확인
      setIsLoading(false);
      loadCountry(); // 백그라운드에서 최신 정보로 업데이트 시도
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    countryCode,
    isKR: countryCode === 'KR',
    isLoading,
  };
}


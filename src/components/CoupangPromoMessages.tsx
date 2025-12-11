// 전체 경로: src/components/CoupangPromoMessages.tsx

import React from 'react';
import './CoupangPromoMessages.css';

/**
 * 쿠팡 프로모션 메시지 컴포넌트
 * - 현재는 아무 내용도 렌더링하지 않아서
 *   화면에 박스가 하나도 보이지 않게 만든다.
 * - AdBanner.tsx 에서 { CoupangPromoMessages } 형태로
 *   불러오기 때문에, 이름 있는 export와 default export를
 *   둘 다 제공한다.
 */
export const CoupangPromoMessages: React.FC = () => {
  // 광고를 전부 숨기기 위해 null 반환
  return null;
};

export default CoupangPromoMessages;

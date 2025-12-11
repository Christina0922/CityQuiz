// D:\CityQuiz\src\components/LanguageSelector.tsx

import React from 'react';

import './LanguageSelector.css'; // 이 파일이 없어도 에러는 안 납니다.

const LanguageSelector: React.FC = () => {
  return (
    <div className="language-selector">
      <button className="lang-button active">한국어</button>
      <span className="lang-separator"> | </span>
      <button className="lang-button">English</button>
    </div>
  );
};

export default LanguageSelector;


// src/components/CoupangFooter.tsx

import { useMemo } from "react";
import {
  pickHourlyCoupangByContext,
  CoupangContext,
} from "../utils/pickRandomCoupang";
import "./CoupangFooter.css";

type Props = {
  context: CoupangContext;
};

export default function CoupangFooter({ context }: Props) {
  const item = useMemo(
    () => pickHourlyCoupangByContext(context),
    [context]
  );

  const onClick = () => {
    window.open(item.url, "_blank");
  };

  return (
    <div className="coupangFooter">
      <button type="button" className="coupangFooter__btn" onClick={onClick}>
        도시를 더 많이 알고 싶다면?
      </button>

      <div className="coupangFooter__notice">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
        제공받습니다.
      </div>
    </div>
  );
}

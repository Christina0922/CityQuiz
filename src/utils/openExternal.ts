// src/utils/openExternal.ts
export function openExternalUrl(url: string) {
  // Android WebView 환경에서도 최대한 "외부로" 열리게 시도합니다.
  // 1) window.open 시도
  const opened = window.open(url, "_blank");
  if (opened) return;

  // 2) 실패 시 location 이동
  window.location.href = url;
}

# RSVP Apps Script Setup

이 프로젝트는 `GitHub Pages + Google Apps Script + Google Spreadsheet` 조합으로 RSVP를 저장하도록 준비되어 있습니다.

## 1. 스프레드시트 만들기

1. Google Spreadsheet를 새로 만듭니다.
2. 시트 이름은 아무거나 써도 되지만, Apps Script가 처음 실행될 때 `RSVP` 시트를 자동으로 만들게 되어 있습니다.

## 2. Apps Script 붙이기

1. 스프레드시트에서 `확장 프로그램 > Apps Script`를 엽니다.
2. 기본으로 열린 `Code.gs` 내용을 전부 지웁니다.
3. 이 파일 내용을 붙여넣습니다.
   - [google-apps-script/Code.gs](</C:/Users/pinkt/first-birthday-invitation/google-apps-script/Code.gs>)
4. 저장합니다.

## 3. 웹앱 배포

1. 오른쪽 위 `배포 > 새 배포`를 누릅니다.
2. 유형은 `웹 앱`을 고릅니다.
3. 실행 사용자는 `나`로 둡니다.
4. 접근 권한은 `모든 사용자`로 설정합니다.
5. 배포 후 나온 `웹 앱 URL`을 복사합니다.

## 4. 초대장에 URL 넣기

1. 이 파일을 엽니다.
   - [script-config.js](</C:/Users/pinkt/first-birthday-invitation/script-config.js>)
2. 아래처럼 `appsScriptUrl` 값에 웹앱 URL을 넣습니다.

```js
window.INVITATION_CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/배포된_웹앱_URL/exec",
};
```

## 5. 반영

1. 저장 후 배포하면 초대장에서 `전달하기`를 눌렀을 때 시트에 바로 저장됩니다.
2. 저장 컬럼 순서는 아래와 같습니다.

- 기록시각
- 참석여부
- 성함
- 연락처
- 본인 외 인원
- 전달사항
- 클라이언트 제출시각

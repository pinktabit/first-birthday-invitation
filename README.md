# 돌잔치 웹초대장

HTML, CSS, JavaScript만 사용하는 모바일 우선 돌잔치 웹초대장입니다. GitHub Pages에 무료로 올릴 수 있습니다.

## 파일 구조

```text
index.html
style.css
script.js
README.md
images/
  main-photo.svg
  gallery-1.svg
  gallery-2.svg
  gallery-3.svg
  gallery-4.svg
  gallery-5.svg
  gallery-6.svg
```

## 내용을 수정하는 방법

대부분의 문구와 링크는 `script.js` 맨 위의 `INVITATION` 안에서 바꾸면 됩니다.

`여기 수정`이라고 적힌 주석을 찾아 아래 정보를 실제 내용으로 교체하세요.

- 아기 이름
- 날짜와 시간
- 장소명과 주소
- 엄마, 아빠 연락처
- 엄마, 아빠 계좌
- 네이버지도, 카카오맵, T맵 링크
- Google Form 참석 여부 링크
- 메인 사진과 갤러리 사진 경로

## 사진을 바꾸는 방법

1. 실제 아기 사진을 `images` 폴더 안에 넣습니다.
2. 예를 들어 메인 사진 파일명이 `main.jpg`라면 `script.js`에서 아래처럼 바꿉니다.

```js
mainPhoto: "images/main.jpg",
```

3. 갤러리 사진도 같은 방식으로 바꿉니다.

```js
galleryImages: [
  "images/photo-1.jpg",
  "images/photo-2.jpg",
  "images/photo-3.jpg"
]
```

사진 파일명은 한글보다 영문과 숫자를 추천합니다. 예: `photo-1.jpg`

## 로컬에서 확인하는 방법

가장 쉬운 방법은 `index.html` 파일을 더블클릭해서 브라우저로 여는 것입니다.

링크 복사 기능은 일부 브라우저에서 `file://` 주소로 열었을 때 제한될 수 있습니다. GitHub Pages에 올린 뒤에는 정상적으로 동작합니다.

## GitHub Pages에 올리는 방법

1. GitHub에 로그인합니다.
2. 오른쪽 위 `+` 버튼을 누르고 `New repository`를 선택합니다.
3. 저장소 이름을 정합니다. 예: `first-birthday-invitation`
4. 공개 저장소로 만들고 `Create repository`를 누릅니다.
5. 이 폴더의 파일을 GitHub 저장소에 업로드합니다.
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
   - `images` 폴더 전체
6. 저장소 화면에서 `Settings`로 들어갑니다.
7. 왼쪽 메뉴에서 `Pages`를 선택합니다.
8. `Build and deployment` 항목에서 `Source`를 `Deploy from a branch`로 선택합니다.
9. `Branch`를 `main`으로 선택하고 폴더는 `/root`로 둔 뒤 `Save`를 누릅니다.
10. 잠시 기다리면 GitHub Pages 주소가 생깁니다.

주소는 보통 아래처럼 만들어집니다.

```text
https://내아이디.github.io/저장소이름/
```

## 카카오톡과 문자로 공유하기

GitHub Pages 주소가 생기면 초대장 화면의 `현재 페이지 링크 복사` 버튼을 눌러 링크를 복사한 뒤 카카오톡이나 문자에 붙여넣으면 됩니다.

카카오톡 공유 이미지는 `index.html`의 `og:image` 값에 연결된 이미지가 사용됩니다. 실제 대표 사진을 쓰려면 `images/main-photo.svg` 대신 업로드한 사진 경로로 바꾸세요.

## Google Form 참석 여부 링크 연결하기

1. Google Form을 만듭니다.
2. 오른쪽 위 `보내기` 버튼을 누릅니다.
3. 링크 아이콘을 선택하고 주소를 복사합니다.
4. `script.js`에서 아래 부분을 복사한 주소로 바꿉니다.

```js
googleFormLink: "복사한 Google Form 주소",
```

## 지도 링크 연결하기

네이버지도, 카카오맵, T맵에서 장소를 검색한 뒤 공유 링크를 복사해 `script.js`의 `mapLinks`에 넣으면 됩니다.

```js
mapLinks: {
  naver: "네이버지도 링크",
  kakao: "카카오맵 링크",
  tmap: "T맵 링크"
}
```

## 디자인 수정하기

색상은 `style.css` 맨 위의 `:root`에서 수정할 수 있습니다.

```css
:root {
  --bg: #f8f1e7;
  --paper: #fffaf2;
  --gold: #b9975b;
}
```

폰트 크기나 카드 여백도 `style.css`에서 바꿀 수 있습니다. 초보자라면 먼저 색상과 사진만 바꾸는 것을 추천합니다.

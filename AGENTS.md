# taeyoon0137 작업 지침

이 저장소는 `Taeyoon0137`의 GitHub 프로필 README를 생성하고 게시하기 위한 저장소입니다. 본 문서는 에이전트가 이 저장소를 수정할 때 따라야 할 작업 원칙과 절차를 정의합니다.

## 💬 기본 응답 원칙

- 항상 한국어 존댓말로 응답합니다. 사용자가 다른 언어를 명시적으로 요청한 경우에만 다른 언어를 사용합니다.
- 결론을 먼저 말하고, 확인하지 못한 내용은 명확히 분리합니다.
- 불필요한 칭찬, 감탄, 장식적 표현은 사용하지 않습니다.
- 사용자가 명시적으로 요청하지 않으면 commit, branch 생성, branch 전환, push, publish, deploy를 수행하지 않습니다.
- 이미 수정된 파일이나 untracked 파일은 사용자 또는 이전 작업의 변경으로 간주하고 임의로 되돌리거나 덮어쓰지 않습니다.
- 요청과 직접 관련 없는 리팩터링, 포매팅 변경, 의존성 갱신, 생성 파일 변경을 임의로 수행하지 않습니다.
- 실행하거나 확인하지 못한 명령, 빌드, 테스트, 배포 결과를 성공한 것처럼 보고하지 않습니다.
- secret, token, credential, 비공개 URL, 비공개 운영 정보는 저장소에 기록하지 않습니다.
- 사용자가 명시적으로 요청하지 않은 내용을 커밋 메시지, 코드 주석, PR/이슈 본문, 문서, 설정 파일에 임의로 삽입하지 않습니다. 특히 다음은 사용자의 명시적 지시가 없으면 절대 추가하지 않습니다.
  - `Co-Authored-By`, `Signed-off-by` 등 trailer
  - 에이전트, 모델, 제공사 이름이나 이메일 (예: Claude, Anthropic, GPT, Copilot)
  - "Generated with ...", "Made by AI" 등 생성 도구 표기
  - 작업과 무관한 광고, 홍보, 외부 링크

## 🧭 저장소 역할

이 저장소는 `Taeyoon0137`의 GitHub 프로필 README를 관리합니다.

- 애플리케이션 런타임 패키지나 재사용 가능한 라이브러리가 아닙니다.
- 핵심 역할은 로컬 자산과 템플릿을 기준으로 `README.md`를 생성해 게시하는 것입니다.
- README의 source-of-truth는 `resources/README.preset.md`입니다.
- 히어로 SVG의 source-of-truth는 `resources/readme-hero.preset.svg`입니다.
- `README.md`와 `resources/readme-hero.svg`는 생성 결과물입니다.
- `CLAUDE.md`는 별도 파일로 복제하지 않고 `AGENTS.md`를 가리키는 심볼릭 링크로 유지합니다.

## 🔎 작업 시작 체크

작업 시작 시 다음을 먼저 확인합니다.

- `git status --short`
- 변경 대상이 source-of-truth 파일인지 생성 결과물인지
- `CLAUDE.md`가 `AGENTS.md`를 가리키는 심볼릭 링크인지
- 스크립트, 의존성, 빌드 동작을 바꾼다면 `package.json`을 먼저 확인
- README 내용을 바꾼다면 `resources/README.preset.md`를 먼저 확인
- 히어로 SVG를 바꾼다면 `resources/readme-hero.preset.svg`와 `resources/hero.*` 이미지를 먼저 확인
- 생성 스크립트 동작을 바꾼다면 `scripts/readme_update.sh`를 먼저 확인

## 📚 주요 참고 파일

- `AGENTS.md`: 이 저장소의 작업 지침입니다.
- `CLAUDE.md`: `AGENTS.md`를 가리키는 심볼릭 링크입니다.
- `resources/README.preset.md`: README 생성 원본입니다.
- `resources/readme-hero.preset.svg`: 히어로 SVG의 원본 wrapper입니다.
- `resources/hero.light.png`: 라이트 모드 히어로 이미지 원본입니다.
- `resources/hero.dark.png`: 다크 모드 히어로 이미지 원본입니다.
- `resources/readme-hero.svg`: 히어로 SVG 생성 결과물입니다.
- `resources/assets/logos/inedit.svg`: Inédit 뱃지에 임베드되는 로고 원본입니다.
- `resources/assets/logos/vendit.svg`: Vendit 뱃지에 임베드되는 로고 원본입니다.
- `resources/assets/logos/whatssub.svg`: Whatssub 뱃지에 임베드되는 로고 원본입니다.
- `scripts/readme_update.sh`: README와 히어로 SVG를 재생성하는 스크립트입니다.
- `mise.toml`: Node와 Yarn 실행 버전의 source-of-truth입니다.
- `mise.lock`: 지원 플랫폼별 도구 다운로드 URL과 제공되는 체크섬을 고정합니다.
- `package.json`: Yarn 스크립트와 패키지 메타데이터입니다.

## 📝 README 생성 규칙

`README.md`는 직접 수정으로 끝내지 않습니다. 반드시 source-of-truth를 수정한 뒤 생성 명령을 실행합니다.

1. README 내용을 바꿀 때는 `resources/README.preset.md`를 수정합니다.
2. `resources/README.preset.md`의 placeholder, 경로, 섹션 구조가 바뀌면 `scripts/readme_update.sh`의 치환/생성 로직도 함께 수정합니다.
3. 히어로 wrapper인 `resources/readme-hero.preset.svg` 또는 `resources/hero.*` 이미지가 바뀌면 `scripts/readme_update.sh`의 히어로 SVG 생성 로직도 함께 확인합니다.
4. `./scripts/readme_update.sh` 또는 `yarn run readme`를 실행해 `README.md`와 `resources/readme-hero.svg`를 재생성합니다.

README에는 확인된 사실만 씁니다. 추측, 임시 운영 정보, secret, token, 개인 인증 정보는 포함하지 않습니다.

## 🖼️ 히어로 이미지 적용 기준

- `resources/readme-hero.preset.svg`는 히어로 wrapper 원본입니다. 임의로 재작성하지 않습니다.
- 히어로 wrapper의 fallback text는 저장소 이름으로 유지합니다.
- 라이트/다크 모드 히어로는 `resources/hero.light.png`(또는 `hero.light.jpg`)과 `resources/hero.dark.png`(또는 `hero.dark.jpg`)를 사용합니다.
- 모드 구분이 필요 없는 단일 히어로는 `resources/hero.png` 또는 `resources/hero.jpg`를 사용합니다.
- 생성 명령은 존재하는 히어로 이미지만 base64 data URI로 `resources/readme-hero.svg`에 임베드합니다.
- `resources/readme-hero.svg`는 생성 결과물입니다. 직접 수정으로 끝내지 않고 생성 명령으로 재생성합니다.

## 🏷️ 뱃지 로고 적용 기준

- Inédit, Vendit, Whatssub 뱃지에 들어가는 로고는 `resources/assets/logos/inedit.svg`, `resources/assets/logos/vendit.svg`, `resources/assets/logos/whatssub.svg`를 사용합니다.
- 로고 SVG가 바뀌면 `scripts/readme_update.sh`가 base64로 인코딩해 `{{KEY_INEDIT}}`, `{{KEY_VENDIT}}`, `{{KEY_WHATSSUB}}` placeholder에 주입합니다.
- 새 뱃지를 추가할 때는 `resources/assets/logos/`에 로고 SVG를 추가하고, `resources/README.preset.md`의 placeholder와 `scripts/readme_update.sh`의 인젝션 로직을 함께 갱신합니다.

## 🛠️ 명령

이 저장소는 mise로 Node `24.19.0`과 Yarn Berry `4.18.0`을 고정합니다. 실행 버전의 source-of-truth는 `mise.toml`이며, `mise.lock`으로 지원 플랫폼의 도구 아티팩트 URL과 제공되는 체크섬을 고정합니다. `packageManager`는 Changesets 등 Yarn 생태계 도구의 호환 메타데이터와 Yarn 아티팩트의 SHA-512를 유지하며, 그 버전은 `mise.toml`의 Yarn 버전과 같아야 합니다.

- mise 설치 확인: `mise --version`
- 고정 도구 확인: `mise current`, `node --version`, `yarn --version`
- 의존성 설치: `yarn install`
- Changeset 작성: `yarn changeset`
- README와 히어로 SVG 재생성: `yarn run readme` 또는 `./scripts/readme_update.sh`
- 린트: `yarn run lint`
- 전체 취약점 확인: `yarn npm audit --all --recursive`

GitHub Actions는 SHA로 고정한 `jdx/mise-action`과 mise `2026.8.14`를 사용하며, `mise.lock` 기반 잠금 설치를 수행합니다. action이나 mise 버전을 올릴 때는 공식 릴리스와 전체 커밋 SHA를 확인하고 lockfile을 다시 생성합니다.

Yarn은 `mise.toml`에서 `aqua:yarnpkg/berry` 백엔드로 명시합니다. mise 레지스트리의 기본 `yarn` 별칭이 사용하는 vfox 백엔드는 현재 `mise.lock`에 다운로드 URL을 기록하지 않아 잠금 설치가 실패하므로, 해당 백엔드가 lockfile URL을 지원하는지 확인하기 전에는 기본 별칭으로 바꾸지 않습니다.

## 🚀 GitHub Release 게시

- 릴리스가 필요한 변경에는 `.changeset/*.md` Changeset을 함께 커밋합니다.
- `main`에 직접 push되면 `.github/workflows/release.yml`이 Changeset release plan을 확인합니다. 유효한 Changeset이 없으면 릴리스 작업을 수행하지 않습니다.
- 유효한 Changeset이 있으면 GitHub Actions가 버전과 `CHANGELOG.md`를 갱신하고 README를 재생성한 뒤, 버전 커밋을 `main`에 직접 추가합니다. Release PR이나 별도 릴리스 브랜치는 만들지 않습니다.
- 버전 커밋에 `v<version>` 태그를 추가하고 GitHub Release를 발행합니다. npm에는 게시하지 않습니다.
- 로컬 `publish` 스크립트나 `develop` → `main` 병합 게시 흐름을 사용하지 않습니다. 사용자가 명시적으로 요청하지 않으면 수동 태그·Release 생성이나 push를 수행하지 않습니다.

## 🔐 의존성 보안 유지보수

- 전체 개발 의존성의 취약점은 `yarn npm audit --all --recursive`로 확인합니다.
- 2026-08-25 기준 `eslint-config-taeyoon@0.2.2`와 일부 하위 플러그인은 ESLint 10을 peer 범위로 선언하지 않으므로, 이 저장소는 peer 요구사항을 충족하는 최신 ESLint 9.x를 사용합니다.
- ESLint 9 지원 종료 알림은 보안 취약점과 구분하며 숨기지 않습니다. `eslint-config-taeyoon`과 관련 플러그인이 ESLint 10 지원 버전을 공개하면 ESLint와 함께 갱신하고 `yarn install --immutable`, `yarn run lint`, `yarn npm audit --all --recursive`를 다시 확인한 뒤 이 기록을 제거합니다.
- TypeScript는 `@typescript-eslint`가 지원하는 최신 범위 때문에 6.x를 유지합니다. TypeScript 7 지원 버전이 공개되면 함께 갱신하고 린트를 다시 확인합니다.

## 🧱 개발 기준

- 새 프레임워크, 빌드 시스템, 런타임 추상화를 도입하지 않습니다. 작은 자동화 저장소의 범위를 유지합니다.
- 생성된 마크다운과 출력물은 기존 Prettier 흐름을 따릅니다.
- 생성 스크립트는 단순하고 명시적으로 유지합니다. 알려진 로컬 자산을 템플릿에 주입하는 범위를 벗어나지 않습니다.

## ✅ 변경 후 확인 기준

변경 후 가능한 범위에서 아래를 실행합니다.

- 에이전트 지침 변경: `test -f AGENTS.md`, `test -L CLAUDE.md`, `test "$(readlink CLAUDE.md)" = "AGENTS.md"`, `git diff --check`
- `resources/README.preset.md` 변경: `yarn run readme` 후 `git diff --check`
- 히어로 wrapper 또는 `resources/hero.*` 이미지 변경: `yarn run readme` 후 `git diff --check`
- 로고 SVG 변경: `yarn run readme` 후 `git diff --check`
- 스크립트나 TypeScript 설정 변경: 영향을 받는 생성 명령 실행 후 `git diff --check`
- 작업 종료 전 `git status --short`로 변경 범위를 한 번 더 확인합니다.

실행할 수 없는 항목은 성공한 것처럼 말하지 않고 이유와 함께 보고합니다.

## 🔗 CLAUDE.md 심볼릭 링크 관리

`CLAUDE.md`는 `AGENTS.md`를 가리키는 심볼릭 링크로 유지합니다.

```sh
ln -s AGENTS.md CLAUDE.md
```

이미 `CLAUDE.md`가 존재한다면 먼저 종류를 확인합니다.

- 이미 `AGENTS.md`를 가리키는 심볼릭 링크라면 유지합니다.
- 일반 파일이거나 다른 대상을 가리키는 링크라면 임의로 덮어쓰지 말고 사용자에게 확인합니다.

Windows에서는 일반 사용자 권한으로 `ln -s`가 동작하지 않거나, Git for Windows가 symlink을 일반 파일로 체크아웃할 수 있습니다. 아래 순서로 fallback합니다.

1. 개발자 모드가 켜져 있거나 관리자 권한이 있다면 PowerShell에서 symlink을 만듭니다.

   ```powershell
   New-Item -ItemType SymbolicLink -Path CLAUDE.md -Target AGENTS.md
   ```

2. Git for Windows를 사용한다면 `git config core.symlinks` 값을 확인하고 `false`라면 `git config core.symlinks true` 후 다시 체크아웃합니다.
3. symlink을 사용할 수 없는 환경이라면 `CLAUDE.md`를 `AGENTS.md`의 일반 파일 사본으로 둡니다. 이 경우 `AGENTS.md`를 수정할 때 같은 변경을 `CLAUDE.md`에도 반영하고, 커밋 전에 `diff AGENTS.md CLAUDE.md` 결과가 비어 있는지 확인합니다.

## 🧾 커밋 원칙

커밋은 사용자가 명시적으로 요청한 경우에만 합니다.

커밋 메시지는 아래 Prefix를 사용하고, 영문 Sentence Case로 작성합니다.

- 기능 추가: `Feat: ...`
- 문서 갱신: `Docs: ...`
- 이름/구조 정리: `Refactor: ...`
- 버그 수정: `Fix: ...`
- 설정 변경: `Config: ...`
- 생성 로직/빌드 변경: `Chore: ...`
- 테스트 추가/수정: `Test: ...`

한 커밋에는 하나의 목적만 담습니다. 사용자가 커밋을 요청했더라도 무관한 변경은 함께 stage하지 않고, 같은 파일에 사용자 변경과 작업 변경이 섞여 있으면 diff를 확인해 필요한 hunk만 선별합니다.

# scratch-tutoring-web
> 스크래치 튜터링 시스템

## 서버 내 설치 방법
- packages/dist, packages/dist, packages/build 내에 .env 파일을 각각 생성 후 안에 내용을 ```SCHEMA_PATH=https://<프로덕션 서버 도메인>/graphql``` 적어주세요
- yarn bootstrap
- yarn build
- 이후 nginx 에서 https://codechacha.com/ko/deploy-react-with-nginx/#nginx-%EC%84%A4%EC%A0%95 와 같이 설정을 해줘야하는데, 
총 3개의 server_name 에 대해 해주어야합니다.
1. app => packages/dist
2. admin => packages/dist
3. gui => packages/build

## Quick start
```bash
sudo code /etc/hosts
```

마지막 줄에 아래와 같이 127.0.0.1 local.stg-scratch-tutoring.app 추가 (🚨 이 액션은 위험하니 주의하세요.)

```bash
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost
127.0.0.1       local.stg-scratch-tutoring.app
```
VSCode에서 Retry as Sudo 버튼 클릭

```bash
yarn bootstrap
sh certificate.sh # 로컬에서 https 를 사용할 수 있도록 인증서를 설치합니다.
yarn dev:hot # .env.dev 파일이 필요합니다. CODEOWNERS에게 요청하세요
```

Open `https://local.stg-scratch-tutoring.app:<port>` with your browser to see the result.
⚠️ http:// 대신 https:// 로 사용하세요!

## lint & type-check
```bash
# 타입 체크보다 lint:fix를 먼저 해야합니다.
yarn lint:fix
yarn type-check
```

## VSCode 설정
아래 Extension들을 설치하세요.

**`dbaeumer.vscode-eslint`**: ESLint

**`esbenp.prettier-vscode`**: Prettier - Code formatter

**`rbbit.typescript-hero`**: `⌥ + Shift + O` 키로 쓰이지 않는 import 정리

**`gruntfuggly.todo-tree`**: TODO 주석 관리

## Commands
**`yarn bootstrap`**: 패키지 설치

**`yarn start`**: 모듈들을 빌드하고 할당된 포트에 띄웁니다. 타입도 함께 빌드합니다. 빌드된 타입은 dist/index.d.ts 에 있습니다. 각 파일에 변경이 생길 때마다 다시 빌드합니다.

**`yarn pull-types`**: 모든 모듈에서 리모트 모듈의 타입 파일을 가져와 generated/types/<리모트 모듈 이름>.d.ts 파일을 생성합니다.

**`yarn clean`**: Remove the node_modules directory from all packages.

**`yarn clean:dist`**: Remove the dist directory from all packages.

**`yarn clean:types`**: Remove the generated/types/*.d.ts files from all packages

**`yarn clean:all`**: Remove the node_modules, dist, generated/types/*.d.ts from all packages.

**`yarn type-check`**: 모든 패키지에서 타입을 체크합니다.

**`yarn lint`**: 모든 패키지에서 lint error, warning을 체크합니다.

**`yarn lint:fix`**: 모든 패키지에서 lint error, warning을 체크하고 자동 수정이 가능한 항목은 자동으로 수정합니다.

**`yarn commit`**: git commit 대신 사용하세요.


## Trouble Shooting

8001, 8002 포트가 기존에 로컬 시스템에서 쓰는 포트와 겹친다면, 아래 환경 변수를 세팅하여 bootstrap 해주세요.

```
export APP_URL=https://local.stg-scratch-tutoring.app:5001
export ADMIN_URL=https://local.stg-scratch-tutoring.app:5002
export APP_PORT=5001
export ADMIN_PORT=5002
yarn dev:hot
```

위 예시는 app 은 5001 포트, admin 은 5002 포트를 사용하는 예시입니다.

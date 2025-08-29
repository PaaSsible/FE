# 1️⃣ Node 단계: 빌드
FROM node:lts-trixie-slim AS builder

# 작업 디렉토리
WORKDIR /app

# 패키지 복사
COPY package.json pnpm-lock.yaml ./

# pnpm 설치 및 의존성 설치
RUN npm install -g pnpm
RUN pnpm install

# 소스 전체 복사
COPY . .

# Vite 빌드 (환경 변수 필요 시 설정 가능)
ENV NODE_ENV=production
RUN pnpm build

# 2️⃣ Nginx 단계: 정적 파일 서빙
FROM nginx:mainline-alpine-perl

# Vite 빌드 결과를 Nginx html 디렉토리로 복사
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Nginx 기본 포트
EXPOSE 80

# 컨테이너 실행 시 Nginx 포그라운드 실행
CMD ["nginx", "-g", "daemon off;"]

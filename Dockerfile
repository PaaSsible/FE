# ---- Node 단계: 빌드 ----
FROM node:lts-trixie-slim AS builder

# 작업 디렉토리
WORKDIR /app

# 패키지 복사
COPY package.json pnpm-lock.yaml ./

# pnpm 설치 및 의존성 설치
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# 소스 전체 복사
COPY . .

# Vite에 주입할 빌드 인자 선언
ARG VITE_API_USER_URL
ARG VITE_API_RECRUIT_URL
ARG VITE_API_BOARD_URL
ARG VITE_API_CHAT_URL
ARG VITE_API_MEET_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_REDIRECT_URL

# Vite가 인식하는 .env.production 생성
RUN printf "VITE_API_USER_URL=%s\nVITE_API_RECRUIT_URL=%s\nVITE_API_BOARD_URL=%s\nVITE_API_CHAT_URL=%s\nVITE_API_MEET_URL=%s\nVITE_GOOGLE_CLIENT_ID=%s\nVITE_REDIRECT_URL=%s\n" \
  "$VITE_API_USER_URL" "$VITE_API_RECRUIT_URL" "$VITE_API_BOARD_URL" "$VITE_API_CHAT_URL" "$VITE_API_MEET_URL" "$VITE_GOOGLE_CLIENT_ID" "$VITE_REDIRECT_URL" > .env.production

# 환경 변수
ENV NODE_ENV=production

# Vite 빌드
RUN pnpm build

# ---- Nginx 단계: 정적 파일 서빙 ----
FROM nginx:mainline-alpine-perl

# Vite 빌드 결과를 Nginx html 디렉토리로 복사
COPY --from=builder /app/dist/ /usr/share/nginx/html

# Nginx conf 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx 기본 포트
EXPOSE 80

# 컨테이너 실행 시 Nginx 포그라운드 실행
CMD ["nginx", "-g", "daemon off;"]

FROM node:20

WORKDIR /app

# 依存関係を先にインストール
COPY package.json package-lock.json* yarn.lock* ./
RUN yarn install || npm install

# アプリのソースをコピー
COPY . .

EXPOSE 3000

# Viteサーバーをホスト公開
CMD ["npm", "run", "dev", "--", "--host"]
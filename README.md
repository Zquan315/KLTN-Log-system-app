# KLTN-Log-system-app

## các lệnh đã chạy
- chạy `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` để lấy JWT
- sudo apt update

//install docker
sudo snap install docker
sudo apt install docker-compose -y

// move docker
cd docker
sudo docker compose up -d

// backend và frontend
//node & pnpm
- curl -fsSL https://get.pnpm.io/install.sh | sh -
- source ~/.bashrc
- curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
- source ~/.bashrc 
- nvm install 20
- nvm use 20
- pnpm -v
- node -v

//Nest CLI
- pnpm add -g @nestjs/cli


// dependencies
cd backend

pnpm add @nestjs/config @nestjs/jwt passport passport-jwt @nestjs/passport @nestjs/platform-express
pnpm add mongoose @nestjs/mongoose bcrypt
pnpm add reflect-metadata
pnpm add @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
pnpm add class-validator class-transformer
pnpm add csv-stringify  # export CSV
pnpm add -D @nestjs/cli typescript ts-node tsconfig-paths rimraf
pnpm add -D @types/bcrypt @types/node @types/express @types/passport-jwt
pnpm install @nestjs/common @nestjs/core @nestjs/passport @nestjs/platform

// front end
cd frontend
pnpm add dayjs
pnpm add react react-dom
pnpm add -D typescript @types/react @types/react-dom^19.1.1 vite @vitejs/plugin-react

//run backend
pnpm start:dev

//run frontend

#!/usr/bin/env sh

# 中止脚本如果发生错误
set -e

# 构建
npm run build

# 进入构建输出目录
cd dist

# 如果需要自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 部署到 https://[USERNAME].github.io/restaurant-marketing-app
git push -f https://github.com/nndemo/restaurant-marketing-app.git main:gh-pages

cd -
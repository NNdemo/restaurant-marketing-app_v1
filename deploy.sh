#!/usr/bin/env sh

# 中止脚本如果发生错误
set -e

# 构建
npm run build

# 进入构建输出目录
cd dist

# 创建.nojekyll文件阻止GitHub Pages使用Jekyll处理
touch .nojekyll

# 创建404.html (与index.html相同，用于SPA路由)
cp index.html 404.html

# 如果需要自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy to restaurant-marketing-app_v1'

# 部署到 https://[USERNAME].github.io/restaurant-marketing-app_v1
git push -f https://github.com/NNdemo/restaurant-marketing-app_v1.git main:gh-pages

cd -

echo "部署完成！现在请访问 https://nndemo.github.io/restaurant-marketing-app_v1/"
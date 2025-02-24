#!/bin/bash

# 创建目录
mkdir -p ../src/assets/pool
mkdir -p ../src/assets/putCoin

# 下载函数
download_file() {
    url=$1
    dest=$2
    if curl -s -L -o "$dest" "$url"; then
        echo "Downloaded: $dest"
    else
        echo "Error downloading $url"
    fi
}

# 下载许愿池序列帧图片
for i in $(seq 1 20); do
    url="https://morefun-active.oss-cn-beijing.aliyuncs.com/farfetch/animation/pool/pool${i}.jpg"
    dest="../src/assets/pool/pool${i}.jpg"
    download_file "$url" "$dest" &
done

# 下载投币动画序列帧图片
for i in $(seq 1 38); do
    url="https://morefun-active.oss-cn-beijing.aliyuncs.com/farfetch/animation/coin/coin${i}.png"
    dest="../src/assets/putCoin/coin${i}.png"
    download_file "$url" "$dest" &
done

# 等待所有后台任务完成
wait

echo "All downloads completed!" 
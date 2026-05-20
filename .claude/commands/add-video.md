Use this command to compress any video before adding it to the project. Always run this instead of copying a video directly.

```
ffmpeg -i "$INPUT" -vcodec h264 -b:v 1668886 -r 30 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" -acodec aac -movflags +faststart assets/$OUTPUT.mp4 -y
```

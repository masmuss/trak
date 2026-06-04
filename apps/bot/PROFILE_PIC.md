# Bot Profile Picture

The trak bot logo is a robot-face mark on indigo gradient.

## Source

| Variant         | Path                                       |
| --------------- | ------------------------------------------ |
| Full color icon | `apps/web/static/logo/icon.svg`            |
| Dark bg variant | `apps/web/static/logo/icon-dark.svg`       |
| Mono light      | `apps/web/static/logo/icon-mono-light.svg` |
| Mono dark       | `apps/web/static/logo/icon-mono-dark.svg`  |

## Setting via BotFather

1. Open Telegram → search `@BotFather`
2. Send `/setuserpic`
3. Select `@trak_services_bot`
4. Upload `apps/web/static/logo/icon.svg` (convert to PNG first)

## Convert SVG to PNG

Use any converter for Telegram upload:

```bash
# Inkscape
inkscape apps/web/static/logo/icon.svg --export-png=/tmp/trak-bot-pic.png --export-width=512 --export-height=512

# ImageMagick
convert -background none apps/web/static/logo/icon.svg -resize 512x512 /tmp/trak-bot-pic.png

# Online: https://cloudconvert.com/svg-to-png
```

Telegram profile pics must be at least 512×512px PNG.

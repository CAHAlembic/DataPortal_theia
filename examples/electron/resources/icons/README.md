# Application Icons

This directory should contain the application icons for DataPortal Data Engineering.

## Required Icon Files

### macOS

- `icon.icns` - macOS application icon (generated from iconset)

### Windows

- `icon.ico` - Windows application icon (multi-resolution)

### Linux

- `icon.png` (512x512) - Primary Linux icon
- `icon-256x256.png`
- `icon-128x128.png`
- `icon-64x64.png`
- `icon-48x48.png`
- `icon-32x32.png`
- `icon-16x16.png`

## Current Status

**PLACEHOLDER**: These icon files need to be created from the Alembic logo.

## How to Generate Icons

See `/BUILDING.md` for detailed instructions on creating icons from the Alembic logo.

### Quick Steps

1. Export Alembic logo as high-resolution PNG (1024x1024 or larger)
2. Use image editing software or ImageMagick to create required sizes
3. Convert to platform-specific formats (.icns for macOS, .ico for Windows)
4. Place generated files in this directory

### Tools

- **macOS**: Use `iconutil` (built-in) to convert iconset to .icns
- **Windows**: Use ImageMagick to create .ico file
- **Linux**: Simply provide PNG files at required sizes

---

**Copyright © 2025 Alembic Technologies, Inc.**

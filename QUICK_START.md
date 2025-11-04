# DataPortal Data Engineering - Quick Start Guide

**For the impatient developer who wants to get started NOW**

Copyright © 2025 Alembic Technologies, Inc.

---

## TL;DR

```bash
# 1. Replace the placeholder logo (REQUIRED)
cp /path/to/your/alembic-logo.svg branding/logos/alembic-logo.svg
cp /path/to/your/alembic-logo.svg examples/electron/resources/alembic-logo.svg

# 2. Install dependencies (takes 10-20 minutes first time)
npm install

# 3. Build
npm run build
cd examples/electron
npm run build

# 4. Run it
npm run start

# 5. Package it
npm run package
```

Done! Your branded IDE is in `examples/electron/dist/`

---

## Prerequisites Check

Quick check before you start:

```bash
# Node.js version (need >= 20)
node --version

# Python (need for native builds)
python3 --version  # or python --version

# Check build tools installed
# macOS: xcode-select --version
# Windows: Check for Visual Studio Build Tools
# Linux: gcc --version
```

If any of these fail, see **[BUILDING.md](BUILDING.md)** for detailed setup.

---

## The 5-Minute Version

### Step 1: Logo (CRITICAL)

The placeholder logo MUST be replaced:

```bash
# Replace with your actual Alembic logo
cp YOUR_LOGO.svg branding/logos/alembic-logo.svg
cp YOUR_LOGO.svg examples/electron/resources/alembic-logo.svg
```

### Step 2: Build

```bash
# From the DataPortal_theia directory
npm install    # First time only, takes a while
npm run build  # Compiles everything
```

### Step 3: Test

```bash
cd examples/electron
npm run start  # Launches IDE in dev mode
```

Look for:
- ✅ Window title: "DataPortal Data Engineering"
- ✅ Status bar: Purple (#6845B9)
- ✅ Splash screen: Your logo

### Step 4: Package

```bash
cd examples/electron
npm run package
```

Find your app in: `examples/electron/dist/`

---

## Common Issues & Quick Fixes

### "Cannot find module" error

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails with "gyp ERR"

```bash
# macOS
xcode-select --install

# Linux
sudo apt-get install build-essential python3
```

### Electron build fails

```bash
cd examples/electron
npm run rebuild
```

### "Out of memory" during build

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## Icons (Optional but Recommended)

Skip this if you just want to test. Do this before distributing.

### Generate Icons from Logo

**Requirements**: High-resolution logo PNG (1024x1024 or larger)

```bash
# Create PNG from SVG (if needed)
# Use Inkscape, GIMP, or online converter

# Place PNGs at these sizes:
examples/electron/resources/icons/
├── icon.png (512x512)
├── icon-256x256.png
├── icon-128x128.png
├── icon-64x64.png
├── icon-32x32.png
└── icon-16x16.png
```

**macOS (.icns)**:

```bash
# Create iconset directory with required sizes, then:
iconutil -c icns MyIcon.iconset
mv MyIcon.icns examples/electron/resources/icons/icon.icns
```

**Windows (.ico)**:

```bash
# Using ImageMagick:
convert icon-256.png -define icon:auto-resize=256,128,64,48,32,16 \
  examples/electron/resources/icons/icon.ico
```

See **[BUILDING.md](BUILDING.md)** for detailed icon instructions.

---

## Platform-Specific Notes

### macOS

Standard build:

```bash
npm install
npm run build
cd examples/electron
npm run build
npm run package
```

Output: `.dmg` and `.zip` in `dist/`

### Windows

Need Visual Studio Build Tools first, then:

```bash
npm install
npm run build
cd examples\electron
npm run build
npm run package
```

Output: `.exe` installer and portable in `dist/`

### Linux

```bash
sudo apt-get install build-essential python3
npm install
npm run build
cd examples/electron
npm run build
npm run package
```

Output: `.AppImage`, `.deb`, `.tar.gz` in `dist/`

---

## Verification Checklist

After building, verify:

- [ ] App launches without errors
- [ ] Window title is "DataPortal Data Engineering"
- [ ] Status bar is purple
- [ ] Can open files and folders
- [ ] Terminal works
- [ ] No "Theia" text visible anywhere

If all checked, you're good to go! 🚀

---

## Customization

### Change Colors

Edit: `/branding/themes/alembic-theme.css`

Change `--brand-primary: #6845B9;` to your color.

Then rebuild:

```bash
npm run build
```

### Change Product Name

Edit three files:
1. `/examples/electron/package.json` - `productName`
2. `/examples/electron/electron-builder.yml` - `productName`
3. `/examples/browser/package.json` - `applicationName`

Then rebuild.

### Add Custom CSS

Add your styles to: `/branding/themes/alembic-theme.css`

Copy to: `/examples/electron/resources/alembic-theme.css`

Rebuild.

---

## Getting Help

### Documentation

- **[BRANDING.md](BRANDING.md)** - All about colors, logos, icons
- **[BUILDING.md](BUILDING.md)** - Detailed build instructions
- **[README_DATAPORTAL.md](README_DATAPORTAL.md)** - Full overview
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was done

### Troubleshooting

See **[BUILDING.md](BUILDING.md)** - Troubleshooting section

### Still Stuck?

1. Clear everything and start over:

   ```bash
   npm run clean
   rm -rf node_modules
   npm install
   npm run build
   ```

2. Check that all prerequisites are installed

3. Contact Alembic development team

---

## What's Next?

After the minimal rebrand works:

1. **Phase 2**: Add custom Theia extensions
   - Checkpoint Manager
   - Data Quality Dashboard
   - etc.

2. **Phase 3**: Integrate with backend services
   - Generator services
   - MCP protocol
   - GPU acceleration

3. **Phase 4**: Advanced branding
   - Custom welcome page
   - Branded documentation
   - Tutorial walkthroughs

---

## Quick Reference

| Task | Command | Time |
|------|---------|------|
| Install | `npm install` | 10-20 min (first time) |
| Build | `npm run build` | 5-10 min |
| Run | `cd examples/electron && npm run start` | 30 sec |
| Package | `cd examples/electron && npm run package` | 2-5 min |
| Clean | `npm run clean` | 30 sec |

---

**Ready? Let's go!**

```bash
cd /Users/craigharper/Git/DataPortal_theia
npm install
```

Copyright © 2025 Alembic Technologies, Inc.

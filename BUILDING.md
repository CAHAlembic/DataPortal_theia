# Building DataPortal Data Engineering

**Copyright © 2025 Alembic Technologies, Inc.**

This guide explains how to build and package the DataPortal Data Engineering branded version of Theia IDE.

## Prerequisites

### Required Software

1. **Node.js** (version 20 or higher)

   ```bash
   node --version  # Should show v20.x.x or higher
   ```

   Download from: <https://nodejs.org/>

2. **Python** (for node-gyp native builds)
   - macOS: Pre-installed or via Homebrew
   - Windows: Download from python.org
   - Linux: Usually pre-installed

3. **Build Tools**
   - **macOS**: Xcode Command Line Tools

     ```bash
     xcode-select --install
     ```

   - **Windows**: Visual Studio Build Tools or Visual Studio 2019/2022
   - **Linux**: gcc, g++, make

     ```bash
     sudo apt-get install build-essential
     ```

4. **Git** (for repository management)

### Optional Tools

- **ImageMagick** (for icon generation)
- **iconutil** (macOS, for .icns generation)
- **Electron Builder** (installed automatically as dev dependency)

## Initial Setup

### 1. Clone Repository

```bash
cd /Users/craigharper/Git
cd DataPortal_theia
```

### 2. Install Dependencies

From the repository root:

```bash
npm install
```

This will:
- Install all monorepo dependencies
- Run lerna bootstrap
- Install Electron-specific dependencies
- Compile TypeScript references

**Note**: This process can take 10-20 minutes on first run.

### 3. Verify Installation

```bash
# Check that dependencies installed correctly
npm run compile

# Verify no errors in compilation
```

## Building the Application

### Build Process Overview

The build happens in stages:
1. **Compile TypeScript** → JavaScript
2. **Bundle with Webpack** → Optimized bundles
3. **Build Theia Application** → Complete app structure
4. **Package with Electron Builder** → Distributable installers

### Build Commands

#### Full Development Build

From repository root:

```bash
# Build all packages
npm run build

# Build Electron example specifically
cd examples/electron
npm run build
```

This creates a development build in `examples/electron/lib/`.

#### Production Build

For optimized production builds:

```bash
cd examples/electron
npm run build:production
```

### Build Options

- **Development Mode**: Faster builds, includes source maps
- **Production Mode**: Optimized, minified, no source maps

## Running the Application

### Development Mode

```bash
cd examples/electron
npm run start
```

This launches the IDE without packaging, useful for testing changes.

### Watch Mode

For active development with auto-rebuild:

```bash
cd examples/electron
npm run watch
```

In a separate terminal:

```bash
npm run start
```

## Packaging for Distribution

### Package for Current Platform

```bash
cd examples/electron

# Package for your current OS
npm run package
```

This uses electron-builder configuration from `electron-builder.yml`.

### Package for Specific Platforms

Edit `package.json` scripts section or run:

```bash
# macOS
npx electron-builder --mac

# Windows
npx electron-builder --win

# Linux
npx electron-builder --linux
```

### Package for All Platforms

```bash
npx electron-builder --mac --win --linux
```

**Note**: Cross-platform builds may require additional setup:
- Building for Windows on macOS requires Wine
- Building for macOS requires macOS or appropriate signing setup

### Output Locations

Packaged applications will be in:

```
examples/electron/dist/
├── DataPortal Data Engineering-1.65.0.dmg         # macOS installer
├── DataPortal Data Engineering-1.65.0-mac.zip     # macOS zip
├── DataPortal Data Engineering Setup 1.65.0.exe   # Windows installer
├── DataPortal Data Engineering 1.65.0.exe         # Windows portable
├── dataportal-data-engineering-1.65.0.AppImage    # Linux AppImage
├── dataportal-data-engineering_1.65.0_amd64.deb   # Debian package
└── dataportal-data-engineering-1.65.0.tar.gz      # Linux tarball
```

## Custom Icon Setup

### Creating Icons from Logo

#### macOS (.icns)

1. Create an iconset directory:

   ```bash
   mkdir -p branding/icons/icon.iconset
   ```

2. Generate required sizes from your logo PNG:

   ```
   icon_16x16.png
   icon_16x16@2x.png (32x32)
   icon_32x32.png
   icon_32x32@2x.png (64x64)
   icon_128x128.png
   icon_128x128@2x.png (256x256)
   icon_256x256.png
   icon_256x256@2x.png (512x512)
   icon_512x512.png
   icon_512x512@2x.png (1024x1024)
   ```

3. Convert to .icns:

   ```bash
   iconutil -c icns branding/icons/icon.iconset
   cp branding/icons/icon.icns examples/electron/resources/icons/
   ```

#### Windows (.ico)

Using ImageMagick:

```bash
convert logo-256.png -define icon:auto-resize=256,128,64,48,32,16 \
  examples/electron/resources/icons/icon.ico
```

#### Linux (.png)

Simply place PNG files at required sizes in `examples/electron/resources/icons/`:

```
icon.png          (512x512)
icon-256x256.png
icon-128x128.png
icon-64x64.png
icon-48x48.png
icon-32x32.png
icon-16x16.png
```

## Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors

**Solution**: Reinstall dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. Native module compilation failures

**Solution**: Rebuild native modules

```bash
cd examples/electron
npm run rebuild
```

#### 3. Webpack build errors

**Solution**: Clear webpack cache

```bash
rm -rf examples/electron/.webpack
npm run build
```

#### 4. Electron packaging fails

**Solution**: Check electron-builder.yml configuration and ensure all icon files exist

```bash
# Verify icons exist
ls -la examples/electron/resources/icons/
```

#### 5. "gyp ERR!" errors

**Solution**: Install/update Python and build tools
- macOS: `xcode-select --install`
- Windows: Install Visual Studio Build Tools
- Linux: `sudo apt-get install build-essential python3`

### Build Performance

To improve build times:

1. **Use faster disk**: SSD significantly improves Node.js builds
2. **Increase Node memory**:

   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

3. **Use incremental builds**: `npm run watch` instead of full rebuilds
4. **Disable antivirus** temporarily during builds (Windows)

### Clean Build

If you encounter persistent issues, try a clean build:

```bash
# Clean all build artifacts
npm run clean

# Rebuild from scratch
rm -rf node_modules examples/*/node_modules
npm install
npm run build
```

## Development Workflow

### Making Branding Changes

1. **Update assets**: Modify files in `/branding/`
2. **Copy to resources**: Update `/examples/electron/resources/`
3. **Rebuild**: `npm run build` in examples/electron
4. **Test**: `npm run start` to launch
5. **Verify**: Check that changes appear
6. **Package**: `npm run package` when ready

### Updating Theme

1. Edit: `/branding/themes/alembic-theme.css`
2. Copy: `cp branding/themes/alembic-theme.css examples/electron/resources/`
3. Rebuild and test

### Updating Product Name

1. Edit all package.json files (see BRANDING.md)
2. Edit electron-builder.yml
3. Rebuild application

## CI/CD Integration

For automated builds, create a GitHub Actions workflow or similar:

```yaml
name: Build DataPortal

on: [push]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - run: npm install
    - run: npm run build
    - run: cd examples/electron && npm run package
    
    - uses: actions/upload-artifact@v3
      with:
        name: dataportal-${{ matrix.os }}
        path: examples/electron/dist/*
```

## Build Verification

Before distributing, verify:

- [ ] Application launches without errors
- [ ] Window title is correct
- [ ] Icon displays in OS
- [ ] About dialog shows Alembic branding
- [ ] Theme colors are applied
- [ ] All core IDE features work (editor, terminal, file explorer)
- [ ] No console errors on startup

## Distribution

### Code Signing (Important for Production)

**macOS**:
- Requires Apple Developer account
- Sign with Developer ID Application certificate
- Notarize with Apple

**Windows**:
- Requires code signing certificate
- Sign with signtool or through electron-builder

See electron-builder documentation for detailed signing setup.

### Release Process

1. Update version in package.json files
2. Build and test thoroughly
3. Package for all target platforms
4. Sign applications (production only)
5. Create release notes
6. Distribute via chosen channels

## Support

For build issues, contact:
- **Technical Lead**: See team documentation
- **Repository**: Internal Alembic Git server

---

**Last Updated**: October 28, 2025
**Version**: 1.0

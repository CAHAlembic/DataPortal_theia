# DataPortal Data Engineering

**Alembic's GPU-Native Data Analytics IDE**

Copyright © 2025 Alembic Technologies, Inc.

---

## Overview

DataPortal Data Engineering is a branded version of Eclipse Theia IDE, customized for Alembic Technologies' data engineering and analytics workflows. This IDE provides a modern, extensible development environment optimized for data professionals working with GPU-accelerated pipelines and analytics.

### Key Features

- **Professional Branding**: Alembic's visual identity (purple #6845B9 primary color)
- **Modern IDE**: Based on Eclipse Theia with VS Code compatibility
- **Cross-Platform**: Available for macOS, Windows, and Linux
- **Extensible**: Built on Theia's extension architecture
- **GPU-Ready**: Designed for data engineering workflows

## Product Information

- **Product Name**: DataPortal Data Engineering
- **Company**: Alembic Technologies, Inc.
- **Version**: 1.65.0 (based on Theia 1.65.0)
- **Website**: <https://alembic.com>
- **License**: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0

## Quick Start

### For Users

1. Download the installer for your platform
2. Run the installer
3. Launch "DataPortal Data Engineering"
4. Start working with your data projects

### For Developers

See **[BUILDING.md](BUILDING.md)** for complete build instructions.

#### Prerequisites

- Node.js >= 20
- Python (for native modules)
- Platform-specific build tools

#### Quick Build

```bash
# Install dependencies
npm install

# Build application
npm run build

# Run in development mode
cd examples/electron
npm run start

# Package for distribution
npm run package
```

## Documentation

- **[BRANDING.md](BRANDING.md)** - Branding guidelines and assets
- **[BUILDING.md](BUILDING.md)** - Build and packaging instructions
- **[Original Theia README](README.md)** - Eclipse Theia documentation

## Branding Elements

### Colors

- **Primary**: #6845B9 (Alembic Purple)
- **Text**: #000000 (Black), #737373 (Grey)
- **10-Color Chart Palette**: Purple, Blue, Orange, Yellow, Green, Red, Magenta, Cyan, Light Blue, Lime

### Visual Assets

- Logo: `/branding/logos/alembic-logo.svg`
- Icons: `/branding/icons/` (to be generated)
- Theme: `/branding/themes/alembic-theme.css`

## Architecture

DataPortal Data Engineering is built on:

- **Eclipse Theia** (1.65.0) - IDE framework
- **Electron** (37.2.1) - Desktop application framework
- **Node.js** (>=20) - Runtime environment
- **TypeScript** - Primary development language
- **Webpack** - Module bundling

## Project Structure

```
DataPortal_theia/
├── branding/                      # Alembic brand assets
│   ├── logos/                     # Logo files
│   ├── icons/                     # Icon sources
│   └── themes/                    # Custom CSS themes
├── examples/
│   ├── electron/                  # Electron desktop app
│   │   ├── package.json          # Product metadata
│   │   ├── electron-builder.yml  # Build configuration
│   │   └── resources/            # Application resources
│   └── browser/                   # Browser version (optional)
├── packages/                      # Theia core packages
├── BRANDING.md                    # Branding guide
├── BUILDING.md                    # Build instructions
└── README_DATAPORTAL.md          # This file
```

## Current Status

### ✅ Completed

- [x] Product name updated to "DataPortal Data Engineering"
- [x] Package.json files rebranded
- [x] Alembic color theme created
- [x] Electron builder configuration created
- [x] Documentation completed (BRANDING.md, BUILDING.md)
- [x] Project structure established

### ⏳ Pending

- [ ] Replace placeholder logo with actual Alembic logo
- [ ] Generate application icons from Alembic logo
- [ ] Build and test on all target platforms
- [ ] Create distributable installers
- [ ] User acceptance testing

## Building and Packaging

### Development Build

```bash
cd examples/electron
npm run build
npm run start
```

### Production Package

```bash
cd examples/electron
npm run build:production
npm run package
```

Output will be in `examples/electron/dist/`

### Supported Platforms

- **macOS**: .dmg installer, .zip archive
- **Windows**: .exe installer, portable .exe
- **Linux**: .AppImage, .deb package, .tar.gz

## Customization

This is a **minimal rebrand** focusing on:

- Visual branding (logo, colors, product name)
- No custom extensions (yet)
- No backend integration (yet)
- Standard Theia functionality

### Future Enhancements

Planned for future phases:

1. **Custom Extensions**:
   - Checkpoint Manager
   - Data Quality Dashboard
   - Thread Manager
   - Visual Query Builder
   - Network/API Discovery

2. **Backend Integration**:
   - Generator service connections
   - MCP (Model Context Protocol) integration
   - GPU acceleration support

3. **Advanced Branding**:
   - Custom welcome page
   - Branded documentation
   - Tutorial walkthroughs

## Development

### Making Changes

1. Update branding assets in `/branding/`
2. Modify configuration in `examples/electron/`
3. Rebuild: `npm run build`
4. Test: `npm run start`
5. Package: `npm run package`

### Theme Customization

Edit `/branding/themes/alembic-theme.css` to customize:
- Colors
- Fonts
- UI element styling
- Layout tweaks

### Icon Updates

1. Create new icons from logo
2. Place in `examples/electron/resources/icons/`
3. Update `electron-builder.yml` if paths change
4. Rebuild application

## Testing

Before distribution, verify:

- [ ] Application launches successfully
- [ ] Window title shows "DataPortal Data Engineering"
- [ ] Status bar uses Alembic Purple
- [ ] Application icon displays correctly
- [ ] No "Theia" branding visible
- [ ] All IDE features work correctly
- [ ] No console errors

## Distribution

### Code Signing (Production)

For production distribution:

- **macOS**: Requires Apple Developer certificate and notarization
- **Windows**: Requires code signing certificate
- **Linux**: Optional but recommended

### Release Checklist

- [ ] Version numbers updated
- [ ] All platforms built and tested
- [ ] Applications signed (production)
- [ ] Release notes prepared
- [ ] Documentation updated

## Support

For questions or issues:

- **Internal**: Contact Alembic development team
- **Technical**: See BUILDING.md troubleshooting section
- **Branding**: See BRANDING.md guidelines

## License

This project is based on Eclipse Theia and maintains its license:

- EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0

Alembic branding and customizations:
- Copyright © 2025 Alembic Technologies, Inc.

## Acknowledgments

Built on [Eclipse Theia](https://theia-ide.org/), the open-source Cloud & Desktop IDE framework.

---

**DataPortal Data Engineering** - Empowering Data Engineers with GPU-Native Analytics

**Alembic Technologies, Inc.** - <https://alembic.com>

Last Updated: October 28, 2025

# DataPortal Data Engineering - Branding Guide

**Copyright © 2025 Alembic Technologies, Inc.**

This document describes the branding elements and guidelines for DataPortal Data Engineering, Alembic's branded version of Eclipse Theia IDE.

## Product Identity

- **Product Name**: DataPortal Data Engineering
- **Company**: Alembic Technologies, Inc.
- **Website**: <https://alembic.com>
- **App ID**: com.alembic.dataportal
- **Category**: Developer Tools / Data Engineering

## Color Palette

### Primary Brand Color

- **Alembic Purple**: `#6845B9`
  - RGB: `104, 69, 185`
  - HSL: `260°, 46%, 50%`
  - Usage: Primary actions, branding, status bar, buttons, highlights

### Text Colors

- **Black**: `#000000` - Primary text, body copy
- **Grey**: `#737373` - Secondary text, muted content
- **White**: `#FFFFFF` - Text on dark backgrounds

### Chart Color Palette (10 colors)

Used for data visualizations and distinctive UI elements:

1. **Purple**: `#6845B9` - Primary data series
2. **Blue**: `#0073E6` - Secondary data series
3. **Orange**: `#D76639` - Tertiary data series
4. **Yellow**: `#E49C41` - Warning states, highlights
5. **Green**: `#4AA473` - Success, positive trends
6. **Red**: `#D03935` - Destructive actions, alerts
7. **Magenta**: `#CA4AF3` - Alternative accent
8. **Cyan**: `#54B4D8` - Information, status
9. **Light Blue**: `#517FFD` - Links, interactive elements
10. **Lime**: `#94CB1D` - Additional data series

## Visual Assets

### Logo Files

Located in: `/branding/logos/`

- `alembic-logo.svg` - Main logo (SVG format, scalable)
- Additional formats can be generated as needed

**Current Status**: Placeholder logo is being used. Replace with actual Alembic logo.

### Application Icons

Located in: `/branding/icons/` and `/examples/electron/resources/icons/`

Required icon sizes:
- **macOS**: 512x512 PNG → convert to `.icns` format
- **Windows**: 256x256 PNG → convert to `.ico` format
- **Linux**: Multiple PNGs (512x512, 256x256, 128x128, 64x64, 32x32, 16x16)

**Current Status**: Icons need to be created from Alembic logo.

### Icon Generation Tools

**macOS (.icns)**:

```bash
# Using iconutil (built-in)
mkdir MyIcon.iconset
# Create required sizes: icon_16x16.png through icon_512x512@2x.png
iconutil -c icns MyIcon.iconset
```

**Windows (.ico)**:

```bash
# Using ImageMagick
convert icon-256.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

**Linux (.png)**:
Simply provide PNG files at the required sizes.

## Theme Customization

### Theme File

Location: `/branding/themes/alembic-theme.css`

This CSS file defines all Alembic brand colors and applies them to Theia UI elements:

- Status bar (Alembic Purple background)
- Activity bar highlights
- Button styling
- Selection highlights
- Link colors
- Tab borders
- Progress bars
- Menu selections

### Applying Theme

The theme is automatically loaded via:
1. Webpack configuration in `/examples/electron/webpack.config.js`
2. CSS file copied to `/examples/electron/resources/alembic-theme.css`
3. Injected during application startup

## File Locations

### Configuration Files

- `/examples/electron/package.json` - Electron app metadata
- `/examples/browser/package.json` - Browser app metadata
- `/package.json` - Monorepo configuration
- `/examples/electron/electron-builder.yml` - Build and packaging configuration

### Resource Files

- `/examples/electron/resources/` - Application resources (logos, icons, CSS)
- `/branding/` - Source branding assets

### Theme Files

- `/branding/themes/alembic-theme.css` - Theme source
- `/examples/electron/resources/alembic-theme.css` - Deployed theme

## Customization Points

### Window Title

Set in: `examples/electron/package.json`

```json
{
  "theia": {
    "frontend": {
      "config": {
        "applicationName": "DataPortal Data Engineering"
      }
    }
  }
}
```

### Splash Screen

Set in: `examples/electron/package.json`

```json
{
  "electron": {
    "splashScreenOptions": {
      "content": "resources/alembic-logo.svg",
      "height": 90
    }
  }
}
```

### Product Name

Set in multiple locations:
- `examples/electron/package.json`: `productName` field
- `examples/browser/package.json`: `theia.frontend.config.applicationName`
- `electron-builder.yml`: `productName` field

## Brand Guidelines

### Do's

✅ Use Alembic Purple (#6845B9) for primary actions and branding
✅ Maintain high contrast for accessibility (black text on white background)
✅ Use the 10-color chart palette consistently for data visualizations
✅ Keep the professional, clean aesthetic of the IDE
✅ Ensure all visible text says "DataPortal Data Engineering"

### Don'ts

❌ Don't use colors outside the approved palette
❌ Don't mix different shades of purple arbitrarily
❌ Don't leave any "Theia" or "Eclipse" branding visible to users
❌ Don't compromise readability for aesthetics
❌ Don't modify core Theia functionality (only visual branding)

## Testing Checklist

Before releasing a branded build, verify:

- [✅] Application title shows "DataPortal Data Engineering"
- [✅] Window title bar shows correct product name
- [✅] About dialog shows Alembic company name
- [✅] Status bar uses Alembic Purple (#6845B9)
- [ ] Buttons use Alembic Purple background
- [✅] Application icon displays correctly in OS (dock/taskbar)
- [✅] Splash screen shows during launch
- [ ] No "Theia" or "Eclipse" text visible in UI
- [✅] Theme colors match brand palette
- [✅] All UI elements remain readable and accessible

## Future Enhancements

After this minimal rebrand, future branding efforts could include:

1. **Custom Welcome Page**: Branded landing page with DataPortal content
2. **Custom Icons**: Branded icon set for file types and actions
3. **Branded Documentation**: In-app help and tutorials
4. **Custom Menu Items**: DataPortal-specific menu structure
5. **Integration Branding**: Branded connection dialogs and settings

## Support

For branding questions or asset updates, contact:
- **Product Manager**: Craig Harper
- **Company**: Alembic Technologies, Inc.
- **Website**: <https://alembic.com>

---

**Last Updated**: October 28, 2025
**Version**: 1.0

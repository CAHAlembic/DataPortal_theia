// @ts-check
import 'reflect-metadata';
import * as path from 'path';
import { app } from 'electron';
import { Container } from 'inversify';
import { ElectronMainApplication, ElectronMainApplicationGlobals } from '@theia/core/lib/electron-main/electron-main-application';
import electronMainApplicationModule from '@theia/core/lib/electron-main/electron-main-application-module';

// Workaround for https://github.com/electron/electron/issues/9225
if (process.env.LC_ALL) {
    process.env.LC_ALL = 'C';
}
process.env.LC_NUMERIC = 'C';

(async () => {
    // @ts-ignore
    (await require('@theia/core/electron-shared/fix-path')).default();

    const theiaAppProjectPath = path.resolve(__dirname, '..', '..', '..');
    process.env.THEIA_APP_PROJECT_PATH = theiaAppProjectPath;

    const config = {
        "applicationName": "DataPortal Data Engineering",
        "defaultTheme": {
            "light": "light",
            "dark": "dark"
        },
        "defaultIconTheme": "theia-file-icons",
        "electron": {
            "windowOptions": {},
            "showWindowEarly": true,
            "splashScreenOptions": {
                "content": "resources/alembic-logo.svg",
                "height": 90
            },
            "uriScheme": "theia"
        },
        "defaultLocale": "",
        "validatePreferencesSchema": true,
        "reloadOnReconnect": true,
        "uriScheme": "theia",
        "preferences": {
            "window.title": "${activeEditorShort}${separator}${appName}"
        }
    };

    const logoPath = path.resolve(theiaAppProjectPath, '../../branding/logos/alembic-logo.png');

    // Set About panel options
    app.setAboutPanelOptions({
        applicationName: 'DataPortal Data Engineering',
        applicationVersion: require('../../../package.json').version,
        copyright: 'Copyright (c) 2025 Alembic Technologies, Inc.'
    });

    if (process.platform === 'darwin') {
        try {
            const { nativeImage } = require('electron');
            const image = nativeImage.createFromPath(logoPath);
            if (!image.isEmpty()) {
                app.dock?.setIcon(image);
            }
        } catch (err) {
            // Ignore errors setting dock icon
        }
    }

    const isSingleInstance = true;

    if (isSingleInstance && !app.requestSingleInstanceLock(process.argv)) {
        app.quit();
        return;
    }

    const container = new Container();
    container.load(electronMainApplicationModule);
    container.bind(ElectronMainApplicationGlobals).toConstantValue({
        THEIA_APP_PROJECT_PATH: theiaAppProjectPath,
        THEIA_BACKEND_MAIN_PATH: path.resolve(__dirname, '../../backend/main.js'),
        THEIA_FRONTEND_HTML_PATH: path.resolve(theiaAppProjectPath, 'lib', 'frontend', 'index.html'),
        THEIA_SECONDARY_WINDOW_HTML_PATH: path.resolve(theiaAppProjectPath, 'lib', 'frontend', 'secondary-window.html')
    });

    function load(raw: any) {
        return Promise.resolve(raw.default).then(module =>
            container.load(module)
        );
    }

    async function start() {
        const application = container.get(ElectronMainApplication);
        await application.start(config);
    }

    try {
        await load(require('@theia/filesystem/lib/electron-main/electron-main-module'));
        await load(require('@theia/api-samples/lib/electron-main/update/sample-updater-main-module'));
        await start();
    } catch (reason) {
        if (typeof reason !== 'number') {
            console.error('Failed to start the electron application.');
            if (reason) {
                console.error(reason);
            }
        }
        app.quit();
    };
})();

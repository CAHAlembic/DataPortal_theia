/**
 * DataPortal Data Engineering - Webpack Configuration
 * Copyright © 2025 Alembic Technologies, Inc.
 * 
 * This file has been customized for Alembic branding.
 */
// @ts-check
const configs = require('./gen-webpack.config.js');
const nodeConfig = require('./gen-webpack.node.config.js');
const path = require('path');

/**
 * Expose bundled modules on window.theia.moduleName namespace, e.g.
 * window['theia']['@theia/core/lib/common/uri'].
 * Such syntax can be used by external code, for instance, for testing.
 */
configs[0].module.rules.push({
    test: /\.js$/,
    loader: require.resolve('@theia/application-manager/lib/expose-loader')
});

/**
 * Add custom CSS loader for Alembic theme
 */
configs[0].module.rules.push({
    test: /alembic-theme\.css$/,
    use: ['style-loader', 'css-loader']
});

module.exports = [
    ...configs,
    nodeConfig.config
];

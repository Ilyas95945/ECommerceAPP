const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.sourceExts.push('cjs');

// Web-specific configuration
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;

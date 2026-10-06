const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Permet d'importer les fichiers .lottie avec require()
config.resolver.assetExts.push("lottie");

module.exports = config;

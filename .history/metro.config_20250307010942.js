// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Tambahkan konfigurasi untuk mengatasi masalah resolusi
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'ttf'];
config.resolver.assetExts = [
	'png',
	'jpg',
	'jpeg',
	'gif',
	'svg',
	'ttf',
	'otf',
	'woff',
	'woff2',
];

// Tambahkan konfigurasi untuk menangani font
config.transformer.babelTransformerPath = require.resolve(
	'metro-react-native-babel-transformer'
);

// Tambahkan konfigurasi untuk mengatasi masalah cache
config.resetCache = true;

module.exports = config;

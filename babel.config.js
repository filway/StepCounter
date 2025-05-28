module.exports = {
  presets: [
    'babel-preset-expo',
    '@babel/preset-flow', // ← 就加在这里
  ],
  plugins: ['react-native-reanimated/plugin'],
}

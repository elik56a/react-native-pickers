// Minimal stub so pure modules importing react-native can be unit tested in node.
module.exports = new Proxy({}, { get: () => () => null });

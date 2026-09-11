const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const rootDir = path.resolve(__dirname, '..');

const filesToObfuscate = [
  { src: path.join(rootDir, 'js/security.js'), dest: path.join(rootDir, 'js/security.min.js') },
  { src: path.join(rootDir, 'js/wedding-data.js'), dest: path.join(rootDir, 'js/wedding-data.min.js') },
  { src: path.join(rootDir, 'js/main.js'), dest: path.join(rootDir, 'js/main.min.js') }
];

const options = {
  compact: true,
  debugProtection: true,
  debugProtectionInterval: 2500,
  disableConsoleOutput: false, // cho phép console log bản quyền hoạt động
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  renameGlobals: false,        // giữ nguyên các biến toàn cục như WEDDING_DATA để các file gọi được nhau
  selfDefending: true,         // chống beautify / format code
  simplify: true,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75
};

console.log('🛡️ Đang tiến hành làm rối và mã hóa các file JavaScript...');

filesToObfuscate.forEach(({ src, dest }) => {
  if (!fs.existsSync(src)) {
    console.error(`❌ Không tìm thấy file nguồn: ${src}`);
    process.exit(1);
  }
  const code = fs.readFileSync(src, 'utf8');
  const obfuscationResult = JavaScriptObfuscator.obfuscate(code, options);
  fs.writeFileSync(dest, obfuscationResult.getObfuscatedCode(), 'utf8');
  const origSize = (Buffer.byteLength(code, 'utf8') / 1024).toFixed(1);
  const minSize = (Buffer.byteLength(obfuscationResult.getObfuscatedCode(), 'utf8') / 1024).toFixed(1);
  console.log(`✓ Mã hóa thành công: ${path.basename(src)} (${origSize} KB) -> ${path.basename(dest)} (${minSize} KB)`);
});

console.log('✅ Hoàn tất bảo vệ mã nguồn!');

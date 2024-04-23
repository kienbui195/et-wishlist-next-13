const fs = require('fs');
const postcss = require('postcss');
const scss = require('postcss-scss');

const inputFilePath = './src/styles/index.scss'; // Thay đổi đường dẫn đến file SCSS của bạn ở đây
const outputFilePath = './src/app/index.css'; // Thay đổi đường dẫn đến file CSS output ở đây

// Đọc file SCSS
const scssContent = fs.readFileSync(inputFilePath, 'utf8');

// Sử dụng PostCSS với plugin postcss-scss
postcss([scss])
  .process(scssContent, { from: inputFilePath, to: outputFilePath })
  .then(result => {
    fs.writeFileSync(outputFilePath, result.css);
    console.log('Biên dịch SCSS thành công!');
  })
  .catch(error => {
    console.error('Đã xảy ra lỗi khi biên dịch SCSS:', error);
  });
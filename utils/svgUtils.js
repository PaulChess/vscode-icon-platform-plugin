
const { v4 } = require('uuid');

function dealSvgFile(svg) {
  const id = v4();
  return svg.replace(/id="/g, `id="${id}-`).replace(/xlink:href="#/g, `xlink:href="#${id}-`).replace(/filter="url\(#/g, `filter="url(#${id}-`).replace(/fill="url\(#/g, `fill="url(#${id}-`);
}

module.exports = {
  dealSvgFile
}

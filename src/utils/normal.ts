import { v4 as uuidv4 } from 'uuid';

export function dealSvgFile(svg: string) {
  const id = uuidv4();
  return svg.replace(/id="/g, `id="${id}-`).replace(/xlink:href="#/g, `xlink:href="#${id}-`).replace(/filter="url\(#/g, `filter="url(#${id}-`).replace(/fill="url\(#/g, `fill="url(#${id}-`);
}
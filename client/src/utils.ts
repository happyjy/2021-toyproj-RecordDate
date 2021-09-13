import { RESPONSIVE } from './Constants';

export function detectResponsiveMobile() {
  return window.innerWidth <= RESPONSIVE.mobile;
}

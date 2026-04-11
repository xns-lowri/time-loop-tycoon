const BG_COL = [26, 31, 43];

/*
const COL_NIGHT = [10, 15, 40];
const COL_DAWN = [30, 60, 120];
const COL_SUNRISE = [255, 180, 100];
const COL_AM = [135, 206, 235];
const COL_PM = [135, 187, 235];
const COL_SUNSET = [255, 120, 80];
*/

/*
const COL_NIGHT = [18, 23, 42];
const COL_DAWN = [28, 46, 82];
const COL_SUNRISE = [141, 106, 72];
const COL_AM = [81, 119, 139];
const COL_PM = [81, 109, 139];
const COL_SUNSET = [141, 75, 62];
*/
const COL_NIGHT = [28, 46, 82];
const COL_DAWN = [40, 60, 100];
const COL_SUNRISE = [160, 120, 80];
const COL_AM = [90, 140, 170];
const COL_PM = [80, 120, 160];
const COL_SUNSET = [150, 90, 70];

//const base_bg = `rgb(135, 187, 235)`;

const STARS_OPACITY = 0.5;
const STARS_OPACITY_MIN = 0.05;

export function getStarsOpacity(t) {
  if(t < 0.2) {
    return lerp(STARS_OPACITY, STARS_OPACITY_MIN, Math.max(0, (t-0.1)/0.1));
  }
  else if(t > 0.75) {
    return lerp(STARS_OPACITY_MIN, STARS_OPACITY, Math.min(1, (t-0.75)/0.15));
  }
  return STARS_OPACITY_MIN;
}

export function getLoopGradient(t) {
  const base_bg = `rgb(26, 31, 43)`;
  const sky_col = getLoopColour(t);

  const angle = 120+(120*t);

  return `linear-gradient(${angle}deg, ${sky_col}, ${base_bg})`;
}

export function getLoopColour(t) {
  if (t < 0.1) {
    // Dawn
    return lerpColour(BG_COL, COL_DAWN, t / 0.1);
  }
  else if (t < 0.2) {
    // Dawn
    return lerpColour(COL_DAWN, COL_SUNRISE, (t - 0.1) / 0.1);
  }
  else if (t < 0.3) {
    // Day
    return lerpColour(COL_SUNRISE, COL_AM, (t - 0.2) / 0.1);
  }
  else if (t < 0.7) {
    // Day
    return lerpColour(COL_AM, COL_PM, (t - 0.3) / 0.4);
  }
  else if (t < 0.8) {
    // Sunset
    return lerpColour(COL_PM, COL_SUNSET, (t - 0.7) / 0.1);
  }
  else if (t < 0.9) {
    // Sunset
    return lerpColour(COL_SUNSET, COL_NIGHT, (t - 0.8) / 0.1);
  }
  else {
    // Night
    return lerpColour(COL_NIGHT, BG_COL, (t - 0.9) / 0.1);
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColour(c1, c2, t) {
  const r = Math.floor(lerp(c1[0], c2[0], t));
  const g = Math.floor(lerp(c1[1], c2[1], t));
  const b = Math.floor(lerp(c1[2], c2[2], t));

  return `rgb(${r}, ${g}, ${b})`;
}
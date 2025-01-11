export function rgbToVec3(rgb: [number, number, number]): string {
  const vec3 = rgb.map(value => (value / 255).toFixed(3)).join(', ');
  return `vec3(${vec3})`;
}


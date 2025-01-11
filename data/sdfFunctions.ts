export interface SDFFunction {
  name: string;
  category: '2D' | '3D' | 'Transformations' | 'Shapes' | 'Raymarching' | 'Lighting' | 'Utility';
  description: string;
  code: string;
  defaultParams: string;
  usageExamples: string[];
}

export const sdfFunctions: SDFFunction[] = [
  {
    name: 'sdfCircle',
    category: '2D',
    description: '2D Signed Distance Function for a circle',
    code: `
float sdfCircle(vec2 p, float radius) {
    return length(p) - radius;
}`,
    defaultParams: '0.5',
    usageExamples: ['Create circular shapes', 'Use as a building block for more complex 2D shapes'],
  },
  {
    name: 'sdfRectangle',
    category: '2D',
    description: '2D Signed Distance Function for a rectangle',
    code: `
float sdfRectangle(vec2 p, vec2 size) {
    vec2 d = abs(p) - size;
    return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0);
}`,
    defaultParams: 'vec2(0.3, 0.2)',
    usageExamples: ['Create rectangular shapes', 'Combine with other SDFs to create complex 2D geometry'],
  },
  {
    name: 'sdfSphere',
    category: '3D',
    description: '3D Signed Distance Function for a sphere',
    code: `
float sdfSphere(vec3 p, float radius) {
    return length(p) - radius;
}`,
    defaultParams: '0.5',
    usageExamples: ['Create spherical shapes', 'Use as a building block for more complex 3D shapes'],
  },
  {
    name: 'sdfBox',
    category: '3D',
    description: '3D Signed Distance Function for a box',
    code: `
float sdfBox(vec3 p, vec3 size) {
    vec3 d = abs(p) - size;
    return length(max(d, vec3(0.0))) + min(max(d.x, max(d.y, d.z)), 0.0);
}`,
    defaultParams: 'vec3(0.3, 0.2, 0.1)',
    usageExamples: ['Create box shapes', 'Combine with other SDFs to create complex 3D geometry'],
  },
  {
    name: 'sdfRoundedRectangle',
    category: '2D',
    description: '2D Signed Distance Function for a rounded rectangle',
    code: `
float sdfRoundedRectangle(vec2 p, vec2 size, float radius) {
    vec2 d = abs(p) - size + vec2(radius);
    return length(max(d, vec2(0.0))) - radius;
}`,
    defaultParams: 'vec2(0.3, 0.2), 0.1',
    usageExamples: ['Create rounded rectangular shapes', 'Use for UI elements or game objects'],
  },
  {
    name: 'sdfEllipse',
    category: '2D',
    description: '2D Signed Distance Function for an ellipse',
    code: `
float sdfEllipse(vec2 p, vec2 radii) {
    vec2 q = p / radii;
    return length(q) - 1.0;
}`,
    defaultParams: 'vec2(0.3, 0.2)',
    usageExamples: ['Create elliptical shapes', 'Use for planetary orbits or lens effects'],
  },
  {
    name: 'sdfHeart',
    category: '2D',
    description: '2D Signed Distance Function for a heart shape',
    code: `
float sdfHeart(vec2 p) {
    p.y -= 0.2;
    float a = length(p);
    float b = atan(p.y, p.x);
    return a - 1.0 + 0.3 * sin(b * 5.0);
}`,
    defaultParams: 'p',
    usageExamples: ['Create heart-shaped objects', 'Use for particle effects or decorative elements'],
  },
  {
    name: 'sdfTorus',
    category: '3D',
    description: '3D Signed Distance Function for a torus',
    code: `
float sdfTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}`,
    defaultParams: 'vec2(0.3, 0.1)',
    usageExamples: ['Create torus (donut) shapes', 'Use for rings or circular structures in 3D space'],
  },
  {
    name: 'sdfCone',
    category: '3D',
    description: '3D Signed Distance Function for a cone',
    code: `
float sdfCone(vec3 p, float radius, float height) {
    float q = length(p.xz);
    return max((q - radius * (p.y / height)), p.y - height);
}`,
    defaultParams: '0.3, 0.5',
    usageExamples: ['Create cone shapes', 'Use for pyramids, mountains, or conical light beams'],
  },
  {
    name: 'translate2D',
    category: 'Transformations',
    description: 'Translates a point in 2D space by a given offset',
    code: `
vec2 translate(vec2 p, vec2 offset) {
    return p - offset;
}`,
    defaultParams: 'vec2(0.3, 0.0)',
    usageExamples: ['Translate shapes in 2D space', 'Position objects relative to each other'],
  },
  {
    name: 'rotate2D',
    category: 'Transformations',
    description: 'Rotates a point in 2D space around the origin',
    code: `
vec2 rotate(vec2 p, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    mat2 rotationMatrix = mat2(c, -s, s, c);
    return rotationMatrix * p;
}`,
    defaultParams: '0.5',
    usageExamples: ['Rotate shapes around the origin', 'Create animated rotations'],
  },
  {
    name: 'scale2D',
    category: 'Transformations',
    description: 'Scales a point in 2D space',
    code: `
vec2 scale(vec2 p, vec2 scale) {
    return p * scale;
}`,
    defaultParams: 'vec2(1.5, 1.0)',
    usageExamples: ['Scale shapes uniformly or non-uniformly', 'Create stretched or squashed effects'],
  },
];

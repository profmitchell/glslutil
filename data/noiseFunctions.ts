export interface NoiseFunction {
  name: string;
  category: '2D';
  description: string;
  code: string;
  performanceNotes: string;
  usageExamples: string[];
}

export const noiseFunctions: NoiseFunction[] = [
  {
    name: 'value2D',
    category: '2D',
    description: '2D Value Noise function',
    code: `
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float value2D(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}`,
    performanceNotes: 'Moderate performance, suitable for most real-time applications.',
    usageExamples: ['Terrain generation', 'Cloud textures', 'Procedural textures'],
  },
  {
    name: 'perlin2D',
    category: '2D',
    description: '2D Perlin Noise function',
    code: `
vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
               dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float perlin2D(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}`,
    performanceNotes: 'Good performance, widely used in various applications.',
    usageExamples: ['Terrain generation', 'Water surfaces', 'Natural textures'],
  },
  {
    name: 'simplex2D',
    category: '2D',
    description: '2D Simplex Noise function',
    code: `
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float simplex2D(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}`,
    performanceNotes: 'Excellent performance, especially for higher dimensions.',
    usageExamples: ['Procedural textures', 'Particle systems', 'Animated effects'],
  },
  {
    name: 'worley2D',
    category: '2D',
    description: '2D Worley Noise function',
    code: `
vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float worley2D(vec2 p) {
    vec2 i_st = floor(p);
    vec2 f_st = fract(p);
    float m_dist = 1.;
    
    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x),float(y));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5*sin(6.2831*point);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);
            m_dist = min(m_dist, dist);
        }
    }
    return m_dist;
}`,
    performanceNotes: 'Moderate performance, can be optimized for specific use cases.',
    usageExamples: ['Cellular textures', 'Voronoi diagrams', 'Organic-looking patterns'],
  },
  {
    name: 'voronoi2D',
    category: '2D',
    description: '2D Voronoi Noise function',
    code: `
vec2 voronoiRandom(vec2 p) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float voronoi2D(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    
    float m_dist = 1.0;
    for(int j=-1; j<=1; j++) {
        for(int i=-1; i<=1; i++) {
            vec2 g = vec2(float(i), float(j));
            vec2 o = voronoiRandom(n + g);
            o = 0.5 + 0.5 * sin(6.2831 * o);
            vec2 r = g + o - f;
            float d = dot(r, r);
            m_dist = min(m_dist, d);
        }
    }
    return sqrt(m_dist);
}`,
    performanceNotes: 'Moderate performance, similar to Worley noise but with additional features.',
    usageExamples: ['Cell-like patterns', 'Cracked textures', 'Natural-looking distributions'],
  },
];


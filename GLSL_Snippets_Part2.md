
## 6. Raymarching Utilities

### Scene Composition
```glsl
// Combines two distance fields using union
// d1, d2: distances from two objects
float unionSDF(float d1, float d2) {
    return min(d1, d2); // Returns the closer distance
}

// Combines two distance fields using intersection
float intersectionSDF(float d1, float d2) {
    return max(d1, d2); // Returns the farther distance
}

// Subtracts one distance field from another
float subtractSDF(float d1, float d2) {
    return max(d1, -d2); // Removes d2 from d1
}
```

### Lighting and Shadows
```glsl
// Computes basic diffuse lighting
// normal: the surface normal
// lightDir: the direction to the light
float diffuseLighting(vec3 normal, vec3 lightDir) {
    return max(dot(normal, lightDir), 0.0); // Clamp negative values to zero
}

// Computes basic specular lighting
// normal: the surface normal
// lightDir: the direction to the light
// viewDir: the direction to the viewer
// shininess: the shininess factor
float specularLighting(vec3 normal, vec3 lightDir, vec3 viewDir, float shininess) {
    vec3 reflectDir = reflect(-lightDir, normal); // Reflect light around normal
    return pow(max(dot(viewDir, reflectDir), 0.0), shininess); // Specular highlight
}
```

### Soft Shadows
```glsl
// Computes soft shadows using raymarching
// ro: ray origin
// rd: ray direction
float softShadows(vec3 ro, vec3 rd) {
    float t = 0.02; // Initial shadow ray step size
    float result = 1.0; // Shadow intensity
    for (int i = 0; i < 50; i++) {
        float d = sceneSDF(ro + rd * t); // Distance to the nearest object
        if (d < 0.001) return 0.0; // Full shadow
        result = min(result, 10.0 * d / t); // Accumulate shadow factor
        t += d; // Step along the ray
    }
    return result; // Final shadow intensity
}
```

### Reflections
```glsl
// Reflects a ray off a surface
// rd: incoming ray direction
// normal: surface normal
vec3 reflectRay(vec3 rd, vec3 normal) {
    return reflect(rd, normal); // Built-in GLSL reflection function
}

// Computes a simple reflection color
// ro: ray origin
// rd: ray direction
vec3 computeReflection(vec3 ro, vec3 rd) {
    vec3 hitPoint = ro + rd * raymarch(ro, rd); // Find intersection point
    vec3 normal = computeNormal(hitPoint); // Compute surface normal
    vec3 reflectionDir = reflectRay(rd, normal); // Reflect ray
    return textureCube(envMap, reflectionDir).rgb; // Sample environment map
}
```

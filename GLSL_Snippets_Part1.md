
# GLSL Snippets

## 3. Transformation Functions

### Translate
```glsl
// Translates a point in 2D space by a given offset
// p: the original point
// offset: the translation vector
vec2 translate(vec2 p, vec2 offset) {
    return p - offset; // Shift the point by the offset
}
```

### Rotate
```glsl
// Rotates a point in 2D space around the origin
// p: the original point
// angle: the rotation angle in radians
vec2 rotate(vec2 p, float angle) {
    float c = cos(angle); // Precompute cosine
    float s = sin(angle); // Precompute sine
    mat2 rotationMatrix = mat2(c, -s, s, c); // Create rotation matrix
    return rotationMatrix * p; // Apply rotation to the point
}
```

### Scale
```glsl
// Scales a point in 2D space
// p: the original point
// scale: the scale factor
vec2 scale(vec2 p, vec2 scale) {
    return p * scale; // Multiply the point by the scale factor
}
```

## 5. Shapes and Patterns

### Stripes
```glsl
// Creates a horizontal stripe pattern
// uv: the input UV coordinates
// width: the width of the stripes
float stripes(vec2 uv, float width) {
    return step(0.5, fract(uv.y / width)); // Creates alternating bands
}
```

### Grid
```glsl
// Creates a grid pattern
// uv: the input UV coordinates
// spacing: the spacing between grid lines
float grid(vec2 uv, float spacing) {
    vec2 gridLines = step(0.5, fract(uv / spacing)); // Creates lines in x and y directions
    return max(gridLines.x, gridLines.y); // Combine the lines into a grid
}
```

### Checkerboard
```glsl
// Creates a checkerboard pattern
// uv: the input UV coordinates
float checkerboard(vec2 uv) {
    vec2 check = floor(uv); // Get integer coordinates
    return mod(check.x + check.y, 2.0); // Alternate between 0 and 1
}
```

### Radial Patterns
```glsl
// Creates a radial pattern (concentric circles)
// uv: the input UV coordinates
// frequency: the number of circles
float radialPattern(vec2 uv, float frequency) {
    float r = length(uv); // Compute distance from the center
    return fract(r * frequency); // Create repeating rings
}
```

### Hexagonal or Triangular Tiling
```glsl
// Creates a hexagonal tiling pattern
// uv: the input UV coordinates
float hexTiling(vec2 uv) {
    const float sqrt3 = 1.73205080757; // Square root of 3 for hex grid spacing
    uv.x += uv.y * 0.5; // Offset x by half of y
    uv.y *= sqrt3 * 0.5; // Scale y by sqrt(3)/2
    vec2 hex = mod(uv, 1.0) - 0.5; // Get local coordinates within a hex cell
    return length(hex) - 0.5; // Return distance to the cell edge
}
```

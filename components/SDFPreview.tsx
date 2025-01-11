'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { SDFFunction } from '../data/sdfFunctions'
import * as THREE from 'three'

interface SDFPreviewProps {
  sdfFunction: SDFFunction;
}

function SDFShaderMaterial({ sdfFunction }: SDFPreviewProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        u_time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        varying vec2 vUv;
        ${sdfFunction.code}
        void main() {
          vec2 p = (vUv * 2.0 - 1.0) * 1.5;
          float d = ${sdfFunction.category === '2D' 
            ? `${sdfFunction.name}(p, ${sdfFunction.defaultParams})`
            : `${sdfFunction.name}(vec3(p, sin(u_time)), ${sdfFunction.defaultParams})`};
          
          // Create an outline effect
          float outline = 1.0 - smoothstep(-0.01, 0.01, abs(d));
          vec3 col = vec3(0.1);  // Dark background
          col = mix(col, vec3(1.0), outline);  // White outline
          
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    }),
    [sdfFunction]
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = state.clock.elapsedTime
    }
  })

  return <shaderMaterial ref={materialRef} args={[shaderArgs]} />
}

export function SDFPreview({ sdfFunction }: SDFPreviewProps) {
  return (
    <div className="w-full h-32 bg-secondary rounded-md overflow-hidden">
      <Canvas>
        <mesh>
          <planeGeometry args={[2, 2]} />
          <SDFShaderMaterial sdfFunction={sdfFunction} />
        </mesh>
      </Canvas>
    </div>
  )
}

'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { NoiseFunction } from '../data/noiseFunctions'
import * as THREE from 'three'

interface NoisePreviewProps {
  noiseFunction: NoiseFunction;
}

function NoiseShaderMaterial({ noiseFunction }: NoisePreviewProps) {
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
        ${noiseFunction.code}
        void main() {
          float n = ${noiseFunction.name}(vUv * 10.0 + u_time);
          gl_FragColor = vec4(vec3(n), 1.0);
        }
      `,
    }),
    [noiseFunction]
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = state.clock.elapsedTime
    }
  })

  return <shaderMaterial ref={materialRef} args={[shaderArgs]} />
}

export function NoisePreview({ noiseFunction }: NoisePreviewProps) {
  return (
    <div className="w-full h-64 md:h-96">
      <Canvas>
        <mesh>
          <planeGeometry args={[2, 2]} />
          <NoiseShaderMaterial noiseFunction={noiseFunction} />
        </mesh>
      </Canvas>
    </div>
  )
}


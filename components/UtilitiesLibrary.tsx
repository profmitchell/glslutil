'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clipboard, Check } from 'lucide-react'
import { useToast } from "./ui/use-toast"

interface UtilityFunction {
  name: string;
  category: string;
  description: string;
  code: string;
  usageExamples: string[];
}

const utilityFunctions: UtilityFunction[] = [
  {
    name: 'Random',
    category: 'Math',
    description: 'Generates pseudo-random numbers from a 2D input',
    code: `
float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// 2D noise function
float noise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}`,
    usageExamples: ['Generate random values', 'Create noise patterns']
  },
  {
    name: 'Camera Utils',
    category: 'Camera',
    description: 'Utility functions for camera manipulation',
    code: `
mat4 lookAt(vec3 eye, vec3 target, vec3 up) {
    vec3 zAxis = normalize(target - eye);
    vec3 xAxis = normalize(cross(up, zAxis));
    vec3 yAxis = cross(zAxis, xAxis);
    
    return mat4(
        vec4(xAxis, 0.0),
        vec4(yAxis, 0.0),
        vec4(zAxis, 0.0),
        vec4(eye, 1.0)
    );
}

vec3 orbitCamera(float radius, float theta, float phi) {
    return vec3(
        radius * sin(phi) * cos(theta),
        radius * cos(phi),
        radius * sin(phi) * sin(theta)
    );
}`,
    usageExamples: ['Camera positioning', 'View matrix calculation']
  },
  {
    name: 'Color Conversion',
    category: 'Color',
    description: 'Functions for converting between color spaces',
    code: `
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}`,
    usageExamples: ['Color space conversion', 'Color manipulation']
  }
];

function UtilityCard({ utility }: { utility: UtilityFunction }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(utility.code);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `${utility.name} function copied successfully.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {utility.name}
        </CardTitle>
        <Badge>{utility.category}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{utility.description}</p>
        <pre className="p-4 bg-secondary rounded-lg overflow-x-auto">
          <code className="text-xs">{utility.code}</code>
        </pre>
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            {utility.usageExamples.map((example, index) => (
              <Badge key={index} variant="secondary">{example}</Badge>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function UtilitiesLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const filteredFunctions = utilityFunctions.filter(func => 
    (category === 'all' || func.category === category) &&
    (func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     func.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder="Search utility functions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Math">Math</SelectItem>
            <SelectItem value="Camera">Camera</SelectItem>
            <SelectItem value="Color">Color</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {filteredFunctions.map((func) => (
          <UtilityCard key={func.name} utility={func} />
        ))}
      </div>
    </div>
  );
}

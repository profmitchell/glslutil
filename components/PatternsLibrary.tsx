'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clipboard, Check } from 'lucide-react'
import { useToast } from "./ui/use-toast"

interface Pattern {
  name: string;
  category: string;
  description: string;
  code: string;
  defaultParams?: string;
  usageExamples: string[];
}

const patterns: Pattern[] = [
  {
    name: 'Stripes',
    category: '2D',
    description: 'Creates a horizontal stripe pattern',
    code: `
float stripes(vec2 uv, float width) {
    return step(0.5, fract(uv.y / width));
}`,
    defaultParams: '0.1',
    usageExamples: ['Create striped textures', 'Background patterns']
  },
  {
    name: 'Grid',
    category: '2D',
    description: 'Creates a grid pattern',
    code: `
float grid(vec2 uv, float spacing) {
    vec2 gridLines = step(0.5, fract(uv / spacing));
    return max(gridLines.x, gridLines.y);
}`,
    defaultParams: '0.1',
    usageExamples: ['Create grid backgrounds', 'Technical overlays']
  },
  {
    name: 'Checkerboard',
    category: '2D',
    description: 'Creates a checkerboard pattern',
    code: `
float checkerboard(vec2 uv) {
    vec2 check = floor(uv);
    return mod(check.x + check.y, 2.0);
}`,
    usageExamples: ['Create checkerboard textures', 'Test UV mappings']
  },
  {
    name: 'Radial Pattern',
    category: '2D',
    description: 'Creates a radial pattern (concentric circles)',
    code: `
float radialPattern(vec2 uv, float frequency) {
    float r = length(uv);
    return fract(r * frequency);
}`,
    defaultParams: '10.0',
    usageExamples: ['Create circular patterns', 'Radar-like effects']
  },
  {
    name: 'Hexagonal Tiling',
    category: '2D',
    description: 'Creates a hexagonal tiling pattern',
    code: `
float hexTiling(vec2 uv) {
    const float sqrt3 = 1.73205080757;
    uv.x += uv.y * 0.5;
    uv.y *= sqrt3 * 0.5;
    vec2 hex = mod(uv, 1.0) - 0.5;
    return length(hex) - 0.5;
}`,
    usageExamples: ['Create honeycomb patterns', 'Geometric backgrounds']
  },
  {
    name: 'Noise Pattern',
    category: 'Procedural',
    description: 'Generates Perlin-like noise pattern',
    code: `
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}`,
    usageExamples: ['Create organic textures', 'Terrain generation']
  }
];

function PatternCard({ pattern }: { pattern: Pattern }) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pattern.code);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `${pattern.name} pattern copied successfully.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border transition-all hover:shadow-lg">
      {/* Preview Area */}
      <div className="aspect-square bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 flex items-center justify-center">
          <Button variant="outline" size="sm" onClick={() => setShowCode(!showCode)}>
            {showCode ? 'Hide Code' : 'View Code'}
          </Button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold">{pattern.name}</h3>
            <p className="text-sm text-muted-foreground">{pattern.description}</p>
          </div>
          <Badge>{pattern.category}</Badge>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {pattern.usageExamples.map((example, index) => (
            <Badge key={index} variant="secondary" className="text-xs">{example}</Badge>
          ))}
        </div>

        {/* Code Section - Collapsible */}
        {showCode && (
          <div className="mt-4 space-y-2">
            <pre className="bg-secondary p-3 rounded-lg overflow-x-auto">
              <code className="text-xs whitespace-pre-wrap">{pattern.code}</code>
            </pre>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyToClipboard}
              className="w-full"
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Clipboard className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function PatternsLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const filteredPatterns = patterns.filter(pattern => 
    (category === 'all' || pattern.category === category) &&
    (pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pattern.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-background z-10 pb-4 pt-4 border-b">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search patterns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="2D">2D Patterns</SelectItem>
              <SelectItem value="Procedural">Procedural</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatterns.map((pattern) => (
          <PatternCard key={pattern.name} pattern={pattern} />
        ))}
      </div>
    </div>
  );
}

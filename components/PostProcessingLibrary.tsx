'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clipboard, Check } from 'lucide-react'
import { useToast } from "./ui/use-toast"

interface PostProcessEffect {
  name: string;
  category: string;
  description: string;
  code: string;
  usageExamples: string[];
}

const postProcessEffects: PostProcessEffect[] = [
  {
    name: 'Bloom',
    category: 'Effects',
    description: 'Adds a glow effect to bright areas',
    code: `
vec4 applyBloom(sampler2D image, vec2 uv, float intensity) {
    vec4 color = texture2D(image, uv);
    vec4 bloomColor = vec4(0.0);
    float total = 0.0;
    
    for(float i = -4.0; i <= 4.0; i++) {
        for(float j = -4.0; j <= 4.0; j++) {
            vec2 offset = vec2(i, j) * 0.004;
            vec4 sample = texture2D(image, uv + offset);
            float weight = 1.0 / (1.0 + i*i + j*j);
            bloomColor += sample * weight;
            total += weight;
        }
    }
    
    bloomColor /= total;
    return mix(color, bloomColor, intensity);
}`,
    usageExamples: ['Add glow to bright objects', 'Create atmospheric effects']
  },
  {
    name: 'Chromatic Aberration',
    category: 'Effects',
    description: 'Separates color channels to create a chromatic aberration effect',
    code: `
vec4 applyChromaticAberration(sampler2D image, vec2 uv, float strength) {
    vec2 direction = normalize(uv - 0.5);
    vec3 color;
    color.r = texture2D(image, uv - direction * strength).r;
    color.g = texture2D(image, uv).g;
    color.b = texture2D(image, uv + direction * strength).b;
    return vec4(color, 1.0);
}`,
    usageExamples: ['Create lens distortion effects', 'Add visual style to scene edges']
  },
  {
    name: 'Film Grain',
    category: 'Effects',
    description: 'Adds a film grain effect to the image',
    code: `
float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec4 applyFilmGrain(sampler2D image, vec2 uv, float time, float intensity) {
    vec4 color = texture2D(image, uv);
    float grain = random(uv + time) * 2.0 - 1.0;
    return vec4(color.rgb + grain * intensity, color.a);
}`,
    usageExamples: ['Add cinematic grain', 'Create retro effects']
  }
];

function EffectCard({ effect }: { effect: PostProcessEffect }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(effect.code);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `${effect.name} effect copied successfully.`,
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
          {effect.name}
        </CardTitle>
        <Badge>{effect.category}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{effect.description}</p>
        <pre className="p-4 bg-secondary rounded-lg overflow-x-auto">
          <code className="text-xs">{effect.code}</code>
        </pre>
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            {effect.usageExamples.map((example, index) => (
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

export function PostProcessingLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const filteredEffects = postProcessEffects.filter(effect => 
    (category === 'all' || effect.category === category) &&
    (effect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     effect.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder="Search effects..."
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
            <SelectItem value="Effects">Effects</SelectItem>
            <SelectItem value="Filters">Filters</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {filteredEffects.map((effect) => (
          <EffectCard key={effect.name} effect={effect} />
        ))}
      </div>
    </div>
  );
}

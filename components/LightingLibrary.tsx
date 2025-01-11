'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clipboard, Check } from 'lucide-react'
import { useToast } from "./ui/use-toast"

interface LightingFunction {
  name: string;
  category: string;
  description: string;
  code: string;
  usageExamples: string[];
}

const lightingFunctions: LightingFunction[] = [
  {
    name: 'Phong Lighting',
    category: 'Basic',
    description: 'Implements the Phong lighting model with ambient, diffuse, and specular components',
    code: `
vec3 phongLighting(vec3 normal, vec3 lightDir, vec3 viewDir, vec3 lightColor, 
                   vec3 materialColor, float shininess) {
    // Ambient
    vec3 ambient = 0.1 * lightColor;
    
    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;
    
    // Specular
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = spec * lightColor;
    
    return (ambient + diffuse + specular) * materialColor;
}`,
    usageExamples: ['Basic material shading', 'Standard lighting model']
  },
  {
    name: 'PBR Lighting',
    category: 'Advanced',
    description: 'Physically Based Rendering lighting model',
    code: `
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

float DistributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH * NdotH;

    float nom = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / denom;
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}`,
    usageExamples: ['Realistic material rendering', 'High-quality lighting']
  },
  {
    name: 'Toon Shading',
    category: 'Stylized',
    description: 'Creates a cel-shaded/toon shading effect',
    code: `
vec3 toonShading(vec3 normal, vec3 lightDir, vec3 baseColor, int levels) {
    float intensity = dot(normalize(normal), normalize(lightDir));
    intensity = ceil(intensity * float(levels)) / float(levels);
    return baseColor * intensity;
}`,
    usageExamples: ['Cartoon-style rendering', 'Stylized graphics']
  }
];

function LightingCard({ lighting }: { lighting: LightingFunction }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(lighting.code);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `${lighting.name} function copied successfully.`,
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
          {lighting.name}
        </CardTitle>
        <Badge>{lighting.category}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{lighting.description}</p>
        <pre className="p-4 bg-secondary rounded-lg overflow-x-auto">
          <code className="text-xs">{lighting.code}</code>
        </pre>
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            {lighting.usageExamples.map((example, index) => (
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

export function LightingLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const filteredFunctions = lightingFunctions.filter(func => 
    (category === 'all' || func.category === category) &&
    (func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     func.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder="Search lighting functions..."
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
            <SelectItem value="Basic">Basic</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Stylized">Stylized</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {filteredFunctions.map((func) => (
          <LightingCard key={func.name} lighting={func} />
        ))}
      </div>
    </div>
  );
}

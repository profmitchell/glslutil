'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clipboard, Check } from 'lucide-react'
import { useToast } from "./ui/use-toast"

interface AudioFunction {
  name: string;
  category: string;
  description: string;
  code: string;
  usageExamples: string[];
}

const audioFunctions: AudioFunction[] = [
  {
    name: 'Frequency Visualization',
    category: 'Visualization',
    description: 'Visualizes audio frequency data as bars',
    code: `
float visualizeFrequency(vec2 uv, sampler2D audioData, float index) {
    float frequency = texture2D(audioData, vec2(index, 0.0)).r;
    return step(1.0 - frequency, uv.y);
}

// Usage in main shader:
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord/iResolution.xy;
    float index = uv.x;  // Use x position as frequency index
    float bar = visualizeFrequency(uv, iChannel0, index);
    fragColor = vec4(vec3(bar), 1.0);
}`,
    usageExamples: ['Audio visualizer', 'Music reactive graphics']
  },
  {
    name: 'Beat Detection',
    category: 'Analysis',
    description: 'Detects beats in audio for visual effects',
    code: `
float detectBeat(sampler2D audioData, float threshold) {
    float bass = texture2D(audioData, vec2(0.1, 0.0)).r;  // Low frequencies
    return step(threshold, bass);
}

// Smooth beat detection
float smoothBeat(sampler2D audioData, float threshold, float smoothing) {
    float rawBeat = detectBeat(audioData, threshold);
    return mix(texture2D(audioData, vec2(0.0, 0.1)).r, rawBeat, smoothing);
}`,
    usageExamples: ['Beat-synchronized effects', 'Music reactive animations']
  },
  {
    name: 'Waveform Display',
    category: 'Visualization',
    description: 'Displays audio waveform',
    code: `
float visualizeWaveform(vec2 uv, sampler2D audioData) {
    float sample = texture2D(audioData, vec2(uv.x, 0.0)).r;
    float waveform = smoothstep(0.0, 0.02, abs(uv.y - 0.5 - sample * 0.5));
    return 1.0 - waveform;
}`,
    usageExamples: ['Waveform visualization', 'Audio monitoring']
  },
  {
    name: 'Spectrum Analysis',
    category: 'Analysis',
    description: 'Analyzes different frequency bands',
    code: `
vec3 analyzeSpectrum(sampler2D audioData) {
    float low = texture2D(audioData, vec2(0.1, 0.0)).r;    // Bass
    float mid = texture2D(audioData, vec2(0.5, 0.0)).r;    // Mids
    float high = texture2D(audioData, vec2(0.9, 0.0)).r;   // Highs
    return vec3(low, mid, high);
}

// Use for frequency-based color
vec3 frequencyColor(sampler2D audioData) {
    return analyzeSpectrum(audioData);
}`,
    usageExamples: ['Frequency analysis', 'Multi-band visualization']
  },
  {
    name: 'Exponential Smoothing',
    category: 'Smoothing',
    description: 'Applies exponential smoothing to audio data',
    code: `
float expSmooth(float currentValue, float lastValue, float smoothing) {
    return smoothing * currentValue + (1.0 - smoothing) * lastValue;
}

// Usage example with audio:
float smoothAudio(sampler2D audioData, vec2 uv, float smoothing) {
    float currentSample = texture2D(audioData, uv).r;
    float lastSample = texture2D(audioData, vec2(uv.x - 0.01, uv.y)).r;
    return expSmooth(currentSample, lastSample, smoothing);
}`,
    usageExamples: ['Smooth audio transitions', 'Reduce jitter in visualizations']
  },
  {
    name: 'Moving Average',
    category: 'Smoothing',
    description: 'Implements a simple moving average filter',
    code: `
float movingAverage(sampler2D audioData, vec2 uv, int samples) {
    float sum = 0.0;
    for(int i = 0; i < samples; i++) {
        float offset = float(i) / float(samples) * 0.1;
        sum += texture2D(audioData, vec2(uv.x - offset, uv.y)).r;
    }
    return sum / float(samples);
}`,
    usageExamples: ['Smooth frequency data', 'Average out noise']
  },
  {
    name: 'Peak Detection',
    category: 'Analysis',
    description: 'Detect and smooth audio peaks',
    code: `
float smoothedPeak(float current, float lastPeak, float attack, float release) {
    float peak = max(current, lastPeak * release);
    return mix(lastPeak, peak, attack);
}

// Usage with audio:
float getPeak(sampler2D audioData, vec2 uv, float attack, float release) {
    float current = texture2D(audioData, uv).r;
    float lastPeak = texture2D(audioData, vec2(uv.x - 0.01, uv.y)).r;
    return smoothedPeak(current, lastPeak, attack, release);
}`,
    usageExamples: ['Envelope following', 'Peak metering']
  }
];

function AudioFunctionCard({ audioFunction }: { audioFunction: AudioFunction }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(audioFunction.code);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `${audioFunction.name} function copied successfully.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-card p-6 rounded-lg border">
      <div className="w-full md:w-1/3 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{audioFunction.name}</h3>
          <Badge>{audioFunction.category}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{audioFunction.description}</p>
        <div className="flex flex-wrap gap-2">
          {audioFunction.usageExamples.map((example, index) => (
            <Badge key={index} variant="secondary">{example}</Badge>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Clipboard className="h-4 w-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy Code'}
        </Button>
      </div>
      
      <div className="w-full md:w-2/3 space-y-4">
        <div className="h-32 bg-black rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center space-x-1">
              {/* Fake audio visualizer bars */}
              {Array.from({ length: 32 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-1.5 bg-primary"
                  style={{
                    height: `${Math.random() * 100}%`,
                    transition: 'height 150ms ease'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
          <code className="text-xs whitespace-pre-wrap">{audioFunction.code}</code>
        </pre>
      </div>
    </div>
  );
}

export function AudioAnalysisLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const filteredFunctions = audioFunctions.filter(func => 
    (category === 'all' || func.category === category) &&
    (func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     func.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-background z-10 pb-4 pt-4 border-b">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search audio functions..."
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
              <SelectItem value="Visualization">Visualization</SelectItem>
              <SelectItem value="Analysis">Analysis</SelectItem>
              <SelectItem value="Smoothing">Smoothing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-6">
        {filteredFunctions.map((func) => (
          <AudioFunctionCard key={func.name} audioFunction={func} />
        ))}
      </div>
    </div>
  );
}

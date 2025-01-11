'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clipboard, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { NoiseFunction } from '../data/noiseFunctions';
import { NoisePreview } from './NoisePreview';
import { useToast } from "./ui/use-toast"

interface NoiseCardProps {
  noiseFunction: NoiseFunction;
}

export function NoiseCard({ noiseFunction }: NoiseCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(noiseFunction.code);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `${noiseFunction.name} function copied successfully.`,
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
          {noiseFunction.name}
        </CardTitle>
        <Badge>{noiseFunction.category}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <NoisePreview noiseFunction={noiseFunction} />
        <p className="text-xs text-muted-foreground">{noiseFunction.description}</p>
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
            {expanded ? 'Hide Details' : 'Show Details'}
          </Button>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Clipboard className="h-4 w-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
        </div>
        {expanded && (
          <div className="mt-4 space-y-4">
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs">
              <code>{noiseFunction.code}</code>
            </pre>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Performance Notes:</h4>
              <p className="text-xs">{noiseFunction.performanceNotes}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Usage Examples:</h4>
              <ul className="list-disc list-inside text-xs">
                {noiseFunction.usageExamples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

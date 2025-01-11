'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clipboard, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { SDFFunction } from '../data/sdfFunctions';
import { SDFPreview } from './SDFPreview';
import { useToast } from "./ui/use-toast"

interface SDFCardProps {
  sdfFunction: SDFFunction;
}

export function SDFCard({ sdfFunction }: SDFCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sdfFunction.code);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `${sdfFunction.name} function copied successfully.`,
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
          {sdfFunction.name}
        </CardTitle>
        <Badge>{sdfFunction.category}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <SDFPreview sdfFunction={sdfFunction} />
        <p className="text-xs text-muted-foreground">{sdfFunction.description}</p>
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
              <code>{sdfFunction.code}</code>
            </pre>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Usage Examples:</h4>
              <ul className="list-disc list-inside text-xs">
                {sdfFunction.usageExamples.map((example, index) => (
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

'use client'

import { ColorLibrary } from '@/components/ColorLibrary';
import { NoiseLibrary } from '@/components/NoiseLibrary';
import { SDFLibrary } from '@/components/SDFLibrary';
import { MyNotes } from '@/components/MyNotes';
import { PatternsLibrary } from '@/components/PatternsLibrary';
import { AudioAnalysisLibrary } from '@/components/AudioAnalysisLibrary';
import { LightingLibrary } from '@/components/LightingLibrary';
import { PostProcessingLibrary } from '@/components/PostProcessingLibrary';
import { UtilitiesLibrary } from '@/components/UtilitiesLibrary';
import { SettingsModal } from '@/components/SettingsModal';
import { ColorListsProvider } from '@/context/ColorListsContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Home() {
  return (
    <ColorListsProvider>
      <div className="min-h-screen w-full flex items-start justify-center bg-background p-4">
        <div className="w-[600px] max-h-[90vh] rounded-lg border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-auto">
          <div className="sticky top-0 z-10 flex justify-between items-center px-4 py-2 bg-card border-b">
            <h1 className="text-base font-bold">GLSLibrary</h1>
            <SettingsModal />
          </div>
          <div className="p-3">
            <Tabs defaultValue="colors" className="flex flex-col">
              <div className="sticky top-[41px] z-10 bg-card border-b">
                <TabsList className="inline-flex h-6 items-center text-muted-foreground w-full justify-start overflow-x-auto text-xs">
                  <TabsTrigger value="colors" className="h-6 px-2">Colors</TabsTrigger>
                  <TabsTrigger value="noise" className="h-6 px-2">Noise</TabsTrigger>
                  <TabsTrigger value="sdf" className="h-6 px-2">SDF</TabsTrigger>
                  <TabsTrigger value="patterns" className="h-6 px-2">Patterns</TabsTrigger>
                  <TabsTrigger value="lighting" className="h-6 px-2">Lighting</TabsTrigger>
                  <TabsTrigger value="postfx" className="h-6 px-2">Post FX</TabsTrigger>
                  <TabsTrigger value="audio" className="h-6 px-2">Audio</TabsTrigger>
                  <TabsTrigger value="utils" className="h-6 px-2">Utils</TabsTrigger>
                  <TabsTrigger value="notes" className="h-6 px-2">Notes</TabsTrigger>
                </TabsList>
              </div>
              <div className="mt-2 px-1">
                <TabsContent value="colors">
                  <ColorLibrary />
                </TabsContent>
                <TabsContent value="noise">
                  <NoiseLibrary />
                </TabsContent>
                <TabsContent value="sdf">
                  <SDFLibrary />
                </TabsContent>
                <TabsContent value="patterns">
                  <PatternsLibrary />
                </TabsContent>
                <TabsContent value="lighting">
                  <LightingLibrary />
                </TabsContent>
                <TabsContent value="postfx">
                  <PostProcessingLibrary />
                </TabsContent>
                <TabsContent value="audio">
                  <AudioAnalysisLibrary />
                </TabsContent>
                <TabsContent value="utils">
                  <UtilitiesLibrary />
                </TabsContent>
                <TabsContent value="notes">
                  <MyNotes />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </ColorListsProvider>
  );
}

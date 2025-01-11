'use client'

import { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ThemeToggle } from './ThemeToggle'

export function SettingsModal() {
  const [uiScale, setUiScale] = useState(100)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--app-scale', `${uiScale / 100}`)
  }, [uiScale])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Settings className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-base">Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div className="space-y-1">
            <Label className="text-xs">Theme</Label>
            <ThemeToggle />
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs">UI Scale ({uiScale}%)</Label>
            <Slider
              defaultValue={[100]}
              max={100}
              min={50}
              step={5}
              onValueChange={(value) => setUiScale(value[0])}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Lists</Label>
            <div className="flex space-x-2">
              <Button size="sm" className="text-xs h-7">Export Lists</Button>
              <Button size="sm" className="text-xs h-7">Import Lists</Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <h4 className="font-semibold mb-0.5">About</h4>
            <p>Developed By Mitchell Cohen 2024</p>
            <p>Newton, MA</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

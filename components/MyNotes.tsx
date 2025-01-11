'use client'

import { useState, useEffect } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "./ui/use-toast"
import { Input } from "@/components/ui/input"
import { Plus, X } from 'lucide-react'

interface NoteSection {
  id: string;
  title: string;
  content: string;
}

export function MyNotes() {
  const [noteSections, setNoteSections] = useState<NoteSection[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const savedNotes = localStorage.getItem('myNotes')
    if (savedNotes) {
      setNoteSections(JSON.parse(savedNotes))
    }
  }, [])

  const saveNotes = (newNoteSections: NoteSection[]) => {
    setNoteSections(newNoteSections)
    localStorage.setItem('myNotes', JSON.stringify(newNoteSections))
  }

  const handleNoteChange = (id: string, content: string) => {
    const newNoteSections = noteSections.map(section => 
      section.id === id ? { ...section, content } : section
    )
    saveNotes(newNoteSections)
  }

  const handleTitleChange = (id: string, title: string) => {
    const newNoteSections = noteSections.map(section => 
      section.id === id ? { ...section, title } : section
    )
    saveNotes(newNoteSections)
  }

  const addNoteSection = () => {
    const newSection: NoteSection = {
      id: Date.now().toString(),
      title: 'New Note',
      content: ''
    }
    saveNotes([...noteSections, newSection])
  }

  const removeNoteSection = (id: string) => {
    const newNoteSections = noteSections.filter(section => section.id !== id)
    saveNotes(newNoteSections)
  }

  const handleCopyNotes = (id: string) => {
    const section = noteSections.find(section => section.id === id)
    if (section) {
      navigator.clipboard.writeText(section.content).then(() => {
        toast({
          title: "Copied to clipboard",
          description: `"${section.title}" has been copied to the clipboard.`,
        })
      }).catch((err) => {
        console.error('Failed to copy text: ', err)
        toast({
          title: "Failed to copy",
          description: "There was an error copying your notes to the clipboard.",
          variant: "destructive",
        })
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Notes</h2>
      {noteSections.map((section) => (
        <div key={section.id} className="space-y-2 p-4 border rounded-md">
          <div className="flex justify-between items-center">
            <Input
              value={section.title}
              onChange={(e) => handleTitleChange(section.id, e.target.value)}
              className="font-bold"
            />
            <Button variant="ghost" size="sm" onClick={() => removeNoteSection(section.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            value={section.content}
            onChange={(e) => handleNoteChange(section.id, e.target.value)}
            placeholder="Type your notes here... (e.g., terminal commands, GLSL shader snippets)"
            className="min-h-[200px]"
          />
          <Button onClick={() => handleCopyNotes(section.id)}>Copy to Clipboard</Button>
        </div>
      ))}
      <Button onClick={addNoteSection}>
        <Plus className="h-4 w-4 mr-2" />
        Add Note Section
      </Button>
    </div>
  )
}

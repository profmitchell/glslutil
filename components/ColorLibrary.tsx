'use client'

import { useState } from 'react';
import { colorLibrary } from '@/data/colors';
import { CategoryDropdown } from '@/components/CategoryDropdown';
import { Sidebar } from '@/components/Sidebar';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

export function ColorLibrary() {
  const [categories, setCategories] = useState(colorLibrary.map(category => ({ ...category, isExpanded: true })));
  const [searchTerm, setSearchTerm] = useState('');
  const allExpanded = categories.every(category => category.isExpanded);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destIndex, 0, reorderedItem);

    setCategories(items);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    colors: category.colors.filter(color =>
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.colors.length > 0);

  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-background z-10 pb-4">
        <div className="flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search colors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCategories(prev => 
                prev.map(cat => ({ ...cat, isExpanded: !allExpanded }))
              )}
              className="flex items-center gap-1"
            >
              {allExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </Button>
            <Sidebar />
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="space-y-4"
            >
              {filteredCategories.map((category, index) => (
                <Draggable 
                  key={category.id} 
                  draggableId={category.id} 
                  index={index}
                >
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                    >
                      <CategoryDropdown category={category} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

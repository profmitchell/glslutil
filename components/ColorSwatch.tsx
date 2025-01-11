import { useState, useCallback } from 'react';
import { Color } from '../data/colors';
import { useToast } from "./ui/use-toast";
import { Plus, X } from 'lucide-react';
import { useColorLists } from '../context/ColorListsContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from './ui/button';

interface ColorSwatchProps {
  color: Color;
}

export function ColorSwatch({ color }: ColorSwatchProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { lists, addColorToList } = useColorLists();

  const copyToClipboard = useCallback(() => {
    if (!isOpen) {  // Only copy if dropdown is not open
      navigator.clipboard.writeText(color.value).then(() => {
        toast({
          title: "Copied to clipboard",
          description: `${color.name}: ${color.value}`,
        });
      }).catch(() => {
        // Fallback method
        const textArea = document.createElement("textarea");
        textArea.value = color.value;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          toast({
            title: "Copied to clipboard",
            description: `${color.name}: ${color.value}`,
          });
        } catch {
          console.error('Fallback: Oops, unable to copy');
        }
        document.body.removeChild(textArea);
      });
    }
  }, [color.value, color.name, toast, isOpen]);

  const handleAddToList = useCallback((listIndex: number) => {
    addColorToList(color, listIndex);
    toast({
      title: "Added to list",
      description: `${color.name} has been added to your list`,
    });
    setIsOpen(false);
  }, [color, addColorToList, toast]);

  return (
    <div
      className="w-full h-12 p-1 flex items-center justify-between space-x-2 hover:scale-105 transition-transform relative group cursor-pointer bg-background border border-input hover:bg-accent hover:text-accent-foreground rounded-md"
      onClick={copyToClipboard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-6 h-6 rounded-md flex-shrink-0"
        style={{ backgroundColor: `rgb(${color.value.slice(5, -1).split(',').map(n => parseFloat(n) * 255).join(',')})` }}
      ></div>
      <div className="flex-grow text-left">
        <p className="text-xs font-semibold truncate">{color.name}</p>
        <p className="text-xs text-muted-foreground truncate">{color.value}</p>
      </div>
      <DropdownMenu open={isOpen && isHovered} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={`absolute right-1 top-1/2 -translate-y-1/2 transition-opacity p-1 rounded-full bg-primary text-primary-foreground ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          onCloseAutoFocus={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}
          className="min-w-[200px]"
        >
          <div className="flex items-center justify-between px-2 py-1.5 border-b">
            <span className="text-sm font-medium">Add to List</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {lists.map((list, index) => (
            <DropdownMenuCheckboxItem
              key={index}
              onSelect={(e) => {
                e.preventDefault();
                handleAddToList(index);
              }}
            >
              {list.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

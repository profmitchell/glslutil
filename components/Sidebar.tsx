import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { useColorLists } from '../context/ColorListsContext';
import { useToast } from './ui/use-toast';

export function Sidebar() {
  const { lists, addList, deleteList, removeColorFromList } = useColorLists();
  const [newListName, setNewListName] = useState('');
  const { toast } = useToast();

  const handleAddList = () => {
    if (newListName.trim()) {
      addList(newListName);
      setNewListName('');
    }
  };

  const copyColorToClipboard = async (color: { name: string; value: string }) => {
    try {
      await navigator.clipboard.writeText(color.value);
      toast({
        title: "Copied to clipboard",
        description: `${color.name}: ${color.value}`,
      });
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = color.value;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast({
          title: "Copied to clipboard",
          description: `${color.name}: ${color.value}`,
        });
      } catch {
        toast({
          title: "Failed to copy",
          description: "Please try again or copy manually",
          variant: "destructive",
        });
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Color Lists</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Color Lists</SheetTitle>
          <SheetDescription>
            Manage your color lists here.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-2">
            <Input
              placeholder="New list name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddList();
                }
              }}
            />
            <Button onClick={handleAddList}>Add List</Button>
          </div>
          {lists.map((list, listIndex) => (
            <div key={listIndex} className="flex flex-col p-2 border rounded-md">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium">{list.name}</h3>
                  <p className="text-sm text-muted-foreground">{list.colors.length} colors</p>
                </div>
                {listIndex > 1 && ( // Prevent deletion of default lists
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteList(listIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {list.colors.map((color, colorIndex) => (
                  <div 
                    key={colorIndex} 
                    className="flex items-center gap-2 p-2 border rounded-md hover:bg-accent cursor-pointer group relative"
                    onClick={() => copyColorToClipboard(color)}
                  >
                    <div
                      className="w-6 h-6 rounded-md transition-transform group-hover:scale-110"
                      style={{ 
                        backgroundColor: `rgb(${color.value
                          .slice(5, -1)
                          .split(',')
                          .map((n: string) => parseFloat(n) * 255)
                          .join(',')})` 
                      }}
                    />
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium truncate">{color.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{color.value}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeColorFromList(listIndex, colorIndex);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

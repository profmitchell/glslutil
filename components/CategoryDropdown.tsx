import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ColorCategory } from '../data/colors';
import { ColorSwatch } from './ColorSwatch';

interface CategoryDropdownProps {
  category: ColorCategory;
}

export function CategoryDropdown({ category }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      <button
        className="w-full flex justify-between items-center p-2 bg-secondary text-secondary-foreground rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{category.name}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
          {category.colors.map((color) => (
            <ColorSwatch key={`${category.id}-${color.name}`} color={color} />
          ))}
        </div>
      )}
    </div>
  );
}


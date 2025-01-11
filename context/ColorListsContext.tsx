import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Color } from '../data/colors';

interface ColorList {
  name: string;
  colors: Color[];
}

interface ColorListsContextType {
  lists: ColorList[];
  addList: (name: string) => void;
  deleteList: (listIndex: number) => void;
  addColorToList: (color: Color, listIndex: number) => void;
  removeColorFromList: (listIndex: number, colorIndex: number) => void;
}

const ColorListsContext = createContext<ColorListsContextType | undefined>(undefined);

export function ColorListsProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<ColorList[]>([
    { name: "Favorite Colors", colors: [] },
    { name: "Project Palette", colors: [] },
  ]);

  const addList = useCallback((name: string) => {
    setLists(prevLists => [...prevLists, { name, colors: [] }]);
  }, []);

  const deleteList = useCallback((listIndex: number) => {
    setLists(prevLists => {
      const newLists = [...prevLists];
      newLists.splice(listIndex, 1);
      return newLists;
    });
  }, []);

  const addColorToList = useCallback((color: Color, listIndex: number) => {
    setLists(prevLists => {
      const newLists = [...prevLists];
      // Check if color already exists in the list
      const colorExists = newLists[listIndex].colors.some(
        (c: Color) => c.name === color.name && c.value === color.value
      );
      
      if (!colorExists) {
        newLists[listIndex].colors.push(color);
      }
      return newLists;
    });
  }, []);

  const removeColorFromList = useCallback((listIndex: number, colorIndex: number) => {
    setLists(prevLists => {
      const newLists = [...prevLists];
      newLists[listIndex].colors.splice(colorIndex, 1);
      return newLists;
    });
  }, []);

  return (
    <ColorListsContext.Provider value={{
      lists,
      addList,
      deleteList,
      addColorToList,
      removeColorFromList,
    }}>
      {children}
    </ColorListsContext.Provider>
  );
}

export function useColorLists() {
  const context = useContext(ColorListsContext);
  if (context === undefined) {
    throw new Error('useColorLists must be used within a ColorListsProvider');
  }
  return context;
}

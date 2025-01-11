'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sdfFunctions } from '../data/sdfFunctions';
import { SDFCard } from './SDFCard';

export function SDFLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const filteredSDFFunctions = sdfFunctions.filter(func => 
    (category === 'all' || func.category === category) &&
    (func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     func.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder="Search SDF functions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="2D">2D Shapes</SelectItem>
            <SelectItem value="3D">3D Shapes</SelectItem>
            <SelectItem value="Transformations">Transformations</SelectItem>
            <SelectItem value="Shapes">Patterns & Shapes</SelectItem>
            <SelectItem value="Raymarching">Raymarching</SelectItem>
            <SelectItem value="Lighting">Lighting</SelectItem>
            <SelectItem value="Utility">Utilities</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-6"> {/* Updated grid class name */}
        {filteredSDFFunctions.map((func) => (
          <SDFCard key={func.name} sdfFunction={func} />
        ))}
      </div>
    </div>
  );
}

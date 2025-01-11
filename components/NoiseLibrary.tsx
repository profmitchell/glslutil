'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { noiseFunctions } from '../data/noiseFunctions';
import { NoiseCard } from './NoiseCard';

export function NoiseLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const filteredNoiseFunctions = noiseFunctions.filter(func => 
    (category === 'all' || func.category === category) &&
    (func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     func.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder="Search noise functions..."
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
            <SelectItem value="2D">2D</SelectItem>
            <SelectItem value="3D">3D</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {filteredNoiseFunctions.map((func) => (
          <NoiseCard key={func.name} noiseFunction={func} />
        ))}
      </div>
    </div>
  );
}


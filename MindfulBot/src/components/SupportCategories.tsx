import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { cn } from './ui/lib/utils';

interface SupportCategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const SupportCategories: React.FC<SupportCategoriesProps> = ({
  activeCategory,
  setActiveCategory,
}) => {
  return (
    <div className="w-full animate-fade-in">
      <h3 className="text-base font-medium mb-2 text-muted-foreground">
        I need support with:
      </h3>
      <Tabs
        defaultValue={activeCategory}
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-4 gap-2">
          <TabsTrigger 
            value="general"
            className={cn(
              "data-[state=active]:bg-support data-[state=active]:text-white transition-all duration-300"
            )}
          >
            General
          </TabsTrigger>
          <TabsTrigger 
            value="anxiety"
            className={cn(
              "data-[state=active]:bg-support data-[state=active]:text-white transition-all duration-300"
            )}
          >
            Anxiety
          </TabsTrigger>
          <TabsTrigger 
            value="depression"
            className={cn(
              "data-[state=active]:bg-support data-[state=active]:text-white transition-all duration-300"
            )}
          >
            Depression
          </TabsTrigger>
          <TabsTrigger 
            value="stress"
            className={cn(
              "data-[state=active]:bg-support data-[state=active]:text-white transition-all duration-300"
            )}
          >
            Stress
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default SupportCategories;

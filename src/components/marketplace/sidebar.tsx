import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  CreditCard, 
  Brain, 
  BarChart, 
  MessageSquare, 
  Grid,
  Search,
  ChevronRight,
  DollarSign,
  Tag
} from "lucide-react";
import { useMarketPlaceStore } from '@/store/marketplace.store';

export function CategorySidebar({count}:{count:number}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilters, setPriceFilters] = useState({ free: false, paid: false });
  const [searchQuery, setSearchQuery] = useState('');
  const {tags,fetchTags}=useMarketPlaceStore();
  const categories = [
    { name: "All", icon: Grid, count: count },
    { name: "Authentication", icon: ShieldCheck, count: 28 },
    { name: "Payments", icon: CreditCard, count: 42 },
    { name: "AI/ML", icon: Brain, count: 35 },
    { name: "Analytics", icon: BarChart, count: 21 },
    { name: "Communication", icon: MessageSquare, count: 30 }
  ]; 

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  useEffect(()=>{
    fetchTags();
  },[])

  return (
    <nav className="h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-4">
          <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Categories
          </h3>
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.name;
              
              return (
                <motion.button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`w-full flex items-center px-4 py-2 text-sm transition-all ${
                    isSelected 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`h-4 w-4 mr-3 ${
                    isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  <span className="flex-1 text-left font-medium">{category.name}</span>
                  <span className={`mr-2 text-xs ${
                    isSelected 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {category.count}
                  </span>
                  {isSelected && (
                    <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Filters Section */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Filters
          </h3>
          
          {/* Price Filter */}
          <div className="space-y-2">
            <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
              Price Range
            </h4>
            {['Free', 'Paid'].map((option) => (
              <motion.label
                key={option}
                className="flex items-center space-x-3 cursor-pointer group"
                whileHover={{ x: 2 }}
              >
                <input
                  type="checkbox"
                  checked={priceFilters[option.toLowerCase()]}
                  onChange={() => setPriceFilters(prev => ({
                    ...prev,
                    [option.toLowerCase()]: !prev[option.toLowerCase()]
                  }))}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                  {option}
                </span>
              </motion.label>
            ))}
          </div>

          {/* Tags Section */}
          <div className="mt-4">
            <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="h-4 w-4 mr-2 text-gray-400" />
              Popular Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {tags?.list?.map((tag,i) => (
                <motion.span
                  key={i}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag.value}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default CategorySidebar;
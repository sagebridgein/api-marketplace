import React from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const LoadingPlayground = () => {
  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Sidebar Trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden absolute top-4 left-4">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarSkeleton />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 border-r bg-white">
        <SidebarSkeleton />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Request Section */}
        <div className="flex-1 p-4 border-r">
          {/* Tabs Skeleton */}
          <div className="border-b pb-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((tab) => (
                <div
                  key={tab}
                  className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Parameters Form Skeleton */}
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex space-x-2">
                <div className="h-10 flex-1 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-10 flex-1 bg-gray-200 rounded-md animate-pulse" />
              </div>
            ))}
            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse mt-4" />
          </div>

          {/* Send Button Skeleton */}
          <div className="mt-6">
            <div className="h-10 w-full bg-gray-300 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Response Section */}
        <div className="flex-1 p-4">
          <div className="border rounded-lg h-full">
            {/* Response Header Skeleton */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse" />
              <div className="flex space-x-2">
                <div className="h-6 w-16 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded-md animate-pulse" />
              </div>
            </div>
            {/* Response Content Skeleton */}
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4, 5].map((line) => (
                <div
                  key={line}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarSkeleton = () => {
  return (
    <div className="h-full">
      {/* Sidebar Header Skeleton */}
      <div className="p-4 border-b">
        <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse" />
      </div>
      {/* Sidebar Content Skeleton */}
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex items-center space-x-2">
            <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-8 flex-1 bg-gray-200 rounded-md animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingPlayground;
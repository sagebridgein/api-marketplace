import { Button } from "@/components/ui/button";
interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
  }
  
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
  
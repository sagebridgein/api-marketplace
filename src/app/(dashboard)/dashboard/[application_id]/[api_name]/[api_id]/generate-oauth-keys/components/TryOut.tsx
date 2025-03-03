import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiList } from "@/types";
import { useRouter } from "next/navigation";

const TryOutButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.div
      onClick={onClick}
      className="flex justify-center mt-8 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className={cn(
          "group  w-full flex items-center justify-center relative px-8 py-3 rounded-full bg-gradient-to-r text-white font-medium text-lg overflow-hidden shadow-lg transition-shadow duration-300",
          "from-blue-600 via-blue-500 to-blue-400 hover:shadow-blue-500/25"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className={cn(
            "absolute inset-0 bg-gradient-to-r to-transparent",
            "from-blue-600 via-blue-500 to-blue-400 hover:shadow-blue-500/25"
          )}
          initial={{ x: "100%" }}
          whileHover={{ x: "-100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        <span className="relative flex items-center gap-2">
          Try Out
          <motion.span
            className="inline-block"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.span>
        </span>
      </motion.button>
    </motion.div>
  );
};

const TryOut = ({ apiId }: { apiId: string }) => {
  const router = useRouter();
  return (
    <div className="space-y-4 w-full">
      <TryOutButton onClick={() => router.push(`/playground/${apiId}`)} />
    </div>
  );
};

export default TryOut;

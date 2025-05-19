"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Clock, MessageSquare, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { formatDistanceToNow } from "date-fns";

// Define the Message type if it's not imported elsewhere
interface Message {
  id: string;
  content: string;
  timestamp: Date | string;
}

export const MessageHistoryList = () => {
  const { data: messageHistory, isLoading, isError, dataUpdatedAt } =
    api.messages.getMessages.useQuery(undefined, {
      refetchOnWindowFocus: true,
      refetchInterval: 30000, // Auto-refresh every 30 seconds
    });

  const formatTimeAgo = (timestamp: Date | string): string => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      console.error("Invalid date format:", e);
      return "unknown time ago";
    }
  };

// Safe way to handle dataUpdatedAt with proper type checking
  const getLastUpdated = (dataUpdatedAt: number | null | undefined): string => {
    if (!dataUpdatedAt || typeof dataUpdatedAt !== 'number') {
      return "just now";
    }

    try {
      const date = new Date(dataUpdatedAt);
      // Validate that we have a valid date
      if (isNaN(date.getTime())) {
        return "just now";
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
      return formatDistanceToNow(date, { addSuffix: false });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "just now";
    }
  };

// Use the safe function
  const lastUpdated = getLastUpdated(dataUpdatedAt);

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="space-y-3 w-full mx-auto">
        {[1, 2, 3].map((n) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: n * 0.1 }}
            className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-pink-100 shadow-sm"
          >
            <div className="flex items-center mb-2">
              <Skeleton className="h-4 w-24 bg-pink-50" />
            </div>
            <Skeleton className="h-4 w-full bg-pink-50" />
            <Skeleton className="h-4 w-2/3 bg-pink-50 mt-2" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (isError || !messageHistory || messageHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-gray-400 bg-white/80 backdrop-blur-sm rounded-xl border border-pink-100 shadow-sm w-full mx-auto"
      >
        <div className="flex flex-col items-center gap-2">
          <MessageSquare className="h-8 w-8 text-pink-300" />
          <p>{isError ? "Failed to load messages" : "No messages yet"}</p>
        </div>
      </motion.div>
    );
  }

  // Sort messages from newest to oldest
  const sortedMessages = [...messageHistory].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-sm text-pink-500 font-medium mb-4"
      >
        <Sparkles className="h-4 w-4" />
        <span>Updated {lastUpdated}</span>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 max-h-[calc(100vh-200px)] md:max-h-[500px)] overflow-y-auto pr-1 custom-scrollbar"
      >
        <AnimatePresence>
          {sortedMessages.map((message) => (
            <motion.div
              key={message.id}
              variants={itemVariants}
              layout
              whileHover={{ scale: 1.01 }}
              className="transform-gpu"
            >
              <Card className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-pink-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-xs text-pink-400 mb-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatTimeAgo(message.timestamp)}</span>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-100 to-transparent mb-3"></div>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {message.text}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

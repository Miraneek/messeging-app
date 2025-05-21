"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Clock, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type messageHistory = {
  id: number
  text: string | null
  timestamp: Date
}[] | undefined

export const MessageHistoryList = ({ initialMessages }: { initialMessages: messageHistory }) => {
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

  const { data: messageHistory, refetch } = api.messages.getMessages.useQuery(undefined, {
    initialData: initialMessages,
  });

  const deleteMutation = api.messages.deleteMessage.useMutation({
    onSuccess: async () => {
      await refetch();
      setMessageToDelete(null);
      toast.success("Message deleted successfully");
    },
  });

  const formatTimeAgo = (timestamp: Date | string): string => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      console.error("Invalid date format:", e);
      return "unknown time ago";
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const sortedMessages = messageHistory?.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full mx-auto"
    >
      <AlertDialog open={messageToDelete !== null} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent className="bg-black/80 border border-pink-500/30 backdrop-blur-md text-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-100">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-pink-500/30 text-gray-300 hover:bg-pink-500/10 hover:text-gray-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => messageToDelete !== null && handleDelete(messageToDelete)}
              className="bg-pink-500/20 text-pink-200 hover:bg-pink-500/30 border border-pink-500/50"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar"
      >
        <AnimatePresence mode="popLayout">
          {sortedMessages?.map((message) => (
            <motion.div
              key={message.id}
              variants={itemVariants}
              layout
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover={{
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              className="transform-gpu will-change-transform"
            >
              <Card className="p-4 bg-black/30 backdrop-blur-md rounded-xl border border-pink-500/20 shadow-lg hover:border-pink-500/40 transition-all duration-300">
                <div className="mb-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-pink-400 mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-medium">{formatTimeAgo(message.timestamp)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full text-pink-400/70 hover:text-pink-400 hover:bg-pink-500/10 transition-colors"
                      onClick={() => setMessageToDelete(message.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete message</span>
                    </Button>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-500/20 to-transparent mb-3"></div>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {message.text}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
          {(!sortedMessages || sortedMessages.length === 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-center py-8 text-gray-400"
            >
              <p>No messages yet. Be the first to write one!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const WriteMessageForm = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);

  // Set isConnected to true by default (you can replace with actual connection logic)
  const isConnected = true;

  const mutation = api.messages.createNewMessege.useMutation({
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      toast.success("Message sent successfully");
      setMessage("");
      setIsSending(false);

      // You might want to invalidate queries to refresh message list
      // utils.messages.getMessages.invalidate();
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      toast.error(":((( unlucky something se rozbilo");
      setIsSending(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    mutation.mutate(message.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            className="w-full min-h-[120px] resize-none p-4 rounded-xl border-2 border-pink-100 focus:border-pink-300 focus:ring-1 focus:ring-pink-200 shadow-sm transition-all duration-200 text-gray-800 bg-white/80 backdrop-blur-sm placeholder:text-gray-400"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending || !isConnected}
          />

          {/* Character count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: message.length > 0 ? 1 : 0 }}
            className="absolute bottom-3 right-3 text-xs text-pink-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full"
          >
            {message.length} {message.length === 1 ? 'character' : 'characters'}
          </motion.div>
        </div>

        <div className="flex justify-between items-center">
          {/* Send button */}
          <motion.div
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="w-full"
          >
            <Button
              type="submit"
              disabled={!message.trim() || isSending || !isConnected}
              className={`w-full rounded-full px-6 py-2.5 flex items-center justify-center gap-2 shadow-md transition-all duration-200 ${
                !message.trim() || !isConnected
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
              }`}
            >
              <AnimatePresence mode="wait">
                {isSending ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Sending</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="send"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <span>Send</span>
                    <Send className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

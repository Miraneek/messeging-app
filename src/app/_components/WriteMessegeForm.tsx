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


  const mutation = api.messages.createNewMessege.useMutation({
    onSuccess: async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      toast.success("Message sent successfully");
      setMessage("");
      setIsSending(false);
      await utils.messages.getMessages.invalidate();

      // You might want to invalidate queries to refresh message list
      // utils.messages.getMessages.invalidate();
    },
    onError: (error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      toast.error(":((( unlucky something se rozbilo");
      setIsSending(false);
    }
  });

  const utils = api.useUtils()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    mutation.mutate(message.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            className="w-full min-h-[120px] resize-none p-4 rounded-xl border-2 border-pink-500/20 focus:border-pink-500/40 focus:ring-1 focus:ring-pink-500/20 shadow-lg transition-all duration-300 text-gray-200 bg-black/30 backdrop-blur-md placeholder:text-gray-500"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: message.length > 0 ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 right-3 text-xs text-pink-400 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full font-medium border border-pink-500/20 will-change-opacity"
          >
            {message.length} {message.length === 1 ? 'character' : 'characters'}
          </motion.div>
        </div>

        <div className="flex justify-between items-center">
          <motion.div
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            className="w-full will-change-transform"
          >
            <Button
              type="submit"
              disabled={!message.trim() || isSending}
              className={`w-full rounded-full px-6 py-2.5 flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
                !message.trim()
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
              }`}
            >
              <AnimatePresence mode="wait">
                {isSending ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 will-change-opacity"
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 will-change-opacity"
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

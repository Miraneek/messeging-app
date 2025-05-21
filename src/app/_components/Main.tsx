"use client";

import { motion } from "framer-motion";
import { WriteMessageForm } from "@/app/_components/WriteMessegeForm";
import { MessageHistoryList } from "@/app/_components/MessegeHistoryList";
import type { messageHistory } from "@/app/_components/MessegeHistoryList";

export default function Main({ initialMessages }: { initialMessages: messageHistory }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 w-full text-gray-100">
      <div className="relative z-10 flex flex-col min-h-screen">
        <motion.header 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="py-6 px-4 bg-black/20 backdrop-blur-md border-b border-pink-500/20"
        >
          <div className="container mx-auto">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
            >
              Mírův desklet
            </motion.h1>
          </div>
        </motion.header>

        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Message Writing Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.4,
                delay: 0.1
              }}
              className="bg-black/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300"
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-xl font-semibold mb-6 text-gray-100"
              >
                Write a Message
              </motion.h2>
              <WriteMessageForm />
            </motion.div>

            {/* Message History Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.4,
                delay: 0.2
              }}
              className="bg-black/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300"
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-xl font-semibold mb-6 text-gray-100"
              >
                Message History
              </motion.h2>
              <MessageHistoryList initialMessages={initialMessages} />
            </motion.div>
          </div>
        </main>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="py-4 text-center text-sm text-gray-400 border-t border-pink-500/20 bg-black/20 backdrop-blur-md"
        >
          <p>Stay connected with Mírův desklet</p>
        </motion.footer>
      </div>
    </div>
  );
}

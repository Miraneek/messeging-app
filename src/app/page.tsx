"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, History } from "lucide-react";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { WriteMessageForm } from "@/app/_components/WriteMessegeForm";
import { MessageHistoryList } from "@/app/_components/MessegeHistoryList";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("write");

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 w-full text-gray-800 flex flex-col">
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 container mx-auto py-8 px-3">
          <div className="max-w-md mx-auto">
            <Tabs
              defaultValue="write"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full gap-2 h-full mb-4 bg-white rounded-full p-1 shadow-sm border border-pink-100">
                <TabsTrigger
                  value="write"
                  className="flex items-center justify-center gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white py-3 transition-all duration-300 rounded-full"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Write</span>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center justify-center gap-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white py-3 transition-all duration-300 rounded-full"
                >
                  <History className="h-4 w-4" />
                  <span>History</span>
                </TabsTrigger>
              </TabsList>

              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-pink-100"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      duration: 0.05,
                    }}
                  >
                    <TabsContent value="write" className="mt-0 focus-visible:outline-none">
                      <WriteMessageForm />
                    </TabsContent>

                    <TabsContent value="history" className="mt-0 focus-visible:outline-none">
                      <MessageHistoryList />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </Tabs>
          </div>
        </main>

        <footer className="py-4 text-center text-xs text-gray-500 border-t border-pink-100 bg-white/80 backdrop-blur-sm">
          <p>Stay connected with mírův desklet</p>
        </footer>
      </div>
    </div>
  );
}

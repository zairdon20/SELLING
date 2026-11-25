"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Smartphone, Laptop, Tablet } from "lucide-react";

/**
 * Full-screen brand splash shown once per browser session on first visit.
 *
 * The animation tells a tiny "running off to shop" story: a shopping cart
 * rolls across the screen with a happy bounce while gadget icons (phone,
 * tablet, laptop) pop up in its wake, the TwendaChina wordmark fades in,
 * then the whole overlay lifts away to reveal the store.
 *
 * Dismiss behaviour:
 *   - auto-dismiss after ~2.4s
 *   - click anywhere to skip
 *   - sessionStorage flag prevents replay on subsequent navigation
 */
const STORAGE_KEY = "twendachina-splash-seen";
const DURATION_MS = 2400;

export function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only on the client; skip if already seen this session.
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setShow(false);
        return;
      }
    } catch {
      /* sessionStorage may be unavailable (private mode) — fall through */
    }
    setShow(true);

    const timer = setTimeout(() => dismiss(), DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white cursor-pointer select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          onClick={dismiss}
          aria-hidden="true"
        >
          {/* Soft background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-100 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-100 blur-3xl" />
          </div>

          {/* Running shopping scene */}
          <div className="relative mb-8 h-24 w-full max-w-sm overflow-hidden">
            {/* Gadget icons popping up in the cart's wake */}
            {[Smartphone, Tablet, Laptop].map((Icon, i) => (
              <motion.div
                key={i}
                className="absolute top-2 text-blue-600"
                initial={{ x: 60, y: 40, opacity: 0, scale: 0.4 }}
                animate={{
                  x: [60, 120 + i * 30, 180 + i * 30],
                  y: [40, -8, 0],
                  opacity: [0, 1, 0],
                  scale: [0.4, 1, 0.6],
                }}
                transition={{
                  duration: 1.8,
                  delay: 0.3 + i * 0.25,
                  ease: "easeOut",
                }}
              >
                <Icon className="h-7 w-7" />
              </motion.div>
            ))}

            {/* The rolling cart */}
            <motion.div
              className="absolute bottom-0 text-blue-700"
              initial={{ x: -40 }}
              animate={{ x: [-40, 360] }}
              transition={{ duration: 1.9, ease: "easeInOut", delay: 0.2 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.4,
                  repeat: 4,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              >
                <ShoppingCart className="h-12 w-12" />
              </motion.div>
              {/* little speed lines */}
              <motion.div
                className="absolute -left-6 top-3 h-1 w-5 rounded-full bg-blue-300"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.3, repeat: 6, delay: 0.3 }}
              />
            </motion.div>
          </div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            className="relative text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-blue-700 via-violet-600 to-emerald-600 bg-clip-text text-transparent">
                TwendaChina
              </span>
            </h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Your electronics store · Phones · Tablets · Computers
            </p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="relative mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-neutral-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: DURATION_MS / 1000, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.p
            className="absolute bottom-6 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Tap to skip
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

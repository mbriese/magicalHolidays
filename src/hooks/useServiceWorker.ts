"use client";

import { useEffect, useState } from "react";

export function useServiceWorker() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        setRegistration(reg);
        setIsRegistered(true);
        console.log("[SW] Service Worker registered successfully");

        // Check for updates
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setIsUpdateAvailable(true);
                console.log("[SW] New version available");
              }
            });
          }
        });

        // Check for updates periodically
        setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000); // Check every hour
      } catch (error) {
        console.error("[SW] Service Worker registration failed:", error);
      }
    };

    registerSW();

    // Handle controller change (when new SW takes over)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("[SW] New Service Worker activated");
    });
  }, []);

  const updateServiceWorker = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage("skipWaiting");
      window.location.reload();
    }
  };

  return {
    isRegistered,
    isUpdateAvailable,
    updateServiceWorker,
  };
}

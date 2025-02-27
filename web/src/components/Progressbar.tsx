import type React from "react";
import { useState, useEffect, useRef } from "react";
import { eventListener } from "../utils/EventListener";
import { fetchNui } from "../utils/fetchNui";

interface ProgressBarProps {}

export const ProgressBar: React.FC<ProgressBarProps> = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const onCompleteRef = useRef<string | null>(null);

  const showProgressBar = (duration: number, onComplete?: string, onCancel?: string) => {
    setIsVisible(true);
    setProgress(0);
    startTimeRef.current = Date.now();
    durationRef.current = duration;
    onCompleteRef.current = onComplete || null;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / durationRef.current) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        setTimeout(() => {
          setIsVisible(false);
          if (onCompleteRef.current) {
            fetchNui("ServerEvent", onCompleteRef.current);
          }
        }, 300);
      }
    }, 16);
  };

  const hideProgressBar = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    eventListener.listen("progressbar", (data) => {
      if (data.event === "show") {
        showProgressBar(data.duration, data.onComplete, data.onCancel);
      } else if (data.event === "hide") {
        hideProgressBar();
      } else if (data.event === "cancel") {
        hideProgressBar();
        if (data.onCancel) {
          fetchNui("ServerEvent", data.onCancel);
        }
      }
    });

    return () => {
      eventListener.remove("progressbar");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[250px]">
      <div className="relative w-full h-4 bg-neutral-800 rounded-full overflow-hidden shadow-sm">
        <div
          className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};
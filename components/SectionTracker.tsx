"use client";

import { useEffect, useRef } from "react";
import { logEvent } from "@/app/[slug]/actions";

type Props = {
  sectionId: string;
  clientId: string;
  userLabel: string | null;
  children: React.ReactNode;
};

export function SectionTracker({ sectionId, clientId, userLabel, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTrackedRef = useRef(false); // Track once per mount/active-session to avoid database flooding

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // If we haven't tracked it in this mount session, set a timer for 1 second dwell time
          if (!hasTrackedRef.current) {
            timerRef.current = setTimeout(() => {
              logEvent({
                clientId,
                userLabel,
                eventType: "viewed_section",
                metadata: { section: sectionId },
              });
              hasTrackedRef.current = true;
            }, 1000);
          }
        } else {
          // If they scroll away, clear any active timer
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          // Optionally allow re-tracking if they scroll completely away and return later
          hasTrackedRef.current = false;
        }
      },
      {
        threshold: 0.15, // Trigger when 15% of the section is visible
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [sectionId, clientId, userLabel]);

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}

"use client";

import {
  bindDiveClock,
  beginDiveOut,
  clearDiveHold,
  getDive,
  markDivePushed,
  shouldPush,
  subscribeDive,
} from "@/lib/dive";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

function surveySlug(path: string): string | null {
  const match = /^\/work\/([^/]+)/.exec(path);
  return match ? match[1] : null;
}

function syncDiveAttr() {
  const dive = getDive();
  const root = document.documentElement;
  if (dive.mode === "idle") {
    if (dive.slug) root.dataset.dive = "hold";
    else delete root.dataset.dive;
  } else {
    root.dataset.dive = dive.mode;
  }
}

export function DiveDirector() {
  const router = useRouter();
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    const unbind = bindDiveClock();
    const off = subscribeDive(() => {
      const dive = getDive();
      syncDiveAttr();
      const here =
        typeof window !== "undefined" ? window.location.pathname : pathname;
      if ((dive.mode === "in" || dive.mode === "adjacent") && dive.slug) {
        if (shouldPush(dive.progress, dive.pushed)) {
          markDivePushed();
          router.push(`/work/${dive.slug}`);
        }
      } else if (dive.mode === "out" && shouldPush(dive.progress, dive.pushed)) {
        markDivePushed();
        router.push("/work");
      } else if (
        dive.mode === "idle" &&
        dive.slug &&
        here === "/work"
      ) {
        router.push(`/work/${dive.slug}`);
      }
    });
    syncDiveAttr();
    const held = getDive();
    if (
      held.mode === "idle" &&
      held.slug &&
      window.location.pathname === "/work"
    ) {
      router.push(`/work/${held.slug}`);
    }
    return () => {
      off();
      unbind();
      delete document.documentElement.dataset.dive;
    };
  }, [router]);

  useEffect(() => {
    const prev = prevPath.current;
    prevPath.current = pathname;
    const fromSurvey = surveySlug(prev);
    const dive = getDive();
    if (fromSurvey && pathname === "/work") {
      if (dive.mode === "idle" && dive.slug) beginDiveOut(dive.slug);
      return;
    }
    if (fromSurvey && !pathname.startsWith("/work")) {
      if (dive.mode === "idle") clearDiveHold();
    }
  }, [pathname]);

  return null;
}

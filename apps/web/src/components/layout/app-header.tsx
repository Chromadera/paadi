"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Bell, Settings2 } from "lucide-react";
import { useHeaderStore } from "@/lib/header/store";

const ROOT_TABS = ["/home", "/pots", "/activity", "/profile"];

// Explicit type layout representing both static navigation targets and functional triggers
type HeaderAction = {
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onPress?: () => void;
};

const ROOT_TAB_ACTIONS: Record<string, HeaderAction | null> = {
  "/home": { icon: Bell, href: "/activity" },
  "/pots": null, 
  "/activity": null,
  "/profile": { icon: Settings2, href: "/settings" },
};

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const storeAction = useHeaderStore((s) => s.action);

  const isRootTab = ROOT_TABS.some((tab) => pathname === tab);
  
  // Cleanly extract the action object based on routing context
  const rightSlot: HeaderAction | null = isRootTab
    ? (ROOT_TAB_ACTIONS[pathname] ?? null)
    : (storeAction ?? null);

  const screenTitle = deriveTitle(pathname);

  return (
    <div className="flex items-center justify-between w-full px-1 py-3 mb-4   shrink-0 select-none">

      {/* LEFT — Back button navigation framework */}
      <div className="w-8 flex items-center">
        {!isRootTab && (
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center h-8 w-8 rounded-xl text-ink/60 hover:text-ink active:scale-90 transition-all"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* CENTER — Branding wordmark or dynamic title engine */}
      <div className="flex-1 flex items-center justify-center">
        {isRootTab ? (
          <span className="text-lg font-black tracking-tight text-ink">
            Paa<span className="text-primary">di</span>
          </span>
        ) : (
          <span className="text-base font-black text-ink tracking-tight uppercase">
            {screenTitle}
          </span>
        )}
      </div>

      {/* RIGHT — Contextual actions slot */}
      <div className="w-8 flex items-center justify-end">
        {rightSlot && (() => {
          const Icon = rightSlot.icon;
          const iconClassName = "h-5 w-5 stroke-[2.25]";

          // Scenario A: Standard Link Route
          if (rightSlot.href) {
            return (
              <Link
                href={rightSlot.href}
                className="flex items-center justify-center h-8 w-8 rounded-xl text-ink/50 hover:text-ink active:scale-90 transition-all"
              >
                <Icon className={iconClassName} />
              </Link>
            );
          }

          // Scenario B: Functional Interceptor (e.g. Save form, filter data modal)
          if (rightSlot.onPress) {
            return (
              <button
                type="button"
                onClick={rightSlot.onPress}
                className="flex items-center justify-center h-8 w-8 rounded-xl text-ink/50 hover:text-ink active:scale-90 transition-all"
              >
                <Icon className={iconClassName} />
              </button>
            );
          }

          return null;
        })()}
      </div>

    </div>
  );
}

function deriveTitle(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return "Paadi";

  const titleMap: Record<string, string> = {
    "create":   "Create Pot",
    "edit":     "Edit Pot",
    "verify":   "Verify Identity",
    "settings": "Settings",
    "activity": "Activity",
    "profile":  "Profile",
  };

  const last = segments[segments.length - 1];
  const first = segments[0];

  if (last && titleMap[last]) return titleMap[last];
  if (first && titleMap[first]) return titleMap[first];

  if (first === "pots" && segments.length > 1) return "Pot Details";
  if (first === "pay") return "Pay Your Share";

  return (last ?? "Paadi")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
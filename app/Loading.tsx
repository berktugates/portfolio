"use client";

import { Typewriter } from "@/app/components/ui/typewriter";
import { Tcontext } from "@/store/context/ThemeContext";
import { useContext } from "react";

export default function LoadingScreen() {
  const context = useContext(Tcontext);
  if (!context) return null;
  const { theme } = context;

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        theme === "light" ? "bg-white" : "bg-black"
      }`}
    >
      <div className="text-3xl tracking-tighter">
        <Typewriter
          text={[`Hold tight — a developer worth hiring is just seconds away.`]}
          speed={100}
          initialDelay={0}
          waitTime={2000}
          deleteSpeed={30}
          loop={true}
          showCursor={true}
          cursorChar="|"
          className={`font-medium ${
            theme === "light" ? "text-black" : "text-white"
          }`}
          cursorClassName={`${
            theme === "light" ? "text-black" : "text-white"
          } ml-1`}
        />
      </div>
    </div>
  );
}

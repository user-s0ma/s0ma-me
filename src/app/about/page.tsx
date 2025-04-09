"use client";
export const runtime = 'edge';

import React, { useState, useEffect } from "react";

const userInfo = [
  "NickName\n$0",
  "Name\nSoma",
  "Birth Date\n2005-11-30",
  "X(Twitter)\nuser_s0ma",
  "Discord\nnect.dev",
  "Github\nuser-s0ma"
].join("\n\n");

export default function About() {
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < userInfo.length) {
      const timer = setTimeout(() => {
        setDisplayedText(displayedText + userInfo[charIndex]);
        setCharIndex(charIndex + 1);
      }, 25);
      return () => clearTimeout(timer);
    }
  }, [charIndex, displayedText, userInfo]);

  return (
    <main className="w-[min(1000px,_100%)] p-[10px] flex flex-col grow">
      <div className="m-[10px] text-[24px]">ABOUT</div>
      <pre className="m-[10px] text-[24px] whitespace-pre-wrap">
        {displayedText}<span className="animate-ping">|</span>
      </pre>
    </main>
  );
}
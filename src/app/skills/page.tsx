"use client";
export const runtime = 'edge';

import { useState, useEffect, useRef } from "react";

const timelineData = [
  { date: "2021", isYear: true },
  { date: "November 2021", text: "Python" },
  { date: "2022", isYear: true },
  { date: "March 2022", text: "Pytorch.py" },
  { date: "April 2022", text: "HTML CSS" },
  { date: "June 2022", text: "JavaScript" },
  { date: "September 2022", text: "React.js" },
  { date: "October 2022", text: "Express.js" },
  { date: "December 2022", text: "SQL" },
  { date: "2023", isYear: true },
  { date: "June 2023", text: "Next.js" },
  { date: "2024", isYear: true },
  { date: "March 2024", text: "TypeScript" },
  { date: "2025", isYear: true },
  { date: "April 2025", text: "React Native" },
];

export default function Resume() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [activeIndex, setActiveIndex] = useState(timelineData.length - 1);
  const timelineRef = useRef(null);

  let timeoutId;
  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const timelineElements = timelineRef.current.children;
        let closestIndex = 0;
        let minDistance = Infinity;
        for (let i = 0; i < timelineElements.length; i++) {
          const elementRect = timelineElements[i].getBoundingClientRect();
          const elementCenter = elementRect.top - (elementRect.height / 2);
          const viewportCenter = window.innerHeight / 2;
          const distance = Math.abs(viewportCenter - elementCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
          }
        }
        setActiveIndex(closestIndex);
        console.log(closestIndex);

        const { top } = timelineRef.current.getBoundingClientRect();
        setScrollPosition((window.innerHeight) / 2 - top);

        setIsUserScrolling(true);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setIsUserScrolling(false), 150);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!isUserScrolling && timelineRef.current && timelineRef.current.children[activeIndex]) {
      const activeElement = timelineRef.current.children[activeIndex];
      window.scrollTo({
        top: activeElement.offsetTop - (window.innerHeight / 2) + (activeElement.offsetHeight / 2),
        behavior: "smooth"
      });
    }
  }, [activeIndex, isUserScrolling]);

  function TimelineItem({ date, text, isYear, isActive }) {
    return (
      <div className="h-[60px] pl-[40px] m-[40px] relative snap-center">
        <div className="w-[10px] h-[10px] left-[-5px] top-0 bottom-0 my-auto absolute bg-white rounded-full"></div>
        <div className="flex flex-col">
          <div className={isYear ? isActive ? "text-[42px] font-bold" : "text-[36px] font-bold" : "text-[16px]"}>{date}</div>
          <div className={isActive ? "text-[36px] font-bold" : "text-[24px]"}>{text}</div>
        </div>
      </div>
    );
  }
  
  return (
    <main className="w-[min(1000px,_100%)] relative flex flex-col grow">
      <div className="w-[2px] h-full top-0 left-[49px] absolute bg-white rounded-full"></div>
      <div style={{ top: `${scrollPosition}px` }} className="left-[50px] absolute shadow-[0_0_10px_10px_white] animate-pulse"></div>
      <div className="px-[10px] py-[calc(50dvh_-_70px)] flex flex-col" ref={timelineRef}>
        {timelineData.map((item, index) => (
          <TimelineItem
            key={index}
            date={item.date} 
            text={item.text} 
            isYear={item.isYear}
            isActive={index === activeIndex}
          />
        ))}
      </div>
    </main>
  );
}
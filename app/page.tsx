"use client"
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative w-screen h-screen">
      {/* Background image */}
      <Image
        src="/rDJegQJaCyGaYysj2g5XWY-1200-80.jpg" 
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Content on top */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          BROWSE AND SEARCH LATEST MOVIES
        </h1>
        <Link href="/movie">
        <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-white text-lg font-medium">
          BROWSE MOVIES
        </button></Link>
        
      </div>
    </div>
  );
}

// components/shared/NavBar.tsx

import Link from "next/link";
import { ModeToggle } from "./Togglek";

export default function NavBar() {
    return (
      <header>
        <nav className="w-full font-mono bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4">
          <div className="flex justify-between items-center gap-6">
          <Link href="/"> <div className="text-2xl tracking-wide">MOVIE-X</div></Link> 
            <div className="text-black">
              <ModeToggle/>
            </div>
          </div>
        </nav>
      </header>
    );
  }
  
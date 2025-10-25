"use client";
import Freighter from "@/app/components/Freighter";
import Passkeys from "@/app/components/Passkeys";


export default function Home() {

  return (
    <>
      <header className="w-full justify-between items-center py-4 px-8 flex shadow-lg" >
        <div className="items-center flex">
          Freighter + Passkeys Demo
        </div>
        <nav className="md:flex hidden space-x-4"></nav>
      </header>
      <div className="grid grid-cols-2 gap-5 p-20">
        <div className="flex justify-center">
          <Freighter />
        </div>
        <div className="flex justify-center">
          <Passkeys />
        </div>
      </div>
    </>
  );
}

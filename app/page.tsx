import Image from "next/image";
import SnowyBackground from "./snowybg";
import Navbar from "./navbar";
import PrivateAccessButton from "./privateaccess";


export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* The Background Layer */}
      <SnowyBackground />

      {/* The Navbar Layer */}
      <Navbar />

      {/* The Main Content Layer */}
      <div className="relative z-10 pt-32 flex flex-col items-center">

        {/* BUTTON GOES */}
        <PrivateAccessButton />

        {/* Hero Section */}
        <section className="text-center mt-8">
          <h2 className="text-5xl md:text-7xl font-serif text-[#D23669] mb-4">
            Feminine Help on Standby! 
          </h2>
          {/* Add more feature divs below */}
        </section>
      
          
      </div>
    </main>
  );
}
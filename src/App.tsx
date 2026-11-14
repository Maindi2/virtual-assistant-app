import { useState } from "react";
import { ContactSection } from "./components/ContactSection";
import { DataCleaningShowcase } from "./components/DataCleaningShowcase";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ServicesSection } from "./components/ServicesSection";
import { VideoStudio } from "./components/VideoStudio";

export default function App() {
  const [selectedService, setSelectedService] = useState<string>("");

  function handleSelectService(serviceTitle: string) {
    setSelectedService(serviceTitle);
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <Header />
      <main>
        <Hero />
        <ServicesSection onSelectService={handleSelectService} />
        <DataCleaningShowcase />
        <VideoStudio />
        <ContactSection selectedService={selectedService} />
      </main>
      <Footer />
    </div>
  );
}

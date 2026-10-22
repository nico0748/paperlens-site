import "./landing.css";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Privacy } from "@/components/landing/Privacy";
import { Download } from "@/components/landing/Download";
import { SharedCallout } from "@/components/landing/SharedCallout";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Privacy />
      <Download />
      <SharedCallout />
    </>
  );
}

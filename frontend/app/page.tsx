import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";

// Configure Next.js to regenerate the page frequently if using dynamic data
export const revalidate = 60; // revalidate every 60 seconds

// Next.js server component fetching
async function getPublicData() {
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';
  const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN || 'your_internal_proxy_token_here_for_nextjs';

  const headers = { 'x-internal-token': INTERNAL_API_TOKEN };

  try {
    const [servicesRes, projectsRes, testimonialsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/services`, { headers, next: { revalidate: 60 } }),
      fetch(`${BACKEND_URL}/projects`, { headers, next: { revalidate: 60 } }),
      fetch(`${BACKEND_URL}/testimonials`, { headers, next: { revalidate: 60 } }),
    ]);

    const services = servicesRes.ok ? await servicesRes.json() : [];
    const projects = projectsRes.ok ? await projectsRes.json() : [];
    const testimonials = testimonialsRes.ok ? await testimonialsRes.json() : [];

    return { services, projects, testimonials };
  } catch (e) {
    console.error("Failed to fetch server data:", e);
    return { services: [], projects: [], testimonials: [] };
  }
}

export default async function Home() {
  const { services, projects, testimonials } = await getPublicData();

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <ServicesSection initialServices={services} />
      <PortfolioSection initialProjects={projects} />
      <AboutSection />
      <TestimonialsSection initialTestimonials={testimonials} />
      <ContactSection />
    </div>
  );
}

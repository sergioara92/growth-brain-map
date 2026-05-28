import { createFileRoute } from "@tanstack/react-router";
import Explorable from "@/components/explorable/Explorable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mentalidad de Crecimiento / Growth Mindset" },
      { name: "description", content: "An interactive bilingual explorable about growth mindset and neuroplasticity for teens." },
      { property: "og:title", content: "Mentalidad de Crecimiento / Growth Mindset" },
      { property: "og:description", content: "An interactive bilingual explorable about growth mindset and neuroplasticity for teens." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Explorable />;
}

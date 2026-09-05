import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8FAFD]">
      <Navbar />

      <main className="flex-1 w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}
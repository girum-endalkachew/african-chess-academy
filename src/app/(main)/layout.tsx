import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer"; // <-- ADD THIS

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="master-glass mx-auto max-w-[1280px] rounded-[28px] overflow-hidden flex flex-col min-h-[calc(100vh-48px)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer /> {/* <-- ADD THIS */}
      </div>
    </div>
  );
}
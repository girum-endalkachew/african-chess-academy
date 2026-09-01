import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen p-2 sm:p-5 lg:p-6 flex flex-col">
      <div className="master-glass mx-auto max-w-[1360px] w-full rounded-2xl sm:rounded-[28px] overflow-hidden flex flex-col min-h-[calc(100vh-24px)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

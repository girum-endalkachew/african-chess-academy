import { Navbar } from "@/components/layout/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* 
        This is the MASTER GLASS CONTAINER from your blueprint.
        Max-width 1280px, centered, rounded corners.
      */}
      <div className="master-glass mx-auto max-w-[1280px] rounded-[28px] overflow-hidden flex flex-col min-h-[calc(100vh-48px)]">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
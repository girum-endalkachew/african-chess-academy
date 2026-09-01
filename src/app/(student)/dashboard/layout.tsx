import { StudentPortalLayout } from "@/components/layout/student-portal-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentPortalLayout>{children}</StudentPortalLayout>;
}

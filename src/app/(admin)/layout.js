// /app/(admin)/layout.js

import NextAuthProvide from "@/provider/authProvider";
import AdminLayout from "./_common/layout/adminLayout";

export const metadata = {
  title: "Admin Dashboard - My Trav Plan",
  description: "Manage and oversee travel plans, user accounts, and application settings from a centralized admin panel. Efficiently handle bookings, packages, and user interactions to ensure smooth operations and enhance user experience.",
};


export default function AdminRootLayout({ children }) {
  return (
    <NextAuthProvide>

      <AdminLayout>{children}</AdminLayout>
    </NextAuthProvide>
  );
}

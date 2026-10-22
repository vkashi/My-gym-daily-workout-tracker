import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IRON SIX | 3D Muscle Tracker",
  description: "Interactive 3D workout muscle tracker",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

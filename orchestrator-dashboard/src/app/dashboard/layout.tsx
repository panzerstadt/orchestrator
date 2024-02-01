"use client";
import { Inter } from "next/font/google";
import { UserProvider, useUser } from "@auth0/nextjs-auth0/client";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <>
        <div className="fixed top-2 right-2 text-xs p-2 bg-white bg-opacity-45 z-50">
          Welcome {user.name}!{" "}
          <a className="text-sky-600" href="/api/auth/logout">
            Logout
          </a>
        </div>
        <UserProvider>
          <div className={inter.className}>{children}</div>
        </UserProvider>
      </>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <a href="/api/auth/login">Login</a>
    </div>
  );
}

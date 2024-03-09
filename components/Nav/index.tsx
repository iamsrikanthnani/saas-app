"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserButton, useAuth } from "@clerk/nextjs";
import { routes } from "@/constants/routes";
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/actions/user.action";

export function Nav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const { userId } = useAuth();
  const [credits, setCredits] = useState("");

  const getCredits = async () => {
    const user = await getUserById(userId!);
    setCredits(user?.creditBalance);
  };

  useEffect(() => {
    getCredits();
  }, [pathname]);

  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href={"/"}>
            <h2 className="text-2xl font-bold tracking-tight mr-8">SAAS</h2>
          </Link>

          <nav
            className={cn(
              "flex items-center space-x-4 lg:space-x-6",
              className
            )}
            {...props}
          >
            {routes.map((route) => (
              <Link
                href={route.path}
                className={`text-sm font-medium ${
                  pathname === route.path ? "" : "text-muted-foreground"
                } transition-colors hover:text-primary`}
              >
                {route.name}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <p>Credits: {credits}</p>
            <UserButton
              afterSwitchSessionUrl="/sign-in"
              afterMultiSessionSingleSignOutUrl="/sign-in"
              afterSignOutUrl="/sign-in"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

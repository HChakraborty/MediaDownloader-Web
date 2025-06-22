"use client";
import React from "react";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
const FloatingNav = React.lazy(() => import("../../ui/floating-navbar"));
export function Header({
  onSubmit,
}: {
  onSubmit: (e: string) => void;
}) {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  return (
    <div className="relative  w-full">
      <FloatingNav navItems={navItems} onSubmit={onSubmit} />
    </div>
  );
}

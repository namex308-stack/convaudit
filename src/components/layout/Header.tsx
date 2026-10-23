"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { AdPreferencesToggle } from "@/components/ads/AdPreferencesToggle";
import { TOOLS } from "@/lib/tools";
import { BrandMark } from "./BrandMark";

const categories = ["Image", "PDF", "YouTube"] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrolledState = () => setIsScrolled(window.scrollY > 8);

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md transition-[border-color,box-shadow] duration-normal supports-[backdrop-filter]:bg-background/75 ${
        isScrolled ? "border-border shadow-sm" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Convaudit home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-primary transition-transform duration-fast group-hover:scale-105">
            <BrandMark className="size-6" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            Convaudit
          </span>
        </Link>

        <nav aria-label="Tool categories" className="hidden items-center gap-1 md:flex">
          {categories.map((category) => (
            <Button
              key={category}
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href={`/search?q=${category}`}>{category}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link href="/search" aria-label="Search tools">
              <Search aria-hidden="true" />
              <span>Search</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="sm:hidden">
            <Link href="/search" aria-label="Search tools">
              <Search aria-hidden="true" />
            </Link>
          </Button>
          <AdPreferencesToggle />
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] overflow-y-auto">
              <SheetTitle className="px-1 text-base font-semibold">
                Navigation
              </SheetTitle>
              <div className="mt-4 flex flex-col gap-1">
                <p className="px-2 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Categories
                </p>
                {categories.map((category) => (
                  <Button
                    key={category}
                    asChild
                    variant="ghost"
                    className="justify-start"
                    onClick={() => setOpen(false)}
                  >
                    <Link href={`/search?q=${category}`}>{category} tools</Link>
                  </Button>
                ))}
                <div className="my-2 border-t border-border" />
                <Button asChild variant="ghost" className="justify-start" onClick={() => setOpen(false)}>
                  <Link href="/">Home</Link>
                </Button>
                <Button asChild variant="ghost" className="justify-start" onClick={() => setOpen(false)}>
                  <Link href="/blog">Blog</Link>
                </Button>
                <Button asChild variant="ghost" className="justify-start" onClick={() => setOpen(false)}>
                  <Link href="/about">About</Link>
                </Button>
                <Button asChild variant="ghost" className="justify-start" onClick={() => setOpen(false)}>
                  <Link href="/privacy">Privacy Policy</Link>
                </Button>
                <Button asChild variant="ghost" className="justify-start" onClick={() => setOpen(false)}>
                  <Link href="/terms">Terms of Service</Link>
                </Button>
              </div>
              <div className="mt-6 border-t pt-4">
                <p className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  All Tools
                </p>
                <div className="mt-2 flex flex-col gap-1">
                  {TOOLS.map((t) => (
                    <Button
                      key={t.slug}
                      asChild
                      variant="ghost"
                      className="justify-start text-sm"
                      onClick={() => setOpen(false)}
                    >
                      <Link href={`/tools/${t.slug}`}>{t.name}</Link>
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

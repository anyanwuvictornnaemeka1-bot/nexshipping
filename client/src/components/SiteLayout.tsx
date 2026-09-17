import { Link, useLocation } from "wouter";
import { ArrowUpRight, Menu, PackageCheck, Phone, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  ["Services", "/services"],
  ["About", "/about"],
  ["Tracking", "/tracking"],
  ["Insights", "/news"],
] as const;

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-[#122235]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071b2f]/95 text-white shadow-[0_8px_40px_rgba(7,27,47,0.16)] backdrop-blur-xl">
        <div className="container flex h-[76px] items-center justify-between gap-8">
          <Link
            href="/"
            className="group flex items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[#f35b24] shadow-[0_8px_20px_rgba(243,91,36,0.28)] transition-transform group-hover:rotate-[-6deg]">
              <PackageCheck className="size-5" strokeWidth={2.4} />
            </span>
            <span className="font-display text-xl font-bold tracking-[-0.04em]">
              nex<span className="text-[#f35b24]">shipping</span>
            </span>
          </Link>
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Main navigation"
          >
            {navItems.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium text-white/65 transition-colors hover:text-white",
                  location === href && "text-white"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/contact"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Talk to an expert
            </Link>
            <Button
              asChild
              className="h-11 rounded-full bg-[#f35b24] px-5 font-semibold text-white shadow-[0_8px_20px_rgba(243,91,36,0.22)] hover:bg-[#df4d1a]"
            >
              <Link href="/quote">
                Get a quote <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
          <button
            className="grid size-10 place-items-center rounded-xl border border-white/15 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-white/10 bg-[#071b2f] px-5 py-5 lg:hidden">
            <nav
              className="container flex flex-col gap-5"
              aria-label="Mobile navigation"
            >
              {navItems.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-white/80"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/quote"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center rounded-full bg-[#f35b24] px-5 py-3 font-semibold"
              >
                Get a quote <ArrowUpRight className="ml-2 size-4" />
              </Link>
            </nav>
          </div>
        )}
      </header>
      {children}
      <footer className="bg-[#071b2f] text-white">
        <div className="container grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:py-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[#f35b24]">
                <PackageCheck className="size-5" />
              </span>
              <span className="font-display text-xl font-bold tracking-[-0.04em]">
                nex<span className="text-[#f35b24]">shipping</span>
              </span>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-7 text-white/50">
              One connected logistics partner for the world’s most ambitious
              supply chains.
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-white/60">
              <Phone className="size-4 text-[#f35b24]" /> +1 (312) 555-0148
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
              Explore
            </p>
            <div className="mt-5 grid gap-3 text-sm text-white/65">
              <Link href="/services" className="hover:text-white">
                Services
              </Link>
              <Link href="/about" className="hover:text-white">
                About us
              </Link>
              <Link href="/news" className="hover:text-white">
                Insights
              </Link>
              <Link href="/faq" className="hover:text-white">
                FAQ
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
              Work with us
            </p>
            <div className="mt-5 grid gap-3 text-sm text-white/65">
              <Link href="/tracking" className="hover:text-white">
                Track a shipment
              </Link>
              <Link href="/quote" className="hover:text-white">
                Request a quote
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact team
              </Link>
              <Link href="/login" className="hover:text-white">
                Customer portal
              </Link>
              <Link href="/admin" className="hover:text-white">
                Admin portal
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
              Our offices
            </p>
            <p className="mt-5 text-sm leading-7 text-white/65">
              Chicago · Rotterdam
              <br />
              Singapore · Dubai
              <br />
              24 / 7 global support
            </p>
          </div>
        </div>
        <div className="container flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nexshipping Global Logistics.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function SectionEyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-xs font-bold uppercase tracking-[0.24em] text-[#f35b24]",
        light && "text-[#ff8358]"
      )}
    >
      {children}
    </p>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="bg-[#071b2f] px-4 py-20 text-white md:py-28">
      <div className="container max-w-4xl">
        <SectionEyebrow light>{eyebrow}</SectionEyebrow>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}

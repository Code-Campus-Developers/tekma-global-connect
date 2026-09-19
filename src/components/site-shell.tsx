import { Link } from "@tanstack/react-router";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/7-transparent.png";
import { contact, services } from "@/lib/site-data";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Opportunities", "/opportunities"],
  ["Leadership", "/leadership"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-5 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-6 lg:px-8">
        <Link
          to="/"
          aria-label="TEKMA Global Partners home"
          className="flex min-w-0 flex-1 items-center gap-2 max-[390px]:gap-1.5 lg:flex-none"
        >
          <img
            src={logo}
            alt="TEKMA Global Partners Limited"
            width={72}
            height={69}
            className="h-14 w-auto shrink-0 object-contain max-[390px]:h-12 max-[350px]:h-10 lg:h-18"
          />
          <span className="whitespace-nowrap text-base font-extrabold leading-none tracking-[0.04em] text-navy max-[390px]:text-[13px] max-[390px]:tracking-[0.02em] max-[350px]:text-[11px] max-[350px]:tracking-[0.01em] sm:text-xl xl:text-2xl">
            TEKMA GLOBAL PARTNERS
          </span>
        </Link>
        <nav
          aria-label="Primary navigation"
          className="ml-auto hidden h-full min-h-0 items-center justify-center gap-3 pl-8 lg:flex"
        >
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="text-base font-semibold text-foreground/75 transition-colors hover:text-petroleum data-[status=active]:text-petroleum"
          >
            <span className="inline-block origin-center scale-y-110">Home</span>
          </Link>
          <Link
            to="/about"
            className="text-base font-semibold text-foreground/75 transition-colors hover:text-petroleum data-[status=active]:text-petroleum"
          >
            <span className="inline-block origin-center scale-y-110">About</span>
          </Link>
          <div className="group relative flex h-full items-center">
            <button
              className="flex min-h-11 items-center gap-1 text-base font-semibold text-foreground/75 transition-colors hover:text-petroleum"
              aria-haspopup="true"
            >
              <span className="inline-block origin-center scale-y-110">Services</span>
              <ChevronDown className="size-4" />
            </button>
            <div className="invisible absolute left-1/2 top-full w-[560px] -translate-x-1/2 border-t-2 border-gold bg-background p-5 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-petroleum">
                Our capabilities
              </p>
              <div className="grid grid-cols-2 gap-1">
                {services.map((s) => (
                  <Link
                    key={s.href}
                    to={s.href}
                    className="border-l-2 border-transparent p-3 text-sm font-semibold hover:border-ocean hover:bg-surface"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link
            to="/opportunities"
            className="text-base font-semibold text-foreground/75 transition-colors hover:text-petroleum data-[status=active]:text-petroleum"
          >
            <span className="inline-block origin-center scale-y-110">Opportunities</span>
          </Link>
          <Link
            to="/leadership"
            className="text-base font-semibold text-foreground/75 transition-colors hover:text-petroleum data-[status=active]:text-petroleum"
          >
            <span className="inline-block origin-center scale-y-110">Leadership</span>
          </Link>
          <Link
            to="/contact"
            className="text-base font-semibold text-foreground/75 transition-colors hover:text-petroleum data-[status=active]:text-petroleum"
          >
            <span className="inline-block origin-center scale-y-110">Contact</span>
          </Link>
        </nav>
        <Button
          asChild
          className="hidden min-h-11 whitespace-nowrap rounded-none bg-navy px-4 text-xs font-bold uppercase tracking-[0.12em] hover:bg-petroleum lg:inline-flex"
        >
          <Link to="/opportunities">Discuss an opportunity</Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="min-h-11 min-w-11 shrink-0 lg:hidden"
        >
          <Menu />
        </Button>
      </div>
      {open && (
        <div className="fixed inset-0 z-[60] min-h-dvh overflow-y-auto bg-navy text-primary-foreground lg:hidden">
          <div className="flex items-center justify-between gap-4 border-b border-primary-foreground/15 p-5 max-[390px]:gap-2 max-[390px]:px-4">
            <div className="flex min-w-0 items-center gap-2 max-[390px]:gap-1.5">
              <img
                src={logo}
                alt="TEKMA Global Partners Limited"
                className="h-14 w-auto shrink-0 max-[390px]:h-10 max-[350px]:h-9"
                width={72}
                height={69}
              />
              <span className="whitespace-nowrap text-lg font-extrabold leading-none tracking-[0.04em] text-white max-[390px]:text-[13px] max-[390px]:tracking-[0.02em] max-[350px]:text-[11px] max-[350px]:tracking-[0.01em] sm:text-2xl">
                TEKMA GLOBAL PARTNERS
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="min-h-11 min-w-11 shrink-0 text-primary-foreground"
            >
              <X />
            </Button>
          </div>
          <nav aria-label="Mobile navigation" className="p-6">
            <div className="flex flex-col">
              {links.map(([label, to]) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="border-b border-primary-foreground/15 py-4 text-2xl font-bold"
                >
                  {label}
                </Link>
              ))}
            </div>
            <p className="mb-2 mt-7 text-xs font-bold uppercase tracking-[0.18em] text-gold">
              Services
            </p>
            {services.map((s) => (
              <Link
                key={s.href}
                to={s.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-base text-primary-foreground/80"
              >
                {s.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 border-b border-primary-foreground/15 pb-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <img
                src={logo}
                alt="TEKMA Global Partners Limited"
                className="h-24 w-auto shrink-0"
                width={100}
                height={96}
              />
              <span className="text-base font-extrabold leading-tight tracking-[0.04em] text-white sm:text-lg">
                TEKMA GLOBAL PARTNERS
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-primary-foreground/70">
              Global brokerage and consultancy across energy, assets, maritime and commercial real
              estate.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Navigate</h2>
            <div className="mt-5 grid gap-3 text-sm">
              {links.slice(1).map(([label, to]) => (
                <Link
                  key={to}
                  to={to}
                  className="text-primary-foreground/75 hover:text-primary-foreground"
                >
                  {label}
                </Link>
              ))}
              <Link to="/privacy" className="text-primary-foreground/75">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/75">
                Terms of Use
              </Link>
            </div>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Abuja</h2>
            <address className="mt-5 not-italic text-sm leading-7 text-primary-foreground/75">
              {contact.address}
            </address>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="mt-3 flex items-center gap-2 text-sm"
            >
              <Phone className="size-4 text-energy" />
              {contact.phone}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="mt-3 flex items-center gap-2 break-all text-sm"
            >
              <Mail className="size-4 text-magenta" />
              {contact.email}
            </a>
          </div>
        </div>
        <div className="pt-7 text-center text-xs text-primary-foreground/55">
          © {new Date().getFullYear()} Tekma Global Partners Limited. All Rights Reserved.
          <p className="mt-2">
            Designed by{" "}
            <a
              href="https://codecampus.com.ng/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-foreground/75 transition-colors hover:text-primary-foreground"
            >
              Code Campus
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

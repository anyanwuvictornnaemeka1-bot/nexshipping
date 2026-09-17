import { ArrowRight, LockKeyhole, PackageCheck, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

export default function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#071b2f] text-white">
        <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-[#ff8358]" />
      </main>
    );
  }

  if (user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#071b2f] px-5 text-white">
        <div className="max-w-md text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f35b24]">
            <PackageCheck className="size-7" />
          </div>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#ff8358]">
            You’re signed in
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">
            Welcome back, {user.name?.split(" ")[0] ?? "there"}.
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/55">
            Open your customer portal to review shipments, quote requests, and the latest updates from our operations team.
          </p>
          <Button asChild className="mt-8 rounded-full bg-[#f35b24] text-white hover:bg-[#df4d1a]">
            <Link href="/dashboard">
              Open customer portal <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen bg-[#071b2f] text-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden border-r border-white/10 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(243,91,36,0.2),transparent_35%)]" />
        <Link href="/" className="relative flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#f35b24]">
            <PackageCheck className="size-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-[-0.04em]">
            nex<span className="text-[#f35b24]">shipping</span>
          </span>
        </Link>
        <div className="relative max-w-lg">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff8358]">Customer portal</p>
          <h1 className="mt-5 font-display text-6xl font-semibold leading-[0.98] tracking-[-0.06em]">
            Your cargo, clearly accounted for.
          </h1>
          <p className="mt-7 max-w-md text-base leading-8 text-white/55">
            One secure place to follow every handoff, revisit quote requests, and stay close to the work moving your business forward.
          </p>
        </div>
        <p className="relative text-xs uppercase tracking-[0.16em] text-white/35">Nexshipping Global Logistics</p>
      </section>

      <section className="grid place-items-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-[#f35b24]">
              <PackageCheck className="size-5" />
            </span>
            <span className="font-display text-xl font-bold tracking-[-0.04em]">
              nex<span className="text-[#f35b24]">shipping</span>
            </span>
          </Link>
          <div className="mt-14 lg:mt-0">
            <div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-[#ff8358]">
              <LockKeyhole className="size-5" />
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#ff8358]">Secure access</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em]">Sign in to your portal.</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">
              Use your authorized Nexshipping account to view your private shipment and quote information.
            </p>
            <Button onClick={startLogin} className="mt-8 h-13 w-full rounded-full bg-[#f35b24] text-white hover:bg-[#df4d1a]">
              Continue to sign in <ArrowRight className="size-4" />
            </Button>
            <div className="mt-8 flex items-start gap-3 border-t border-white/10 pt-6 text-xs leading-6 text-white/45">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#ff8358]" />
              <span>Authentication is handled by Nexshipping’s secure account provider. We never store your password on this site.</span>
            </div>
            <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/55 hover:text-white">
              Return to public site <ArrowRight className="size-4 rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthTabs } from "@/components/auth/AuthTabs";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff_20%,_#f1f5f9_90%)] flex items-center justify-center p-6">
      <div className="mx-auto max-w-5xl w-full grid gap-12 md:grid-cols-2 items-center">
        {/* LEFT — MINIMAL MODERN HERO */}
        <section className="space-y-6 pl-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Built for small shops
          </div>

          <h1 className="text-2xl md:text-4xl font-bold leading-tight text-slate-900 tracking-tight">
            Fast Billing.
            <span className="text-emerald-600">Zero Complexity.</span>
          </h1>

          <p className="text-slate-600 text-base max-w-md leading-relaxed">
            A clean, simple POS system designed to help you bill faster, track
            sales in real-time, and manage inventory effortlessly.
          </p>

          {/* Feature bullets — modern, minimal */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            {[
              "1-Tap Billing",
              "Live Sales View",
              "Smart Inventory",
              "Staff Roles",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-lg border border-slate-200"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT — PREMIUM LOGIN CARD */}
        <section className="flex justify-center">
          <Card className="w-full max-w-md border border-slate-200 rounded-2xl shadow-sm bg-white/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                Welcome back 👋
              </CardTitle>
              <p className="text-sm text-slate-500">
                Sign in to continue to your dashboard
              </p>
            </CardHeader>

            <CardContent className="pt-4">
              <AuthTabs />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

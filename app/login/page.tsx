import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthTabs } from "@/components/auth/AuthTabs";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border bg-card p-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">
              Designed for small shops
            </span>
          </div>
          <h1 className="mb-2 text-pretty text-3xl font-semibold">
            Bill faster. Sell smarter.
          </h1>
          <p className="mb-6 text-muted-foreground">
            Create bills in seconds, track sales live, and manage products
            effortlessly on mobile and desktop.
          </p>

          <ul className="mb-6 grid gap-2 md:grid-cols-2">
            <li className="rounded-lg border bg-background px-3 py-2 text-sm">
              Quick checkout
            </li>
            <li className="rounded-lg border bg-background px-3 py-2 text-sm">
              Live sales
            </li>
            <li className="rounded-lg border bg-background px-3 py-2 text-sm">
              Inventory
            </li>
            <li className="rounded-lg border bg-background px-3 py-2 text-sm">
              Staff accounts
            </li>
          </ul>

          {/* <div className="rounded-xl border bg-background p-4">
            <Image
              src="/images/auth-screens.png"
              alt="Example authentication card design"
              className="h-auto w-full rounded-lg"
            />
          </div> */}

          <p className="mt-4 inline-flex items-center gap-2 rounded-lg border bg-emerald-500/10 px-3 py-2 text-xs">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            {"Your data is encrypted and backed up automatically."}
          </p>
        </section>

        <section>
          <Card className="overflow-hidden">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <p className="text-sm text-muted-foreground">
                Login or create an account to continue
              </p>
            </CardHeader>
            <CardContent>
              <AuthTabs />
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

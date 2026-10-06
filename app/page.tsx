import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50">
      {/* HERO */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2 lg:px-8 lg:py-24">
          {/* LEFT */}

          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Welcome to MarketStore
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Everything You Need,
              <span className="mt-2 block text-blue-600">
                All in One Store.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg md:mx-0">
              Discover quality products, explore great prices and enjoy a
              simple, secure and convenient shopping experience.
            </p>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-md"
              >
                Shop Now
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:bg-slate-50"
              >
                Explore Products
              </Link>
            </div>

            {/* SMALL FEATURES */}

            <div className="mt-10 grid grid-cols-3 gap-3 sm:max-w-lg">
              <div className="rounded-xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <p className="text-lg font-bold text-slate-900">Fast</p>

                <p className="mt-1 text-xs text-slate-500">Shopping</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <p className="text-lg font-bold text-slate-900">Easy</p>

                <p className="mt-1 text-xs text-slate-500">Checkout</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <p className="text-lg font-bold text-slate-900">Secure</p>

                <p className="mt-1 text-xs text-slate-500">Orders</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="mx-auto w-full max-w-lg">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl sm:p-6">
              {/* HEADER */}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    MarketStore
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                    Featured Shopping
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
                  🛍️
                </div>
              </div>

              {/* VISUAL */}

              <div className="mt-5 flex min-h-[260px] items-center justify-center rounded-2xl bg-slate-100 p-6 sm:min-h-[310px]">
                <div className="group flex h-48 w-40 items-center justify-center rounded-3xl bg-slate-900 shadow-xl transition-transform duration-500 hover:scale-105 sm:h-60 sm:w-48">
                  <div className="text-center">
                    <div className="text-5xl transition-transform duration-300 group-hover:scale-110 sm:text-6xl">
                      🛒
                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-300">
                      Quality Products
                    </p>
                  </div>
                </div>
              </div>

              {/* MINI CARDS */}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-blue-50 p-4 transition duration-300 hover:-translate-y-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                    ✓
                  </div>

                  <p className="mt-3 text-sm font-bold text-slate-900">
                    Quality Products
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Complete product details
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-4 transition duration-300 hover:-translate-y-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-white">
                    ⚡
                  </div>

                  <p className="mt-3 text-sm font-bold text-slate-900">
                    Quick Checkout
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Simple ordering process
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Why MarketStore?
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Simple and reliable shopping
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
              Everything you need for an easy online shopping experience.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🛍️",
                title: "Quality Products",
                text: "View complete product details and multiple images.",
              },
              {
                icon: "🛒",
                title: "Easy Cart",
                text: "Add products and manage quantities easily.",
              },
              {
                icon: "⚡",
                title: "Quick Checkout",
                text: "Complete your order in a few simple steps.",
              },
              {
                icon: "📦",
                title: "Order Tracking",
                text: "View your orders and check their status.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-slate-900 px-6 py-10 text-center sm:px-10 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Start Shopping
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Find something you’ll love.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Explore our available products and enjoy a smooth shopping
            experience.
          </p>

          <Link
            href="/products"
            className="group mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500"
          >
            View Products
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

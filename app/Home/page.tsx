// import Link from "next/link";

// export default function HomePage() {
//   return (
//     <main className="min-h-screen overflow-hidden bg-[#f8f9ff]">
//       {/* ==================================================
//           HERO
//       ================================================== */}

//       <section className="relative overflow-hidden">
//         {/* BACKGROUND DECORATION */}

//         <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl" />

//         <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-pink-300/30 blur-3xl" />

//         <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

//         <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2 lg:px-8 lg:py-28">
//           {/* LEFT */}

//           <div className="text-center md:text-left">
//             {/* BADGE */}

//             <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
//               <span className="h-2 w-2 animate-pulse rounded-full bg-violet-600" />

//               <span className="text-xs font-semibold tracking-wide text-violet-700 sm:text-sm">
//                 Discover • Shop • Enjoy
//               </span>
//             </div>

//             {/* HEADING */}

//             <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-7xl">
//               Everything you love,
//               <span className="mt-2 block bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
//                 all in one store.
//               </span>
//             </h1>

//             {/* DESCRIPTION */}

//             <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg md:mx-0">
//               Explore quality products, great prices and a simple shopping
//               experience designed to make every purchase easy.
//             </p>

//             {/* BUTTONS */}

//             <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
//               <Link
//                 href="/products"
//                 className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/30 sm:w-auto sm:text-base"
//               >
//                 Shop Now
//                 <span className="transition-transform duration-300 group-hover:translate-x-1">
//                   →
//                 </span>
//               </Link>

//               <Link
//                 href="/products"
//                 className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:text-violet-700 hover:shadow-lg sm:w-auto sm:text-base"
//               >
//                 Explore Products
//               </Link>
//             </div>

//             {/* MINI STATS */}

//             <div className="mt-10 grid grid-cols-3 gap-3 sm:max-w-lg">
//               <div>
//                 <p className="text-xl font-black text-slate-900 sm:text-2xl">
//                   Fast
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">Shopping</p>
//               </div>

//               <div className="border-x border-slate-200">
//                 <p className="text-xl font-black text-slate-900 sm:text-2xl">
//                   Easy
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">Checkout</p>
//               </div>

//               <div>
//                 <p className="text-xl font-black text-slate-900 sm:text-2xl">
//                   Secure
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">Orders</p>
//               </div>
//             </div>
//           </div>

//           {/* ==================================================
//               RIGHT HERO VISUAL
//           ================================================== */}

//           <div className="relative mx-auto w-full max-w-lg">
//             {/* MAIN CARD */}

//             <div className="relative rotate-1 rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-2xl shadow-purple-500/10 backdrop-blur-xl transition-all duration-500 hover:rotate-0 hover:-translate-y-2 hover:shadow-purple-500/20 sm:p-6">
//               {/* TOP */}

//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-widest text-violet-500">
//                     MarketStore
//                   </p>

//                   <h2 className="mt-1 text-xl font-black text-slate-900">
//                     Featured Collection
//                   </h2>
//                 </div>

//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 text-lg text-white shadow-lg">
//                   ✦
//                 </div>
//               </div>

//               {/* PRODUCT VISUAL */}

//               <div className="relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 p-6">
//                 <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-purple-300/40 blur-2xl" />

//                 <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-pink-300/40 blur-2xl" />

//                 <div className="relative flex min-h-[260px] items-center justify-center sm:min-h-[320px]">
//                   <div className="relative flex h-52 w-44 items-center justify-center rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-700 shadow-2xl transition duration-500 hover:scale-105 sm:h-64 sm:w-52">
//                     <div className="absolute left-5 top-5 h-16 w-16 rounded-full bg-violet-500/40 blur-xl" />

//                     <div className="text-center text-white">
//                       <div className="text-5xl sm:text-6xl">🛍️</div>

//                       <p className="mt-4 text-sm font-semibold text-slate-300">
//                         Premium Picks
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* FLOAT CARD */}

//                 <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
//                   <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                     Starting from
//                   </p>

//                   <p className="mt-1 text-lg font-black text-slate-900">
//                     PKR 999
//                   </p>
//                 </div>

//                 <div className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow">
//                   New
//                 </div>
//               </div>

//               {/* BOTTOM */}

//               <div className="mt-5 grid grid-cols-2 gap-3">
//                 <div className="rounded-2xl bg-violet-50 p-4 transition duration-300 hover:-translate-y-1 hover:bg-violet-100">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
//                     ✓
//                   </div>

//                   <p className="mt-3 text-sm font-bold text-slate-900">
//                     Quality Products
//                   </p>

//                   <p className="mt-1 text-xs leading-5 text-slate-500">
//                     Carefully listed products
//                   </p>
//                 </div>

//                 <div className="rounded-2xl bg-pink-50 p-4 transition duration-300 hover:-translate-y-1 hover:bg-pink-100">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500 text-white">
//                     ⚡
//                   </div>

//                   <p className="mt-3 text-sm font-bold text-slate-900">
//                     Quick Orders
//                   </p>

//                   <p className="mt-1 text-xs leading-5 text-slate-500">
//                     Smooth checkout experience
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ==================================================
//           FEATURES
//       ================================================== */}

//       <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
//         <div className="mx-auto max-w-7xl">
//           {/* SECTION HEADER */}

//           <div className="mx-auto max-w-2xl text-center">
//             <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
//               Why MarketStore?
//             </p>

//             <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
//               Shopping made simple.
//             </h2>

//             <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
//               Everything you need for a smooth online shopping experience.
//             </p>
//           </div>

//           {/* CARDS */}

//           <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
//             <div className="group rounded-2xl border border-violet-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-xl transition duration-300 group-hover:scale-110 group-hover:bg-violet-600">
//                 🛍️
//               </div>

//               <h3 className="mt-5 font-bold text-slate-900">
//                 Quality Products
//               </h3>

//               <p className="mt-2 text-sm leading-6 text-slate-500">
//                 Browse complete product information, prices and multiple images.
//               </p>
//             </div>

//             <div className="group rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl transition duration-300 group-hover:scale-110 group-hover:bg-blue-500">
//                 🛒
//               </div>

//               <h3 className="mt-5 font-bold text-slate-900">Smart Cart</h3>

//               <p className="mt-2 text-sm leading-6 text-slate-500">
//                 Add products, manage quantities and review your cart with ease.
//               </p>
//             </div>

//             <div className="group rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-100">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-xl transition duration-300 group-hover:scale-110 group-hover:bg-pink-500">
//                 ⚡
//               </div>

//               <h3 className="mt-5 font-bold text-slate-900">Quick Checkout</h3>

//               <p className="mt-2 text-sm leading-6 text-slate-500">
//                 Move from product selection to checkout in just a few clicks.
//               </p>
//             </div>

//             <div className="group rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl transition duration-300 group-hover:scale-110 group-hover:bg-emerald-500">
//                 📦
//               </div>

//               <h3 className="mt-5 font-bold text-slate-900">Order Tracking</h3>

//               <p className="mt-2 text-sm leading-6 text-slate-500">
//                 Check your orders and stay updated with their current status.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ==================================================
//           CTA
//       ================================================== */}

//       <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
//         <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-700 via-purple-700 to-pink-600 px-6 py-12 shadow-2xl shadow-violet-500/20 sm:px-10 sm:py-16 lg:px-16">
//           <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

//           <div className="absolute -bottom-20 left-20 h-64 w-64 rounded-full bg-pink-300/20 blur-3xl" />

//           <div className="relative flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
//             <div>
//               <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-200">
//                 Start Shopping
//               </p>

//               <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
//                 Find something you’ll love.
//               </h2>

//               <p className="mt-3 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
//                 Explore our products and enjoy a fast, simple and modern
//                 shopping experience.
//               </p>
//             </div>

//             <Link
//               href="/products"
//               className="group inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-violet-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl"
//             >
//               View Products
//               <span className="transition-transform duration-300 group-hover:translate-x-1">
//                 →
//               </span>
//             </Link>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

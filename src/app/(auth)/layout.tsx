export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-gray-950">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-8 flex items-center gap-3">
              <img src="/amcmep-one-icon.png" alt="AMC MEP 24x7" className="h-12 w-12 rounded-2xl shadow-sm" />
              <div>
                <p className="text-sm font-semibold text-blue-700">AMC MEP 24x7 One</p>
                <h1 className="text-xl font-black tracking-tight text-slate-950">Service, AMC, and support workspace</h1>
              </div>
            </div>
            <h2 className="text-5xl font-black leading-[1.04] tracking-tight text-slate-950">
              Keep every service request, AMC update, and chat in one clean workspace.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Continue with your email account or approve this web login from the verified mobile app using QR.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {["Requests", "AMC", "Chats"].map((item) => (
                <div key={item} className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
                  <p className="text-sm font-bold text-slate-900">{item}</p>
                  <p className="mt-1 text-xs text-slate-500">Live from your account</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="mx-auto w-full max-w-[440px]">
          {children}
        </div>
      </div>
    </div>
  );
}

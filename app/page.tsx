import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold">Welcome to Stytch RBAC Example</h1>
          <p className="text-xl font-semibold mt-10">
            This example demonstrates how to use Stytch's RBAC features to build
            a simple organization dashboard.
          </p>
          <p className="text-xl font-semibold">
            To get started, <a href="/login" className="text-blue-800">sign up</a> and create an
            organization.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/stytch-logo.svg"
            alt="Stytch Logo"
            width={200}
            height={200}
          />
        </div>
      </div>
    </main>
  );
}

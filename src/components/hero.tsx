import Image from "next/image";

export function Hero() {
  return (
    <>
      <div className="flex items-center gap-1 mt-3 mb-2">
        <Image
          src="/images/icon.png"
          alt="ADHD Task Manager"
          width={56}
          height={56}
          priority
        />
        <h1 className="text-3xl font-bold text-gray-100 text-center font-heading">
          ADHD Task Manager
        </h1>
      </div>
      <p className="text-gray-100 mb-8 text-center">Unf*ck your brain.</p>
    </>
  );
}

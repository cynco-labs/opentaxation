import { ReactNode } from 'react';

interface YearEndLayoutProps {
  children: ReactNode;
}

export default function YearEndLayout({ children }: YearEndLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
}

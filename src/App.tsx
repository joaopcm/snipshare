import { Analytics } from "@vercel/analytics/react";

export function App() {
  return (
    <>
      <Analytics />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>;
    </>
  );
}

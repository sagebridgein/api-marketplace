import Marketplace from "@/components/marketplace";
export default async function Home() {
  return (
    <>
      <main className="flex flex-col gap-6 w-full">
        <Marketplace/>
      </main>
    </>
  );
}

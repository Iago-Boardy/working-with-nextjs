import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="">
      <Sidebar />
      
      <div className="flex justify-center my-6 flex-grow">{children}</div>
    </div>
  );
}

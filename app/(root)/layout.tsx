import { Nav } from "@/components/Nav";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Nav />
      {children}
    </main>
  );
};

export default Layout;

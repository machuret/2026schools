import InnerNav from "@/components/InnerNav";
import Footer from "@/components/Footer";

export default function InnerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <InnerNav backHref="/" backLabel="Home" />
      {children}
      <Footer />
    </>
  );
}

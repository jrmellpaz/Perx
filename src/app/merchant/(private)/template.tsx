export default function MerchantTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>Navbar</nav>
      {children}
    </div>
  );
}

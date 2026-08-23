export default function Footer() {
  return (
    <footer className="py-12 border-t border-line">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink/50">
        <span className="font-display font-semibold text-ink">FREZORA</span>
        <p>Frezora is operated by Elbra Solutions BV.</p>
        <a href="mailto:frezora.support@gmail.com" className="hover:text-ink">
          frezora.support@gmail.com
        </a>
      </div>
    </footer>
  );
}

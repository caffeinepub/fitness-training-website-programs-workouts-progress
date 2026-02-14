import { SiCoffeescript } from 'react-icons/si';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'certificate-app'
  );

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} MD SUHEL. All rights reserved.</p>
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            Built with <SiCoffeescript className="h-4 w-4 text-primary" /> using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

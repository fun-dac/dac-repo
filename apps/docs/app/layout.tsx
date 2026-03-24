import { RootProvider } from 'fumadocs-ui/provider/next';

import './global.css';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <html suppressHydrationWarning lang="en">
    <body className="flex min-h-screen flex-col">
      <RootProvider>{children}</RootProvider>
    </body>
  </html>
);

export default Layout;

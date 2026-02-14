import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import ResidentialCertificateApplicationPage from './pages/ResidentialCertificateApplicationPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import Header from './components/Header';
import Footer from './components/Footer';

// Layout component with Header and Footer
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Define routes
const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ResidentialCertificateApplicationPage,
});

const myApplicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-applications',
  component: MyApplicationsPage,
});

const applicationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/application/$applicationNumber',
  component: ApplicationDetailPage,
});

// Create router
const routeTree = rootRoute.addChildren([
  indexRoute,
  myApplicationsRoute,
  applicationDetailRoute,
]);

const router = createRouter({ routeTree, defaultPreload: 'intent' });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

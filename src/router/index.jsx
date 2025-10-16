import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layout
const Layout = lazy(() => import("@/components/organisms/Layout"));

// Pages
const Home = lazy(() => import("@/components/pages/Home"));
const ProductDetail = lazy(() => import("@/components/pages/ProductDetail"));
const Cart = lazy(() => import("@/components/pages/Cart"));
const Checkout = lazy(() => import("@/components/pages/Checkout"));
const OrderConfirmation = lazy(() => import("@/components/pages/OrderConfirmation"));
const OrderHistory = lazy(() => import("@/components/pages/OrderHistory"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div>Loading.....</div>}>
    {children}
  </Suspense>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: <SuspenseWrapper><Home /></SuspenseWrapper>
  },
  {
    path: "product/:id",
    element: <SuspenseWrapper><ProductDetail /></SuspenseWrapper>
  },
  {
    path: "cart",
    element: <SuspenseWrapper><Cart /></SuspenseWrapper>
  },
  {
    path: "checkout", 
    element: <SuspenseWrapper><Checkout /></SuspenseWrapper>
  },
  {
    path: "order-confirmation/:orderId",
    element: <SuspenseWrapper><OrderConfirmation /></SuspenseWrapper>
},
  {
    path: "orders",
    element: <Suspense fallback={<div>Loading.....</div>}><OrderHistory /></Suspense>
  },
  {
    path: "*",
    element: <SuspenseWrapper><NotFound /></SuspenseWrapper>
  }
];

const routes = [
  {
    path: "/",
    element: <SuspenseWrapper><Layout /></SuspenseWrapper>,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);
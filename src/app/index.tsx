import { AppProvider } from "./provider";
import { AppRouter } from "./router";
import { Toaster } from "@/components/ui/sonner";

export const App = () => (
  <AppProvider>
    <AppRouter />
    <Toaster />
  </AppProvider>
);

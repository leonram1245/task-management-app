import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/DashboardPage";
import { Toaster } from "./components/ui/toaster";
import { ProtectedRoute } from "./components/ProtectedRoute";

const system = createSystem(defaultConfig, { theme: { tokens: {} } });

const App = () => (
  <ChakraProvider value={system}>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);

export default App;

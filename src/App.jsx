import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Pages
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { ProductDetails } from "./pages/ProductDetails";
import { Featured } from "./pages/Featured";
import { Categories } from "./pages/Categories";
import { Category } from "./pages/Category";
import { Search } from "./pages/Search";
import { Stores } from "./pages/Stores";
import { StorePage } from "./pages/StorePage";
import { Download } from "./pages/Download";
import { OpenProduct } from "./pages/OpenProduct";
import { Privacy } from "./pages/Privacy";
import { Contact } from "./pages/Contact";
import { About } from "./pages/About";
import { NotFound } from "./pages/NotFound";

const scrollPositions = new Map();
const MAX_RESTORE_FRAMES = 12;

/** New pages start at the top; Back returns to where you were. */
function ScrollManager() {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    const save = () => scrollPositions.set(key, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [key]);

  useLayoutEffect(() => {
    const pathChanged = previousPath.current !== pathname;
    previousPath.current = pathname;
    const saved = navigationType === "POP" ? scrollPositions.get(key) : undefined;

    if (saved === undefined) {
      if (pathChanged) window.scrollTo({ top: 0, behavior: "instant" });
      return undefined;
    }

    // The page may need a few frames to grow back to its old height.
    let frames = 0;
    let handle = 0;
    const restore = () => {
      window.scrollTo({ top: saved, behavior: "instant" });
      frames += 1;
      if (Math.abs(window.scrollY - saved) > 2 && frames < MAX_RESTORE_FRAMES) {
        handle = requestAnimationFrame(restore);
      }
    };
    restore();
    return () => cancelAnimationFrame(handle);
  }, [key, pathname, navigationType]);

  return null;
}

export function App() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/featured" element={<Featured />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<Category />} />
          <Route path="/search" element={<Search />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/stores/:id" element={<StorePage />} />
          <Route path="/download" element={<Download />} />
          <Route path="/open/product/:id" element={<OpenProduct />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;

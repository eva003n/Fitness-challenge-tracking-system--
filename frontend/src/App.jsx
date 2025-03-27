import { Routes, Route, NavLink } from "react-router-dom";
import RoutePaths from "./RoutePaths.jsx";

import Header from "./components/common/header";

import { useAuth } from "./context/authProvider";
import SideBar from "./components/common/Sidebar.jsx";
import { useEffect, useState } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuth();
  // const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    // const { user } = useAuth();
    const _isOpen = JSON.parse(localStorage.getItem("isOpen"));
    setIsOpen(_isOpen);
  }, []);

  return (
    <main className="fixed inset-0 z-50 flex bg-white dark:bg-gray-950">
      {user && <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />}
      <div className="scrollbar-custom grow overflow-x-auto">
        <Header />
        <div className="mx-auto h-full">
          <RoutePaths />
        </div>
      </div>
    </main>
  );
}

export default App;

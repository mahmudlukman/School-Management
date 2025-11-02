import { Outlet, useLocation } from "react-router-dom";
import SideMenu from "./SideMenu";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "../../@types";

const MainLayout = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Extract the first segment of the path, defaulting to "dashboard"
  const path = location.pathname.split("/")[1] || "dashboard";
  const activeMenu = path.charAt(0).toUpperCase() + path.slice(1).toLowerCase();

  return (
    <div>
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow mx-5">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;

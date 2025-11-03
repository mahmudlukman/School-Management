import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../@types";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import { MENU_DATA, MENU_SECTIONS } from "../../utils/data";
import { getInitials } from "../../utils/helper";


const SideMenu = ({ activeMenu }: { activeMenu: string }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [groupedMenuData, setGroupedMenuData] = useState<
    {
      title: string;
      items: { id: string; label: string; icon: IconType; path: string }[];
    }[]
  >([]);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();

  const handleClick = (route: string) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    if (user) {
      // Filter menu items based on user role
      const filteredMenu = MENU_DATA.filter((item) =>
        item.visible.includes(user.role)
      );

      // Group filtered menu by sections
      const grouped = MENU_SECTIONS.map((section) => ({
        title: section.title,
        items: filteredMenu.filter((item) =>
          section.items.includes(item.label)
        ),
      })).filter((section) => section.items.length > 0);

      setGroupedMenuData(grouped);
    }
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20 overflow-y-auto">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white font-semibold cursor-pointer">
            {getInitials(user?.name || user?.email)}
          </div>
        </div>
        <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1 capitalize">
          {user?.role?.replace("_", " ")}
        </div>
        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || user?.email}
        </h5>
        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {groupedMenuData.map((section, sectionIndex) => (
        <div key={`section_${sectionIndex}`} className="mb-4">
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase px-6 mb-2">
            {section.title}
          </h3>
          {section.items.map((item, index) => (
            <button
              key={`menu_${index}`}
              className={`w-full flex items-center gap-4 text-[15px] ${
                activeMenu === item.label
                  ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
                  : ""
              } py-3 px-6 mb-3 cursor-pointer relative`}
              onClick={() => handleClick(item.path)}
              disabled={item.path === "logout" && isLoggingOut}
            >
              <item.icon className="text-xl" />
              <span>
                {item.path === "logout" && isLoggingOut
                  ? "Logging out..."
                  : item.label}
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SideMenu;

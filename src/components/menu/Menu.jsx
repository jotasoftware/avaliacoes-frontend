import { NavLink } from "react-router-dom";
import { useState } from "react";
import { MdFolder, MdHome, MdInfo } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAvaliacao } from "../../context/AvaliacaoContext";

const Menu = () => {
  const { logout } = useAuth();
  const {avaliacoes} = useAvaliacao();
  const navigate = useNavigate();
  const menuItems = [
    { name: "Home", path: "/"},
    { name: "Pendentes", path: "/pendentes" },
    { name: "Ferramentas", path: "/ferramentas" },
    // { name: "Matriculas", path: "/matriculas" }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const sair = ()=>{
    logout();
    navigate('/login', { replace: true});
  }

  return (
    <nav className="flex flex-col gap-1 bg-transparent">
    <div className="flex-1 flex flex-row gap-2">
    {menuItems.map((item, index) => (
          <div key={item.name} className="group flex items-center">
            <div className="flex items-center justify-between">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `text-base px-4 flex items-center gap-2 transition relative
                ${isActive ? "text-gray-800" : "text-gray-600 hover:text-gray-800"}`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}

                  <span
                    className={`absolute left-2 right-2 -bottom-1 h-[2px] rounded-full transition-all
                    ${isActive ? "bg-indigo-800 opacity-100" : "opacity-0"}`}
                  />
                </>
              )}
            </NavLink>
            </div>
          </div>
        ))}
    </div>

  {/* <div className="mt-auto flex gap-1 justify-center">
    <button
      onClick={sair}
      className="px-4 py-2 rounded-md text-gray-700 hover:bg-zinc-100 flex-1 flex items-center gap-2 justify-center"
    >
      <IoExit />
    </button>
  </div> */}
</nav>

  );
};

export default Menu;

import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import FiltroAvaliacoes from "../../components/filtroAvaliacoes/FiltroAvaliacoes";
import Menu from "../../components/menu/Menu";

const MainLayout = () => {

    return (
        <div className="h-screen w-screen flex flex-col white bg-zinc-100 ">
            <div className="flex flex-row px-4 py-2 border-b border-zinc-200 justify-between">
                <div className="flex gap-8">
                    <div>
                        <img src="AvaliacoesLogo.png" alt="" width={100} height={55}/>
                    </div>
                    <Menu />
                </div>
                <div className="flex justify-end">
                    <FiltroAvaliacoes />
                </div>
            </div>
                
            <main className="flex-1 flex flex-col p-4">
                <div className="flex-1 overflow-auto pt-[15px]">
                <Outlet />
                </div>
            </main>

        </div>


    );
};

export default MainLayout;

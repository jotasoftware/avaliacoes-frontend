import React, { useState } from 'react'
import { PiSidebarFill } from "react-icons/pi";
import { useSidebar } from '../../context/SidebarContext';
import CampoBusca from '../campoBusca/CampoBusca';
import { Link } from 'react-router';

const PageHeader = () => {
  const [open, setOpen] = useState(false);
  const {toggleSidebar} = useSidebar();

  return (
      <div className="h-[62px] w-full flex items-center text-white justify-between pb-[16px] border-b">
        <div className='flex items-center gap-4'>
          <button
            onClick={toggleSidebar}
            className="text-white p-2 rounded hover:bg-blue-500/40 transition-colors duration-300"
          >
            <PiSidebarFill size={24} fill="Black"></PiSidebarFill>
          </button>
          <div className="text-black flex gap-1">
            {breadcrumb.map((item, index) => (
              <span key={item.path} className="flex items-center gap-1">
                {index < breadcrumb.length - 1 ? <Link to={item.path}className="text-base text-black hover:text-blue-600 hover:underline cursor-pointer">{item.name}</Link> : item.name}
                {index < breadcrumb.length - 1 && <span className="mx-1">/</span>}
              </span>
            ))}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <CampoBusca breadcrumb={breadcrumb}></CampoBusca>
        </div>
      </div>
  )
}

export default PageHeader
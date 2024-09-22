'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, History, HomeIcon, Menu, PackageSearch, Settings, ShoppingCart, UserPlus, LogIn } from "lucide-react";
import { Hind } from "next/font/google";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from 'next/navigation'; // Hook para acessar a URL atual

const hind = Hind({ weight: '300', subsets: ["latin"] });

interface MenuItem {
  link: string;
  icon: React.ReactNode;
  text: string;
}

const menuList: MenuItem[] = [
  { link: "/", icon: <HomeIcon className="w-6 h-6" />, text: "Início" },
  { link: "/products", icon: <PackageSearch className="w-6 h-6" />, text: "Produtos" },
  { link: "/products/favorites", icon: <Heart className="w-6 h-6" />, text: "Favoritos" },
  { link: "/carrinho/carrinho", icon: <ShoppingCart className="w-6 h-6" />, text: "Carrinho" },
  { link: "/historico/historico", icon: <History className="w-6 h-6" />, text: "Histórico" },
];

const dropdownItems = [
  { icon: <UserPlus className="w-5 h-5" />, text: "Criar Conta", link: "/register" },
  { icon: <LogIn className="w-5 h-5" />, text: "Login", link: "/login" },
  { icon: <Settings className="w-5 h-5" />, text: "Configurações", link: "/settings" },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='flex'>
      <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <NavSidebar isOpen={isOpen} pathname={pathname} />
    </div>
  );
};

interface HeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isOpen, toggleSidebar }) => (
  <header className="w-full flex justify-between items-center p-2 px-4 border-b">
    <div className="flex items-center gap-2 w-[400px]">
      <Menu 
        className={`w-7 h-7 cursor-pointer transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-64' : 'translate-x-0'}`} 
        onClick={toggleSidebar} 
      />
      <h1 className={`text-[22px] leading-none transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-64' : 'translate-x-0'}`}>
        Florybal Ivoti
      </h1>
    </div>
    <UserDropdown />
  </header>
);

const UserDropdown: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex justify-end w-[400px]">
      <div ref={dropdownRef} className="relative">
        <Avatar className='h-10 w-10 cursor-pointer' onClick={toggleDropdown}>
          <AvatarImage src="" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {dropdownOpen && (
          <div className="absolute top-10 right-0 w-48 bg-white shadow-md rounded-md z-10">
            <ul className="flex flex-col p-2">
              {dropdownItems.map((item, index) => (
                <li key={index} className="border-t flex items-center gap-3 p-2.5 hover:bg-zinc-200 transition-all rounded-br-xl rounded-bl-xl">
                  {item.icon}
                  <Link href={item.link}>{item.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

interface NavSidebarProps {
  isOpen: boolean;
  pathname: string;
}

const NavSidebar: React.FC<NavSidebarProps> = ({ isOpen, pathname }) => (
  <nav className={`fixed z-20 h-full bg-white text-black w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out p-2 shadow-lg`}>
    <ul className="flex flex-col h-full">
      <div className="flex-grow">
        {menuList.map((item, index) => (
          <li key={index} className={`flex items-center gap-3 p-3 transition-all rounded ${pathname === item.link ? 'bg-blue-200' : 'hover:bg-zinc-200'}`}>
            {item.icon}
            <Link href={item.link} className="text-[17px]">{item.text}</Link>
          </li>
        ))}
      </div>
      <li className="flex items-center gap-3 p-3 hover:bg-zinc-200 transition-all rounded">
        <Settings className="w-6 h-6" />
        <p className="text-[17px]">Configurações</p>
      </li>
    </ul>
  </nav>
);

export default Sidebar;

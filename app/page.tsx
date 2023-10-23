'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react';
import { useTheme } from 'next-themes';
import logo from './_assets/kanban-logo.svg'
export default function Home() {
  const [darkMode, setDarkMode] = useState<'light' | 'dark'>('light')
  const {theme, setTheme} = useTheme();
  return (
    <div className="grid grid-rows-1 grid-cols-[300px,1fr] py-4 bg-slate-400">
      <div>
        <img src={logo.src} alt="Kanban App" />
      </div>
      <div>new taks</div>
    </div>
  )
}

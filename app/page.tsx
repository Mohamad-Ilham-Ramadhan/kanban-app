'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react';
import { useTheme } from 'next-themes';
export default function Home() {
  const [darkMode, setDarkMode] = useState<'light' | 'dark'>('light')
  const {theme, setTheme} = useTheme();
  return (
    <>
    
    </>
  )
}

'use client'

import React from 'react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import NavMenu from './NavMenu'

export const Header: React.FC<HeaderProps> = ({}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header id='App:Header' className={cn('bg-white')}>
      {/* TODO: Logo Section */}
      {/* TODO: Search Field Section */}
      {/* TODO: NaveMenu Section */}
      {/* TODO: UserAvatar Section */}
      <NavMenu />
    </header>
  )
}

const navigation = [
  { name: 'B1H0', href: 'b1h0' },
  { name: 'iDAC', href: 'idac' },
  { name: 'DASI', href: 'dasi' },
  { name: 'TEAM', href: 'TEAM' },
]

interface HeaderProps {}

export default Header

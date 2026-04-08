'use client'

import { useClerk } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const { signOut } = useClerk()
  
  return (
    <button 
      onClick={() => signOut({ redirectUrl: '/' })}
      className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors mt-2"
    >
      <LogOut className="h-4 w-4 inline mr-1" />
      <span>Cerrar sesión</span>
    </button>
  )
}

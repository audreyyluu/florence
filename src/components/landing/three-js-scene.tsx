"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Camera, CameraOff, User, Clock } from "lucide-react"

// Simulated camera feed component
const CameraFeed = ({ id, status }: { id: number, status: 'active' | 'inactive' | 'alert' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'alert': return 'bg-red-500';
    }
  }

  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Camera feed placeholder */}
      <div className="aspect-video bg-gray-900 flex items-center justify-center">
        {status === 'inactive' ? (
          <CameraOff className="h-12 w-12 text-gray-600" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Camera className="h-12 w-12 text-blue-400 mb-2" />
            <div className="text-xs text-gray-400">Camera feed placeholder</div>
          </div>
        )}
      </div>
      
      {/* Camera info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <span className="text-xs text-white font-medium">Room {100 + id}</span>
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-xs text-white">
            <User className="h-3 w-3 mr-1" />
            <span>{Math.floor(Math.random() * 3) + 1}</span>
          </div>
          <div className="flex items-center text-xs text-white">
            <Clock className="h-3 w-3 mr-1" />
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ThreeJsScene() {
  const [mounted, setMounted] = useState(false)
  
  // Camera statuses for demonstration
  const cameraStatuses: ('active' | 'inactive' | 'alert')[] = [
    'active', 'active', 'alert', 'active',
    'inactive', 'active', 'active', 'active',
    'active', 'alert', 'active', 'inactive'
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cameraStatuses.slice(0, 6).map((status, index) => (
          <CameraFeed key={index} id={index} status={status} />
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Preview of the CareCam surveillance dashboard. Sign up to access all features.
        </p>
      </div>
    </motion.div>
  )
}
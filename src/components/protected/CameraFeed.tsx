"use client"

import { useEffect, useRef, useState } from "react"
import { Camera } from "lucide-react"

// Define the types we need for status
type PatientStatus = 'stable' | 'check' | 'urgent' | 'alerted'

interface CameraFeedProps {
  roomNumber: number
  isMain?: boolean
  videoUrl?: string
  showRoomInfo?: boolean
  status?: PatientStatus
}

export function CameraFeed({ 
  roomNumber, 
  isMain = false, 
  videoUrl, 
  showRoomInfo = false,
  status 
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      // Reset states when video URL changes
      setError(null)
      setIsLoading(true)

      const video = videoRef.current
      
      const handleCanPlay = () => {
        console.log(`Video for room ${roomNumber} can play`)
        setIsLoading(false)
        video.play().catch(playError => {
          console.error(`Autoplay failed for room ${roomNumber}:`, playError)
          setError("Autoplay prevented")
        })
      }

      const handleError = (e: Event) => {
        const videoError = (e.target as HTMLVideoElement).error
        console.error(`Video error for room ${roomNumber}:`, videoError)
        setError(videoError?.message || "Failed to load video")
        setIsLoading(false)
      }

      // Add event listeners
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)

      // Load the video
      video.load()

      // Cleanup
      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
      }
    }
  }, [videoUrl, roomNumber])
  
  // Function to determine room status color based on actual status system
  const getRoomStatusColor = (roomNumber: number, status?: PatientStatus): string => {
    // Use provided status if available, otherwise determine based on room number
    const roomStatus = status || determineStatusFromRoomNumber(roomNumber)
    
    // Return color based on status - matches the system used throughout the app
    switch (roomStatus) {
      case 'stable': return 'bg-green-500'
      case 'check': return 'bg-yellow-500'
      case 'urgent': return 'bg-red-500'
      case 'alerted': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  // Temporary function to assign a status by room number if none is provided
  const determineStatusFromRoomNumber = (roomNumber: number): PatientStatus => {
    const statuses: PatientStatus[] = ['stable', 'check', 'urgent', 'alerted']
    return statuses[roomNumber % statuses.length]
  }

  return (
    <div className={`relative aspect-video bg-gray-900 rounded-lg overflow-hidden`}>
      {videoUrl ? (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            controls={false}
          >
            {/* Try multiple sources */}
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl.replace('.webm', '.mp4')} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
              <div className="text-white text-sm">Loading video...</div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/50 p-4 text-center">
              <div className="text-red-400 text-sm mb-2">Error: {error}</div>
              <div className="text-gray-400 text-xs">
                Try converting the video to a web-compatible format using FFmpeg:
                <br />
                ffmpeg -i input.mp4 -c:v libx264 -c:a aac output.mp4
              </div>
            </div>
          )}
          
          {/* Only show room info when explicitly requested */}
          {showRoomInfo && (
            <div className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-black/50 rounded px-2 py-1">
              <div className={`w-4 h-4 rounded-full ${getRoomStatusColor(roomNumber, status)} ring-1 ring-white/30`}></div>
              <div className="text-white text-xs font-medium">
                Room {roomNumber}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className={`${isMain ? 'h-24 w-24' : 'h-16 w-16'} text-gray-700`} />
          
          {/* Only show room info when explicitly requested */}
          {showRoomInfo && (
            <div className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-black/50 rounded px-2 py-1">
              <div className={`w-4 h-4 rounded-full ${getRoomStatusColor(roomNumber, status)} ring-1 ring-white/30`}></div>
              <div className="text-white text-xs font-medium">
                Room {roomNumber}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 
"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, User } from "lucide-react"

interface CameraFeedProps {
  roomNumber: number
  isMain?: boolean
  videoUrl?: string
}

export function CameraFeed({ roomNumber, isMain = false, videoUrl }: CameraFeedProps) {
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

  return (
    <div className={`relative ${isMain ? 'aspect-video' : 'aspect-video'} bg-gray-900 rounded-lg overflow-hidden`}>
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
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className={`${isMain ? 'h-24 w-24' : 'h-16 w-16'} text-gray-700`} />
        </div>
      )}
      {/* <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
        Room {roomNumber}
      </div>
      <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-white text-xs flex items-center">
        <User className="h-3 w-3 mr-1" />
        <span>{Math.floor(Math.random() * 3) + 1}</span>
      </div> */}
    </div>
  )
} 
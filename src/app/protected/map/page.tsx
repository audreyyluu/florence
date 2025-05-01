"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  AlertTriangle,
  User,
  Clock,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { motion } from "framer-motion"

type RoomStatus = 'stable' | 'check' | 'urgent' | 'alerted'
type FloorLevel = '1' | '2' | '3'
type WingSection = 'A' | 'B' | 'C' | 'D'

interface RoomData {
  id: number
  roomNumber: number
  status: RoomStatus
  floor: FloorLevel
  wing: WingSection
  patientName?: string
  staffCount: number
  lastActivity: Date
  hasAlert: boolean
  vitals?: {
    heartRate?: number
    bloodPressure?: string
    oxygenLevel?: number
    temperature?: number
  }
  activities?: {
    timestamp: Date
    description: string
    type: 'movement' | 'staff' | 'alert' | 'vitals'
  }[]
}

const generateMockRooms = (): RoomData[] => {
  const statuses: RoomStatus[] = ['stable', 'check', 'urgent', 'alerted']
  
  // Front page room statuses for rooms 100-108
  const frontPageRoomStatuses: Record<number, RoomStatus> = {
    100: 'urgent',
    101: 'check',
    102: 'stable',
    103: 'urgent',
    104: 'urgent',
    105: 'alerted',
    106: 'urgent',
    107: 'stable',
    108: 'urgent',
    109: 'stable' // Updated status for room 109
  }
  
  return Array.from({ length: 18 }, (_, i) => {
    const roomNumber = 100 + i
    
    // Use predefined status for rooms 100-109, random status for others
    const status = roomNumber <= 109 
      ? frontPageRoomStatuses[roomNumber] 
      : statuses[Math.floor(Math.random() * statuses.length)]
    
    const room: RoomData = {
      id: i + 1,
      roomNumber,
      status,
      floor: '1',
      wing: i < 5 ? 'A' : i < 10 ? 'B' : i < 15 ? 'C' : 'D',
      patientName: status !== 'stable' ? `Patient ${roomNumber}` : undefined,
      staffCount: status === 'stable' ? 0 : Math.floor(Math.random() * 3),
      lastActivity: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)),
      hasAlert: status === 'urgent'
    }
    
    // Special data for room 109
    if (roomNumber === 109) {
      room.patientName = "John Smith"
      room.lastActivity = new Date() // Most recent activity
      room.staffCount = 1
      room.vitals = {
        heartRate: 88,
        bloodPressure: "130/85",
        oxygenLevel: 96,
        temperature: 99.1
      }
      room.activities = [
        {
          timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
          description: "Nurse checked on patient",
          type: "staff"
        },
        {
          timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
          description: "Patient moving in bed",
          type: "movement"
        },
        {
          timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
          description: "Vital signs checked",
          type: "vitals"
        },
        {
          timestamp: new Date(Date.now() - 120 * 60000), // 2 hours ago
          description: "Medication administered",
          type: "staff"
        }
      ]
    }
    
    return room
  })
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  
  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else {
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }
}

const getStatusColor = (status: RoomStatus): string => {
  switch (status) {
    case 'stable': return 'bg-green-100'
    case 'check': return 'bg-yellow-100'
    case 'urgent': return 'bg-red-100'
    case 'alerted': return 'bg-blue-100'
  }
}

const getStatusBadge = (status: RoomStatus) => {
  switch (status) {
    case 'stable':
      return <Badge variant="outline" className="border-green-500 text-green-500">Stable</Badge>
    case 'check':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Check on patient</Badge>
    case 'urgent':
      return <Badge variant="destructive">Needs immediate attention</Badge>
    case 'alerted':
      return <Badge variant="outline" className="border-blue-500 text-blue-500">Staff alerted</Badge>
  }
}

export default function HospitalMapPage() {
  const router = useRouter()
  const [rooms] = useState<RoomData[]>(generateMockRooms())
  const [selectedFloor, setSelectedFloor] = useState<FloorLevel>('1')
  const [selectedWing, setSelectedWing] = useState<WingSection | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState("")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const filteredRooms = rooms.filter(room => {
    if (room.floor !== selectedFloor) return false
    
    if (selectedWing !== 'all' && room.wing !== selectedWing) return false
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        room.roomNumber.toString().includes(query) ||
        (room.patientName?.toLowerCase().includes(query) || false)
      )
    }
    
    return true
  })
  
  const roomsByWing = filteredRooms.reduce((acc, room) => {
    if (!acc[room.wing]) {
      acc[room.wing] = []
    }
    acc[room.wing].push(room)
    return acc
  }, {} as Record<WingSection, RoomData[]>)
  
  const handleRoomClick = (room: RoomData) => {
    setSelectedRoom(room)
    router.push(`/protected/rooms/${room.roomNumber}`)
  }
  
  const handleViewRoom = () => {
    if (selectedRoom) {
      router.push(`/protected/rooms/${selectedRoom.roomNumber}`)
    }
  }
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2))
  }
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6))
  }
  
  const totalRooms = filteredRooms.length
  const stableRooms = filteredRooms.filter(r => r.status === 'stable').length
  const checkRooms = filteredRooms.filter(r => r.status === 'check').length
  const urgentRooms = filteredRooms.filter(r => r.status === 'urgent').length
  const alertedRooms = filteredRooms.filter(r => r.status === 'alerted').length
  
  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Hospital Map</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/protected')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle>Map Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <Select
                    value={selectedFloor}
                    onValueChange={(value) => setSelectedFloor(value as FloorLevel)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Floor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Floor 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Select
                    value={selectedWing}
                    onValueChange={(value) => setSelectedWing(value as WingSection | 'all')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Wing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Wings</SelectItem>
                      <SelectItem value="A">Wing A</SelectItem>
                      <SelectItem value="B">Wing B</SelectItem>
                      <SelectItem value="C">Wing C</SelectItem>
                      <SelectItem value="D">Wing D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search rooms..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3 flex justify-between">
              <div className="text-sm text-muted-foreground">
                {filteredRooms.length} rooms displayed
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.6}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 2}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card className="md:w-80">
            <CardHeader className="pb-3">
              <CardTitle>Floor {selectedFloor} Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-red-100 dark:bg-red-950 p-2 rounded-md text-center">
                  <div className="text-2xl font-bold">{urgentRooms}</div>
                  <div className="text-xs text-muted-foreground">Urgent</div>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-md text-center">
                  <div className="text-2xl font-bold">{checkRooms}</div>
                  <div className="text-xs text-muted-foreground">Check</div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-950 p-2 rounded-md text-center">
                  <div className="text-2xl font-bold">{alertedRooms}</div>
                  <div className="text-xs text-muted-foreground">Staff Alerted</div>
                </div>
                <div className="bg-green-100 dark:bg-green-950 p-2 rounded-md text-center">
                  <div className="text-2xl font-bold">{stableRooms}</div>
                  <div className="text-xs text-muted-foreground">Stable</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Floor {selectedFloor} Map</CardTitle>
            <CardDescription>
              Click on a room to view details and camera feed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="relative border rounded-md p-4 min-h-[500px] overflow-hidden"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}
            >
              <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded-md border z-10">
                <div className="text-xs font-medium mb-1">Status Color Key</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 rounded-sm"></div>
                    <span className="text-xs">Stable</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-100 rounded-sm"></div>
                    <span className="text-xs">Check on patient</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-100 rounded-sm"></div>
                    <span className="text-xs">Needs immediate attention</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-100 rounded-sm"></div>
                    <span className="text-xs">Staff alerted</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-8 items-center justify-center h-full">
                <div className="w-full h-12 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <span className="text-sm font-medium">Main Hallway</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {Object.entries(roomsByWing).map(([wing, rooms]) => (
                    <div key={wing} className="space-y-2">
                      <h3 className="text-sm font-medium">Wing {wing}</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {rooms.map(room => (
                          <TooltipProvider key={room.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <motion.div
                                  className={`aspect-square ${getStatusColor(room.status)} rounded-md border p-2 cursor-pointer flex flex-col items-center justify-center text-center hover:ring-2 hover:ring-primary transition-all ${selectedRoom?.id === room.id ? 'ring-2 ring-primary' : ''}`}
                                  onClick={() => handleRoomClick(room)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <div className="text-xs font-medium">{room.roomNumber}</div>
                                  {room.hasAlert && (
                                    <AlertTriangle className="h-3 w-3 text-red-500 mt-1" />
                                  )}
                                </motion.div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs">
                                  <p className="font-medium">Room {room.roomNumber}</p>
                                  <p>{room.patientName || 'No patient'}</p>
                                  <p>Status: {room.status}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <span className="text-xs font-medium">Elevator</span>
                  </div>
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <span className="text-xs font-medium">Stairs</span>
                  </div>
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <span className="text-xs font-medium">Nurses Station</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {selectedRoom && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Room {selectedRoom.roomNumber} Details</span>
                {selectedRoom.hasAlert && (
                  <Badge variant="destructive" className="ml-2">Alert</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {selectedRoom.patientName || 'No patient assigned'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div>{getStatusBadge(selectedRoom.status)}</div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>Floor {selectedRoom.floor}, Wing {selectedRoom.wing}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Staff Present</p>
                  <p>{selectedRoom.staffCount} staff members</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Activity</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{formatTimeAgo(selectedRoom.lastActivity)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button onClick={handleViewRoom}>
                View Room
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
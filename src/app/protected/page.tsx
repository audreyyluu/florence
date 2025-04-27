"use client"
import { useState, Suspense, lazy, useEffect } from "react";
import { Eye, Palette, User, AlertTriangle, Plus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prefetchDashboardPages, prefetchNextPageData } from "@/utils/prefetch";

// Lazy load less critical components
const CameraFeed = lazy(() => import("@/components/protected/CameraFeed").then(mod => ({ default: mod.CameraFeed })));

// Loading fallback
const LoadingCard = () => (
  <Card className="overflow-hidden relative animate-pulse">
    <div className="aspect-video bg-gray-800 rounded-lg"></div>
    <CardFooter className="flex justify-between py-2">
      <div className="h-5 w-20 bg-gray-700 rounded"></div>
      <div className="h-5 w-10 bg-gray-700 rounded"></div>
    </CardFooter>
  </Card>
);

// Define status types to ensure type safety
type PatientStatus = 'stable' | 'check' | 'urgent' | 'alerted';

// Status color mapping
const statusColors: Record<PatientStatus, { color: string; label: string }> = {
  stable: { color: 'bg-green-500', label: 'Stable' },
  check: { color: 'bg-yellow-500', label: 'Check on patient' },
  urgent: { color: 'bg-red-500', label: 'Needs immediate attention' },
  alerted: { color: 'bg-blue-500', label: 'Staff alerted' },
};

// Status priority order for sorting (highest priority first)
const statusPriority: Record<PatientStatus, number> = {
  urgent: 1,   // Red - highest priority
  check: 2,    // Yellow
  alerted: 3,  // Blue
  stable: 4,   // Green - lowest priority
};

// Sample data for camera feeds
const cameraFeeds = [
  { id: 1, roomNumber: 100, status: 'urgent' as PatientStatus, medicalProfessionals: 1, videoUrl: `/videos/room100.webm` },
  { id: 2, roomNumber: 101, status: 'check' as PatientStatus, medicalProfessionals: 1, videoUrl: `/videos/room101.webm` },
  { id: 3, roomNumber: 102, status: 'stable' as PatientStatus, medicalProfessionals: 1, videoUrl: `/videos/room102.webm` },
  { id: 4, roomNumber: 103, status: 'urgent' as PatientStatus, medicalProfessionals: 1, videoUrl: `/videos/room103.webm` },
  { id: 5, roomNumber: 104, status: 'urgent' as PatientStatus, medicalProfessionals: 1, videoUrl: `/videos/room104.webm` },
  { id: 6, roomNumber: 105, status: 'alerted' as PatientStatus, medicalProfessionals: 3, videoUrl: `/videos/room105.webm` },
  { id: 7, roomNumber: 106, status: 'urgent' as PatientStatus, medicalProfessionals: 1, videoUrl: `/videos/room106.webm` },
  { id: 8, roomNumber: 107, status: 'stable' as PatientStatus, medicalProfessionals: 1, videoUrl: `/videos/room107.webm` },
  { id: 9, roomNumber: 108, status: 'urgent' as PatientStatus, medicalProfessionals: 1, videoUrl: `/videos/room108.webm` },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: i + 10,
    roomNumber: 109 + i,
    status: ['stable', 'check', 'urgent', 'alerted'][Math.floor(Math.random() * 4)] as PatientStatus,
    medicalProfessionals: 1,
    videoUrl: undefined,
  }))
];

export default function ProtectedPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [surveillanceOperators] = useState(Math.floor(Math.random() * 5) + 3);
  const [showColorKey, setShowColorKey] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [newCameraIp, setNewCameraIp] = useState("");
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Display 9 videos per page
  const videosPerPage = 9;
  const totalPages = Math.ceil(cameraFeeds.length / videosPerPage);
  
  // Separate feeds with and without video streaming
  const streamingFeeds = cameraFeeds.filter(feed => feed.videoUrl);
  const nonStreamingFeeds = cameraFeeds.filter(feed => !feed.videoUrl);
  
  // Sort only the streaming feeds by status priority
  const sortedStreamingFeeds = [...streamingFeeds].sort((a, b) => 
    statusPriority[a.status] - statusPriority[b.status]
  );
  
  // Combine sorted streaming feeds with unsorted non-streaming feeds
  const sortedCameraFeeds = [...sortedStreamingFeeds, ...nonStreamingFeeds];
  
  const currentFeeds = sortedCameraFeeds.slice(
    currentPage * videosPerPage, 
    (currentPage + 1) * videosPerPage
  );

  // Effect to set loaded state and prefetch
  useEffect(() => {
    setIsLoaded(true);
    
    // Prefetch dashboard pages
    prefetchDashboardPages(router, pathname || '');
    
    // Prefetch next page of rooms
    prefetchNextPageData(
      router, 
      currentPage, 
      videosPerPage, 
      sortedCameraFeeds, 
      (feed) => `/protected/rooms/${feed.roomNumber}`
    );
  }, [currentPage, pathname, router, sortedCameraFeeds, videosPerPage]);

  // Prefetch when changing pages
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRoomClick = (roomNumber: number) => {
    router.push(`/protected/rooms/${roomNumber}`);
  };

  const handleAddCamera = () => {
    // In a real app, this would add the camera to the database
    console.log("Adding camera:", { ip: newCameraIp, roomNumber: newRoomNumber });
    setNewCameraIp("");
    setNewRoomNumber("");
    setShowAddCamera(false);
  };

  return (
    <div className="container pb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold tracking-tight">Surveillance Dashboard</h2>
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-5 w-5" />
                  <span>{surveillanceOperators}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of surveillance operators</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Popover open={showColorKey} onOpenChange={setShowColorKey}>
            <PopoverTrigger asChild>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Show color key"
              >
                <Palette className="h-5 w-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-2">
                <h3 className="font-medium">Status Color Key</h3>
                {Object.entries(statusColors).map(([key, { color, label }]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-4 h-4 ${color} rounded-sm border border-gray-300`}></div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {currentFeeds.map((feed) => (
          <Suspense key={feed.id} fallback={<LoadingCard />}>
            <Card 
              className="overflow-hidden cursor-pointer hover:ring-1 hover:ring-primary transition-all relative"
              onClick={() => handleRoomClick(feed.roomNumber)}
            >
              {/* Status indicator dot */}
              <div className={`absolute top-2 left-2 z-10 w-3 h-3 rounded-full ${statusColors[feed.status].color}`}></div>
              
              <CameraFeed 
                roomNumber={feed.roomNumber} 
                videoUrl={feed.videoUrl}
              />
              <CardFooter className="flex justify-between py-2">
                <div className="font-medium">Room {feed.roomNumber}</div>
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{feed.medicalProfessionals}</span>
                </div>
              </CardFooter>
            </Card>
          </Suspense>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}

      <Dialog open={showAddCamera} onOpenChange={setShowAddCamera}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Camera</DialogTitle>
            <DialogDescription>
              Enter the camera IP address and room number to add a new camera.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="camera-ip" className="text-right">
                IP Address
              </Label>
              <Input
                id="camera-ip"
                value={newCameraIp}
                onChange={(e) => setNewCameraIp(e.target.value)}
                placeholder="192.168.1.100"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room-number" className="text-right">
                Room Number
              </Label>
              <Input
                id="room-number"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
                placeholder="101"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddCamera}>Add Camera</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setShowAddCamera(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
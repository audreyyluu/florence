"use client"
import { useState } from "react";
import { Camera, Eye, Palette, User, AlertTriangle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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

// Define status types to ensure type safety
type PatientStatus = 'stable' | 'check' | 'urgent' | 'alerted';

// Sample data for camera feeds
const cameraFeeds = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  roomNumber: 100 + i,
  status: ['stable', 'check', 'urgent', 'alerted'][Math.floor(Math.random() * 4)] as PatientStatus,
  medicalProfessionals: Math.floor(Math.random() * 4),
}));

// Status color mapping
const statusColors: Record<PatientStatus, { color: string; label: string }> = {
  stable: { color: 'bg-green-500', label: 'Stable' },
  check: { color: 'bg-yellow-500', label: 'Check on patient' },
  urgent: { color: 'bg-red-500', label: 'Needs immediate attention' },
  alerted: { color: 'bg-blue-500', label: 'Staff alerted' },
};

export default function ProtectedPage() {
  const router = useRouter();
  const [surveillanceOperators] = useState(Math.floor(Math.random() * 5) + 3);
  const [showColorKey, setShowColorKey] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [newCameraIp, setNewCameraIp] = useState("");
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [showAddCamera, setShowAddCamera] = useState(false);
  
  // Display 9 videos per page
  const videosPerPage = 9;
  const totalPages = Math.ceil(cameraFeeds.length / videosPerPage);
  const currentFeeds = cameraFeeds.slice(
    currentPage * videosPerPage, 
    (currentPage + 1) * videosPerPage
  );

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
          <Card 
            key={feed.id} 
            className="overflow-hidden cursor-pointer hover:ring-1 hover:ring-primary transition-all"
            onClick={() => router.push(`/protected/rooms/${feed.roomNumber}`)}
          >
            <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
              <Camera className="h-16 w-16 text-gray-700" />
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${statusColors[feed.status].color}`}></div>
              </div>
            </div>
            <CardFooter className="flex justify-between py-2">
              <div className="font-medium">Room {feed.roomNumber}</div>
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{feed.medicalProfessionals}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1 px-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button 
                key={i}
                variant={currentPage === i ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button>
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
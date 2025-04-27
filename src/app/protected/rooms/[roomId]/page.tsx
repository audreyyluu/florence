"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import React from "react"
import { 
  ArrowLeft, 
  Camera, 
  Bell,
  Activity, 
  MessageCircle,
  Heart, 
  MessageSquare, 
  AlertTriangle,
  User,
  Send,
  Play,
  Pause,
  SkipBack,
  Clock,
  Edit,
  Save,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { CameraFeed } from "@/components/CameraFeed"

type DangerousBehavior = {
  id: string
  type: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high'
}

type ActivityEvent = {
  id: string
  description: string
  timestamp: Date
}

type PatientVitals = {
  heartRate: number
  bloodPressure: string
  temperature: number
  respiratoryRate: number
  oxygenSaturation: number
}

type PatientInfo = {
  name: string
  age: number
  roomNumber: number
  admissionDate: Date
  diagnosis: string
  allergies: string[]
  medications: string[]
}

type TimelineEvent = {
  id: string
  timestamp: Date
  type: string
  severity: 'low' | 'medium' | 'high'
  position: number
}

type PatientStatus = 'stable' | 'check' | 'urgent' | 'alerted'

const generateMockDangerousBehaviors = (count: number): DangerousBehavior[] => {
  const behaviors = ['Coughing', 'Falling', 'Heavy breathing', 'Distress', 'Rapid movement']
  const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']
  
  return Array.from({ length: count }, (_, i) => ({
    id: `behavior-${i}`,
    type: behaviors[Math.floor(Math.random() * behaviors.length)],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
    severity: severities[Math.floor(Math.random() * severities.length)]
  }))
}

const generateMockActivities = (count: number): ActivityEvent[] => {
  const activities = [
    'Stood up from bed',
    'Sat down on chair',
    'Nurse entered room',
    'Doctor checked vitals',
    'Medication administered',
    'Food delivered',
    'Fell off bed',
    'Coughed repeatedly',
    'Called for assistance',
    'Family visitor arrived'
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `activity-${i}`,
    description: activities[Math.floor(Math.random() * activities.length)],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 7200000))
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

const generateMockPatientVitals = (): PatientVitals => {
  return {
    heartRate: Math.floor(Math.random() * 30) + 60,
    bloodPressure: `${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 20) + 60}`,
    temperature: parseFloat((Math.random() * 2 + 36).toFixed(1)),
    respiratoryRate: Math.floor(Math.random() * 8) + 12,
    oxygenSaturation: Math.floor(Math.random() * 5) + 95
  }
}

const generateMockPatientInfo = (roomId: string): PatientInfo => {
  const roomNumber = parseInt(roomId, 10)
  const allergies = ['Penicillin', 'Peanuts', 'Latex', 'Shellfish', 'None']
  const medications = [
    'Acetaminophen 500mg',
    'Lisinopril 10mg',
    'Metformin 1000mg',
    'Atorvastatin 20mg',
    'Albuterol inhaler'
  ]
  
  return {
    name: `Patient ${roomNumber}`,
    age: Math.floor(Math.random() * 50) + 25,
    roomNumber,
    admissionDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 86400000)),
    diagnosis: ['Pneumonia', 'Fractured hip', 'Post-surgical recovery', 'Cardiac monitoring'][Math.floor(Math.random() * 4)],
    allergies: [allergies[Math.floor(Math.random() * allergies.length)]],
    medications: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
      medications[Math.floor(Math.random() * medications.length)]
    )
  }
}

const generateEcgData = () => {
  const points = 100;
  return Array.from({ length: points }, (_, i) => {
    let y = 0;
    
    y += Math.sin(i / 5) * 10;
    
    if (i % 25 >= 12 && i % 25 <= 14) {
      y -= 30;
    } else if (i % 25 >= 15 && i % 25 <= 17) {
      y += 50;
    } else if (i % 25 >= 18 && i % 25 <= 20) {
      y -= 20;
    }
    
    y += (Math.random() - 0.5) * 5;
    
    return { x: i, y: y + 50 };
  });
};

const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

const generateMockTimelineEvents = (count: number, dangerousBehaviors: DangerousBehavior[]): TimelineEvent[] => {
  const baseEvents = dangerousBehaviors.map((behavior, index) => ({
    id: `timeline-${index}`,
    timestamp: behavior.timestamp,
    type: behavior.type,
    severity: behavior.severity,
    position: Math.floor(Math.random() * 100)
  }));
  
  const additionalCount = Math.max(0, count - baseEvents.length);
  const behaviors = ['Coughing', 'Movement', 'Distress', 'Call button pressed', 'Visitor']
  const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']
  
  const additionalEvents = Array.from({ length: additionalCount }, (_, i) => ({
    id: `timeline-add-${i}`,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 7200000)),
    type: behaviors[Math.floor(Math.random() * behaviors.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    position: Math.floor(Math.random() * 100)
  }));
  
  return [...baseEvents, ...additionalEvents].sort((a, b) => a.position - b.position);
}

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const router = useRouter()
  const unwrappedParams = React.use(params as any) as { roomId: string }
  const roomId = unwrappedParams.roomId
  const roomNumber = parseInt(roomId, 10)
  
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot', timestamp: Date }[]>([
    { text: "Hello, how can I help you with monitoring this patient?", sender: 'bot', timestamp: new Date() }
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [dangerousBehaviors] = useState<DangerousBehavior[]>(generateMockDangerousBehaviors(Math.floor(Math.random() * 3) + 3))
  const [activities] = useState<ActivityEvent[]>(generateMockActivities(10))
  const [patientVitals] = useState<PatientVitals>(generateMockPatientVitals())
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(generateMockPatientInfo(roomId))
  const [ecgData] = useState(generateEcgData())
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedDiagnosis, setEditedDiagnosis] = useState(patientInfo.diagnosis)
  const [editedAllergies, setEditedAllergies] = useState(patientInfo.allergies.join(", "))
  const [editedMedications, setEditedMedications] = useState(patientInfo.medications.join("\n"))
  
  const [timelineEvents] = useState<TimelineEvent[]>(generateMockTimelineEvents(8, dangerousBehaviors))
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  
  const nearbyRooms = [
    roomNumber + 1,
    roomNumber + 2,
    roomNumber + 3
  ]
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const determineRoomStatus = (): PatientStatus => {
    if (dangerousBehaviors.some(b => b.severity === 'high')) return 'urgent';
    if (dangerousBehaviors.some(b => b.severity === 'medium')) return 'check';
    if (dangerousBehaviors.some(b => b.severity === 'low')) return 'alerted';
    return 'stable';
  }
  
  const roomStatus = determineRoomStatus();
  
  const getStatusColor = (status: PatientStatus): string => {
    switch (status) {
      case 'stable': return 'bg-green-500';
      case 'check': return 'bg-yellow-500';
      case 'urgent': return 'bg-red-500';
      case 'alerted': return 'bg-blue-500';
    }
  }
  
  const getSeverityColor = (severity: 'low' | 'medium' | 'high'): string => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  }
  
  const mapSeverityToStatus = (severity: 'low' | 'medium' | 'high'): PatientStatus => {
    switch (severity) {
      case 'high': return 'urgent';
      case 'medium': return 'check';
      case 'low': return 'alerted';
      default: return 'stable';
    }
  }
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }
  
  const handleTimelineClick = (position: number) => {
    setCurrentPosition(position)
  }
  
  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event)
    setCurrentPosition(event.position)
  }
  
  const resetPlayback = () => {
    setCurrentPosition(0)
    setIsPlaying(false)
  }
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    const userMessage = { text: inputValue, sender: 'user' as const, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    
    setTimeout(() => {
      const botResponses = [
        "I'll check on that for you.",
        "The patient's vitals are currently stable.",
        "I've notified the nursing staff about your concern.",
        "The last medication was administered 2 hours ago.",
        "Would you like me to alert the doctor on call?"
      ]
      const botMessage = {
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: 'bot' as const,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    }, 1000)
  }
  
  const handleSaveMedicalHistory = () => {
    setPatientInfo(prev => ({
      ...prev,
      diagnosis: editedDiagnosis,
      allergies: editedAllergies.split(',').map(a => a.trim()).filter(a => a),
      medications: editedMedications.split('\n').map(m => m.trim()).filter(m => m)
    }))
    setIsEditing(false)
  }
  
  const handleCancelEdit = () => {
    setEditedDiagnosis(patientInfo.diagnosis)
    setEditedAllergies(patientInfo.allergies.join(", "))
    setEditedMedications(patientInfo.medications.join("\n"))
    setIsEditing(false)
  }
  
  const getVideoUrl = (roomNum: number) => {
    return roomNum >= 100 && roomNum <= 109 ? `/videos/room${roomNum}.webm` : undefined
  }
  
  return (
    <div className="container h-[calc(100vh-80px)] py-4">
      <div className="flex items-center gap-4 mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push('/protected')}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">Room {roomNumber} Surveillance</h1>
        <Badge className={getStatusColor(roomStatus)}>
          {roomStatus.charAt(0).toUpperCase() + roomStatus.slice(1)}
        </Badge>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-150px)]">
        <ResizablePanel defaultSize={60} minSize={40}>
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-2">
              <div className="flex-1 relative">
                <CameraFeed 
                  roomNumber={roomNumber} 
                  isMain={true}
                  videoUrl={getVideoUrl(roomNumber)}
                />
                
                {selectedEvent && (
                  <div className="absolute bottom-4 left-4 bg-black/70 p-2 rounded text-white text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(selectedEvent.severity)}>
                        {mapSeverityToStatus(selectedEvent.severity)}
                      </Badge>
                      <span>{selectedEvent.type}</span>
                      <span className="text-xs opacity-70">
                        {formatTimestamp(selectedEvent.timestamp)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={resetPlayback}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={togglePlayback}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>Timeline</span>
                  </div>
                </div>
                
                <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <div 
                    className="absolute h-full bg-primary/20 transition-all" 
                    style={{ width: `${currentPosition}%` }}
                  ></div>
                  
                  <TooltipProvider>
                    {timelineEvents.map(event => (
                      <Tooltip key={event.id}>
                        <TooltipTrigger asChild>
                          <button
                            className={`absolute h-full w-1.5 ${getSeverityColor(event.severity)} cursor-pointer hover:w-2 transition-all`}
                            style={{ left: `${event.position}%` }}
                            onClick={() => handleEventClick(event)}
                          ></button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-medium">{event.type}</p>
                            <p>{formatTimestamp(event.timestamp)}</p>
                            <p>Status: {mapSeverityToStatus(event.severity)}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                  
                  <Slider
                    value={[currentPosition]}
                    min={0}
                    max={100}
                    step={1}
                    className="absolute inset-0 opacity-0"
                    onValueChange={(value) => handleTimelineClick(value[0])}
                  />
                </div>
                
                <div className="flex items-center gap-4 mt-2 justify-end">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs">High</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-xs">Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs">Low</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {nearbyRooms.map(room => (
                  <div key={room} className="cursor-pointer" onClick={() => router.push(`/protected/rooms/${room}`)}>
                    <CameraFeed 
                      roomNumber={room}
                      videoUrl={getVideoUrl(room)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40} minSize={30}>
          <Tabs defaultValue="activity" className="h-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="vitals" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Vitals</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="h-[calc(100%-60px)]">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  {dangerousBehaviors.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Detected
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {dangerousBehaviors.map(behavior => (
                            <motion.li 
                              key={behavior.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <Badge variant={
                                  behavior.severity === 'high' ? 'destructive' : 
                                  behavior.severity === 'medium' ? 'default' : 'secondary'
                                }>
                                  {behavior.severity}
                                </Badge>
                                <span>{behavior.type}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(behavior.timestamp)}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {activities.map(activity => (
                          <li key={activity.id} className="flex justify-between items-start border-b pb-2 last:border-0">
                            <span>{activity.description}</span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {formatTimestamp(activity.timestamp)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="vitals" className="h-[calc(100%-60px)]">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">ECG Monitor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 w-full bg-black rounded-md p-2 relative">
                        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div key={`v-${i}`} className="h-full w-px bg-green-500/20 col-start-auto" />
                          ))}
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div key={`h-${i}`} className="w-full h-px bg-green-500/20 row-start-auto" />
                          ))}
                        </div>
                        <svg 
                          viewBox="0 0 100 100" 
                          className="w-full h-full overflow-visible"
                          preserveAspectRatio="none"
                        >
                          <polyline
                            points={ecgData.map(point => `${point.x},${point.y}`).join(' ')}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                        <div className="absolute bottom-2 right-2 text-green-500 text-xs">
                          {patientVitals.heartRate} BPM
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Vitals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Heart Rate</p>
                          <p className="text-lg font-medium">{patientVitals.heartRate} <span className="text-sm text-muted-foreground">bpm</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Blood Pressure</p>
                          <p className="text-lg font-medium">{patientVitals.bloodPressure} <span className="text-sm text-muted-foreground">mmHg</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Temperature</p>
                          <p className="text-lg font-medium">{patientVitals.temperature} <span className="text-sm text-muted-foreground">°C</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Respiratory Rate</p>
                          <p className="text-lg font-medium">{patientVitals.respiratoryRate} <span className="text-sm text-muted-foreground">bpm</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Oxygen Saturation</p>
                          <p className="text-lg font-medium">{patientVitals.oxygenSaturation} <span className="text-sm text-muted-foreground">%</span></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Medical History</CardTitle>
                      {!isEditing ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={handleSaveMedicalHistory}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-1">Patient Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Name</p>
                            <p>{patientInfo.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Age</p>
                            <p>{patientInfo.age}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Room</p>
                            <p>{patientInfo.roomNumber}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Admission Date</p>
                            <p>{patientInfo.admissionDate.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-1">Diagnosis</h3>
                        {isEditing ? (
                          <Input
                            value={editedDiagnosis}
                            onChange={(e) => setEditedDiagnosis(e.target.value)}
                            className="w-full"
                          />
                        ) : (
                          <p className="text-sm">{patientInfo.diagnosis}</p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-1">Allergies</h3>
                        {isEditing ? (
                          <Input
                            value={editedAllergies}
                            onChange={(e) => setEditedAllergies(e.target.value)}
                            className="w-full"
                            placeholder="Separate allergies with commas"
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {patientInfo.allergies.map((allergy, i) => (
                              <Badge key={i} variant="outline">{allergy}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-1">Medications</h3>
                        {isEditing ? (
                          <Textarea
                            value={editedMedications}
                            onChange={(e) => setEditedMedications(e.target.value)}
                            className="w-full"
                            placeholder="Enter one medication per line"
                            rows={4}
                          />
                        ) : (
                          <ul className="text-sm space-y-1">
                            {patientInfo.medications.map((medication, i) => (
                              <li key={i}>{medication}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="chat" className="h-[calc(100%-60px)] flex flex-col">
              <div className="flex-1 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="space-y-4 p-2">
                    {messages.map((message, i) => (
                      <div 
                        key={i} 
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2 mt-4 pt-2 border-t">
                <Input 
                  placeholder="Type your message..." 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
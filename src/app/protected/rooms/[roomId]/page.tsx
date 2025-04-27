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
import { CameraFeed } from "@/components/protected/CameraFeed"

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
  closeContacts?: {
    name: string
    relationship: string
    location: string
    phone_number: string
  }[]
}

type TimelineEvent = {
  id: string
  timestamp: Date
  type: string
  severity: 'low' | 'medium' | 'high'
  position: number
}

type PatientStatus = 'stable' | 'check' | 'urgent' | 'alerted'

type PatientTimestampData = {
  room_number: string
  predicted_symptoms: string[]
  timestamps: {
    start_time: string
    end_time: string
    symptoms: string[]
    confidence: number
    description: string
    danger_level: string
  }[]
  danger_level: string
  description: string
  vitals: {
    heart_rate: number
    blood_pressure: string
    blood_oxygen: number
    blood_glucose: number
    temperature: number
    respiratory_rate: number
    pulse_rate: number
  }
  admission_date: string
}

type PatientDataFromBackend = {
  full_name: string
  location: string
  age: number
  pre_existing_conditions: string[]
  current_symptoms: string[]
  diagnosis: string
  allergies: string
  medications: string[]
  close_contacts: {
    name: string
    relationship: string
    location: string
    phone_number: string
  }[]
}

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

// Function to fetch patient data from the backend
const fetchPatientData = async (roomId: string): Promise<PatientInfo | null> => {
  try {
    const response = await fetch(`http://localhost:8000/patientinfo/${roomId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch patient data');
    }
    
    const data: PatientDataFromBackend = await response.json();
    
    return {
      name: data.full_name,
      age: data.age,
      roomNumber: parseInt(roomId, 10),
      admissionDate: new Date(), // This would ideally come from the backend
      diagnosis: data.diagnosis,
      allergies: data.allergies.split(',').map(a => a.trim()),
      medications: data.medications,
      closeContacts: data.close_contacts
    };
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return null;
  }
};

// Function to fetch timeline data from the backend
const fetchTimelineData = async (roomId: string): Promise<PatientTimestampData | null> => {
  try {
    const response = await fetch(`http://localhost:8000/timelineinfo/${roomId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch timeline data');
    }
    
    const data: PatientTimestampData = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    return null;
  }
};

// Function to convert timestamps to dangerous behaviors
const timelineToDangerousBehaviors = (timeline: PatientTimestampData): DangerousBehavior[] => {
  return timeline.timestamps.map((timestamp, index) => {
    // Map danger level to severity
    let severity: 'low' | 'medium' | 'high' = 'low';
    if (timestamp.danger_level === 'Critical' || timestamp.danger_level === 'High') {
      severity = 'high';
    } else if (timestamp.danger_level === 'Moderate') {
      severity = 'medium';
    }
    
    // Use the first symptom as the type, or 'Unknown' if no symptoms
    const type = timestamp.symptoms[0] || 'Unknown';
    
    // Parse the timestamp to a Date
    const dateStr = timestamp.start_time;
    const date = new Date();
    const [timePart, amPm] = dateStr.split(' ');
    const [hours, minutes] = timePart.split(':');
    let hour = parseInt(hours, 10);
    if (amPm === 'PM' && hour < 12) hour += 12;
    if (amPm === 'AM' && hour === 12) hour = 0;
    date.setHours(hour, parseInt(minutes, 10), 0);
    
    return {
      id: `behavior-${index}`,
      type,
      timestamp: date,
      severity
    };
  });
};

// Function to convert timestamps to activity events
const timelineToActivityEvents = (timeline: PatientTimestampData): ActivityEvent[] => {
  return timeline.timestamps.map((timestamp, index) => {
    // Parse the timestamp to a Date
    const dateStr = timestamp.start_time;
    const date = new Date();
    const [timePart, amPm] = dateStr.split(' ');
    const [hours, minutes] = timePart.split(':');
    let hour = parseInt(hours, 10);
    if (amPm === 'PM' && hour < 12) hour += 12;
    if (amPm === 'AM' && hour === 12) hour = 0;
    date.setHours(hour, parseInt(minutes, 10), 0);
    
    return {
      id: `activity-${index}`,
      description: timestamp.description.split('.')[0] + '.', // Take first sentence
      timestamp: date
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Function to convert timeline data to patient vitals
const timelineToPatientVitals = (timeline: PatientTimestampData): PatientVitals => {
  return {
    heartRate: timeline.vitals.heart_rate,
    bloodPressure: timeline.vitals.blood_pressure,
    temperature: timeline.vitals.temperature,
    respiratoryRate: timeline.vitals.respiratory_rate,
    oxygenSaturation: timeline.vitals.blood_oxygen
  };
};

// Function to convert timeline events to timeline events
const timelineToTimelineEvents = (timeline: PatientTimestampData): TimelineEvent[] => {
  return timeline.timestamps.map((timestamp, index) => {
    // Map danger level to severity
    let severity: 'low' | 'medium' | 'high' = 'low';
    if (timestamp.danger_level === 'Critical' || timestamp.danger_level === 'High') {
      severity = 'high';
    } else if (timestamp.danger_level === 'Moderate') {
      severity = 'medium';
    }
    
    // Calculate position based on index (evenly distribute across the timeline)
    const position = (index / (timeline.timestamps.length - 1)) * 100;
    
    // Parse the timestamp to a Date
    const dateStr = timestamp.start_time;
    const date = new Date();
    const [timePart, amPm] = dateStr.split(' ');
    const [hours, minutes] = timePart.split(':');
    let hour = parseInt(hours, 10);
    if (amPm === 'PM' && hour < 12) hour += 12;
    if (amPm === 'AM' && hour === 12) hour = 0;
    date.setHours(hour, parseInt(minutes, 10), 0);
    
    return {
      id: `timeline-${index}`,
      timestamp: date,
      type: timestamp.symptoms[0] || 'Unknown',
      severity,
      position
    };
  });
};

// Helper function to summarize patient conditions based on detections and patient info
const getPatientSummary = (behaviors: DangerousBehavior[], patientInfo: PatientInfo | null, timelineData: PatientTimestampData | null): string => {
  if (!patientInfo || !timelineData) return '';
  
  // Get primary diagnosis and current symptoms
  const diagnosis = patientInfo.diagnosis;
  const symptoms = timelineData.predicted_symptoms.join(', ');
  
  return `${patientInfo.name} has ${diagnosis} with current symptoms: ${symptoms}. Patient requires monitoring for ${timelineData.danger_level.toLowerCase()} risk conditions.`;
};

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
  const chatContainerRef = useRef<HTMLDivElement>(null)
  
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null)
  const [patientVitals, setPatientVitals] = useState<PatientVitals | null>(null)
  const [dangerousBehaviors, setDangerousBehaviors] = useState<DangerousBehavior[]>([])
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [originalTimelineData, setOriginalTimelineData] = useState<PatientTimestampData | null>(null)
  const [ecgData, setEcgData] = useState(generateEcgData())
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedDiagnosis, setEditedDiagnosis] = useState('')
  const [editedAllergies, setEditedAllergies] = useState('')
  const [editedMedications, setEditedMedications] = useState('')
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  
  // ECG animation
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setEcgData(currentData => {
        // Shift the data points to create scrolling effect
        const newData = [...currentData.slice(1), currentData[0]];
        
        // Add some variability to the last point to make it more realistic
        const lastPoint = newData[newData.length - 1];
        const variability = (Math.random() - 0.5) * 5;
        newData[newData.length - 1] = { 
          ...lastPoint, 
          y: lastPoint.y + variability 
        };
        
        return newData;
      });
    }, 80); // Update every 80ms for smooth animation
    
    return () => clearInterval(animationInterval);
  }, []);
  
  // Fetch patient data and timeline data
  useEffect(() => {
    const fetchData = async () => {
      // Fetch patient data
      const patientData = await fetchPatientData(roomId);
      if (patientData) {
        setPatientInfo(patientData);
        setEditedDiagnosis(patientData.diagnosis);
        setEditedAllergies(patientData.allergies.join(", "));
        setEditedMedications(patientData.medications.join("\n"));
      }
      
      // Fetch timeline data
      const timelineData = await fetchTimelineData(roomId);
      if (timelineData) {
        setDangerousBehaviors(timelineToDangerousBehaviors(timelineData));
        setActivities(timelineToActivityEvents(timelineData));
        setPatientVitals(timelineToPatientVitals(timelineData));
        setTimelineEvents(timelineToTimelineEvents(timelineData));
        // Store the original timeline data for use in the summary
        setOriginalTimelineData(timelineData);
      }
    };
    
    fetchData();
  }, [roomId]);
  
  const nearbyRooms = [
    roomNumber + 1,
    roomNumber + 2,
    roomNumber + 3
  ]
  
  // Add function to determine statuses for nearby rooms
  const getNearbyRoomStatus = (roomNum: number): PatientStatus => {
    // This is a simple algorithm to assign statuses
    // In a real implementation, this would fetch actual statuses from an API
    const statuses: PatientStatus[] = ['stable', 'check', 'urgent', 'alerted'];
    return statuses[roomNum % statuses.length];
  };
  
  // Function to scroll chat to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Enhanced scrolling effect - scroll when messages change
  useEffect(() => {
    // Small delay to ensure DOM updates are complete
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);
  
  // Scroll to bottom when chat tab is selected
  useEffect(() => {
    const chatTab = document.querySelector('[data-state="active"][value="chat"]');
    if (chatTab) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-state' && 
              chatTab.getAttribute('data-state') === 'active') {
            scrollToBottom();
          }
        });
      });
      
      observer.observe(chatTab, { attributes: true });
      return () => observer.disconnect();
    }
  }, []);
  
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
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    const userMessage = { text: inputValue, sender: 'user' as const, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    scrollToBottom();
    
    // Show loading state
    const loadingMessage = { text: "Thinking...", sender: 'bot' as const, timestamp: new Date() }
    setMessages(prev => [...prev, loadingMessage])
    
    try {
      // Call the backend API
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_number: roomNumber.toString(),
          message: userMessage.text
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from assistant');
      }
      
      const data = await response.json();
      
      // Replace loading message with the actual response
      setMessages(prev => prev.filter(msg => msg !== loadingMessage));
      const botMessage = {
        text: data.response,
        sender: 'bot' as const,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      scrollToBottom();
    } catch (error) {
      console.error('Error calling chat API:', error);
      
      // Replace loading message with an error message
      setMessages(prev => prev.filter(msg => msg !== loadingMessage));
      const errorMessage = {
        text: "Sorry, I'm having trouble connecting to the assistant. Please try again later.",
        sender: 'bot' as const,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      scrollToBottom();
    }
  }
  
  const handleSaveMedicalHistory = () => {
    if (patientInfo) {
      setPatientInfo(prev => ({
        ...prev!,
        diagnosis: editedDiagnosis,
        allergies: editedAllergies.split(',').map(a => a.trim()).filter(a => a),
        medications: editedMedications.split('\n').map(m => m.trim()).filter(m => m)
      }))
    }
    setIsEditing(false)
  }
  
  const handleCancelEdit = () => {
    if (patientInfo) {
      setEditedDiagnosis(patientInfo.diagnosis)
      setEditedAllergies(patientInfo.allergies.join(", "))
      setEditedMedications(patientInfo.medications.join("\n"))
    }
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
                      showRoomInfo={true}
                      status={getNearbyRoomStatus(room)}
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
                        {/* Patient Summary Section */}
                        <div className="mb-3 text-sm border-b pb-2">
                          <p>{getPatientSummary(dangerousBehaviors, patientInfo, originalTimelineData)}</p>
                        </div>
                        <ul className="space-y-2">
                          {/* Sort behaviors by severity: high -> medium -> low */}
                          {dangerousBehaviors
                            .slice()
                            .sort((a, b) => {
                              const severityOrder = { high: 0, medium: 1, low: 2 };
                              return severityOrder[a.severity] - severityOrder[b.severity];
                            })
                            .map(behavior => (
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
                          {patientVitals?.heartRate} BPM
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
                          <p className="text-lg font-medium">{patientVitals?.heartRate} <span className="text-sm text-muted-foreground">bpm</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Blood Pressure</p>
                          <p className="text-lg font-medium">{patientVitals?.bloodPressure} <span className="text-sm text-muted-foreground">mmHg</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Temperature</p>
                          <p className="text-lg font-medium">{patientVitals?.temperature} <span className="text-sm text-muted-foreground">°C</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Respiratory Rate</p>
                          <p className="text-lg font-medium">{patientVitals?.respiratoryRate} <span className="text-sm text-muted-foreground">bpm</span></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Oxygen Saturation</p>
                          <p className="text-lg font-medium">{patientVitals?.oxygenSaturation} <span className="text-sm text-muted-foreground">%</span></p>
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
                            <p>{patientInfo?.name || 'Unknown'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Age</p>
                            <p>{patientInfo?.age || 'Unknown'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Room</p>
                            <p>{patientInfo?.roomNumber || roomNumber}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Admission Date</p>
                            <p>{patientInfo?.admissionDate?.toLocaleDateString() || 'Unknown'}</p>
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
                          <p className="text-sm">{patientInfo?.diagnosis || 'Unknown'}</p>
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
                            {patientInfo?.allergies.map((allergy, i) => (
                              <Badge key={i} variant="outline">{allergy}</Badge>
                            )) || <Badge variant="outline">No allergies</Badge>}
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
                            {patientInfo?.medications.map((medication, i) => (
                              <li key={i}>{medication}</li>
                            )) || <li>No medications</li>}
                          </ul>
                        )}
                      </div>
                      
                      {patientInfo?.closeContacts && patientInfo.closeContacts.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-1">Close Contacts</h3>
                          <ul className="text-sm space-y-3">
                            {patientInfo.closeContacts.map((contact, i) => (
                              <li key={i} className="border-b pb-2 last:border-0">
                                <div className="font-medium">{contact.name} <span className="font-normal">({contact.relationship})</span></div>
                                <div>{contact.location}</div>
                                <div>{contact.phone_number}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="chat" className="h-[calc(100%-60px)] flex flex-col">
              <div className="flex-1 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 h-full">
                  <div className="space-y-4 p-2 min-h-full flex flex-col justify-end" ref={chatContainerRef}>
                    <div className="flex-1" />
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
                          <p className="whitespace-pre-wrap break-words">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} className="h-1" />
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
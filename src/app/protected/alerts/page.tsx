"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  X,
  User,
  Clock,
  Activity
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

// Types for alert data
type AlertSeverity = 'low' | 'medium' | 'high'
type AlertType = 'breathing' | 'heartrate' | 'fatigue' | 'movement' | 'bloodpressure' | 'edema' | 'anxiety'

interface PatientAlert {
  id: string
  patientId: string
  patientName: string
  roomNumber: number
  timestamp: Date
  type: AlertType
  severity: AlertSeverity
  description: string
  resolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
}

interface PatientInfo {
  full_name: string
  diagnosis: string
  age: number
  pre_existing_conditions: string[]
}

interface TimelineInfo {
  room_number: string
  predicted_symptoms: string[]
  timestamps: TimelineTimestamp[]
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
}

interface TimelineTimestamp {
  start_time: string
  end_time: string
  symptoms: string[]
  confidence: number
  description: string
  danger_level: string
}

// Function to generate real alerts based on patient data
const generateRealAlerts = (): PatientAlert[] => {
  // Patient data for rooms 100-108
  const patientData: Record<number, PatientInfo> = {
    100: {
      full_name: "Drusilla Atherton",
      diagnosis: "Congestive Heart Failure",
      age: 58,
      pre_existing_conditions: ["Hypertension", "Type 2 Diabetes", "Osteoarthritis"]
    },
    101: {
      full_name: "Eleanor Ainsworth",
      diagnosis: "Acute Heart Failure Exacerbation",
      age: 72,
      pre_existing_conditions: ["Hypertension", "Type 2 Diabetes", "Chronic Kidney Disease", "Atrial Fibrillation"]
    },
    102: {
      full_name: "Jamal Thompson",
      diagnosis: "Vaso-occlusive crisis due to Sickle Cell Anemia",
      age: 10, 
      pre_existing_conditions: ["Asthma", "Sickle Cell Anemia"]
    },
    103: {
      full_name: "Thomas Abernathy",
      diagnosis: "Acute Myocardial Infarction (Heart Attack)",
      age: 62,
      pre_existing_conditions: ["Hypertension", "Type 2 Diabetes", "Coronary Artery Disease", "COPD"]
    },
    104: {
      full_name: "Maria Rodriguez",
      diagnosis: "Community-Acquired Pneumonia",
      age: 67,
      pre_existing_conditions: ["COPD", "Hypertension"]
    },
    105: {
      full_name: "Sarah Johnson",
      diagnosis: "Severe Dehydration and Electrolyte Imbalance",
      age: 35,
      pre_existing_conditions: ["None"]
    },
    106: {
      full_name: "Robert Chen",
      diagnosis: "Post-Surgery Recovery (Hip Replacement)",
      age: 71,
      pre_existing_conditions: ["Osteoarthritis", "Hypertension"]
    },
    107: {
      full_name: "Amira Hassan",
      diagnosis: "Diabetic Ketoacidosis",
      age: 24,
      pre_existing_conditions: ["Type 1 Diabetes"]
    },
    108: {
      full_name: "William Parker",
      diagnosis: "Stroke (Ischemic)",
      age: 68,
      pre_existing_conditions: ["Hypertension", "Hyperlipidemia", "Atrial Fibrillation"]
    }
  };

  // Generate alerts based on room data
  const alerts: PatientAlert[] = [];
  
  // Room 100 - Drusilla Atherton
  alerts.push({
    id: "alert-100-1",
    patientId: "P100",
    patientName: patientData[100].full_name,
    roomNumber: 100,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    type: "breathing",
    severity: "medium",
    description: "Patient experiencing shortness of breath, potential CHF exacerbation",
    resolved: false
  });
  
  alerts.push({
    id: "alert-100-2",
    patientId: "P100",
    patientName: patientData[100].full_name,
    roomNumber: 100,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    type: "edema",
    severity: "medium",
    description: "Edema in lower extremities observed, consistent with CHF",
    resolved: true,
    resolvedBy: "Dr. Smith",
    resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  });
  
  // Room 101 - Eleanor Ainsworth
  alerts.push({
    id: "alert-101-1",
    patientId: "P101",
    patientName: patientData[101].full_name,
    roomNumber: 101,
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    type: "heartrate",
    severity: "high",
    description: "Irregular heartbeat detected, potential atrial fibrillation event",
    resolved: false
  });
  
  alerts.push({
    id: "alert-101-2",
    patientId: "P101",
    patientName: patientData[101].full_name,
    roomNumber: 101,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    type: "bloodpressure",
    severity: "high",
    description: "Blood pressure elevated to 160/90, requiring intervention",
    resolved: true,
    resolvedBy: "Dr. Johnson",
    resolvedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000)
  });
  
  // Room 102 - Jamal Thompson
  alerts.push({
    id: "alert-102-1",
    patientId: "P102",
    patientName: patientData[102].full_name,
    roomNumber: 102,
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    type: "breathing",
    severity: "high",
    description: "Breathing difficulties observed, potential asthma complication",
    resolved: false
  });
  
  // Room 103 - Thomas Abernathy
  alerts.push({
    id: "alert-103-1",
    patientId: "P103",
    patientName: patientData[103].full_name,
    roomNumber: 103,
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    type: "heartrate",
    severity: "high",
    description: "Abnormal heart rhythm detected post myocardial infarction",
    resolved: false
  });
  
  // Room 104 - Maria Rodriguez
  alerts.push({
    id: "alert-104-1",
    patientId: "P104",
    patientName: patientData[104].full_name,
    roomNumber: 104,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    type: "breathing",
    severity: "medium",
    description: "Increased respiratory rate, pneumonia-related complications",
    resolved: true,
    resolvedBy: "Dr. Patel",
    resolvedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  });
  
  // Room 105 - Sarah Johnson
  alerts.push({
    id: "alert-105-1",
    patientId: "P105",
    patientName: patientData[105].full_name,
    roomNumber: 105,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    type: "fatigue",
    severity: "medium",
    description: "Patient showing signs of extreme fatigue, electrolyte imbalance",
    resolved: false
  });
  
  // Room 106 - Robert Chen
  alerts.push({
    id: "alert-106-1",
    patientId: "P106",
    patientName: patientData[106].full_name,
    roomNumber: 106,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    type: "movement",
    severity: "low",
    description: "Unusual movement detected, potential post-op mobility issue",
    resolved: true,
    resolvedBy: "Dr. Garcia",
    resolvedAt: new Date(Date.now() - 7 * 60 * 60 * 1000)
  });
  
  // Room 107 - Amira Hassan
  alerts.push({
    id: "alert-107-1",
    patientId: "P107",
    patientName: patientData[107].full_name,
    roomNumber: 107,
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    type: "bloodpressure",
    severity: "high",
    description: "Significant drop in blood pressure, DKA complication",
    resolved: false
  });
  
  // Room 108 - William Parker
  alerts.push({
    id: "alert-108-1",
    patientId: "P108",
    patientName: patientData[108].full_name,
    roomNumber: 108,
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    type: "movement",
    severity: "medium",
    description: "Limited movement on left side, post-stroke monitoring",
    resolved: false
  });
  
  alerts.push({
    id: "alert-108-2",
    patientId: "P108",
    patientName: patientData[108].full_name,
    roomNumber: 108,
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    type: "anxiety",
    severity: "low",
    description: "Patient showing signs of anxiety and agitation",
    resolved: true,
    resolvedBy: "Dr. Wilson",
    resolvedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  });
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Helper function to format date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Get severity badge variant
const getSeverityBadge = (severity: AlertSeverity) => {
  switch (severity) {
    case 'high':
      return <Badge variant="destructive">High</Badge>
    case 'medium':
      return <Badge>Medium</Badge>
    case 'low':
      return <Badge variant="secondary">Low</Badge>
  }
}

// Get alert type icon
const getAlertTypeIcon = (type: AlertType) => {
  switch (type) {
    case 'breathing':
      return <Activity className="h-4 w-4 text-red-500" />
    case 'heartrate':
      return <Activity className="h-4 w-4 text-orange-500" />
    case 'fatigue':
      return <Activity className="h-4 w-4 text-yellow-500" />
    case 'movement':
      return <Activity className="h-4 w-4 text-blue-500" />
    case 'bloodpressure':
      return <Activity className="h-4 w-4 text-purple-500" />
    case 'edema':
      return <Activity className="h-4 w-4 text-indigo-500" />
    case 'anxiety':
      return <User className="h-4 w-4 text-gray-500" />
  }
}

export default function AlertsHistoryPage() {
  const router = useRouter()
  const [alerts] = useState<PatientAlert[]>(generateRealAlerts())
  const [filteredAlerts, setFilteredAlerts] = useState<PatientAlert[]>(alerts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'resolved' | 'unresolved'>('all')
  const [currentPage, setCurrentPage] = useState(0)
  
  // Get unique patients for filter dropdown
  const uniquePatients = Array.from(new Set(alerts.map(alert => alert.patientId)))
    .map(patientId => {
      const alert = alerts.find(a => a.patientId === patientId)
      return {
        id: patientId,
        name: alert?.patientName || '',
        roomNumber: alert?.roomNumber || 0
      }
    })
    .sort((a, b) => a.roomNumber - b.roomNumber)
  
  // Items per page for pagination
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage)
  const currentAlerts = filteredAlerts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )
  
  // Filter alerts based on search query and filters
  useEffect(() => {
    let result = alerts
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(alert => 
        alert.patientName.toLowerCase().includes(query) ||
        alert.roomNumber.toString().includes(query) ||
        alert.description.toLowerCase().includes(query)
      )
    }
    
    // Filter by patient
    if (selectedPatient) {
      result = result.filter(alert => alert.patientId === selectedPatient)
    }
    
    // Filter by severity
    if (selectedSeverity !== 'all') {
      result = result.filter(alert => alert.severity === selectedSeverity)
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      result = result.filter(alert => 
        selectedStatus === 'resolved' ? alert.resolved : !alert.resolved
      )
    }
    
    setFilteredAlerts(result)
    setCurrentPage(0) // Reset to first page when filters change
  }, [alerts, searchQuery, selectedPatient, selectedSeverity, selectedStatus])
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedPatient(null)
    setSelectedSeverity('all')
    setSelectedStatus('all')
  }
  
  // Handle patient selection
  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId === 'all' ? null : patientId)
  }
  
  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Alerts History</h1>
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
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">High Priority Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {alerts.filter(a => a.severity === 'high' && !a.resolved).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Unresolved high priority alerts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {alerts.filter(a => {
                  const today = new Date()
                  return a.timestamp.getDate() === today.getDate() &&
                    a.timestamp.getMonth() === today.getMonth() &&
                    a.timestamp.getFullYear() === today.getFullYear()
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Alerts triggered in the last 24 hours
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((alerts.filter(a => a.resolved).length / alerts.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Percentage of alerts that have been resolved
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter alerts by patient, severity, or status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient or description..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={selectedPatient || 'all'}
                onValueChange={handlePatientSelect}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  {uniquePatients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      Room {patient.roomNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={selectedSeverity}
                onValueChange={(value) => setSelectedSeverity(value as AlertSeverity | 'all')}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as 'all' | 'resolved' | 'unresolved')}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={clearFilters}
                disabled={!searchQuery && !selectedPatient && selectedSeverity === 'all' && selectedStatus === 'all'}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-3 text-sm text-muted-foreground">
            {filteredAlerts.length} alerts found
          </CardFooter>
        </Card>
        
        {/* Alerts Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Alert Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Room</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Alert Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAlerts.length > 0 ? (
                  currentAlerts.map(alert => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">
                        Room {alert.roomNumber}
                      </TableCell>
                      <TableCell>
                        {alert.patientName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getAlertTypeIcon(alert.type)}
                          <span className="capitalize">{alert.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{alert.description}</TableCell>
                      <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{formatDate(alert.timestamp)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={alert.resolved ? "outline" : "secondary"}>
                          {alert.resolved ? "Resolved" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/protected/rooms/${alert.roomNumber}`)}
                        >
                          View Room
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No alerts found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <CardFooter className="flex justify-center border-t pt-6">
              <div className="flex items-center gap-2">
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
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
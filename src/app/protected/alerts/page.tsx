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
type AlertType = 'fall' | 'distress' | 'coughing' | 'movement' | 'breathing' | 'visitor'

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

// Mock data generator
const generateMockAlerts = (count: number): PatientAlert[] => {
  const alertTypes: AlertType[] = ['fall', 'distress', 'coughing', 'movement', 'breathing', 'visitor']
  const severities: AlertSeverity[] = ['low', 'medium', 'high']
  
  return Array.from({ length: count }, (_, i) => {
    const roomNumber = 100 + Math.floor(Math.random() * 20)
    const patientId = `P${roomNumber}`
    const resolved = Math.random() > 0.7
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
    
    return {
      id: `alert-${i}`,
      patientId,
      patientName: `Patient ${roomNumber}`,
      roomNumber,
      timestamp,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: getAlertDescription(alertTypes[Math.floor(Math.random() * alertTypes.length)]),
      resolved,
      resolvedBy: resolved ? 'Dr. Smith' : undefined,
      resolvedAt: resolved ? new Date(timestamp.getTime() + Math.floor(Math.random() * 60 * 60 * 1000)) : undefined
    }
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Helper function to get alert description
const getAlertDescription = (type: AlertType): string => {
  const descriptions = {
    fall: 'Patient has fallen out of bed',
    distress: 'Patient showing signs of distress',
    coughing: 'Persistent coughing detected',
    movement: 'Unusual movement detected',
    breathing: 'Irregular breathing pattern',
    visitor: 'Unauthorized visitor detected'
  }
  return descriptions[type]
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
    case 'fall':
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case 'distress':
      return <Activity className="h-4 w-4 text-orange-500" />
    case 'coughing':
      return <Activity className="h-4 w-4 text-yellow-500" />
    case 'movement':
      return <Activity className="h-4 w-4 text-blue-500" />
    case 'breathing':
      return <Activity className="h-4 w-4 text-purple-500" />
    case 'visitor':
      return <User className="h-4 w-4 text-gray-500" />
  }
}

export default function AlertsHistoryPage() {
  const router = useRouter()
  const [alerts] = useState<PatientAlert[]>(generateMockAlerts(50))
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
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
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
      </div>
    </div>
  )
}
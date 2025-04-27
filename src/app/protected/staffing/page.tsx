"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Clock,
  AlertTriangle,
  ChevronDown,
  Filter,
  BarChart3,
  X,
  ArrowUpDown
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

// Types for staff data
type StaffRole = 'doctor' | 'nurse' | 'assistant' | 'specialist'
type StaffStatus = 'active' | 'break' | 'off-duty'

interface StaffMember {
  id: string
  name: string
  role: StaffRole
  status: StaffStatus
  currentRoom: number | null
  timeInRoom: number | null // minutes
  assignedRooms: number[]
}

interface RoomStaffing {
  roomNumber: number
  patientName: string
  patientCondition: PatientStatus
  assignedStaff: string[] // IDs of assigned staff
  currentStaff: string[] // IDs of staff currently in room
  lastVisit: Date | null
  minimumStaffNeeded: number
}

// Define status types to ensure type safety - copied from dashboard
type PatientStatus = 'stable' | 'check' | 'urgent' | 'alerted';

// Status color mapping - copied from dashboard
const statusColors: Record<PatientStatus, { color: string; label: string }> = {
  stable: { color: 'bg-green-500', label: 'Stable' },
  check: { color: 'bg-yellow-500', label: 'Check on patient' },
  urgent: { color: 'bg-red-500', label: 'Needs immediate attention' },
  alerted: { color: 'bg-blue-500', label: 'Staff alerted' },
};

// Replace mock data generator functions with static data
const staticStaffData: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Dr. James Miller',
    role: 'doctor',
    status: 'active',
    currentRoom: 105,
    timeInRoom: 15,
    assignedRooms: [105]
  },
  {
    id: 'staff-2',
    name: 'Nurse Sarah Johnson',
    role: 'nurse',
    status: 'active',
    currentRoom: 105,
    timeInRoom: 25,
    assignedRooms: [105]
  },
  {
    id: 'staff-3',
    name: 'Dr. Emily Chen',
    role: 'doctor',
    status: 'off-duty',
    currentRoom: null,
    timeInRoom: null,
    assignedRooms: [100, 101, 102]
  },
  {
    id: 'staff-4',
    name: 'Nurse Michael Brown',
    role: 'nurse',
    status: 'break',
    currentRoom: null,
    timeInRoom: null,
    assignedRooms: [103, 104]
  },
  {
    id: 'staff-5',
    name: 'Assistant Robert Wilson',
    role: 'assistant',
    status: 'off-duty',
    currentRoom: null,
    timeInRoom: null,
    assignedRooms: [106, 107, 108]
  }
];

const staticRoomData: RoomStaffing[] = [
  {
    roomNumber: 100,
    patientName: 'Drusilla Atherton',
    patientCondition: 'urgent',
    assignedStaff: ['staff-3'],
    currentStaff: [],
    lastVisit: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    minimumStaffNeeded: 1
  },
  {
    roomNumber: 101,
    patientName: 'Eleanor Ainsworth',
    patientCondition: 'check',
    assignedStaff: ['staff-3'],
    currentStaff: [],
    lastVisit: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    minimumStaffNeeded: 1
  },
  {
    roomNumber: 102,
    patientName: 'Jamal Thompson',
    patientCondition: 'stable',
    assignedStaff: ['staff-3'],
    currentStaff: [],
    lastVisit: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    minimumStaffNeeded: 1
  },
  {
    roomNumber: 103,
    patientName: 'Thomas Abernathy',
    patientCondition: 'urgent',
    assignedStaff: ['staff-4'],
    currentStaff: [],
    lastVisit: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    minimumStaffNeeded: 1
  },
  {
    roomNumber: 104,
    patientName: 'Aiko Tanaka',
    patientCondition: 'urgent',
    assignedStaff: ['staff-4'],
    currentStaff: [],
    lastVisit: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    minimumStaffNeeded: 1
  },
  {
    roomNumber: 105,
    patientName: 'Lily Chen',
    patientCondition: 'alerted',
    assignedStaff: ['staff-1', 'staff-2'],
    currentStaff: ['staff-1', 'staff-2'],
    lastVisit: new Date(), // Now (staff currently in room)
    minimumStaffNeeded: 2
  },
  {
    roomNumber: 106,
    patientName: 'Latoya Jackson',
    patientCondition: 'urgent',
    assignedStaff: ['staff-5'],
    currentStaff: [],
    lastVisit: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    minimumStaffNeeded: 1
  },
  {
    roomNumber: 107,
    patientName: 'Mei Chen',
    patientCondition: 'stable',
    assignedStaff: ['staff-5'],
    currentStaff: [],
    lastVisit: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
    minimumStaffNeeded: 1
  },
  {
    roomNumber: 108,
    patientName: 'Daniel Peterson',
    patientCondition: 'urgent',
    assignedStaff: ['staff-5'],
    currentStaff: [],
    lastVisit: new Date(Date.now() - 11 * 60 * 60 * 1000), // 11 hours ago
    minimumStaffNeeded: 1
  }
];

// Helper function to format time
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

// Get role badge
const getRoleBadge = (role: StaffRole) => {
  switch (role) {
    case 'doctor':
      return <Badge className="bg-blue-500">Doctor</Badge>
    case 'nurse':
      return <Badge className="bg-green-500">Nurse</Badge>
    case 'assistant':
      return <Badge className="bg-yellow-500">Assistant</Badge>
    case 'specialist':
      return <Badge className="bg-purple-500">Specialist</Badge>
  }
}

// Get status badge
const getStatusBadge = (status: StaffStatus) => {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="border-green-500 text-green-500">Active</Badge>
    case 'break':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">On Break</Badge>
    case 'off-duty':
      return <Badge variant="outline" className="border-gray-500 text-gray-500">Off Duty</Badge>
  }
}

// Get condition badge - updated to match dashboard colors
const getConditionBadge = (condition: PatientStatus) => {
  switch (condition) {
    case 'stable':
      return <Badge variant="outline" className="border-green-500 text-green-500">Stable</Badge>
    case 'check':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Check on patient</Badge>
    case 'urgent':
      return <Badge variant="outline" className="border-red-500 text-red-500">Needs immediate attention</Badge>
    case 'alerted':
      return <Badge variant="outline" className="border-blue-500 text-blue-500">Staff alerted</Badge>
  }
}

export default function StaffingPage() {
  const router = useRouter()
  const [staff] = useState<StaffMember[]>(staticStaffData)
  const [rooms] = useState<RoomStaffing[]>(staticRoomData)
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<StaffRole | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<StaffStatus | 'all'>('all')
  const [selectedCondition, setSelectedCondition] = useState<PatientStatus | 'all'>('all')
  const [showUnderstaffed, setShowUnderstaffed] = useState(false)
  
  // Filtered data
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>(staff)
  const [filteredRooms, setFilteredRooms] = useState<RoomStaffing[]>(rooms)
  
  // Pagination
  const [currentStaffPage, setCurrentStaffPage] = useState(0)
  const [currentRoomPage, setCurrentRoomPage] = useState(0)
  const itemsPerPage = 8
  
  // Calculate statistics
  const activeStaffCount = staff.filter(s => s.status === 'active').length
  const totalRooms = rooms.length
  const roomsWithStaff = rooms.filter(r => r.currentStaff.length > 0).length
  const understaffedRooms = rooms.filter(r => r.currentStaff.length < r.minimumStaffNeeded).length
  
  // Filter staff based on search and filters
  useEffect(() => {
    let result = staff
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.role.toLowerCase().includes(query) ||
        (s.currentRoom?.toString() || '').includes(query)
      )
    }
    
    if (selectedRole !== 'all') {
      result = result.filter(s => s.role === selectedRole)
    }
    
    if (selectedStatus !== 'all') {
      result = result.filter(s => s.status === selectedStatus)
    }
    
    setFilteredStaff(result)
    setCurrentStaffPage(0)
  }, [staff, searchQuery, selectedRole, selectedStatus])
  
  // Filter rooms based on search and filters
  useEffect(() => {
    let result = rooms
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r => 
        r.patientName.toLowerCase().includes(query) ||
        r.roomNumber.toString().includes(query)
      )
    }
    
    if (selectedCondition !== 'all') {
      result = result.filter(r => r.patientCondition === selectedCondition)
    }
    
    if (showUnderstaffed) {
      result = result.filter(r => r.currentStaff.length < r.minimumStaffNeeded)
    }
    
    setFilteredRooms(result)
    setCurrentRoomPage(0)
  }, [rooms, searchQuery, selectedCondition, showUnderstaffed])
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedRole('all')
    setSelectedStatus('all')
    setSelectedCondition('all')
    setShowUnderstaffed(false)
  }
  
  // Get staff name by ID
  const getStaffName = (id: string): string => {
    const member = staff.find(s => s.id === id)
    return member ? member.name : 'Unknown'
  }
  
  // Get staff role by ID
  const getStaffRole = (id: string): StaffRole | undefined => {
    const member = staff.find(s => s.id === id)
    return member?.role
  }
  
  // Pagination for staff
  const paginatedStaff = filteredStaff.slice(
    currentStaffPage * itemsPerPage,
    (currentStaffPage + 1) * itemsPerPage
  )
  
  // Pagination for rooms
  const paginatedRooms = filteredRooms.slice(
    currentRoomPage * itemsPerPage,
    (currentRoomPage + 1) * itemsPerPage
  )
  
  // Total pages calculation
  const totalStaffPages = Math.ceil(filteredStaff.length / itemsPerPage)
  const totalRoomPages = Math.ceil(filteredRooms.length / itemsPerPage)
  
  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Staff Coordination</h1>
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
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeStaffCount} currently active
              </p>
            </CardContent>
          </Card>
          
          {/* <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Room Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((roomsWithStaff / totalRooms) * 100)}%</div>
              <p className="text-xs text-muted-foreground">
                {roomsWithStaff} of {totalRooms} rooms with staff present
              </p>
            </CardContent>
          </Card> */}
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Understaffed Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{understaffedRooms}</div>
              <p className="text-xs text-muted-foreground">
                Rooms below minimum staffing requirements
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Staff Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Doctors</span>
                <span>{staff.filter(s => s.role === 'doctor').length}</span>
              </div>
              <Progress value={staff.filter(s => s.role === 'doctor').length / staff.length * 100} className="h-1 bg-blue-100" />
              
              <div className="flex items-center justify-between text-xs">
                <span>Nurses</span>
                <span>{staff.filter(s => s.role === 'nurse').length}</span>
              </div>
              <Progress value={staff.filter(s => s.role === 'nurse').length / staff.length * 100} className="h-1 bg-green-100" />
              
              <div className="flex items-center justify-between text-xs">
                <span>Assistants</span>
                <span>{staff.filter(s => s.role === 'assistant').length}</span>
              </div>
              <Progress value={staff.filter(s => s.role === 'assistant').length / staff.length * 100} className="h-1 bg-yellow-100" />
              
              <div className="flex items-center justify-between text-xs">
                <span>Specialists</span>
                <span>{staff.filter(s => s.role === 'specialist').length}</span>
              </div>
              <Progress value={staff.filter(s => s.role === 'specialist').length / staff.length * 100} className="h-1 bg-purple-100" />
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter staff and rooms by name, role, status, or condition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, role, or room..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as StaffRole | 'all')}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                  <SelectItem value="specialist">Specialist</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as StaffStatus | 'all')}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="break">On Break</SelectItem>
                  <SelectItem value="off-duty">Off Duty</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={selectedCondition}
                onValueChange={(value) => setSelectedCondition(value as PatientStatus | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Patient Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="check">Check on patient</SelectItem>
                  <SelectItem value="urgent">Needs immediate attention</SelectItem>
                  <SelectItem value="alerted">Staff alerted</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="understaffed"
                  checked={showUnderstaffed}
                  onChange={(e) => setShowUnderstaffed(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="understaffed" className="text-sm">
                  Show Understaffed Only
                </label>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={clearFilters}
                disabled={!searchQuery && selectedRole === 'all' && selectedStatus === 'all' && selectedCondition === 'all' && !showUnderstaffed}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-3 text-sm text-muted-foreground">
            {filteredStaff.length} staff members and {filteredRooms.length} rooms found
          </CardFooter>
        </Card>
        
        {/* Tabs for Staff and Rooms */}
        <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>
          
          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Room Staffing</CardTitle>
                <CardDescription>
                  Monitor staff presence in each room
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Room</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Current Staff</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRooms.length > 0 ? (
                      paginatedRooms.map(room => (
                        <TableRow key={room.roomNumber}>
                          <TableCell className="font-medium">
                            {room.roomNumber}
                          </TableCell>
                          <TableCell>{room.patientName}</TableCell>
                          <TableCell>
                            {getConditionBadge(room.patientCondition)}
                          </TableCell>
                          <TableCell>
                            {room.currentStaff.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {room.currentStaff.map(staffId => (
                                  <div key={staffId} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-sm">{getStaffName(staffId)}</span>
                                    <span className="text-xs text-muted-foreground">
                                      ({getStaffRole(staffId)})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">No staff present</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {room.lastVisit ? (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{formatTimeAgo(room.lastVisit)}</span>
                              </div>
                            ) : (
                              "Never"
                            )}
                          </TableCell>
                          <TableCell>
                            {room.currentStaff.length < room.minimumStaffNeeded ? (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Understaffed</span>
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-green-500 text-green-500">
                                Adequately Staffed
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/protected/rooms/${room.roomNumber}`)}
                            >
                              View Room
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No rooms found matching your filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              
              {/* Pagination for Rooms */}
              {totalRoomPages > 1 && (
                <CardFooter className="flex justify-center border-t pt-6">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentRoomPage(prev => Math.max(0, prev - 1))}
                      disabled={currentRoomPage === 0}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1 px-2">
                      {Array.from({ length: totalRoomPages }).map((_, i) => (
                        <Button 
                          key={i}
                          variant={currentRoomPage === i ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentRoomPage(i)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentRoomPage(prev => Math.min(totalRoomPages - 1, prev + 1))}
                      disabled={currentRoomPage === totalRoomPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Staff Directory</CardTitle>
                <CardDescription>
                  View and filter medical staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current Location</TableHead>
                      <TableHead>Time in Room</TableHead>
                      <TableHead>Assigned Rooms</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStaff.length > 0 ? (
                      paginatedStaff.map(member => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            {member.name}
                          </TableCell>
                          <TableCell>
                            {getRoleBadge(member.role)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(member.status)}
                          </TableCell>
                          <TableCell>
                            {member.currentRoom ? (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span>Room {member.currentRoom}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Not in a room</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {member.timeInRoom ? (
                              <span>{member.timeInRoom} minutes</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {member.assignedRooms.map(room => (
                                <Badge key={room} variant="outline" className="text-xs">
                                  {room}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No staff found matching your filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              
              {/* Pagination for Staff */}
              {totalStaffPages > 1 && (
                <CardFooter className="flex justify-center border-t pt-6">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentStaffPage(prev => Math.max(0, prev - 1))}
                      disabled={currentStaffPage === 0}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1 px-2">
                      {Array.from({ length: totalStaffPages }).map((_, i) => (
                        <Button 
                          key={i}
                          variant={currentStaffPage === i ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentStaffPage(i)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentStaffPage(prev => Math.min(totalStaffPages - 1, prev + 1))}
                      disabled={currentStaffPage === totalStaffPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
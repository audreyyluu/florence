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
  patientCondition: 'stable' | 'needs_attention' | 'critical'
  assignedStaff: string[] // IDs of assigned staff
  currentStaff: string[] // IDs of staff currently in room
  lastVisit: Date | null
  minimumStaffNeeded: number
}

// Mock data generator functions
const generateMockStaff = (count: number): StaffMember[] => {
  const roles: StaffRole[] = ['doctor', 'nurse', 'assistant', 'specialist']
  const statuses: StaffStatus[] = ['active', 'break', 'off-duty']
  const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Maria']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson']
  
  return Array.from({ length: count }, (_, i) => {
    const role = roles[Math.floor(Math.random() * roles.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const currentRoom = status === 'active' ? 100 + Math.floor(Math.random() * 20) : null
    const timeInRoom = currentRoom ? Math.floor(Math.random() * 60) : null
    const assignedRooms = Array.from(
      { length: Math.floor(Math.random() * 5) + 1 },
      () => 100 + Math.floor(Math.random() * 20)
    )
    
    return {
      id: `staff-${i}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      role,
      status,
      currentRoom,
      timeInRoom,
      assignedRooms: [...new Set(assignedRooms)] // Remove duplicates
    }
  })
}

const generateMockRoomStaffing = (count: number, staff: StaffMember[]): RoomStaffing[] => {
  const conditions = ['stable', 'needs_attention', 'critical'] as const
  
  return Array.from({ length: count }, (_, i) => {
    const roomNumber = 100 + i
    const assignedStaff = staff
      .filter(s => s.assignedRooms.includes(roomNumber))
      .map(s => s.id)
    
    const currentStaff = staff
      .filter(s => s.currentRoom === roomNumber)
      .map(s => s.id)
    
    const lastVisit = currentStaff.length > 0 
      ? new Date(Date.now() - Math.floor(Math.random() * 60 * 60 * 1000)) 
      : new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000))
    
    return {
      roomNumber,
      patientName: `Patient ${roomNumber}`,
      patientCondition: conditions[Math.floor(Math.random() * conditions.length)],
      assignedStaff,
      currentStaff,
      lastVisit,
      minimumStaffNeeded: Math.floor(Math.random() * 2) + 1
    }
  })
}

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

// Get condition badge
const getConditionBadge = (condition: 'stable' | 'needs_attention' | 'critical') => {
  switch (condition) {
    case 'stable':
      return <Badge variant="outline" className="border-green-500 text-green-500">Stable</Badge>
    case 'needs_attention':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Needs Attention</Badge>
    case 'critical':
      return <Badge variant="outline" className="border-red-500 text-red-500">Critical</Badge>
  }
}

export default function StaffingPage() {
  const router = useRouter()
  const [staff] = useState<StaffMember[]>(generateMockStaff(20))
  const [rooms] = useState<RoomStaffing[]>(generateMockRoomStaffing(15, staff))
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<StaffRole | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<StaffStatus | 'all'>('all')
  const [selectedCondition, setSelectedCondition] = useState<'stable' | 'needs_attention' | 'critical' | 'all'>('all')
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
                onValueChange={(value) => setSelectedCondition(value as 'stable' | 'needs_attention' | 'critical' | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Patient Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="needs_attention">Needs Attention</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
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
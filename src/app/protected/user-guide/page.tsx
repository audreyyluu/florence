"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Camera,
  AlertTriangle,
  Users,
  Map,
  Settings,
  Bell,
  Eye,
  Palette,
  Plus,
  ArrowLeft,
  Heart,
  MessageSquare,
  Activity,
  Clock,
  Search,
  Filter,
  ZoomIn,
  ZoomOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

export default function UserGuidePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const GuideSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="space-y-3 text-muted-foreground">
        {children}
      </div>
    </div>
  )

  const FeatureCard = ({ 
    icon: Icon, 
    title, 
    description, 
    href 
  }: { 
    icon: React.ElementType, 
    title: string, 
    description: string, 
    href: string 
  }) => (
    <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => router.push(href)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">User Guide</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/protected')}
          >
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meet Florence</CardTitle>
            <CardDescription>
              Your comprehensive hospital surveillance solution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Florence provides advanced surveillance technology designed specifically for healthcare environments, 
              helping medical staff provide better care through enhanced monitoring capabilities. This guide will 
              help you understand how to use the various features of the system.
            </p>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="rooms">Room Surveillance</TabsTrigger>
                <TabsTrigger value="features">Other Features</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[500px] pr-4">
                <TabsContent value="overview" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GuideSection title="Who is Florence?">
                      <p>
                        Florence is an AI agent with a comprehensive hospital surveillance system that enables operators to monitor 
                        patients remotely and respond quickly to emergencies. The system uses advanced camera technology 
                        and AI to detect potentially dangerous activities such as falls, distress signals, or unusual movements.
                      </p>
                      <p className="mt-2">
                        With Florence, surveillance operators can:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Monitor multiple patient rooms simultaneously</li>
                        <li>Receive alerts when patients need attention based on their activity</li>
                        <li>Track staff presence in each room</li>
                        <li>View patient vitals and medical history</li>
                        <li>Communicate with other staff members</li>
                      </ul>
                    </GuideSection>

                    <GuideSection title="Key Features">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FeatureCard 
                          icon={Camera} 
                          title="Dashboard" 
                          description="Monitor all patient rooms from a central location" 
                          href="/protected" 
                        />
                        <FeatureCard 
                          icon={AlertTriangle} 
                          title="Alerts History" 
                          description="View and manage patient alerts and incidents" 
                          href="/protected/alerts" 
                        />
                        <FeatureCard 
                          icon={Users} 
                          title="Staff Coordination" 
                          description="Track and manage staff presence throughout the facility" 
                          href="/protected/staffing" 
                        />
                        <FeatureCard 
                          icon={Map} 
                          title="Hospital Map" 
                          description="Interact with map showing room status and occupancy" 
                          href="/protected/map" 
                        />
                      </div>
                    </GuideSection>

                    <GuideSection title="Getting Started">
                      <p>
                        To get started with Florence, follow these steps:
                      </p>
                      <ol className="list-decimal pl-6 mt-2 space-y-2">
                        <li>
                          <span className="font-medium">Log in to your account</span>
                          <p className="text-sm mt-1">Use your provided credentials to access the system.</p>
                        </li>
                        <li>
                          <span className="font-medium">Navigate to the Dashboard</span>
                          <p className="text-sm mt-1">This is your central hub for monitoring all rooms.</p>
                        </li>
                        <li>
                          <span className="font-medium">Explore the features</span>
                          <p className="text-sm mt-1">Familiarize yourself with the different sections of the application.</p>
                        </li>
                        <li>
                          <span className="font-medium">Set up your preferences</span>
                          <p className="text-sm mt-1">Visit the Settings page to customize your experience.</p>
                        </li>
                      </ol>
                    </GuideSection>
                  </motion.div>
                </TabsContent>

                <TabsContent value="dashboard" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GuideSection title="Dashboard Overview">
                      <p>
                        The Dashboard is your central hub for monitoring all patient rooms. It provides a grid view of 
                        camera feeds from each room, allowing you to quickly assess the status of multiple patients at once.
                      </p>
                      <div className="mt-4 border rounded-md p-4 bg-muted/30">
                        <h4 className="font-medium mb-2">Key Elements:</h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <Eye className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <span className="font-medium">Surveillance Operators Count</span>
                              <p className="text-sm">Shows the number of operators currently monitoring the system</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Palette className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <span className="font-medium">Color Key</span>
                              <p className="text-sm">Explains the color coding system for room status</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Plus className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <span className="font-medium">Add Camera Button</span>
                              <p className="text-sm">Located in the bottom right, allows adding new camera feeds</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </GuideSection>

                    <GuideSection title="Understanding Room Status">
                      <p>
                        Each room is color-coded to indicate its current status:
                      </p>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span>Stable - No issues detected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                          <span>Check - Patient may need attention</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <span>Urgent - Immediate attention required</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <span>Alerted - Staff has been notified</span>
                        </div>
                      </div>
                    </GuideSection>

                    <GuideSection title="Navigating to Room View">
                      <p>
                        To view detailed information about a specific room:
                      </p>
                      <ol className="list-decimal pl-6 mt-2 space-y-1">
                        <li>Click on any room card in the dashboard grid</li>
                        <li>This will take you to the detailed Room Surveillance view</li>
                        <li>From there, you can monitor the patient more closely and access additional features</li>
                      </ol>
                    </GuideSection>

                    <GuideSection title="Adding a New Camera">
                      <p>
                        To add a new camera to the system:
                      </p>
                      <ol className="list-decimal pl-6 mt-2 space-y-1">
                        <li>Click the "+" button in the bottom right corner of the Dashboard</li>
                        <li>Enter the camera IP address in the format "192.168.1.100"</li>
                        <li>Enter the room number (e.g., "101")</li>
                        <li>Click "Add Camera" to save</li>
                      </ol>
                      <p className="mt-2 text-sm">
                        Note: You may need administrator privileges to add new cameras to the system.
                      </p>
                    </GuideSection>
                  </motion.div>
                </TabsContent>

                <TabsContent value="rooms" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GuideSection title="Room Surveillance View">
                      <p>
                        The Room Surveillance view provides detailed monitoring of a specific patient room. 
                        This view is divided into two main panels:
                      </p>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            Left Panel: Video Feed
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li>Main camera feed for the selected room</li>
                            <li>Timeline for reviewing recorded events</li>
                            <li>Additional camera feeds from nearby rooms</li>
                          </ul>
                        </div>
                        <div className="border rounded-md p-4">
                          <h4 className="font-medium mb-2">Right Panel: Information Tabs</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <span>Activity - Patient behavior and events</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span>Vitals - Patient health metrics and history</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span>Chat - Communication with staff</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </GuideSection>

                    <GuideSection title="Using the Timeline">
                      <p>
                        The timeline feature allows you to review recorded events:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>
                          <span className="font-medium">Playback Controls</span>
                          <p className="text-sm mt-1">Use the play/pause and skip buttons to control playback</p>
                        </li>
                        <li>
                          <span className="font-medium">Event Markers</span>
                          <p className="text-sm mt-1">Colored markers indicate events of different severity levels</p>
                        </li>
                        <li>
                          <span className="font-medium">Scrubbing</span>
                          <p className="text-sm mt-1">Click anywhere on the timeline to jump to that point in time</p>
                        </li>
                      </ul>
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>High Severity</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span>Medium Severity</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>Low Severity</span>
                        </div>
                      </div>
                    </GuideSection>

                    <GuideSection title="Viewing Patient Vitals">
                      <p>
                        The Vitals tab provides important health information:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>ECG Monitor - Real-time electrocardiogram display</li>
                        <li>Heart Rate - Beats per minute</li>
                        <li>Blood Pressure - Systolic/Diastolic readings</li>
                        <li>Temperature - Patient body temperature</li>
                        <li>Respiratory Rate - Breaths per minute</li>
                        <li>Oxygen Saturation - Blood oxygen percentage</li>
                      </ul>
                    </GuideSection>

                    <GuideSection title="Editing Medical History">
                      <p>
                        To edit a patient's medical history:
                      </p>
                      <ol className="list-decimal pl-6 mt-2 space-y-1">
                        <li>Navigate to the Vitals tab</li>
                        <li>Scroll down to the Medical History section</li>
                        <li>Click the "Edit" button in the top right corner</li>
                        <li>Update the diagnosis, allergies, and medications as needed</li>
                        <li>Click "Save" to confirm changes or "Cancel" to discard</li>
                      </ol>
                    </GuideSection>

                    <GuideSection title="Using the Chat Feature">
                      <p>
                        The Chat tab allows communication with healthcare staff:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Type messages in the input box at the bottom</li>
                        <li>Press Enter or click the send button to send messages</li>
                        <li>Scroll through previous messages in the conversation</li>
                        <li>Use this feature to coordinate care with other staff members</li>
                      </ul>
                    </GuideSection>
                  </motion.div>
                </TabsContent>

                <TabsContent value="features" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GuideSection title="Alerts History">
                      <p>
                        The Alerts History page allows you to view and manage all patient alerts:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>
                          <span className="font-medium">Filtering Options</span>
                          <p className="text-sm mt-1">Filter alerts by patient, severity, status, or date range</p>
                        </li>
                        <li>
                          <span className="font-medium">Alert Details</span>
                          <p className="text-sm mt-1">View comprehensive information about each alert</p>
                        </li>
                        <li>
                          <span className="font-medium">Quick Navigation</span>
                          <p className="text-sm mt-1">Jump directly to the relevant room from any alert</p>
                        </li>
                      </ul>
                      <div className="mt-3 flex items-center gap-2">
                        <p className="text-sm italic">
                          Access this feature by clicking "Alerts History" in the sidebar menu
                        </p>
                      </div>
                    </GuideSection>

                    <GuideSection title="Staff Coordination">
                      <p>
                        The Staff Coordination page helps manage medical personnel throughout the facility:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>
                          <span className="font-medium">Staff Directory</span>
                          <p className="text-sm mt-1">View all staff members, their roles, and current locations</p>
                        </li>
                        <li>
                          <span className="font-medium">Room Staffing</span>
                          <p className="text-sm mt-1">See which staff members are assigned to each room</p>
                        </li>
                        <li>
                          <span className="font-medium">Understaffed Alerts</span>
                          <p className="text-sm mt-1">Identify rooms that need additional personnel</p>
                        </li>
                      </ul>
                      <div className="mt-3 flex items-center gap-2">
                        <p className="text-sm italic">
                          Access this feature by clicking "Staff Coordination" in the sidebar menu
                        </p>
                      </div>
                    </GuideSection>

                    <GuideSection title="Hospital Map">
                      <p>
                        The Hospital Map provides a visual overview of the entire facility:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>
                          <span className="font-medium">Interactive Layout</span>
                          <p className="text-sm mt-1">Click on any room to view its details or navigate to it</p>
                        </li>
                        <li>
                          <span className="font-medium">Status Overview</span>
                          <p className="text-sm mt-1">Color-coded rooms indicate patient status at a glance</p>
                        </li>
                        <li>
                          <span className="font-medium">Filtering and Zooming</span>
                          <div className="flex items-center gap-2 mt-1 text-sm">
                            <span>Filter by floor, wing, or room status</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm">
                            <span>Zoom in/out for better visibility</span>
                          </div>
                        </li>
                      </ul>
                      <div className="mt-3 flex items-center gap-2">
                        <p className="text-sm italic">
                          Access this feature by clicking "Hospital Map" in the sidebar menu
                        </p>
                      </div>
                    </GuideSection>

                    <GuideSection title="Settings">
                      <p>
                        The Settings page allows you to customize your CareCam experience:
                      </p>
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>
                          <span className="font-medium">Account Settings</span>
                          <p className="text-sm mt-1">Update your profile information and email</p>
                        </li>
                        <li>
                          <span className="font-medium">Appearance</span>
                          <p className="text-sm mt-1">Toggle between light and dark mode</p>
                        </li>
                        <li>
                          <span className="font-medium">Security</span>
                          <p className="text-sm mt-1">Manage your account security settings</p>
                        </li>
                      </ul>
                      <div className="mt-3 flex items-center gap-2">
                        <p className="text-sm italic">
                          Access this feature by clicking "Settings" in the sidebar menu
                        </p>
                      </div>
                    </GuideSection>
                  </motion.div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.push('/protected')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
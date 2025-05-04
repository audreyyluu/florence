"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { 
  User, 
  Mail, 
  Image as ImageIcon, 
  Sun, 
  Moon, 
  Loader2, 
  Save, 
  AlertCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useAppState } from '@/contexts/AppStateContext'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const { state, updateUserPreferences } = useAppState()
  
  // Form state
  const [email, setEmail] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  console.log(user)

  // Mutations
  const updateEmail = (email: string) => { return true; }
  const updateProfileImage = (pfp: string) => { return true; }
  const updateTheme = (theme: string) => { return true; }
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setEmail("nathan@memorialcare.org")
      setImageUrl("https://img.freepik.com/premium-photo/headshot-doctor_810293-454.jpg")
    }
  }, [user])
  
  // Handle email update
  const handleEmailUpdate = async () => {
    if (!email) {
      setError("Email cannot be empty")
      return
    }
    
    setIsSaving(true)
    setError(null)
    
    try {
      //await updateEmail({ email })
      toast.success("Email updated successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update email")
      toast.error("Failed to update email")
    } finally {
      setIsSaving(false)
    }
  }
  
  // Handle profile image update
  const handleImageUpdate = async () => {
    if (!imageUrl) {
      setError("Image URL cannot be empty")
      return
    }
    
    setIsSaving(true)
    setError(null)
    
    try {
      //await updateProfileImage({ imageUrl })
      toast.success("Profile image updated successfully")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile image")
      toast.error("Failed to update profile image")
    } finally {
      setIsSaving(false)
    }
  }
  
  // Handle theme toggle
  const handleThemeChange = async (newTheme: "light" | "dark") => {
    setTheme(newTheme)
    
    try {
      //await updateTheme({ theme: newTheme })
    } catch (err) {
      console.error("Failed to save theme preference:", err)
    }
  }

  // Handle notification preference change
  const handleNotificationChange = (enabled: boolean) => {
    updateUserPreferences({ showNotifications: enabled })
  }

  // Handle default view change
  const handleDefaultViewChange = (view: string) => {
    updateUserPreferences({ defaultView: view })
  }

  // Handle zoom level change
  const handleZoomLevelChange = (level: number) => {
    updateUserPreferences({ zoomLevel: level })
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user) return "U"
    return "Nathan Che".split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }
  
  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/protected')}
          >
            Back to Dashboard
          </Button>
        </div>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={imageUrl || ""} alt={"User"} />
                    <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-medium">{"Nathan Che"}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                      />
                      <Button 
                        onClick={handleEmailUpdate}
                        disabled={isSaving || email === user?.email}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">Profile Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/your-image.jpg"
                      />
                      <Button 
                        onClick={handleImageUpdate}
                        disabled={isSaving || imageUrl === imageUrl}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <ImageIcon className="h-4 w-4 mr-2" />
                        )}
                        Update
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter a URL for your profile image
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Security Section */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <p className="text-sm text-muted-foreground">
                    Password changes are managed through the authentication system.
                    To reset your password, log out and use the "Forgot password" option.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="theme-mode">Dark Mode</Label>
                    <span className="text-sm text-muted-foreground">
                      Toggle between light and dark mode
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5 text-muted-foreground" />
                    <Switch
                      id="theme-mode"
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => 
                        handleThemeChange(checked ? "dark" : "light")
                      }
                    />
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4 bg-background">
                    <div className="font-medium mb-2">Light Mode Preview</div>
                    <div className="h-24 bg-white border rounded-md flex items-center justify-center">
                      <div className="w-16 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center text-xs">
                        Button
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-950 text-white">
                    <div className="font-medium mb-2">Dark Mode Preview</div>
                    <div className="h-24 bg-gray-800 border border-gray-700 rounded-md flex items-center justify-center">
                      <div className="w-16 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center text-xs">
                        Button
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
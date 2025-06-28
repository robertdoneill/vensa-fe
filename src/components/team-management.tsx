import * as React from "react"
import { 
  IconPlus, 
  IconMail, 
  IconUser, 
  IconTrash,
  IconCheck,
  IconX,
  IconCrown,
  IconShield
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

import { usersApi, type OrganizationUser } from "@/lib/api/users"
import { invitationService } from "@/lib/email/invitation-service"

// Extended interface for team members with role information
interface TeamMember extends OrganizationUser {
  role: 'admin' | 'member' | 'viewer'
  invited_at?: string
  last_login?: string
  status: 'active' | 'invited' | 'inactive'
}

interface InviteFormData {
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'member' | 'viewer'
}

export function TeamManagement() {
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = React.useState(false)
  const [isInviting, setIsInviting] = React.useState(false)
  
  const [inviteForm, setInviteForm] = React.useState<InviteFormData>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'member'
  })

  // Load team members
  React.useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setIsLoading(true)
        const users = await usersApi.getOrganizationUsers()
        
        // Transform users to team members with mock role data
        // In a real app, this would come from the backend
        const transformedMembers: TeamMember[] = users.map((user, index) => ({
          ...user,
          role: index === 0 ? 'admin' : 'member', // First user is admin for demo
          status: user.is_active ? 'active' : 'inactive',
          last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }))
        
        setTeamMembers(transformedMembers)
      } catch (error) {
        console.error('Failed to load team members:', error)
        toast.error('Failed to load team members')
      } finally {
        setIsLoading(false)
      }
    }

    loadTeamMembers()
  }, [])

  const handleInvite = async () => {
    if (!inviteForm.email || !inviteForm.firstName || !inviteForm.lastName) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsInviting(true)
    
    try {
      // Send invitation via backend API
      const result = await invitationService.sendInvitation({
        email: inviteForm.email,
        firstName: inviteForm.firstName,
        lastName: inviteForm.lastName,
        role: inviteForm.role,
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to send invitation')
      }

      // Add pending invite to local state
      const newMember: TeamMember = {
        id: Date.now(), // Mock ID
        username: inviteForm.email.split('@')[0],
        first_name: inviteForm.firstName,
        last_name: inviteForm.lastName,
        email: inviteForm.email,
        is_active: false,
        role: inviteForm.role,
        status: 'invited',
        invited_at: new Date().toISOString()
      }

      setTeamMembers(prev => [...prev, newMember])
      
      toast.success('Invitation sent successfully!', {
        description: `${inviteForm.firstName} ${inviteForm.lastName} will receive an email at ${inviteForm.email}`
      })
      
      // Reset form and close dialog
      setInviteForm({
        email: '',
        firstName: '',
        lastName: '',
        role: 'member'
      })
      setIsInviteDialogOpen(false)
    } catch (error) {
      console.error('Failed to send invitation:', error)
      toast.error('Failed to send invitation', {
        description: error instanceof Error ? error.message : 'Please try again or contact support'
      })
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    const member = teamMembers.find(m => m.id === memberId)
    if (!member) return

    if (!confirm(`Are you sure you want to remove ${member.first_name} ${member.last_name} from the team?`)) {
      return
    }

    try {
      // In a real app, this would call a remove user API endpoint
      setTeamMembers(prev => prev.filter(m => m.id !== memberId))
      
      toast.success('Team member removed', {
        description: `${member.first_name} ${member.last_name} has been removed from the team`
      })
    } catch (error) {
      console.error('Failed to remove team member:', error)
      toast.error('Failed to remove team member')
    }
  }

  const handleRoleChange = async (memberId: number, newRole: TeamMember['role']) => {
    try {
      setTeamMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ))
      
      const member = teamMembers.find(m => m.id === memberId)
      toast.success('Role updated', {
        description: `${member?.first_name} ${member?.last_name}'s role has been updated to ${newRole}`
      })
    } catch (error) {
      console.error('Failed to update role:', error)
      toast.error('Failed to update role')
    }
  }

  const getRoleBadge = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <IconCrown className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        )
      case 'member':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <IconShield className="h-3 w-3 mr-1" />
            Member
          </Badge>
        )
      case 'viewer':
        return (
          <Badge variant="secondary">
            <IconUser className="h-3 w-3 mr-1" />
            Viewer
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <IconCheck className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case 'invited':
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <IconMail className="h-3 w-3 mr-1" />
            Invited
          </Badge>
        )
      case 'inactive':
        return (
          <Badge variant="outline" className="text-gray-500">
            <IconX className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your organization's team members and their permissions
              </CardDescription>
            </div>
            
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to add a new member to your organization
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={inviteForm.firstName}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={inviteForm.lastName}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value: TeamMember['role']) => 
                        setInviteForm(prev => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer - Can view data only</SelectItem>
                        <SelectItem value="member">Member - Can create and edit</SelectItem>
                        <SelectItem value="admin">Admin - Full access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsInviteDialogOpen(false)}
                    disabled={isInviting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleInvite} disabled={isInviting}>
                    {isInviting ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading team members...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-sm">
                            {member.first_name?.[0]}{member.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {member.first_name} {member.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(member.role)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(member.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {member.last_login 
                          ? new Date(member.last_login).toLocaleDateString()
                          : member.status === 'invited' 
                            ? 'Not yet accepted'
                            : 'Never'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleRoleChange(member.id, 'admin')}
                            disabled={member.role === 'admin'}
                          >
                            <IconCrown className="h-4 w-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRoleChange(member.id, 'member')}
                            disabled={member.role === 'member'}
                          >
                            <IconShield className="h-4 w-4 mr-2" />
                            Make Member
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRoleChange(member.id, 'viewer')}
                            disabled={member.role === 'viewer'}
                          >
                            <IconUser className="h-4 w-4 mr-2" />
                            Make Viewer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <IconTrash className="h-4 w-4 mr-2" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
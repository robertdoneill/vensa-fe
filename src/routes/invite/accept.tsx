import * as React from "react"
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { IconCheck, IconX, IconLoader2 } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { invitationService } from "@/lib/email/invitation-service"

interface InviteSearchParams {
  token?: string
}

export const Route = createFileRoute('/invite/accept')({
  component: AcceptInvitePage,
  validateSearch: (search: Record<string, unknown>): InviteSearchParams => {
    return {
      token: typeof search.token === 'string' ? search.token : undefined,
    }
  },
})

function AcceptInvitePage() {
  const navigate = useNavigate()
  const { token } = Route.useSearch()
  
  const [isLoading, setIsLoading] = React.useState(true)
  const [isAccepting, setIsAccepting] = React.useState(false)
  const [inviteData, setInviteData] = React.useState<{
    inviterName: string
    organizationName: string
    role: string
    email: string
  } | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  
  const [formData, setFormData] = React.useState({
    password: '',
    confirmPassword: ''
  })

  // Validate invite token on mount
  React.useEffect(() => {
    const validateInvite = async () => {
      if (!token) {
        setError('Invalid invitation link - missing token')
        setIsLoading(false)
        return
      }

      try {
        const result = await invitationService.validateInvitation(token)
        
        if (!result.success) {
          throw new Error(result.error || 'Invalid invitation')
        }
        
        if (result.invitation) {
          setInviteData(result.invitation)
        }
      } catch (error) {
        console.error('Failed to validate invite:', error)
        setError(error instanceof Error ? error.message : 'Invalid or expired invitation link')
      } finally {
        setIsLoading(false)
      }
    }

    validateInvite()
  }, [token])

  const handleAcceptInvite = async () => {
    if (!formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setIsAccepting(true)

    try {
      if (!token) {
        throw new Error('Invalid invitation token')
      }

      const result = await invitationService.acceptInvitation(token, formData.password)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create account')
      }
      
      toast.success('Welcome to Vensa!', {
        description: 'Your account has been created successfully'
      })
      
      // Redirect to login or dashboard
      navigate({ to: '/dashboard' })
    } catch (error) {
      console.error('Failed to accept invitation:', error)
      toast.error('Failed to create account', {
        description: error instanceof Error ? error.message : 'Please try again or contact support'
      })
    } finally {
      setIsAccepting(false)
    }
  }

  const handleDeclineInvite = () => {
    if (confirm('Are you sure you want to decline this invitation?')) {
      toast.info('Invitation declined')
      // In a real app, you might want to call an API to mark the invite as declined
      navigate({ to: '/' })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <IconLoader2 className="h-5 w-5 animate-spin" />
              <span>Validating invitation...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <IconX className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-900">Invalid Invitation</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate({ to: '/' })}
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <IconCheck className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>You're Invited!</CardTitle>
          <CardDescription>
            {inviteData?.inviterName} has invited you to join{" "}
            <strong>{inviteData?.organizationName}</strong> as a{" "}
            <strong>{inviteData?.role}</strong>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={inviteData?.email || ''}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Create Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter a secure password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2 pt-4">
            <Button 
              className="w-full" 
              onClick={handleAcceptInvite}
              disabled={isAccepting}
            >
              {isAccepting ? (
                <>
                  <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Accept Invitation & Join'
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleDeclineInvite}
              disabled={isAccepting}
            >
              Decline Invitation
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500 pt-2">
            By accepting, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
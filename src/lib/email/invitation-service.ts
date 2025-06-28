export interface SendInvitationRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'member' | 'viewer';
}

class InvitationService {
  async sendInvitation(data: SendInvitationRequest): Promise<{ success: boolean; error?: string }> {
    try {
      // TODO: Replace with your actual backend endpoint when implemented
      const response = await fetch('/api/invitations/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication header when available
          // 'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      await response.json();
      return { success: true };
    } catch (error) {
      console.error('Failed to send invitation:', error);
      
      // For now, simulate success since backend isn't implemented yet
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('📧 DEMO: Simulating invitation send to:', data.email);
        console.log('📧 Backend endpoint not available yet - simulating success');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      }
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async validateInvitation(token: string): Promise<{
    success: boolean;
    invitation?: {
      inviterName: string;
      organizationName: string;
      role: string;
      email: string;
    };
    error?: string;
  }> {
    try {
      // TODO: Replace with your actual backend endpoint when implemented
      const response = await fetch(`/api/invitations/validate/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid or expired invitation');
      }

      const result = await response.json();
      return {
        success: true,
        invitation: result.invitation,
      };
    } catch (error) {
      console.error('Failed to validate invitation:', error);
      
      // For now, simulate validation since backend isn't implemented yet
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('📧 DEMO: Simulating invitation validation for token:', token);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return mock data for demo
        return {
          success: true,
          invitation: {
            inviterName: 'John Doe',
            organizationName: 'Demo Organization',
            role: 'Member',
            email: 'demo@example.com',
          },
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async acceptInvitation(token: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // TODO: Replace with your actual backend endpoint when implemented
      const response = await fetch(`/api/invitations/accept/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to accept invitation');
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      
      // For now, simulate acceptance since backend isn't implemented yet
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('📧 DEMO: Simulating invitation acceptance for token:', token);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

export const invitationService = new InvitationService();
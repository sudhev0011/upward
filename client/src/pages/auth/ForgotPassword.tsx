import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Mail, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { useForgotPasswordMutation } from '@/hooks/auth/useForgotPassword'

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {mutateAsync: forgotPassword, isPending, error} = useForgotPasswordMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email.trim()) {
      toast.error('please provide an email');
      return
    }
    
    try {
      await forgotPassword(formData.email)

      toast.success('Password Reset Email Sent!', {
        description: `We've sent a password reset link to ${formData.email}`
      })
      setIsSubmitted(true)
    } catch {
      toast.error('Failed to Send Reset Email', {
        description: 'Please check your email address and try again'
      })
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-md">
            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Check Your Email</h2>
                    <p className="text-muted-foreground">
                      We've sent a password reset link to{' '}
                      <strong className="text-foreground">{formData.email}</strong>
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Please check your email and click the link to reset your password. 
                      The link will expire in 1 hour.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button asChild className="w-full">
                      <Link to="/login">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Back to Login
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md">
          {error && (
            <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error.message}</span>
            </div>
          )}
          
          <Card className="shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isPending}>
                  <div className="flex items-center space-x-2">
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    <span>Send Reset Link</span>
                  </div>
                </Button>
              </form>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Button 
                    variant="link" 
                    asChild
                    className="p-0 h-auto font-semibold"
                  >
                    <Link to="/login">Back to Login</Link>
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ForgotPassword
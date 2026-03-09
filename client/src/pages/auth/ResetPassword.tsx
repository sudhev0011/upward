import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, ArrowUpRight, CheckCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useResetPasswordMutation } from '@/hooks/auth/useResetPassword'

const PasswordStrength = ({ password }: { password: string }) => {
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Uppercase letter',       pass: /[A-Z]/.test(password) },
    { label: 'Number',                 pass: /\d/.test(password) },
  ]
  const score = checks.filter(c => c.pass).length

  const barColor =
    score === 0 ? 'bg-gray-200' :
    score === 1 ? 'bg-red-400' :
    score === 2 ? 'bg-amber-400' :
    'bg-green-500'

  if (!password) return null

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {checks.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? barColor : 'bg-gray-100'
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-1">
            <div className={`h-1.5 w-1.5 rounded-full ${c.pass ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className={`text-xs ${c.pass ? 'text-green-600' : 'text-gray-400'}`}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ResetPassword = () => {
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew]                 = useState(false)
  const [showConfirm, setShowConfirm]         = useState(false)
  const [fieldError, setFieldError]           = useState('')
  const [isReset, setIsReset]                 = useState(false)

  const { mutateAsync: resetPassword, isPending } = useResetPasswordMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldError('')

    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')

    if (!token) { setFieldError('Invalid or missing reset token'); return }
    if (newPassword.length < 6) { setFieldError('Password must be at least 6 characters'); return }
    if (newPassword !== confirmPassword) { setFieldError('Passwords do not match'); return }

    try {
      await resetPassword({ token, newPassword })
      toast.success('Password reset successfully!')
      setIsReset(true)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to reset password.'
      setFieldError(msg)
      toast.error(msg)
    }
  }

  /* ── Success state ── */
  if (isReset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-sm text-center"
        >
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 border border-green-100">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-2">
            Password updated!
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#719FC4] py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#5585A8] hover:shadow-md hover:-translate-y-px"
          >
            Go to Login <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  /* ── Form state ── */
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Left: Form ── */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:flex-none xl:w-5/12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto w-full max-w-sm"
        >
          {/* Brand */}
          <Link to="/" className="mb-10 inline-flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#719FC4] transition-colors duration-200 group-hover:bg-[#5585A8]">
              <ArrowUpRight className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">Upward</span>
          </Link>

          {/* Icon + heading */}
          <div className="mb-8">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2F9]">
              <ShieldCheck className="h-5 w-5 text-[#719FC4]" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Reset password
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Choose a strong new password for your account.
            </p>
          </div>

          {/* Field error */}
          {fieldError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium text-red-600"
            >
              {fieldError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* New password */}
            <div>
              <label htmlFor="newPassword" className="mb-1.5 block text-sm font-semibold text-gray-700">
                New password
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-[#719FC4]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="newPassword"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setFieldError('') }}
                  placeholder="Enter new password"
                  // required
                  className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-[#719FC4] focus:outline-none focus:ring-2 focus:ring-[#719FC4]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrength password={newPassword} />
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Confirm new password
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 transition-colors group-focus-within:text-[#719FC4]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setFieldError('') }}
                  placeholder="Re-enter new password"
                  // required
                  className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-[#719FC4] focus:outline-none focus:ring-2 focus:ring-[#719FC4]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Match indicator */}
              {confirmPassword && (
                <p className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium ${
                  newPassword === confirmPassword ? 'text-green-600' : 'text-red-500'
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${
                    newPassword === confirmPassword ? 'bg-green-500' : 'bg-red-400'
                  }`} />
                  {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#719FC4] py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#5585A8] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#719FC4]/40 ${
                isPending ? 'cursor-wait opacity-70' : 'hover:-translate-y-px'
              }`}
            >
              {isPending ? 'Resetting…' : 'Reset Password'}
              {!isPending && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link to="/login" className="font-bold text-[#719FC4] hover:text-[#5585A8] transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ── Right: Decorative panel ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-center overflow-hidden bg-gray-900 p-16 relative">
        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(113,159,196,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(113,159,196,0.07) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#719FC4]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#719FC4]/10 blur-3xl" />

        {/* Top brand */}
        <div className="relative mb-auto flex items-center gap-2 pb-16">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#719FC4]">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight">Upward</span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5">
            Keep your<br />account safe.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm mb-10">
            A strong password is your first line of defence. Make it unique and something only you would know.
          </p>

          {/* Tips */}
          <div className="space-y-4">
            {[
              { icon: ShieldCheck, tip: 'Use at least 8 characters with a mix of letters and numbers' },
              { icon: Lock,         tip: 'Avoid reusing passwords from other sites' },
              { icon: CheckCircle,  tip: 'Consider using a passphrase — easier to remember, harder to guess' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#719FC4]/15 text-[#719FC4]">
                  <item.icon className="h-4 w-4" />
                </div>
                <p className="text-sm text-gray-400 leading-relaxed pt-1.5">{item.tip}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative mt-auto pt-16" />
      </div>

    </div>
  )
}

export default ResetPassword
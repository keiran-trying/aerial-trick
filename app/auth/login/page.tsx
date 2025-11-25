import { AuthForm } from '@/components/auth-form'

export default function LoginPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4 py-safe overflow-hidden">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white mb-1">Aerial Tricks</h1>
          <p className="text-sm text-white/90">Master aerial yoga, one trick at a time</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}


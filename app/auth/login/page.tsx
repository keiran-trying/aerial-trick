import { AuthForm } from '@/components/auth-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Aerial Trick</h1>
          <p className="text-white/90">Master aerial yoga, one trick at a time</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}


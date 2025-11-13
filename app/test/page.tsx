export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ✅ It Works!
        </h1>
        <p className="text-gray-600 mb-4">
          Your Next.js app is running successfully!
        </p>
        <div className="space-y-2 text-left">
          <p className="text-sm text-gray-700">
            ✓ Next.js is working
          </p>
          <p className="text-sm text-gray-700">
            ✓ Tailwind CSS is working
          </p>
          <p className="text-sm text-gray-700">
            ✓ Server is running on port 3000
          </p>
        </div>
        <a 
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Go to Home Page
        </a>
      </div>
    </div>
  )
}



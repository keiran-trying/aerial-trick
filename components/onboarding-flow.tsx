'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react'

type SkillLevel = 'easy' | 'intermediate' | 'advanced'
type Interest = 'open_fabric' | 'single_strand' | 'thigh_lock' | 'footlock' | 'mermaid' | 'skirt' | 'pigeon' | 'inversions' | 'sequences' | 'other'
type FabricLength = 'long' | 'short' | 'both'

export function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(null)
  const [interests, setInterests] = useState<Interest[]>([])
  const [fabricLength, setFabricLength] = useState<FabricLength | null>(null)
  const [likesDrop, setLikesDrop] = useState<boolean | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const interestOptions: { value: Interest; label: string; emoji: string }[] = [
    { value: 'open_fabric', label: 'Open Fabric', emoji: '🎪' },
    { value: 'single_strand', label: 'Single Strand', emoji: '🪢' },
    { value: 'mermaid', label: 'Mermaid', emoji: '🧜‍♀️' },
    { value: 'skirt', label: 'Skirt', emoji: '👗' },
    { value: 'pigeon', label: 'Pigeon', emoji: '🕊️' },
    { value: 'thigh_lock', label: 'Thigh Lock', emoji: '🦵' },
    { value: 'footlock', label: 'Foot Lock', emoji: '👣' },
    { value: 'inversions', label: 'Inversions', emoji: '🙃' },
    { value: 'sequences', label: 'Sequences', emoji: '🎬' },
    { value: 'other', label: 'Other', emoji: '✨' },
  ]

  const toggleInterest = (interest: Interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest))
    } else {
      setInterests([...interests, interest])
    }
  }

  const handleSubmit = async () => {
    if (!skillLevel || !fabricLength || likesDrop === null) {
      alert('Please answer all questions')
      return
    }

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in first')
        return
      }

      // Save preferences
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          skill_level: skillLevel,
          interests: interests,
          fabric_length: fabricLength,
          likes_drop: likesDrop,
          onboarding_completed_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Error saving preferences:', error)
        alert('Failed to save preferences. Please try again.')
        return
      }

      // Redirect to home
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error during onboarding:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Welcome to Aerial Trick!</h1>
          </div>
          <p className="text-white/90 text-sm">
            Let's personalize your experience
          </p>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Skill Level */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  What's your skill level?
                </h2>
                <p className="text-sm text-gray-600">
                  This helps us recommend the right tutorials for you
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'easy' as SkillLevel, label: 'Beginner', desc: 'New to aerial yoga', emoji: '🌱' },
                  { value: 'intermediate' as SkillLevel, label: 'Intermediate', desc: 'Some experience', emoji: '🌿' },
                  { value: 'advanced' as SkillLevel, label: 'Advanced', desc: 'Very experienced', emoji: '🌳' },
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSkillLevel(level.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                      skillLevel === level.value
                        ? 'border-purple-600 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl">{level.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{level.label}</h3>
                      <p className="text-sm text-gray-600">{level.desc}</p>
                    </div>
                    {skillLevel === level.value && (
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  What interests you?
                </h2>
                <p className="text-sm text-gray-600">
                  Select all that apply (you can change this later)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => toggleInterest(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      interests.includes(option.value)
                        ? 'border-purple-600 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{option.emoji}</span>
                    <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Fabric Length */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Fabric length preference?
                </h2>
                <p className="text-sm text-gray-600">
                  Do you prefer long or short fabric for your practice?
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'long' as FabricLength, label: 'Long Fabric', desc: 'More room for drops and sequences', emoji: '📏' },
                  { value: 'short' as FabricLength, label: 'Short Fabric', desc: 'Lower to the ground, safer for beginners', emoji: '📐' },
                  { value: 'both' as FabricLength, label: 'Both', desc: 'I practice with different lengths', emoji: '✨' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFabricLength(option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                      fabricLength === option.value
                        ? 'border-purple-600 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                    {fabricLength === option.value && (
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Drops */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  How about drops?
                </h2>
                <p className="text-sm text-gray-600">
                  Drop tutorials are more advanced and require experience
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { value: true, label: 'Yes, I love drops!', desc: 'Show me drop tutorials', emoji: '🎢' },
                  { value: false, label: 'Not yet', desc: 'Maybe later when I\'m ready', emoji: '🤔' },
                ].map((option) => (
                  <button
                    key={option.value.toString()}
                    onClick={() => setLikesDrop(option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                      likesDrop === option.value
                        ? 'border-purple-600 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                    {likesDrop === option.value && (
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !skillLevel}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!skillLevel || !fabricLength || likesDrop === null || isSubmitting}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    Get Started
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


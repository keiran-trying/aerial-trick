'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heart, MessageCircle, Plus, Image as ImageIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Database } from '@/lib/types/database.types'

type Post = Database['public']['Tables']['posts']['Row'] & {
  author: { name: string | null; profile_pic: string | null }
  user_liked: boolean
}

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostMedia, setNewPostMedia] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          *,
          author:users!posts_author_id_fkey (name, profile_pic)
        `)
        .order('created_at', { ascending: false })

      if (user && postsData) {
        // Check which posts the user has liked
        const { data: likesData } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id)

        const likedPostIds = new Set(likesData?.map(l => l.post_id) || [])
        
        setPosts(postsData.map(post => ({
          ...post,
          author: post.author as any,
          user_liked: likedPostIds.has(post.id)
        })))
      } else {
        setPosts(postsData?.map(post => ({
          ...post,
          author: post.author as any,
          user_liked: false
        })) || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    try {
      if (currentlyLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
      } else {
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id })
      }

      // Update local state
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: currentlyLiked ? post.likes - 1 : post.likes + 1,
            user_liked: !currentlyLiked
          }
        }
        return post
      }))
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostContent.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      let mediaUrl = null
      let mediaType = null

      // Upload media if provided
      if (newPostMedia) {
        const fileExt = newPostMedia.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, newPostMedia)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('posts')
          .getPublicUrl(uploadData.path)

        mediaUrl = urlData.publicUrl
        mediaType = newPostMedia.type.startsWith('image/') ? 'image' : 'video'
      }

      const { data: postData, error } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          content: newPostContent.trim(),
          media_url: mediaUrl,
          media_type: mediaType as any,
        })
        .select(`
          *,
          author:users!posts_author_id_fkey (name, profile_pic)
        `)
        .single()

      if (error) throw error

      setPosts([{ ...postData, author: postData.author as any, user_liked: false }, ...posts])
      setNewPostContent('')
      setNewPostMedia(null)
      setShowNewPost(false)
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="h-20 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      {/* New Post Button */}
      <button
        onClick={() => setShowNewPost(true)}
        className="fixed bottom-24 right-4 z-30 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">New Post</h2>
              <button
                onClick={() => setShowNewPost(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPost} className="space-y-4">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind? Share your practice, ask questions..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-32 resize-none"
              />

              <div>
                <label className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {newPostMedia ? newPostMedia.name : 'Add photo or video'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setNewPostMedia(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={!newPostContent.trim() || isSubmitting}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="p-4 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Author Info */}
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                {post.author?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {post.author?.name || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Media - Vertical/Portrait */}
            {post.media_url && (
              <div className="relative bg-gray-100">
                {post.media_type === 'image' ? (
                  <img
                    src={post.media_url}
                    alt="Post media"
                    className="w-full aspect-[9/16] object-cover"
                  />
                ) : (
                  <video controls className="w-full aspect-[9/16] object-cover" playsInline>
                    <source src={post.media_url} type="video/mp4" />
                  </video>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="p-4 flex items-center gap-6 border-t">
              <button
                onClick={() => handleLike(post.id, post.user_liked)}
                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                <Heart
                  className={post.user_liked ? 'fill-red-500 text-red-500' : ''}
                />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <button
                onClick={() => router.push(`/post/${post.id}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-500 transition-colors"
              >
                <MessageCircle />
                <span className="text-sm font-medium">Comment</span>
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm mt-1">Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}


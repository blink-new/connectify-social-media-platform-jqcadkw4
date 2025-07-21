import { useState, useEffect, useCallback } from 'react'
import { blink } from '../blink/client'
import { PostCard } from './PostCard'
import { StoriesBar } from './StoriesBar'

type User = {
  id: string
  email: string
  username: string
  displayName: string
  bio?: string
  avatarUrl?: string
  followersCount: number
  followingCount: number
  postsCount: number
}

type Post = {
  id: string
  userId: string
  content: string
  imageUrl?: string
  likesCount: number
  commentsCount: number
  createdAt: string
  user?: User
  isLiked?: boolean
}

interface FeedProps {
  user: User
}

export function Feed({ user }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true)
      
      // Get all posts with user information
      const allPosts = await blink.db.posts.list({
        orderBy: { created_at: 'desc' },
        limit: 50
      })

      // Get user information for each post
      const postsWithUsers = await Promise.all(
        allPosts.map(async (post: any) => {
          const postUsers = await blink.db.users.list({
            where: { id: post.user_id },
            limit: 1
          })
          
          // Check if current user liked this post
          const likes = await blink.db.likes.list({
            where: { 
              AND: [
                { user_id: user.id },
                { post_id: post.id }
              ]
            },
            limit: 1
          })

          // Convert database fields to camelCase for frontend
          return {
            id: post.id,
            userId: post.user_id,
            content: post.content,
            imageUrl: post.image_url,
            likesCount: post.likes_count,
            commentsCount: post.comments_count,
            createdAt: post.created_at,
            user: postUsers[0] as User,
            isLiked: likes.length > 0
          }
        })
      )

      setPosts(postsWithUsers)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const handleLike = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      if (post.isLiked) {
        // Unlike
        const likes = await blink.db.likes.list({
          where: { 
            AND: [
              { user_id: user.id },
              { post_id: postId }
            ]
          },
          limit: 1
        })
        
        if (likes.length > 0) {
          await blink.db.likes.delete(likes[0].id)
          await blink.db.posts.update(postId, {
            likes_count: Math.max(0, post.likesCount - 1)
          })
        }
      } else {
        // Like
        await blink.db.likes.create({
          id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_id: user.id,
          post_id: postId
        })
        await blink.db.posts.update(postId, {
          likes_count: post.likesCount + 1
        })
      }

      // Refresh posts
      loadPosts()
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                  <div className="w-16 h-3 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="w-full h-4 bg-muted rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-muted rounded animate-pulse" />
              </div>
              <div className="w-full h-64 bg-muted rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stories Bar */}
      <StoriesBar />
      
      {/* Posts Feed */}
      <div className="p-6 space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground">Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={user}
              onLike={() => handleLike(post.id)}
              onComment={() => {
                // TODO: Implement comment functionality
                console.log('Comment on post:', post.id)
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

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

interface PostCardProps {
  post: Post
  currentUser: User
  onLike: () => void
  onComment: () => void
}

export function PostCard({ post, currentUser, onLike, onComment }: PostCardProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.user?.avatarUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {post.user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.user?.displayName || 'Unknown User'}</p>
            <p className="text-sm text-muted-foreground">
              @{post.user?.username || 'unknown'} • {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="px-4 pb-3">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full rounded-lg object-cover max-h-96"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={`flex items-center gap-2 ${
              post.isLiked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart 
              className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} 
            />
            <span className="text-sm">{post.likesCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onComment}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.commentsCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Share className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { X, Image as ImageIcon, Smile } from 'lucide-react'
import { blink } from '../blink/client'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { useToast } from '../hooks/use-toast'

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

interface CreatePostProps {
  user: User
  onClose: () => void
  onPostCreated: () => void
}

export function CreatePost({ user, onClose, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const { toast } = useToast()

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handlePost = async () => {
    if (!content.trim() && !image) {
      toast({
        title: "Error",
        description: "Please add some content or an image to your post.",
        variant: "destructive"
      })
      return
    }

    setIsPosting(true)
    try {
      let imageUrl = ''
      
      // Upload image if selected
      if (image) {
        const { publicUrl } = await blink.storage.upload(
          image,
          `posts/${Date.now()}_${image.name}`,
          { upsert: true }
        )
        imageUrl = publicUrl
      }

      // Create post
      await blink.db.posts.create({
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        content: content.trim(),
        imageUrl: imageUrl || undefined,
        likesCount: 0,
        commentsCount: 0
      })

      // Update user's post count
      await blink.db.users.update(user.id, {
        postsCount: user.postsCount + 1
      })

      toast({
        title: "Success",
        description: "Your post has been shared!"
      })

      onPostCreated()
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Create Post</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.displayName}</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>

          {/* Text Input */}
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none border-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground"
            maxLength={500}
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full rounded-lg object-cover max-h-64"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Character Count */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{content.length}/500</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <label htmlFor="image-upload">
              <Button variant="ghost" size="sm" asChild>
                <span className="cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                </span>
              </Button>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <Button variant="ghost" size="sm">
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={handlePost}
            disabled={isPosting || (!content.trim() && !image)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isPosting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>
    </div>
  )
}
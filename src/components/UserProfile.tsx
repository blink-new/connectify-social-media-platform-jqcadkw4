import { useState } from 'react'
import { Settings, Grid, Bookmark } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

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

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('posts')

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-card border-b border-border">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              <Avatar className="w-32 h-32">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                  {user.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold">{user.displayName}</h1>
                <div className="flex gap-2 justify-center md:justify-start">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 justify-center md:justify-start mb-4">
                <div className="text-center">
                  <div className="font-bold text-lg">{user.postsCount}</div>
                  <div className="text-sm text-muted-foreground">posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{user.followersCount}</div>
                  <div className="text-sm text-muted-foreground">followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{user.followingCount}</div>
                  <div className="text-sm text-muted-foreground">following</div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <p className="font-medium">@{user.username}</p>
                {user.bio && (
                  <p className="text-muted-foreground">{user.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-card border-b border-border rounded-none h-12">
          <TabsTrigger 
            value="posts" 
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger 
            value="saved" 
            className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Saved</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          <div className="p-6">
            {user.postsCount === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-2 border-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground">When you share photos, they'll appear on your profile.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {/* Post grid will be populated with actual posts */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                  >
                    <span className="text-muted-foreground text-sm">Post {i + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 border-2 border-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Saved Posts</h3>
              <p className="text-muted-foreground">Save posts you want to see again.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
import { Home, Search, MessageCircle, User, Settings, Plus, LogOut } from 'lucide-react'
import { blink } from '../blink/client'
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

type Page = 'feed' | 'profile' | 'explore' | 'messages' | 'settings'

interface SidebarProps {
  user: User
  currentPage: Page
  onPageChange: (page: Page) => void
  onCreatePost: () => void
}

export function Sidebar({ user, currentPage, onPageChange, onCreatePost }: SidebarProps) {
  const menuItems = [
    { id: 'feed' as Page, label: 'Home', icon: Home },
    { id: 'explore' as Page, label: 'Explore', icon: Search },
    { id: 'messages' as Page, label: 'Messages', icon: MessageCircle },
    { id: 'profile' as Page, label: 'Profile', icon: User },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden fixed inset-0 bg-black/50 z-40" />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 lg:z-auto">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold">Connectify</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Create Post Button */}
          <Button 
            onClick={onCreatePost}
            className="w-full mb-8 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>

          {/* User Profile */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.displayName}</p>
                <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => blink.auth.logout()}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Sidebar } from './components/Sidebar'
import { Feed } from './components/Feed'
import { CreatePost } from './components/CreatePost'
import { UserProfile } from './components/UserProfile'
import { Toaster } from './components/ui/toaster'

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

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<Page>('feed')
  const [showCreatePost, setShowCreatePost] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      if (state.user && !state.isLoading) {
        // Check if user profile exists in our database
        const existingUsers = await blink.db.users.list({
          where: { id: state.user.id },
          limit: 1
        })

        if (existingUsers.length === 0) {
          // Create user profile
          const newUser = {
            id: state.user.id,
            email: state.user.email,
            username: state.user.email.split('@')[0],
            displayName: state.user.email.split('@')[0],
            bio: '',
            avatarUrl: '',
            followersCount: 0,
            followingCount: 0,
            postsCount: 0
          }
          
          await blink.db.users.create(newUser)
          setUser(newUser)
        } else {
          setUser(existingUsers[0] as User)
        }
      } else {
        setUser(null)
      }
      setLoading(state.isLoading)
    })

    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Connectify...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Connectify</h1>
          <p className="text-muted-foreground mb-8">Connect with friends and share your moments</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar 
          user={user}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onCreatePost={() => setShowCreatePost(true)}
        />
        
        <main className="flex-1 lg:ml-64">
          {currentPage === 'feed' && (
            <Feed user={user} />
          )}
          {currentPage === 'profile' && (
            <UserProfile user={user} />
          )}
          {currentPage === 'explore' && (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Explore</h2>
              <p className="text-muted-foreground">Discover new content and users</p>
            </div>
          )}
          {currentPage === 'messages' && (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Messages</h2>
              <p className="text-muted-foreground">Direct messages coming soon</p>
            </div>
          )}
          {currentPage === 'settings' && (
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <p className="text-muted-foreground">Account settings</p>
            </div>
          )}
        </main>
      </div>

      {showCreatePost && (
        <CreatePost
          user={user}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            setShowCreatePost(false)
            // Refresh feed if needed
          }}
        />
      )}

      <Toaster />
    </div>
  )
}

export default App
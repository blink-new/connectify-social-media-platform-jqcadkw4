import { Plus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function StoriesBar() {
  // Mock stories data
  const stories = [
    { id: '1', username: 'your_story', displayName: 'Your Story', avatarUrl: '', isOwn: true },
    { id: '2', username: 'alice_wonder', displayName: 'Alice', avatarUrl: '', hasStory: true },
    { id: '3', username: 'bob_builder', displayName: 'Bob', avatarUrl: '', hasStory: true },
    { id: '4', username: 'charlie_brown', displayName: 'Charlie', avatarUrl: '', hasStory: true },
    { id: '5', username: 'diana_prince', displayName: 'Diana', avatarUrl: '', hasStory: true },
  ]

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-2 min-w-0">
            <div className={`relative ${story.hasStory && !story.isOwn ? 'p-0.5 bg-gradient-to-tr from-yellow-400 to-pink-500 rounded-full' : ''}`}>
              <div className={`relative ${story.hasStory && !story.isOwn ? 'bg-background p-0.5 rounded-full' : ''}`}>
                <Avatar className="w-16 h-16">
                  <AvatarImage src={story.avatarUrl} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {story.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {story.isOwn && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                    <Plus className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground truncate w-16">
              {story.isOwn ? 'Your Story' : story.displayName}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
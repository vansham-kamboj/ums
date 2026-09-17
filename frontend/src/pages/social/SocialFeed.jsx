import { useState } from 'react';
import { Heart, MessageCircle, Share2, Plus, Image, ThumbsUp, Send, MoreHorizontal, User, Clock, Smile, Bookmark } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const DEMO_POSTS = [
  {
    id: 1, author: 'Dr. Anand Kumar', avatar: 'AK', role: 'Professor, CS Department',
    content: 'Proud to announce that our students secured 3 positions in the top 10 at the National Coding Championship! 🏆 Congratulations to the entire team.',
    likes: 42, comments: 8, time: '2 hours ago', liked: false, hasImage: false,
  },
  {
    id: 2, author: 'University Admin', avatar: 'UA', role: 'Official',
    content: 'Reminder: The deadline for Fall 2026 fee payment is August 31st. Students who have applied for concessions — your requests are being processed. Check the Fee Dashboard for status updates.',
    likes: 15, comments: 3, time: '5 hours ago', liked: true, hasImage: false,
  },
  {
    id: 3, author: 'Sports Club', avatar: 'SC', role: 'Student Club',
    content: 'Inter-college basketball tournament starts next Monday! 🏀 Come cheer for our team at the indoor stadium. Schedule and fixtures posted on the notice board.',
    likes: 67, comments: 12, time: '1 day ago', liked: false, hasImage: true,
  },
  {
    id: 4, author: 'Priya Patel', avatar: 'PP', role: 'Student, B.Tech CS Year 3',
    content: 'Just completed my summer internship at a tech startup. The experience was incredible — learned so much about real-world software development. Thank you to the placement cell for the opportunity! 🙌',
    likes: 89, comments: 15, time: '2 days ago', liked: true, hasImage: false,
  },
  {
    id: 5, author: 'Library Services', avatar: 'LS', role: 'Library Department',
    content: 'New arrivals this week: 50+ titles covering AI/ML, Data Science, and Cloud Computing. Visit the digital catalog to reserve your copy. Extended reading room hours during exam season (8 AM - 10 PM).',
    likes: 23, comments: 5, time: '3 days ago', liked: false, hasImage: false,
  },
];

export default function SocialFeed() {
  const toast = useToast();
  const { user } = useAuth();
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [newPost, setNewPost] = useState('');
  const [showComments, setShowComments] = useState(null);
  const [commentText, setCommentText] = useState('');

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      author: user?.name || 'You',
      avatar: (user?.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2),
      role: user?.scope || 'Member',
      content: newPost,
      likes: 0, comments: 0, time: 'Just now', liked: false, hasImage: false,
    };
    setPosts(prev => [post, ...prev]);
    setNewPost('');
    toast.success('Post published!');
  };

  const toggleLike = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const addComment = (id) => {
    if (!commentText.trim()) return;
    setPosts(prev => prev.map(p => p.id === id ? { ...p, comments: p.comments + 1 } : p));
    setCommentText('');
    toast.success('Comment added');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Social Wall</h1>
        <p className="text-sm text-text-secondary mt-1">Campus updates, achievements, and community posts</p>
      </div>

      {/* Compose */}
      <div className="bg-surface border border-border rounded-md p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-medium flex-shrink-0">
            {(user?.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
              placeholder="Share something with the campus..."
              rows={3}
              className="w-full px-0 py-0 bg-transparent border-none text-sm focus:outline-none resize-none text-text-primary placeholder:text-text-disabled" />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
              <div className="flex gap-2">
                <button className="p-1.5 rounded-md text-text-disabled hover:text-brand-600 hover:bg-brand-100 transition-colors"><Image className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-md text-text-disabled hover:text-brand-600 hover:bg-brand-100 transition-colors"><Smile className="w-4 h-4" /></button>
              </div>
              <button onClick={handlePost} disabled={!newPost.trim()}
                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium rounded-md disabled:opacity-30 transition-colors">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-surface border border-border rounded-md overflow-hidden">
            {/* Post Header */}
            <div className="px-5 py-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-sm font-medium flex-shrink-0">
                  {post.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{post.author}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-text-disabled">{post.role}</span>
                    <span className="text-xs text-text-disabled">•</span>
                    <span className="text-xs text-text-disabled inline-flex items-center gap-0.5"><Clock className="w-3 h-3" />{post.time}</span>
                  </div>
                </div>
              </div>
              <button className="p-1 rounded-md text-text-disabled hover:text-text-secondary hover:bg-bg transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 pb-3">
              <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Image placeholder */}
            {post.hasImage && (
              <div className="mx-5 mb-3 h-48 bg-gradient-to-br from-brand-100 to-brand-200 rounded-md flex items-center justify-center">
                <Image className="w-10 h-10 text-brand-600/30" />
              </div>
            )}

            {/* Stats */}
            <div className="px-5 py-2 flex items-center justify-between text-xs text-text-disabled border-t border-border">
              <span>{post.likes} likes</span>
              <span>{post.comments} comments</span>
            </div>

            {/* Actions */}
            <div className="px-5 py-2 flex items-center gap-1 border-t border-border">
              <button onClick={() => toggleLike(post.id)}
                className={`flex-1 py-2 rounded-md text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors ${
                  post.liked ? 'text-brand-600 bg-brand-100/50' : 'text-text-secondary hover:bg-bg'
                }`}>
                <ThumbsUp className={`w-4 h-4 ${post.liked ? 'fill-brand-600' : ''}`} /> Like
              </button>
              <button onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                className="flex-1 py-2 rounded-md text-xs font-medium text-text-secondary inline-flex items-center justify-center gap-1.5 hover:bg-bg transition-colors">
                <MessageCircle className="w-4 h-4" /> Comment
              </button>
              <button className="flex-1 py-2 rounded-md text-xs font-medium text-text-secondary inline-flex items-center justify-center gap-1.5 hover:bg-bg transition-colors">
                <Bookmark className="w-4 h-4" /> Save
              </button>
            </div>

            {/* Comment Input */}
            {showComments === post.id && (
              <div className="px-5 py-3 border-t border-border bg-bg/30">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-[10px] font-medium flex-shrink-0">
                    {(user?.name || 'U')[0]}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)}
                      placeholder="Write a comment..." onKeyDown={e => e.key === 'Enter' && addComment(post.id)}
                      className="flex-1 px-3 py-1.5 bg-surface border border-border rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brand-600/20" />
                    <button onClick={() => addComment(post.id)} disabled={!commentText.trim()}
                      className="p-1.5 rounded-full bg-brand-600 text-white disabled:opacity-30">
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
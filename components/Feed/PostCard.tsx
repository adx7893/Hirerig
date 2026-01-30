
import React, { useState } from 'react';
import { Post, Comment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const { likePost, addComment } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isLiked = post.likes.includes(user?.id || '');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: user.id,
      authorName: user.name,
      content: commentText,
      timestamp: new Date().toISOString()
    };

    addComment(post.id, newComment);
    setCommentText('');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm mb-4 transition-all hover:shadow-md">
      <div className="p-4 flex items-start space-x-3">
        <img src={post.authorAvatar} alt={post.authorName} className="w-12 h-12 rounded-full object-cover border border-gray-100 dark:border-gray-700 shadow-sm" />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 hover:underline cursor-pointer">{post.authorName}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{post.authorHeadline}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {new Date(post.timestamp).toLocaleDateString()} • <i className="fa-solid fa-earth-americas text-[10px]"></i>
          </p>
        </div>
        <button className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      <div className="px-4 pb-2">
        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </div>

      {post.image && (
        <div className="mt-2 bg-gray-50 dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700">
          <img src={post.image} alt="Post content" className="w-full max-h-[500px] object-contain mx-auto" />
        </div>
      )}

      <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <span className="flex -space-x-1">
            <i className="fa-solid fa-thumbs-up bg-blue-500 text-white rounded-full p-1 border-2 border-white dark:border-gray-900 scale-75"></i>
            <i className="fa-solid fa-heart bg-red-500 text-white rounded-full p-1 border-2 border-white dark:border-gray-900 scale-75"></i>
          </span>
          <span>{post.likes.length} others</span>
        </div>
        <div className="hover:text-blue-600 hover:underline cursor-pointer" onClick={() => setShowComments(!showComments)}>
          <span>{post.comments.length} comments • {Math.floor(Math.random() * 50)} shares</span>
        </div>
      </div>

      <div className="px-1 py-1 flex items-center justify-around border-b border-gray-50 dark:border-gray-800">
        <button 
          onClick={() => user && likePost(post.id, user.id)}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-semibold ${isLiked ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
        >
          <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-thumbs-up text-lg`}></i>
          <span>Like</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-semibold ${showComments ? 'text-blue-600 bg-gray-50 dark:bg-gray-800' : 'text-gray-600 dark:text-gray-300'}`}
        >
          <i className="fa-regular fa-comment-dots text-lg"></i>
          <span>Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-600 dark:text-gray-300 font-semibold">
          <i className="fa-solid fa-share text-lg"></i>
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 space-y-4 rounded-b-lg">
          <form onSubmit={handleAddComment} className="flex items-center space-x-3 mb-2">
            <img src={user?.avatar} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" alt="Me" />
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full py-2 pl-4 pr-10 text-sm focus:ring-1 focus:ring-blue-500 dark:text-white outline-none shadow-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 text-blue-600 hover:text-blue-800 disabled:opacity-50" 
                disabled={!commentText.trim()}
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </form>
          
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {post.comments.length > 0 ? [...post.comments].reverse().map(c => (
              <div key={c.id} className="flex space-x-3 group">
                <img src={`https://picsum.photos/seed/${c.authorId}/50`} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 mt-1" alt={c.authorName} />
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl p-3 flex-1 shadow-sm group-hover:bg-gray-50 dark:group-hover:bg-gray-600 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-gray-900 dark:text-white hover:text-blue-600 cursor-pointer">{c.authorName}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">Just now</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{c.content}</p>
                </div>
              </div>
            )) : (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;

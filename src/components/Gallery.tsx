import { useState } from 'react';
import { deletePost, getErrorMessage, updatePost } from '../helpers/api';
import type { IPost } from '../helpers/types';
import { Preview } from './Preview';

interface Props {
  accountId: string;
  posts: IPost[];
  onPostsChange: React.Dispatch<React.SetStateAction<IPost[]>>;
  onError: (message: string) => void;
}

export function Gallery({
  accountId,
  posts,
  onPostsChange,
  onError,
}: Props) {
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const savePost = async (postId: string) => {
    onError('');
    try {
      const updated = await updatePost(postId, editContent);
      onPostsChange(current =>
        current.map(post => (post._id === postId ? updated : post))
      );
      setEditingPostId(null);
    } catch (error) {
      onError(getErrorMessage(error));
    }
  };

  const removePost = async (postId: string) => {
    onError('');
    try {
      await deletePost(postId);
      onPostsChange(current => current.filter(post => post._id !== postId));
    } catch (error) {
      onError(getErrorMessage(error));
    }
  };

  if (posts.length === 0) return <p>No posts yet.</p>;

  return (
    <section aria-label="Your posts">
      {posts.map(post => {
        const ownsPost = post.author._id === accountId;
        return (
          <article key={post._id} className="card my-3 p-3">
            <header>
              <strong>{post.author.username}</strong>
              <time dateTime={post.createdAt}>
                {' '}
                {new Date(post.createdAt).toLocaleString()}
              </time>
            </header>
            {editingPostId === post._id ? (
              <form
                onSubmit={event => {
                  event.preventDefault();
                  void savePost(post._id);
                }}
              >
                <label htmlFor={`edit-post-${post._id}`}>Edit post</label>
                <textarea
                  id={`edit-post-${post._id}`}
                  value={editContent}
                  onChange={event => setEditContent(event.target.value)}
                />
                <button type="submit">Save post</button>{' '}
                <button type="button" onClick={() => setEditingPostId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <p>{post.content}</p>
            )}
            {ownsPost && editingPostId !== post._id && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPostId(post._id);
                    setEditContent(post.content);
                  }}
                >
                  Edit post
                </button>{' '}
                <button type="button" onClick={() => void removePost(post._id)}>
                  Delete post
                </button>
              </div>
            )}
            <Preview accountId={accountId} post={post} onError={onError} />
          </article>
        );
      })}
    </section>
  );
}

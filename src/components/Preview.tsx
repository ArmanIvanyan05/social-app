import { useEffect, useState } from 'react';
import {
  createComment,
  deleteComment,
  getComments,
  getErrorMessage,
  updateComment,
} from '../helpers/api';
import type { IComment, IPost } from '../helpers/types';

interface Props {
  accountId: string;
  post: IPost;
  onError: (message: string) => void;
}

export function Preview({ accountId, post, onError }: Props) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    let active = true;
    getComments(post._id)
      .then(result => {
        if (active) setComments(result);
      })
      .catch(error => {
        if (active) onError(getErrorMessage(error));
      });
    return () => {
      active = false;
    };
  }, [onError, post._id]);

  const addComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onError('');
    try {
      const comment = await createComment(post._id, content);
      setComments(current => [...current, comment]);
      setContent('');
    } catch (error) {
      onError(getErrorMessage(error));
    }
  };

  const saveComment = async (commentId: string) => {
    onError('');
    try {
      const comment = await updateComment(post._id, commentId, editContent);
      setComments(current =>
        current.map(item => (item._id === commentId ? comment : item))
      );
      setEditingId(null);
    } catch (error) {
      onError(getErrorMessage(error));
    }
  };

  const removeComment = async (commentId: string) => {
    onError('');
    try {
      await deleteComment(post._id, commentId);
      setComments(current => current.filter(item => item._id !== commentId));
    } catch (error) {
      onError(getErrorMessage(error));
    }
  };

  return (
    <section aria-labelledby={`comments-${post._id}`}>
      <h2 id={`comments-${post._id}`}>Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map(comment => (
            <li key={comment._id}>
              <strong>{comment.author.username}:</strong>{' '}
              {editingId === comment._id ? (
                <form
                  onSubmit={event => {
                    event.preventDefault();
                    void saveComment(comment._id);
                  }}
                >
                  <label htmlFor={`edit-comment-${comment._id}`}>
                    Edit comment
                  </label>
                  <input
                    id={`edit-comment-${comment._id}`}
                    value={editContent}
                    onChange={event => setEditContent(event.target.value)}
                  />
                  <button type="submit">Save comment</button>{' '}
                  <button type="button" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                comment.content
              )}
              {comment.author._id === accountId && editingId !== comment._id && (
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(comment._id);
                      setEditContent(comment.content);
                    }}
                  >
                    Edit comment
                  </button>{' '}
                  <button
                    type="button"
                    onClick={() => void removeComment(comment._id)}
                  >
                    Delete comment
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={addComment}>
        <label htmlFor={`new-comment-${post._id}`}>Add a comment</label>
        <input
          id={`new-comment-${post._id}`}
          value={content}
          onChange={event => setContent(event.target.value)}
        />
        <button type="submit">Comment</button>
      </form>
    </section>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { createPost, getErrorMessage, getUserPosts } from '../../../helpers/api';
import type { IContext, IPost } from '../../../helpers/types';
import { Gallery } from '../../../components/Gallery';

export const Photos = () => {
  const { account } = useOutletContext<IContext>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setPosts(await getUserPosts(account._id));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [account._id]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const handlePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const post = await createPost(content);
      setPosts(current => [post, ...current]);
      setContent('');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container">
      <h1>Posts</h1>
      <form onSubmit={handlePost}>
        <label htmlFor="post-content">What&apos;s on your mind?</label>
        <textarea
          id="post-content"
          className="form-control"
          value={content}
          onChange={event => setContent(event.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-outline-dark my-3"
        >
          {submitting ? 'Publishing…' : 'Create post'}
        </button>
      </form>
      {error && <p role="alert" className="alert alert-danger">{error}</p>}
      {loading ? (
        <p role="status">Loading posts…</p>
      ) : (
        <Gallery
          accountId={account._id}
          posts={posts}
          onPostsChange={setPosts}
          onError={setError}
        />
      )}
    </main>
  );
};

requireAuth();

const postForm = document.getElementById('postForm');
const feedContainer = document.getElementById('feedContainer');
const errorBox = document.getElementById('errorBox');
const meLink = document.getElementById('meLink');
const logoutBtn = document.getElementById('logoutBtn');

let currentUser = null;
let followingSet = new Set();

logoutBtn.addEventListener('click', logout);

async function loadCurrentUser() {
  const me = await apiRequest('/api/users/me');
  currentUser = me;
  followingSet = new Set((me.following || []).map((id) => String(id)));
  localStorage.setItem('userId', me._id);
  meLink.href = `/profile?id=${me._id}`;
  meLink.textContent = 'Profile';
}

function createPostCard(post) {
  const myId = localStorage.getItem('userId');
  const likedByMe = post.likes.some((id) => String(id) === myId);

  const commentsHTML = post.comments
    .map((comment) => {
      const avatar = (comment.user && comment.user.profilePicture) || '/css/default-avatar.svg';
      const username = (comment.user && comment.user.username) || 'User';
      return `
        <div class="comment-item">
          <img src="${avatar}" alt="avatar" class="avatar small" />
          <div>
            <strong>${escapeHTML(username)}</strong>
            <p>${escapeHTML(comment.text)}</p>
          </div>
        </div>
      `;
    })
    .join('');

  const imageBlock = post.image
    ? `<img src="${post.image}" class="post-image" alt="post image" />`
    : '';

  const authorAvatar = (post.author && post.author.profilePicture) || '/css/default-avatar.svg';
  const authorName = (post.author && post.author.username) || 'User';
  const authorId = post.author && post.author._id ? String(post.author._id) : '';

  const isMe = currentUser && authorId === String(currentUser._id);
  const isFollowing = followingSet.has(authorId);

  const followButton = isMe
    ? ''
    : `<button class="secondary follow-btn" data-user-id="${authorId}" data-following="${isFollowing}">${isFollowing ? 'Unfollow' : 'Follow'}</button>`;
  const deleteButton = isMe
    ? `<button class="danger delete-post-btn">Delete Post</button>`
    : '';

  return `
    <article class="card" data-post-id="${post._id}">
      <header class="post-header">
        <img src="${authorAvatar}" alt="avatar" class="avatar" />
        <div>
          <strong>${escapeHTML(authorName)}</strong>
          <p class="muted">${new Date(post.createdAt).toLocaleString()}</p>
        </div>
        ${followButton}
      </header>
      <p>${escapeHTML(post.content)}</p>
      ${imageBlock}
      <div class="post-actions">
        <button class="like-btn">${likedByMe ? 'Unlike' : 'Like'} (${post.likes.length})</button>
        ${deleteButton}
      </div>
      <form class="comment-form">
        <input type="text" name="text" placeholder="Write a comment" required maxlength="300" />
        <button type="submit">Comment</button>
      </form>
      <div class="comments">${commentsHTML}</div>
    </article>
  `;
}

async function loadFeed() {
  errorBox.textContent = '';
  try {
    const posts = await apiRequest('/api/posts/feed');
    feedContainer.innerHTML = posts.map(createPostCard).join('') || '<p>No posts yet.</p>';
  } catch (error) {
    errorBox.textContent = error.message;
  }
}

postForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.textContent = '';

  const formData = new FormData(postForm);

  try {
    await apiRequest('/api/posts', {
      method: 'POST',
      body: formData
    });
    postForm.reset();
    loadFeed();
  } catch (error) {
    errorBox.textContent = error.message;
  }
});

feedContainer.addEventListener('click', async (event) => {
  const card = event.target.closest('.card');
  if (!card) return;

  const postId = card.dataset.postId;

  if (event.target.classList.contains('like-btn')) {
    try {
      await apiRequest(`/api/posts/${postId}/like`, { method: 'POST' });
      loadFeed();
    } catch (error) {
      errorBox.textContent = error.message;
    }
  }

  if (event.target.classList.contains('follow-btn')) {
    const userId = event.target.dataset.userId;
    const isFollowing = event.target.dataset.following === 'true';

    if (!userId) return;

    try {
      if (isFollowing) {
        await apiRequest(`/api/users/${userId}/unfollow`, { method: 'POST' });
        followingSet.delete(userId);
        event.target.dataset.following = 'false';
        event.target.textContent = 'Follow';
      } else {
        await apiRequest(`/api/users/${userId}/follow`, { method: 'POST' });
        followingSet.add(userId);
        event.target.dataset.following = 'true';
        event.target.textContent = 'Unfollow';
      }
    } catch (error) {
      errorBox.textContent = error.message;
    }
  }

  if (event.target.classList.contains('delete-post-btn')) {
    const confirmed = window.confirm('Delete this post?');
    if (!confirmed) return;

    try {
      await apiRequest(`/api/posts/${postId}`, { method: 'DELETE' });
      loadFeed();
    } catch (error) {
      errorBox.textContent = error.message;
    }
  }
});

feedContainer.addEventListener('submit', async (event) => {
  if (!event.target.classList.contains('comment-form')) return;

  event.preventDefault();
  const card = event.target.closest('.card');
  const postId = card.dataset.postId;
  const text = event.target.elements.text.value.trim();

  if (!text) return;

  try {
    await apiRequest(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
    loadFeed();
  } catch (error) {
    errorBox.textContent = error.message;
  }
});

(async function init() {
  try {
    await loadCurrentUser();
    await loadFeed();
  } catch (_error) {
    logout();
  }
})();

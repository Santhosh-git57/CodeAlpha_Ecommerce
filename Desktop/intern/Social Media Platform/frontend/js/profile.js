requireAuth();

const logoutBtn = document.getElementById('logoutBtn');
const errorBox = document.getElementById('errorBox');
const profileCard = document.getElementById('profileCard');
const profileForm = document.getElementById('profileForm');
const followActions = document.getElementById('followActions');
const profileFormSection = document.getElementById('profileFormSection');
const profilePosts = document.getElementById('profilePosts');
const deleteProfilePhotoBtn = document.getElementById('deleteProfilePhotoBtn');

let currentViewer = null;
let viewedUserId = null;

logoutBtn.addEventListener('click', logout);

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function renderProfile(user) {
  const avatar = user.profilePicture || '/css/default-avatar.svg';
  profileCard.innerHTML = `
    <img src="${avatar}" class="avatar large" alt="profile picture" />
    <h2>${escapeHTML(user.username)}</h2>
    <p>${escapeHTML(user.bio || 'No bio yet')}</p>
    <p class="muted">Followers: ${user.followers.length} | Following: ${user.following.length}</p>
  `;
}

function renderProfilePosts(posts, isOwnProfile) {
  if (!posts.length) {
    profilePosts.innerHTML = '<p class="muted">No posts yet.</p>';
    return;
  }

  profilePosts.innerHTML = posts
    .map((post) => {
      const imageBlock = post.image ? `<img class="post-image" src="${post.image}" alt="post image" />` : '';

      const editSection = isOwnProfile
        ? `
          <form class="edit-post-form" data-post-id="${post._id}" enctype="multipart/form-data">
            <label>Edit post</label>
            <textarea name="content" maxlength="1000">${escapeHTML(post.content)}</textarea>
            <input type="file" name="image" accept="image/*" />
            <div class="post-editor-actions">
              <button type="submit">Update Post</button>
              <button type="button" class="danger delete-post-btn" data-post-id="${post._id}">Delete Post</button>
            </div>
          </form>
        `
        : '';

      return `
        <article class="card">
          <p class="muted">${new Date(post.createdAt).toLocaleString()}</p>
          <p>${escapeHTML(post.content)}</p>
          ${imageBlock}
          ${editSection}
        </article>
      `;
    })
    .join('');
}

async function loadProfilePosts() {
  try {
    const posts = await apiRequest(`/api/posts/user/${viewedUserId}`);
    const isOwnProfile = String(viewedUserId) === String(currentViewer._id);
    renderProfilePosts(posts, isOwnProfile);
  } catch (error) {
    errorBox.textContent = error.message;
  }
}

async function loadProfile() {
  errorBox.textContent = '';
  try {
    const me = await apiRequest('/api/users/me');
    currentViewer = me;

    const id = getQueryParam('id') || me._id;
    viewedUserId = id;

    const user = String(id) === String(me._id) ? me : await apiRequest(`/api/users/${id}`);

    renderProfile(user);

    if (String(id) === String(me._id)) {
      profileFormSection.style.display = 'block';
      followActions.style.display = 'none';
    } else {
      profileFormSection.style.display = 'none';
      followActions.style.display = 'block';
      followActions.innerHTML = `
        <button id="followBtn">Follow</button>
        <button id="unfollowBtn" class="secondary">Unfollow</button>
      `;

      document.getElementById('followBtn').addEventListener('click', async () => {
        try {
          await apiRequest(`/api/users/${id}/follow`, { method: 'POST' });
          await loadProfile();
        } catch (error) {
          errorBox.textContent = error.message;
        }
      });

      document.getElementById('unfollowBtn').addEventListener('click', async () => {
        try {
          await apiRequest(`/api/users/${id}/unfollow`, { method: 'POST' });
          await loadProfile();
        } catch (error) {
          errorBox.textContent = error.message;
        }
      });
    }

    await loadProfilePosts();
  } catch (error) {
    errorBox.textContent = error.message;
  }
}

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.textContent = '';

  const formData = new FormData(profileForm);

  try {
    await apiRequest('/api/users/me', {
      method: 'PUT',
      body: formData
    });

    profileForm.reset();
    await loadProfile();
  } catch (error) {
    errorBox.textContent = error.message;
  }
});

deleteProfilePhotoBtn.addEventListener('click', async () => {
  const confirmed = window.confirm('Delete your profile photo?');
  if (!confirmed) return;

  errorBox.textContent = '';
  try {
    await apiRequest('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify({ removeProfilePicture: true })
    });
    await loadProfile();
  } catch (error) {
    errorBox.textContent = error.message;
  }
});

profilePosts.addEventListener('submit', async (event) => {
  if (!event.target.classList.contains('edit-post-form')) return;

  event.preventDefault();
  errorBox.textContent = '';

  const postId = event.target.dataset.postId;
  const formData = new FormData(event.target);

  try {
    await apiRequest(`/api/posts/${postId}`, {
      method: 'PUT',
      body: formData
    });
    await loadProfilePosts();
  } catch (error) {
    errorBox.textContent = error.message;
  }
});

profilePosts.addEventListener('click', async (event) => {
  if (!event.target.classList.contains('delete-post-btn')) return;

  const postId = event.target.dataset.postId;
  if (!postId) return;

  const confirmed = window.confirm('Delete this post?');
  if (!confirmed) return;

  errorBox.textContent = '';
  try {
    await apiRequest(`/api/posts/${postId}`, { method: 'DELETE' });
    await loadProfilePosts();
  } catch (error) {
    errorBox.textContent = error.message;
  }
});

loadProfile();

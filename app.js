// State Management
let state = {
  currentPost: {
    id: null,
    title: 'Halo Dunia',
    date: new Date().toISOString().split('T')[0],
    layout: 'post',
    categories: 'tutorial',
    tags: 'github, jekyll',
    content: `# Halo Dunia!

Selamat datang di postingan pertama Anda! Halaman ini di-render secara langsung dari teks **Markdown**.

## Fitur Utama Editor Ini:
1. **Live Preview**: Lihat langsung tampilan halaman blog Anda di sisi kanan.
2. **Auto-Slug**: Nama file dibuat secara otomatis mengikuti konvensi penulisan Jekyll: \`YYYY-MM-DD-judul.md\`.
3. **Draft Manager**: Simpan tulisan Anda secara lokal menggunakan \`localStorage\`.
4. **Markdown Downloader**: Download file langsung dengan ekstensi \`.md\` yang siap diunggah ke folder \`_posts\` di repositori GitHub Anda.

### Contoh Elemen Markdown Lainnya:
* Teks **Tebal (Bold)** dan *Miring (Italic)*.
* Tautan eksternal: [GitHub Pages](https://pages.github.com/).
* Blok Kutipan (Blockquote):
> "GitHub Pages + Jekyll adalah cara tercepat dan gratis untuk memiliki blog pribadi tanpa server."

* Blok Kode (Code block):
\`\`\`yaml
# Contoh file _config.yml
title: Blog Saya
theme: jekyll-theme-minimal
\`\`\`
`
  },
  savedPosts: []
};

// Fallback Simple Markdown Parser (if marked.js CDN is offline)
function fallbackMarkdownParser(md) {
  if (!md) return '';
  let html = md;

  // Escape HTML to prevent XSS
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code blocks
  html = html.replace(/```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Headings
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
  // Blockquotes
  html = html.replace(/^\>\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>');
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
  // Lists (simple conversion)
  html = html.replace(/^\s*[\-\*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');

  // Replace double newlines with paragraphs (ignoring inside pre/blockquote/li)
  html = html.split(/\n\n+/).map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<pre') || p.trim().startsWith('<block') || p.trim().startsWith('<li') || p.trim().startsWith('<li>')) {
      return p;
    }
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  return html;
}

function parseMarkdown(mdText) {
  if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
    return marked.parse(mdText);
  }
  return fallbackMarkdownParser(mdText);
}

// Slugify function
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Get Generated Filename
function getGeneratedFilename() {
  const dateStr = state.currentPost.date || new Date().toISOString().split('T')[0];
  const slugStr = slugify(state.currentPost.title || 'untitled');
  return `${dateStr}-${slugStr}.md`;
}

// Generate Raw Jekyll Post Content (Markdown + Front Matter)
function generateJekyllRawContent() {
  return `---
layout: ${state.currentPost.layout || 'post'}
title: "${state.currentPost.title.replace(/"/g, '\\"')}"
date: ${state.currentPost.date}
categories: ${state.currentPost.categories}
tags: [${state.currentPost.tags}]
---

${state.currentPost.content}`;
}

// Toast Notifications Helper
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'exclamation-circle';

  toast.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Load inputs from state
function loadStateToInputs() {
  document.getElementById('postTitle').value = state.currentPost.title;
  document.getElementById('postDate').value = state.currentPost.date;
  document.getElementById('postLayout').value = state.currentPost.layout;
  document.getElementById('postCategories').value = state.currentPost.categories;
  document.getElementById('postTags').value = state.currentPost.tags;
  document.getElementById('markdownEditor').value = state.currentPost.content;
  updateFilenamePreview();
  renderPreview();
}

// Save inputs to state
function saveInputsToState() {
  state.currentPost.title = document.getElementById('postTitle').value;
  state.currentPost.date = document.getElementById('postDate').value;
  state.currentPost.layout = document.getElementById('postLayout').value;
  state.currentPost.categories = document.getElementById('postCategories').value;
  state.currentPost.tags = document.getElementById('postTags').value;
  state.currentPost.content = document.getElementById('markdownEditor').value;
}

// Update Filename Preview
function updateFilenamePreview() {
  document.getElementById('filenamePreview').innerText = getGeneratedFilename();
}

// Render Markdown Preview
function renderPreview() {
  const htmlContent = parseMarkdown(state.currentPost.content);
  document.getElementById('previewArea').innerHTML = htmlContent;
}

// LocalStorage Post CRUD
function loadSavedPosts() {
  const stored = localStorage.getItem('gitblogmd_posts');
  if (stored) {
    try {
      state.savedPosts = JSON.parse(stored);
    } catch (e) {
      state.savedPosts = [];
    }
  } else {
    state.savedPosts = [];
  }
  renderSavedPostsTable();
}

function saveCurrentPost() {
  saveInputsToState();
  
  if (!state.currentPost.title.trim()) {
    showToast('Judul artikel tidak boleh kosong!', 'error');
    return;
  }

  const posts = [...state.savedPosts];
  const timestamp = new Date().toISOString();

  if (state.currentPost.id === null) {
    // Insert new post
    const newPost = {
      id: 'post_' + Date.now(),
      title: state.currentPost.title,
      date: state.currentPost.date,
      layout: state.currentPost.layout,
      categories: state.currentPost.categories,
      tags: state.currentPost.tags,
      content: state.currentPost.content,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    posts.unshift(newPost);
    state.currentPost.id = newPost.id;
    showToast('Postingan berhasil disimpan!', 'success');
  } else {
    // Update existing post
    const idx = posts.findIndex(p => p.id === state.currentPost.id);
    if (idx !== -1) {
      posts[idx] = {
        ...posts[idx],
        title: state.currentPost.title,
        date: state.currentPost.date,
        layout: state.currentPost.layout,
        categories: state.currentPost.categories,
        tags: state.currentPost.tags,
        content: state.currentPost.content,
        updatedAt: timestamp
      };
      showToast('Postingan berhasil di-update!', 'success');
    }
  }

  state.savedPosts = posts;
  localStorage.setItem('gitblogmd_posts', JSON.stringify(posts));
  loadSavedPosts();
}

function loadPostIntoEditor(id) {
  const post = state.savedPosts.find(p => p.id === id);
  if (post) {
    state.currentPost = {
      id: post.id,
      title: post.title,
      date: post.date,
      layout: post.layout,
      categories: post.categories,
      tags: post.tags,
      content: post.content
    };
    loadStateToInputs();
    switchTab('editor');
    showToast('Artikel berhasil dimuat ke editor!', 'success');
  }
}

function deleteSavedPost(id, event) {
  if (event) event.stopPropagation();
  if (confirm('Apakah Anda yakin ingin menghapus artikel ini dari database lokal?')) {
    state.savedPosts = state.savedPosts.filter(p => p.id !== id);
    localStorage.setItem('gitblogmd_posts', JSON.stringify(state.savedPosts));
    
    // If the currently loaded post is deleted, clear its ID
    if (state.currentPost.id === id) {
      state.currentPost.id = null;
    }
    
    loadSavedPosts();
    showToast('Postingan dihapus!', 'info');
  }
}

function startNewPost() {
  state.currentPost = {
    id: null,
    title: 'Tulisan Baru',
    date: new Date().toISOString().split('T')[0],
    layout: 'post',
    categories: 'blog',
    tags: 'post',
    content: '# Judul Tulisan\n\nTulis konten Anda di sini...'
  };
  loadStateToInputs();
  showToast('Memulai artikel baru di editor', 'info');
}

// Render Saved Posts List in UI
function renderSavedPostsTable() {
  const container = document.getElementById('savedPostsList');
  if (state.savedPosts.length === 0) {
    container.innerHTML = `
      <div class="no-posts">
        <i class="fas fa-folder-open"></i>
        <h3>Belum ada postingan tersimpan</h3>
        <p>Tulis artikel baru dan klik tombol "Simpan ke Database" untuk menyimpannya di sini.</p>
        <button class="btn btn-primary" onclick="startNewPost()"><i class="fas fa-plus"></i> Tulis Sekarang</button>
      </div>
    `;
    return;
  }

  let html = '<div class="posts-grid">';
  state.savedPosts.forEach(post => {
    const excerpt = post.content.replace(/[#*`>]/g, '').substring(0, 120) + '...';
    const dateFormatted = new Date(post.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const filename = `${post.date}-${slugify(post.title)}.md`;
    
    html += `
      <div class="post-card" onclick="loadPostIntoEditor('${post.id}')" style="cursor:pointer;">
        <div class="post-card-header">
          <span class="post-card-date"><i class="far fa-calendar-alt"></i> ${dateFormatted}</span>
          <span style="font-size: 0.75rem; font-family:'Fira Code', monospace; color: var(--text-muted);">${post.layout}</span>
        </div>
        <h3 class="post-card-title">${post.title}</h3>
        <p class="post-card-excerpt">${excerpt}</p>
        <div class="post-card-footer">
          <div class="post-card-meta">
            <div><i class="far fa-file-code"></i> ${filename}</div>
          </div>
          <div class="post-card-actions">
            <button class="btn btn-secondary btn-icon-only" onclick="downloadSpecificPost('${post.id}', event)" title="Download file .md">
              <i class="fas fa-download"></i>
            </button>
            <button class="btn btn-secondary btn-icon-only" onclick="deleteSavedPost('${post.id}', event)" title="Hapus artikel" style="color:var(--accent-danger);">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

// Download Trigger
function downloadSpecificPost(id, event) {
  if (event) event.stopPropagation();
  const post = state.savedPosts.find(p => p.id === id);
  if (!post) return;

  const filename = `${post.date}-${slugify(post.title)}.md`;
  const fileContent = `---
layout: ${post.layout}
title: "${post.title.replace(/"/g, '\\"')}"
date: ${post.date}
categories: ${post.categories}
tags: [${post.tags}]
---

${post.content}`;

  triggerDownload(filename, fileContent);
}

function downloadCurrentPost() {
  saveInputsToState();
  if (!state.currentPost.title.trim()) {
    showToast('Tulis judul artikel sebelum mendownload!', 'error');
    return;
  }
  const filename = getGeneratedFilename();
  const fileContent = generateJekyllRawContent();
  triggerDownload(filename, fileContent);
}

function triggerDownload(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast(`File ${filename} berhasil didownload!`, 'success');
}

// Copy to Clipboard Helpers
function copyRawJekyllContent() {
  saveInputsToState();
  const rawJekyll = generateJekyllRawContent();
  
  navigator.clipboard.writeText(rawJekyll).then(() => {
    showToast('Konten file Markdown + Front Matter berhasil disalin!', 'success');
  }).catch(err => {
    showToast('Gagal menyalin konten', 'error');
  });
}

function copyCodeSnippet(elementId, btn) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Disalin!';
    showToast('Kode berhasil disalin ke clipboard!', 'success');
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = originalText;
    }, 2000);
  }).catch(err => {
    showToast('Gagal menyalin kode', 'error');
  });
}

// View / Tab Switching Routing
function switchTab(tabId) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  // Deactivate all sidebar links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Activate targets
  document.getElementById(tabId + 'Section').classList.add('active');
  
  // Find navigation link
  const navLink = document.querySelector(`.nav-link[onclick="switchTab('${tabId}')"]`);
  if (navLink) {
    navLink.classList.add('active');
  }

  // Section-specific hooks
  if (tabId === 'saved') {
    loadSavedPosts();
  }
}

// Tutorial Step Switching
function switchTutorialStep(stepNum) {
  document.querySelectorAll('.tutorial-step').forEach(step => {
    step.classList.remove('active');
  });
  document.querySelectorAll('.toc-link').forEach(link => {
    link.classList.remove('active');
  });

  document.getElementById('step' + stepNum).classList.add('active');
  
  const tocLink = document.querySelector(`.toc-link[onclick="switchTutorialStep(${stepNum})"]`);
  if (tocLink) {
    tocLink.classList.add('active');
  }

  // Scroll tutorial body to top
  document.querySelector('.tutorial-body').scrollTop = 0;
}

// Event Listeners Initialization
window.addEventListener('DOMContentLoaded', () => {
  // Load default post to editor
  loadStateToInputs();
  
  // LocalStorage loading
  loadSavedPosts();

  // Watch for inputs to update live preview
  document.getElementById('postTitle').addEventListener('input', () => {
    saveInputsToState();
    updateFilenamePreview();
  });

  document.getElementById('postDate').addEventListener('input', () => {
    saveInputsToState();
    updateFilenamePreview();
  });

  document.getElementById('postLayout').addEventListener('input', saveInputsToState);
  document.getElementById('postCategories').addEventListener('input', saveInputsToState);
  document.getElementById('postTags').addEventListener('input', saveInputsToState);

  document.getElementById('markdownEditor').addEventListener('input', () => {
    saveInputsToState();
    renderPreview();
  });
});

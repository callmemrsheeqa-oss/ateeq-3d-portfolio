import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  FileText,
  Mail,
  MailOpen,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type {
  AwardRecord,
  CertificateRecord,
  GalleryImageRecord,
  SocialLinkRecord,
} from '../../types/portfolio';
import type { NotifyFn } from './PortfolioCrudPanels';

const INPUT_CLASS =
  'mt-1 w-full rounded-lg border border-[#F4F7FF]/15 bg-[#070B18] px-3 py-2 text-sm text-[#F4F7FF] placeholder-[#A6B2C9]/45 focus:border-[#00D9FF] focus:outline-none';

interface CvRow {
  id: number;
  title: string;
  originalFilename: string;
  fileSize: number;
  isActive: boolean;
  uploadedByEmail: string;
  updatedAt: string;
}

interface ContactMessageRow {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  emailDelivered: boolean;
  deliveryNote: string;
  createdAt: string;
}

interface AiKnowledgeRow {
  id: number;
  title: string;
  category: string;
  content: string;
  keywords: string[];
  published: boolean;
}

/* ==================== CV UPLOAD & MANAGEMENT PANEL ==================== */
export function CvManagerPanel({
  onSaved,
  notify,
}: {
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const [cvs, setCvs] = useState<CvRow[]>([]);
  const [title, setTitle] = useState('Ateeq Ur Rehman — Curriculum Vitae');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/cv', { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.ok) setCvs(data.items || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      notify('error', 'Please select a PDF file first.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim() || 'Ateeq Ur Rehman — Curriculum Vitae');
    formData.append('file', file);

    setProgress(0);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/cv/upload');
    xhr.withCredentials = true;

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };

    xhr.onload = async () => {
      setProgress(null);
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // ignore
      }
      if (xhr.status >= 200 && xhr.status < 300 && data?.ok) {
        setFile(null);
        await load();
        await onSaved();
        notify('success', 'CV PDF uploaded and set as active.');
      } else {
        notify('error', data?.error || 'Failed to upload CV PDF.');
      }
    };

    xhr.onerror = () => {
      setProgress(null);
      notify('error', 'Upload failed due to a network error.');
    };

    xhr.send(formData);
  };

  const activate = async (id: number) => {
    const res = await fetch(`/api/admin/cv/${id}/activate`, {
      method: 'PUT',
      credentials: 'include',
    });
    if (res.ok) {
      await load();
      await onSaved();
      notify('success', 'Active CV updated.');
    }
  };

  const remove = async (id: number) => {
    const res = await fetch(`/api/admin/cv/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      await load();
      await onSaved();
      notify('success', 'CV deleted.');
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleUpload}
        className="rounded-2xl border border-[#F4F7FF]/12 bg-[#10182B] p-6 space-y-4"
      >
        <h2 className="font-display text-xl font-semibold text-[#F4F7FF]">Upload Official PDF CV</h2>
        <p className="text-xs text-[#A6B2C9]">
          Only genuine PDF documents (%PDF- signature verified server-side) are accepted. Uploading
          automatically sets the newest file as the active public download.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs text-[#A6B2C9]">
            Document Label
            <input
              className={INPUT_CLASS}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Select PDF File (max 15 MB)
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full rounded-lg border border-[#F4F7FF]/15 bg-[#070B18] px-3 py-1.5 text-xs text-[#F4F7FF] file:mr-3 file:rounded-md file:border-0 file:bg-[#00D9FF] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#070B18]"
            />
          </label>
        </div>

        {progress !== null && (
          <div className="space-y-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#070B18]">
              <div
                className="h-full bg-[#00D9FF] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-mono text-xs text-[#00D9FF]">Uploading... {progress}%</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {cvs.some((c) => c.isActive) && (
            <a
              href="/api/cv/download"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00D9FF] hover:underline"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Test Active Public Download</span>
            </a>
          )}
          <button
            type="submit"
            disabled={progress !== null}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] cursor-pointer disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload &amp; Activate CV</span>
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {cvs.length === 0 ? (
          <p className="rounded-xl border border-[#F4F7FF]/10 bg-[#10182B] p-6 text-xs text-[#A6B2C9]">
            No CV PDFs uploaded yet.
          </p>
        ) : (
          cvs.map((cv) => (
            <div
              key={cv.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#F4F7FF]/10 bg-[#10182B] px-5 py-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <FileText className="h-3.5 w-3.5 text-[#00D9FF]" />
                  <span className="text-[#F4F7FF]">{cv.originalFilename}</span>
                  <span className="text-[#A6B2C9]">({(cv.fileSize / 1024).toFixed(1)} KB)</span>
                  {cv.isActive && (
                    <span className="inline-flex items-center gap-1 text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Active
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[#A6B2C9]">{cv.title}</p>
              </div>
              <div className="flex items-center gap-2">
                {!cv.isActive && (
                  <button
                    type="button"
                    onClick={() => activate(cv.id)}
                    className="rounded-lg border border-[#00D9FF]/40 px-3 py-1.5 text-xs font-medium text-[#00D9FF] hover:bg-[#00D9FF]/15 cursor-pointer"
                  >
                    Set Active
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(cv.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:border-rose-400/50 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ==================== GALLERY & PROFILE PHOTO PANEL ==================== */
export function GalleryAndPhotoPanel({
  currentAvatarUrl,
  onSaved,
  notify,
}: {
  currentAvatarUrl: string;
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const [items, setItems] = useState<GalleryImageRecord[]>([]);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Campus & Events');
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<GalleryImageRecord | null>(null);

  const load = async () => {
    const res = await fetch('/api/admin/gallery', { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.ok) setItems(data.items || []);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!profileFile) {
      setProfilePreview(null);
      return;
    }
    const url = URL.createObjectURL(profileFile);
    setProfilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [profileFile]);

  useEffect(() => {
    const urls = galleryFiles.map((f) => URL.createObjectURL(f));
    setGalleryPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [galleryFiles]);

  const uploadProfilePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', profileFile);
      const res = await fetch('/api/admin/profile-photo', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        notify('error', data?.error || 'Failed to update profile portrait.');
        return;
      }
      setProfileFile(null);
      await load();
      await onSaved();
      notify('success', 'Profile portrait updated.');
    } finally {
      setUploading(false);
    }
  };

  const uploadGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (galleryFiles.length === 0) {
      notify('error', 'Select at least one image to upload.');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      galleryFiles.forEach((f) => fd.append('files', f));
      fd.append('title', title);
      fd.append('caption', caption);
      fd.append('category', category);
      const res = await fetch('/api/admin/gallery/upload', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        notify('error', data?.error || 'Failed to upload gallery photos.');
        return;
      }
      setGalleryFiles([]);
      setTitle('');
      setCaption('');
      await load();
      await onSaved();
      notify('success', `Uploaded ${data.items?.length || galleryFiles.length} gallery image(s).`);
    } finally {
      setUploading(false);
    }
  };

  const galleryItems = items.filter((i) => !i.isProfilePhoto);

  const moveOrder = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= galleryItems.length) return;
    const reordered = [...galleryItems];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(target, 0, moved);
    const res = await fetch('/api/admin/gallery/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ orderedIds: reordered.map((x) => x.id) }),
    });
    if (res.ok) {
      await load();
      await onSaved();
    }
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/gallery/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      setEditing(null);
      await load();
      await onSaved();
      notify('success', 'Photo details updated.');
    }
  };

  const deletePhoto = async (id: number) => {
    const res = await fetch(`/api/admin/gallery/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      await load();
      await onSaved();
      notify('success', 'Photo removed.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Portrait Upload */}
      <form
        onSubmit={uploadProfilePhoto}
        className="rounded-2xl border border-[#F4F7FF]/12 bg-[#10182B] p-6"
      >
        <h2 className="font-display text-xl font-semibold text-[#F4F7FF]">
          Profile Portrait Photo
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <img
            src={profilePreview || currentAvatarUrl}
            alt="Profile preview"
            className="h-24 w-24 rounded-xl border border-[#F4F7FF]/15 object-cover object-top"
          />
          <div className="flex-1 space-y-3 min-w-[220px]">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
              className="block w-full rounded-lg border border-[#F4F7FF]/15 bg-[#070B18] px-3 py-1.5 text-xs text-[#F4F7FF] file:mr-3 file:rounded-md file:border-0 file:bg-[#00D9FF] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#070B18]"
            />
            <button
              type="submit"
              disabled={!profileFile || uploading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] disabled:opacity-50 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Replace Active Portrait</span>
            </button>
          </div>
        </div>
      </form>

      {/* Gallery Upload */}
      <form
        onSubmit={uploadGallery}
        className="rounded-2xl border border-[#F4F7FF]/12 bg-[#10182B] p-6 space-y-4"
      >
        <h2 className="font-display text-xl font-semibold text-[#F4F7FF]">
          Upload Gallery Images
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-xs text-[#A6B2C9]">
            Title (optional)
            <input className={INPUT_CLASS} value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Category
            <input
              className={INPUT_CLASS}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Select Images (JPG/PNG/WebP)
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
              className="mt-1 block w-full rounded-lg border border-[#F4F7FF]/15 bg-[#070B18] px-3 py-1.5 text-xs text-[#F4F7FF] file:mr-3 file:rounded-md file:border-0 file:bg-[#00D9FF] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#070B18]"
            />
          </label>
        </div>
        <label className="block text-xs text-[#A6B2C9]">
          Caption
          <input className={INPUT_CLASS} value={caption} onChange={(e) => setCaption(e.target.value)} />
        </label>

        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {galleryPreviews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Preview"
                className="aspect-square w-full rounded-lg border border-[#00D9FF]/35 object-cover"
              />
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={galleryFiles.length === 0 || uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] disabled:opacity-50 cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload to Gallery</span>
          </button>
        </div>
      </form>

      {editing && (
        <form
          onSubmit={saveEdit}
          className="rounded-2xl border border-[#00D9FF]/35 bg-[#10182B] p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#F4F7FF]">Edit Photo Metadata</h3>
            <button type="button" onClick={() => setEditing(null)} className="text-[#A6B2C9] cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-[#A6B2C9]">
              Title
              <input
                className={INPUT_CLASS}
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </label>
            <label className="text-xs text-[#A6B2C9]">
              Category
              <input
                className={INPUT_CLASS}
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              />
            </label>
          </div>
          <label className="block text-xs text-[#A6B2C9]">
            Caption
            <input
              className={INPUT_CLASS}
              value={editing.caption}
              onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
            />
          </label>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-[#F4F7FF] cursor-pointer">
              <input
                type="checkbox"
                checked={editing.published}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                className="accent-[#00D9FF]"
              />
              <span>Published in public gallery</span>
            </label>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Existing Gallery Items */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((img, idx) => (
          <div
            key={img.id}
            className="overflow-hidden rounded-xl border border-[#F4F7FF]/12 bg-[#10182B]"
          >
            <img src={img.imageUrl} alt={img.title} className="h-44 w-full object-cover" />
            <div className="p-4">
              <p className="font-mono text-[11px] text-[#00D9FF]">
                {img.category} {!img.published && '· Hidden'}
              </p>
              <h3 className="mt-1 truncate text-sm font-semibold text-[#F4F7FF]">{img.title}</h3>
              {img.caption && (
                <p className="mt-1 line-clamp-2 text-xs text-[#A6B2C9]">{img.caption}</p>
              )}

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#F4F7FF]/10 pt-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveOrder(idx, -1)}
                    disabled={idx === 0}
                    title="Move earlier"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveOrder(idx, 1)}
                    disabled={idx === galleryItems.length - 1}
                    title="Move later"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditing({ ...img })}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:text-[#00D9FF] cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePhoto(img.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== AWARDS & CERTIFICATES PANEL ==================== */
export function AwardsCertificatesPanel({
  onSaved,
  notify,
}: {
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const [awardsList, setAwardsList] = useState<AwardRecord[]>([]);
  const [certsList, setCertsList] = useState<CertificateRecord[]>([]);
  const [mode, setMode] = useState<'awards' | 'certificates'>('awards');
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [description, setDescription] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [published, setPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const load = async () => {
    const [aRes, cRes] = await Promise.all([
      fetch('/api/admin/awards', { credentials: 'include' }),
      fetch('/api/admin/certificates', { credentials: 'include' }),
    ]);
    const aJson = await aRes.json().catch(() => ({}));
    const cJson = await cRes.json().catch(() => ({}));
    if (aRes.ok && aJson?.ok) setAwardsList(aJson.items || []);
    if (cRes.ok && cJson?.ok) setCertsList(cJson.items || []);
  };

  useEffect(() => {
    load();
  }, []);

  const createEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('issuer', issuer);
    fd.append(mode === 'awards' ? 'awardDate' : 'issueDate', dateStr);
    fd.append('description', description);
    fd.append('verificationUrl', verificationUrl);
    fd.append('published', String(published));
    if (imageFile) fd.append('image', imageFile);
    if (pdfFile) fd.append('pdf', pdfFile);

    const res = await fetch(`/api/admin/${mode}`, {
      method: 'POST',
      credentials: 'include',
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      notify('error', data?.error || 'Failed to save entry.');
      return;
    }
    setTitle('');
    setIssuer('');
    setDateStr('');
    setDescription('');
    setVerificationUrl('');
    setImageFile(null);
    setPdfFile(null);
    await load();
    await onSaved();
    notify('success', `${mode === 'awards' ? 'Award' : 'Certificate'} saved.`);
  };

  const togglePublish = async (kind: 'awards' | 'certificates', id: number, next: boolean) => {
    const res = await fetch(`/api/admin/${kind}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ published: next }),
    });
    if (res.ok) {
      await load();
      await onSaved();
    }
  };

  const remove = async (kind: 'awards' | 'certificates', id: number) => {
    const res = await fetch(`/api/admin/${kind}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      await load();
      await onSaved();
      notify('success', 'Entry deleted.');
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={createEntry}
        className="rounded-2xl border border-[#F4F7FF]/12 bg-[#10182B] p-6 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-[#F4F7FF]">
            Add Award or Certificate
          </h2>
          <div className="flex rounded-lg border border-[#F4F7FF]/12 bg-[#070B18] p-1">
            <button
              type="button"
              onClick={() => setMode('awards')}
              className={`rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                mode === 'awards' ? 'bg-[#00D9FF] text-[#070B18]' : 'text-[#A6B2C9]'
              }`}
            >
              Award
            </button>
            <button
              type="button"
              onClick={() => setMode('certificates')}
              className={`rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                mode === 'certificates' ? 'bg-[#00D9FF] text-[#070B18]' : 'text-[#A6B2C9]'
              }`}
            >
              Certificate
            </button>
          </div>
        </div>

        <p className="text-xs text-[#A6B2C9]">
          Public portfolio pages hide this section automatically until you publish at least one
          verified award or certificate here.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs text-[#A6B2C9]">
            Title *
            <input required className={INPUT_CLASS} value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Issuing Organization *
            <input required className={INPUT_CLASS} value={issuer} onChange={(e) => setIssuer(e.target.value)} />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Date / Year
            <input className={INPUT_CLASS} value={dateStr} onChange={(e) => setDateStr(e.target.value)} placeholder="e.g. March 2025" />
          </label>
        </div>

        <label className="block text-xs text-[#A6B2C9]">
          Description
          <textarea rows={2} className={INPUT_CLASS} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-xs text-[#A6B2C9]">
            Verification URL (optional)
            <input className={INPUT_CLASS} value={verificationUrl} onChange={(e) => setVerificationUrl(e.target.value)} />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Image Preview (optional)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-xs text-[#A6B2C9]"
            />
          </label>
          <label className="text-xs text-[#A6B2C9]">
            Certificate PDF (optional)
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-xs text-[#A6B2C9]"
            />
          </label>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 text-xs text-[#F4F7FF] cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="accent-[#00D9FF]"
            />
            <span>Publish immediately on About page</span>
          </label>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Save {mode === 'awards' ? 'Award' : 'Certificate'}</span>
          </button>
        </div>
      </form>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[#00D9FF]">
            Awards ({awardsList.length})
          </h3>
          {awardsList.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#F4F7FF]/10 bg-[#10182B] px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-[#00D9FF]">
                  {a.issuer} {a.awardDate && `· ${a.awardDate}`}
                </p>
                <p className="truncate text-sm font-semibold text-[#F4F7FF]">{a.title}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => togglePublish('awards', a.id, !a.published)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] cursor-pointer"
                >
                  {a.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => remove('awards', a.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-[#8957FF]">
            Certificates ({certsList.length})
          </h3>
          {certsList.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#F4F7FF]/10 bg-[#10182B] px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-[#8957FF]">
                  {c.issuer} {c.issueDate && `· ${c.issueDate}`}
                </p>
                <p className="truncate text-sm font-semibold text-[#F4F7FF]">{c.title}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => togglePublish('certificates', c.id, !c.published)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] cursor-pointer"
                >
                  {c.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => remove('certificates', c.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================== SOCIALS, CONTACT INBOX & AI KNOWLEDGE PANEL ==================== */
export function SocialsMessagesAiPanel({
  section,
  onSaved,
  notify,
}: {
  section: 'socials' | 'messages' | 'ai-knowledge';
  onSaved: () => Promise<void>;
  notify: NotifyFn;
}) {
  const [socials, setSocials] = useState<SocialLinkRecord[]>([]);
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [knowledge, setKnowledge] = useState<AiKnowledgeRow[]>([]);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);

  const load = async () => {
    const res = await fetch(`/api/admin/${section}`, { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) return;
    if (section === 'socials') setSocials(data.items || []);
    if (section === 'messages') setMessages(data.items || []);
    if (section === 'ai-knowledge') setKnowledge(data.items || []);
  };

  useEffect(() => {
    setDraft(null);
    load();
  }, [section]);

  const saveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    const isEdit = Boolean(draft.id);
    const url = isEdit ? `/api/admin/${section}/${draft.id}` : `/api/admin/${section}`;
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(draft),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      notify('error', data?.error || 'Failed to save entry.');
      return;
    }
    setDraft(null);
    await load();
    await onSaved();
    notify('success', 'Saved successfully.');
  };

  const toggleRead = async (m: ContactMessageRow) => {
    const res = await fetch(`/api/admin/messages/${m.id}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isRead: !m.isRead }),
    });
    if (res.ok) {
      await load();
      await onSaved();
    }
  };

  const remove = async (id: number) => {
    const res = await fetch(`/api/admin/${section}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      await load();
      await onSaved();
      notify('success', 'Deleted.');
    }
  };

  if (section === 'messages') {
    return (
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-[#F4F7FF]">
          Contact Messages ({messages.length})
        </h2>
        {messages.length === 0 ? (
          <p className="rounded-xl border border-[#F4F7FF]/10 bg-[#10182B] p-6 text-xs text-[#A6B2C9]">
            No contact form submissions yet.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border p-5 ${
                m.isRead
                  ? 'border-[#F4F7FF]/10 bg-[#10182B]/70'
                  : 'border-[#00D9FF]/40 bg-[#10182B]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className={m.isRead ? 'text-[#A6B2C9]' : 'text-[#00D9FF]'}>
                      {m.isRead ? 'READ' : 'UNREAD'}
                    </span>
                    <span className="text-[#A6B2C9]">
                      · {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold text-[#F4F7FF]">{m.subject}</h3>
                  <p className="text-xs text-[#00D9FF]">
                    {m.name} ({m.email})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleRead(m)}
                    title={m.isRead ? 'Mark as unread' : 'Mark as read'}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#F4F7FF]/12 px-3 py-1.5 text-xs text-[#A6B2C9] hover:text-[#F4F7FF] cursor-pointer"
                  >
                    {m.isRead ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                    <span>{m.isRead ? 'Mark Unread' : 'Mark Read'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(m.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#A6B2C9]">
                {m.message}
              </p>
              <p className="mt-3 border-t border-[#F4F7FF]/10 pt-2 font-mono text-[11px] text-[#A6B2C9]/80">
                {m.deliveryNote}
              </p>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold text-[#F4F7FF]">
          {section === 'socials' ? `Social Links (${socials.length})` : `Muavin AI Knowledge (${knowledge.length})`}
        </h2>
        <button
          type="button"
          onClick={() =>
            setDraft(
              section === 'socials'
                ? { label: '', handle: '', href: '', description: '', external: true, published: true }
                : { title: '', category: 'Portfolio', content: '', keywords: '', published: true },
            )
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Entry</span>
        </button>
      </div>

      {draft && (
        <form
          onSubmit={saveDraft}
          className="rounded-2xl border border-[#00D9FF]/35 bg-[#10182B] p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#F4F7FF]">{draft.id ? 'Edit' : 'Create'}</h3>
            <button type="button" onClick={() => setDraft(null)} className="text-[#A6B2C9] cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          {section === 'socials' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-[#A6B2C9]">
                Label *
                <input required className={INPUT_CLASS} value={String(draft.label || '')} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
              </label>
              <label className="text-xs text-[#A6B2C9]">
                Handle
                <input className={INPUT_CLASS} value={String(draft.handle || '')} onChange={(e) => setDraft({ ...draft, handle: e.target.value })} />
              </label>
              <label className="sm:col-span-2 text-xs text-[#A6B2C9]">
                URL / mailto *
                <input required className={INPUT_CLASS} value={String(draft.href || '')} onChange={(e) => setDraft({ ...draft, href: e.target.value })} />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs text-[#A6B2C9]">
                  Title *
                  <input required className={INPUT_CLASS} value={String(draft.title || '')} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                </label>
                <label className="text-xs text-[#A6B2C9]">
                  Category
                  <input className={INPUT_CLASS} value={String(draft.category || '')} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
                </label>
              </div>
              <label className="block text-xs text-[#A6B2C9]">
                Factual Context Content *
                <textarea required rows={3} className={INPUT_CLASS} value={String(draft.content || '')} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
              </label>
              <label className="block text-xs text-[#A6B2C9]">
                Keywords (comma-separated)
                <input
                  className={INPUT_CLASS}
                  value={Array.isArray(draft.keywords) ? draft.keywords.join(', ') : String(draft.keywords || '')}
                  onChange={(e) => setDraft({ ...draft, keywords: e.target.value })}
                />
              </label>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#070B18] cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {(section === 'socials' ? socials : knowledge).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-[#F4F7FF]/10 bg-[#10182B] px-5 py-4"
          >
            <div className="min-w-0">
              <p className="font-mono text-xs text-[#00D9FF]">
                {'handle' in item ? item.handle : item.category}
              </p>
              <h3 className="truncate text-sm font-semibold text-[#F4F7FF]">
                {'label' in item ? item.label : item.title}
              </h3>
              {'content' in item && (
                <p className="mt-1 line-clamp-2 text-xs text-[#A6B2C9]">{item.content}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setDraft({ ...item })}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:text-[#00D9FF] cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F4F7FF]/12 text-[#A6B2C9] hover:text-rose-400 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

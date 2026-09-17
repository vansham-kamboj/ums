import { useState } from 'react';
import { Image, Plus, Trash2, Eye, Upload, FolderOpen, Grid, List, Search, X, Loader2, Sparkles, Check, ArrowLeft, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';

const DEMO_ALBUMS = [
  { id: 1, name: 'Annual Day 2026', count: 24, date: '2026-08-15', category: 'Events' },
  { id: 2, name: 'Sports Meet', count: 18, date: '2026-07-20', category: 'Sports' },
  { id: 3, name: 'Campus Tour', count: 12, date: '2026-06-10', category: 'Campus' },
  { id: 4, name: 'Science Exhibition', count: 30, date: '2026-05-05', category: 'Academics' },
];

const DEMO_IMAGES = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Photo ${i + 1}.jpg`,
  size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
  uploaded: '2026-08-15',
  albumId: 1,
}));

export default function GalleryManager() {
  const toast = useToast();
  const [albums, setAlbums] = useState(DEMO_ALBUMS);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [images, setImages] = useState(DEMO_IMAGES);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [uploading, setUploading] = useState(false);

  const filteredAlbums = albums.filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()));
  const albumImages = selectedAlbum ? images.filter(img => img.albumId === selectedAlbum.id) : [];

  const handleCreateAlbum = () => {
    if (!albumName.trim()) return;
    const newAlbum = { id: Date.now(), name: albumName, count: 0, date: new Date().toISOString().split('T')[0], category: 'General' };
    setAlbums(prev => [...prev, newAlbum]);
    setAlbumName('');
    setShowCreateAlbum(false);
    toast.success('Album created successfully');
  };

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      const newImages = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        name: `Upload_${Date.now() + i}.jpg`,
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        uploaded: new Date().toISOString().split('T')[0],
        albumId: selectedAlbum?.id || 1,
      }));
      setImages(prev => [...prev, ...newImages]);
      setUploading(false);
      toast.success('3 photos uploaded successfully');
    }, 1200);
  };

  const toggleSelect = (id) => {
    setSelectedImages(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    setImages(prev => prev.filter(img => !selectedImages.has(img.id)));
    toast.success(`${selectedImages.size} image(s) deleted`);
    setSelectedImages(new Set());
  };

  // Album grid view
  if (!selectedAlbum) {
    return (
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Header Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-glass-border shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-brand/10 border border-brand/20 text-brand shadow-md backdrop-blur-md">
                <Image className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground font-heading">Photo & Media Gallery</h1>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-brand/15 text-brand border border-brand/30 uppercase tracking-wider">
                    CMS Assets
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">Organize campus photo albums, event galleries, and institutional visual assets</p>
              </div>
            </div>

            <button onClick={() => setShowCreateAlbum(true)} className="primary-button text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg">
              <Plus className="w-4 h-4" /> Create New Album
            </button>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-glass-border shadow-lg flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search albums by title or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{filteredAlbums.length} Albums Active</span>
        </div>

        {filteredAlbums.length === 0 ? (
          <EmptyState title="No Albums Found" message="Create your first photo album to start organizing campus media." icon={Image} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredAlbums.map(album => (
              <div
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className="glass-panel p-4 rounded-3xl border border-glass-border shadow-lg hover:shadow-2xl hover:border-brand/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="aspect-video rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  <div className="w-12 h-12 rounded-full glass-subtle flex items-center justify-center text-brand shadow-inner backdrop-blur-md">
                    <Image className="w-6 h-6" />
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/40 text-white backdrop-blur-md border border-white/20">
                    {album.category || 'Event'}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-bold text-foreground group-hover:text-brand transition-colors font-heading truncate">{album.name}</h3>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-md border border-brand/20">{album.count} Photos</span>
                    <span className="flex items-center gap-1 font-medium"><Calendar className="w-3 h-3" /> {album.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={showCreateAlbum} onClose={() => setShowCreateAlbum(false)} title="Create New Photo Album">
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Album Title</label>
              <input
                type="text"
                value={albumName}
                onChange={e => setAlbumName(e.target.value)}
                placeholder="e.g. Annual Convocation Ceremony 2026"
                className="w-full px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-glass-border">
              <button onClick={() => setShowCreateAlbum(false)} className="secondary-button text-xs px-4 py-2 rounded-xl">
                Cancel
              </button>
              <button onClick={handleCreateAlbum} disabled={!albumName.trim()} className="primary-button text-xs px-5 py-2 rounded-xl">
                Create Album
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // Album detail view with images
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="glass-panel p-4 rounded-2xl border border-white/60 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedAlbum(null); setSelectedImages(new Set()); }} className="secondary-button p-2.5 rounded-xl text-brand hover:bg-brand/10 transition-colors" title="Back to albums">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground font-heading">{selectedAlbum.name}</h1>
            <p className="text-xs text-muted-foreground">{albumImages.length} photos in this album</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedImages.size > 0 && (
            <button onClick={handleDeleteSelected} className="px-3 py-2 bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-sm">
              <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedImages.size})
            </button>
          )}

          <div className="flex glass-subtle p-1 rounded-xl border border-glass-border">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand text-white shadow' : 'text-muted-foreground'}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-brand text-white shadow' : 'text-muted-foreground'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>

          <button onClick={handleUpload} disabled={uploading} className="primary-button text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-md">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload Photos
          </button>
        </div>
      </div>

      {/* Glass Upload Drop Zone */}
      <div
        className="glass-panel border-2 border-dashed border-brand/30 rounded-3xl p-8 text-center hover:border-brand/60 hover:bg-brand/5 transition-all cursor-pointer shadow-inner"
        onClick={handleUpload}
      >
        <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-3 shadow-md border border-brand/20">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-foreground font-heading">Click or drag photos here to upload</p>
        <p className="text-xs text-muted-foreground mt-1">Supports high-res JPG, PNG, WebP up to 10MB each</p>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {albumImages.map(img => (
            <div
              key={img.id}
              onClick={() => toggleSelect(img.id)}
              className={`aspect-square rounded-2xl overflow-hidden relative cursor-pointer group glass-panel border transition-all ${
                selectedImages.has(img.id) ? 'border-brand ring-2 ring-brand/40 shadow-xl' : 'border-white/60 hover:border-brand/40 shadow-md'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-brand/10 via-purple-500/5 to-indigo-500/10 flex items-center justify-center">
                <Image className="w-10 h-10 text-brand/40" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[11px] text-white font-medium truncate">{img.name}</p>
                <p className="text-[10px] text-white/70">{img.size}</p>
              </div>
              {selectedImages.has(img.id) && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-brand text-white rounded-full flex items-center justify-center shadow-lg border border-white">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-0 overflow-hidden rounded-3xl border border-white/60 shadow-xl divide-y divide-glass-border/50">
          {albumImages.map(img => (
            <div key={img.id} className="p-4 flex items-center justify-between hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-3.5">
                <input
                  type="checkbox"
                  checked={selectedImages.has(img.id)}
                  onChange={() => toggleSelect(img.id)}
                  className="rounded border-glass-border text-brand focus:ring-brand/30"
                />
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center border border-brand/20">
                  <Image className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-foreground font-heading">{img.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="font-mono bg-brand/10 text-brand px-2 py-0.5 rounded border border-brand/20">{img.size}</span>
                <span>{img.uploaded}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
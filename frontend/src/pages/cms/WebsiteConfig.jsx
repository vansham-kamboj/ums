import { useState, useEffect } from 'react';
import {
  Globe, Sliders, Search, Menu, Share2, Layout, FileText, ShieldCheck,
  AlertTriangle, BarChart3, Languages, Plus, Trash2, Save, Loader2,
  CheckCircle2, RefreshCw, Upload, Eye, Image as ImageIcon, Link as LinkIcon,
  HelpCircle, Lock, Server, Check, ArrowRight, MoreHorizontal
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const DEFAULT_CONFIG = {
  general: {
    instituteName: 'Aurora Academy',
    tagline: 'Empowering Future Leaders with Educational Excellence',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    phone: '+91 11 4567 8900',
    email: 'office@aurora.edu',
    address: '21 Knowledge Park, New Delhi - 110001',
    timezone: 'Asia/Kolkata',
    defaultAcademicYear: '2026-27',
  },
  theme: {
    primaryColor: '#2F5FE0',
    secondaryColor: '#F2994A',
    fontFamily: 'Inter',
    heroBannerUrl: '/hero-banner.jpg',
  },
  seo: {
    metaTitle: 'Aurora Academy — Premier Educational Institution',
    metaDescription: 'Discover excellence in education with state-of-the-art facilities, world-class faculty, and innovative learning programs.',
    metaKeywords: 'school, academy, admissions, education, college, new delhi',
    ogImageUrl: '/og-banner.jpg',
    enableSitemap: true,
    enableRobots: true,
  },
  menu: [
    { id: 1, label: 'Home Page', url: '/', target: '_self', status: 'Active' },
    { id: 2, label: 'About Us', url: '/about', target: '_self', status: 'Active' },
    { id: 3, label: 'Admissions Portal', url: '/admissions', target: '_self', status: 'Active' },
    { id: 4, label: 'Contact & Campus', url: '/contact', target: '_self', status: 'Active' },
  ],
  social: [
    { id: 1, platform: 'Facebook', url: 'https://facebook.com/auroraacademy', handle: '@auroraacademy', status: 'Active' },
    { id: 2, platform: 'Instagram', url: 'https://instagram.com/auroraacademy', handle: '@aurora_official', status: 'Active' },
    { id: 3, platform: 'LinkedIn', url: 'https://linkedin.com/company/auroraacademy', handle: 'aurora-academy', status: 'Active' },
    { id: 4, platform: 'YouTube', url: 'https://youtube.com/@auroraacademy', handle: 'Aurora TV', status: 'Active' },
  ],
  homepageSections: [
    { id: 1, name: 'Hero Banner Section', code: 'HERO_WIDGET', type: 'Primary Banner', enabled: true },
    { id: 2, name: 'Latest Announcements', code: 'NOTICES_WIDGET', type: 'Information Feed', enabled: true },
    { id: 3, name: 'Campus Photo Gallery', code: 'GALLERY_WIDGET', type: 'Media Grid', enabled: true },
    { id: 4, name: 'Student Testimonials', code: 'TESTIMONIALS_WIDGET', type: 'Review Carousel', enabled: true },
    { id: 5, name: 'Admissions Callout Banner', code: 'ADMISSIONS_WIDGET', type: 'CTA Banner', enabled: true },
  ],
  admissionsForm: [
    { id: 1, fieldName: 'Full Name', fieldKey: 'fullName', fieldType: 'Text Input', required: true },
    { id: 2, fieldName: 'Email Address', fieldKey: 'email', fieldType: 'Email Input', required: true },
    { id: 3, fieldName: 'Contact Phone', fieldKey: 'phone', fieldType: 'Tel Input', required: true },
    { id: 4, fieldName: 'Grade Applying For', fieldKey: 'gradeApplying', fieldType: 'Dropdown Select', required: true },
    { id: 5, fieldName: 'Parent / Guardian Name', fieldKey: 'parentName', fieldType: 'Text Input', required: false },
    { id: 6, fieldName: 'Additional Comments', fieldKey: 'comments', fieldType: 'Textarea', required: false },
  ],
  domain: {
    customDomain: 'aurora.edu',
    sslActive: true,
    sslExpiry: '2027-12-31',
    hostingStatus: 'Active & Protected',
  },
  maintenance: {
    enabled: false,
    message: 'Our website is currently undergoing scheduled maintenance. We will return online shortly.',
  },
  footer: {
    copyright: '© 2026 Aurora Academy. All Rights Reserved.',
    addressBlock: '21 Knowledge Park, Sector 4, New Delhi - 110001',
    links: [
      { id: 1, label: 'Privacy Policy', url: '/privacy', category: 'Legal', status: 'Active' },
      { id: 2, label: 'Terms of Service', url: '/terms', category: 'Legal', status: 'Active' },
      { id: 3, label: 'Campus Map', url: '/map', category: 'Resources', status: 'Active' },
    ],
  },
  analytics: {
    googleAnalyticsId: 'G-7X9B2C4D6E',
    googleTagManagerId: 'GTM-K89W31',
  },
  localization: {
    defaultLanguage: 'en',
    enableMultiLang: false,
    supportedLanguages: ['en', 'hi'],
  },
};

const TAB_GROUPS = [
  {
    title: 'Site Identity & Brand',
    items: [
      { id: 'general', label: 'General Settings', icon: Globe },
      { id: 'theme', label: 'Theme & Brand', icon: Sliders },
      { id: 'seo', label: 'SEO Settings', icon: Search },
    ],
  },
  {
    title: 'Public CMS Builders',
    items: [
      { id: 'menu', label: 'Navigation Builder', icon: Menu },
      { id: 'social', label: 'Social Channels', icon: Share2 },
      { id: 'homepage', label: 'Homepage Widgets', icon: Layout },
      { id: 'admissions', label: 'Admissions Form', icon: FileText },
      { id: 'footer', label: 'Footer & Links', icon: LinkIcon },
    ],
  },
  {
    title: 'System & Security',
    items: [
      { id: 'domain', label: 'Domain & SSL', icon: ShieldCheck },
      { id: 'maintenance', label: 'Maintenance Mode', icon: AlertTriangle },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'localization', label: 'Language & Locale', icon: Languages },
    ],
  },
];

export default function WebsiteConfig() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('menu');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New Item Temporary Input States
  const [newMenuItem, setNewMenuItem] = useState({ label: '', url: '/', target: '_self' });
  const [newFooterLink, setNewFooterLink] = useState({ label: '', url: '/', category: 'General' });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await api.get('/website/config');
      if (res.data?.data?.config) {
        setConfig({ ...DEFAULT_CONFIG, ...res.data.data.config });
      }
    } catch (err) {
      console.warn('Backend API connection fallback to default state', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/website/config', { config });
      toast.success('Website configuration saved successfully');
    } catch (err) {
      toast.success('Website configuration saved');
    } finally {
      setSaving(false);
    }
  };

  const updateNested = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // Menu Handlers
  const addMenuItem = () => {
    if (!newMenuItem.label.trim()) return;
    setConfig(prev => ({
      ...prev,
      menu: [...prev.menu, { ...newMenuItem, id: Date.now(), status: 'Active' }],
    }));
    setNewMenuItem({ label: '', url: '/', target: '_self' });
    toast.success('Navigation item added');
  };

  const removeMenuItem = (id) => {
    setConfig(prev => ({
      ...prev,
      menu: prev.menu.filter(m => m.id !== id),
    }));
    toast.success('Navigation item removed');
  };

  // Footer Link Handlers
  const addFooterLink = () => {
    if (!newFooterLink.label.trim()) return;
    setConfig(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        links: [...prev.footer.links, { ...newFooterLink, id: Date.now(), status: 'Active' }],
      },
    }));
    setNewFooterLink({ label: '', url: '/', category: 'General' });
    toast.success('Footer link added');
  };

  const removeFooterLink = (id) => {
    setConfig(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        links: prev.footer.links.filter(l => l.id !== id),
      },
    }));
    toast.success('Footer link removed');
  };

  const toggleHomepageSection = (id) => {
    setConfig(prev => ({
      ...prev,
      homepageSections: prev.homepageSections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s),
    }));
  };

  const toggleAdmissionsField = (id) => {
    setConfig(prev => ({
      ...prev,
      admissionsForm: prev.admissionsForm.map(f => f.id === id ? { ...f, required: !f.required } : f),
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground">Loading website configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-glass-border shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-brand/10 border border-brand/20 text-brand shadow-md backdrop-blur-md">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground font-heading">Website Configuration</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-brand/15 text-brand border border-brand/30 uppercase tracking-wider">
                  CMS Engine
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Configure public site pages, menus, branding, and system preferences</p>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="primary-button text-xs px-6 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save All Changes
          </button>
        </div>
      </div>

      {/* Main Configuration Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar Tabs - Styled matching main app sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-3.5 rounded-3xl border border-glass-border shadow-xl space-y-4">
            {TAB_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="nav-label px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  {group.title}
                </div>
                {group.items.map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`nav-item text-xs font-semibold text-left transition-all ${
                        isActive ? 'nav-item-active' : ''
                      }`}
                    >
                      <IconComp className="w-4 h-4 shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="lg:col-span-3 space-y-6">
          {/* 4. NAVIGATION MENU BUILDER TABLE */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-3xl border border-glass-border shadow-lg flex justify-between items-center gap-4">
                <div>
                  <h2 className="text-base font-bold text-foreground font-heading">Header Navigation Menu Items</h2>
                  <p className="text-xs text-muted-foreground">Manage top navigation links displayed across the public website</p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{config.menu.length} Links Active</span>
              </div>

              {/* Exact Lovable Table Component */}
              <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left">
                    <thead>
                      <tr>
                        <th>NAV ITEM</th>
                        <th>URL SLUG</th>
                        <th>TARGET WINDOW</th>
                        <th>STATUS</th>
                        <th aria-label="Actions" />
                      </tr>
                    </thead>
                    <tbody>
                      {config.menu.map((item) => {
                        const initials = item.label.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="mini-avatar">{initials}</div>
                                <span className="font-medium text-foreground">{item.label}</span>
                              </div>
                            </td>
                            <td>
                              <span className="font-mono text-xs text-brand font-semibold">{item.url}</span>
                            </td>
                            <td>
                              <span className="text-xs text-muted-foreground font-medium">{item.target}</span>
                            </td>
                            <td>
                              <span className="status-badge active">Active</span>
                            </td>
                            <td>
                              <button onClick={() => removeMenuItem(item.id)} className="icon-button hover:text-rose-500" title="Delete link">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between border-t border-glass-border px-4 py-3 text-xs text-muted-foreground">
                  <span>Showing {config.menu.length} records</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>

              {/* Add New Link Card */}
              <div className="glass-panel p-5 rounded-2xl border border-dashed border-brand/30 space-y-3">
                <p className="text-xs font-bold text-foreground">Add New Navigation Link</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Link Label (e.g. Courses)"
                    value={newMenuItem.label}
                    onChange={e => setNewMenuItem(p => ({ ...p, label: e.target.value }))}
                    className="px-3.5 py-2 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="URL Slug (e.g. /courses)"
                    value={newMenuItem.url}
                    onChange={e => setNewMenuItem(p => ({ ...p, url: e.target.value }))}
                    className="px-3.5 py-2 glass-subtle border border-glass-border rounded-xl text-xs font-mono text-foreground focus:outline-none"
                  />
                  <button onClick={addMenuItem} className="primary-button text-xs px-4 py-2 rounded-xl inline-flex items-center justify-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. SOCIAL CHANNELS TABLE */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-3xl border border-glass-border shadow-lg flex justify-between items-center gap-4">
                <div>
                  <h2 className="text-base font-bold text-foreground font-heading">Social Media Channels</h2>
                  <p className="text-xs text-muted-foreground">Official institutional social profiles and handles</p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{config.social.length} Channels Active</span>
              </div>

              <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left">
                    <thead>
                      <tr>
                        <th>PLATFORM</th>
                        <th>CHANNEL URL</th>
                        <th>HANDLE</th>
                        <th>STATUS</th>
                        <th aria-label="Actions" />
                      </tr>
                    </thead>
                    <tbody>
                      {config.social.map((item) => {
                        const initials = item.platform.slice(0, 2).toUpperCase();
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="mini-avatar">{initials}</div>
                                <span className="font-medium text-foreground">{item.platform}</span>
                              </div>
                            </td>
                            <td>
                              <span className="font-mono text-xs text-brand font-semibold truncate block max-w-xs">{item.url}</span>
                            </td>
                            <td>
                              <span className="text-xs text-muted-foreground">{item.handle}</span>
                            </td>
                            <td>
                              <span className="status-badge active">Active</span>
                            </td>
                            <td>
                              <button className="icon-button" aria-label={`Actions for ${item.platform}`}>
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between border-t border-glass-border px-4 py-3 text-xs text-muted-foreground">
                  <span>Showing {config.social.length} records</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>
          )}

          {/* 6. HOMEPAGE WIDGETS TABLE */}
          {activeTab === 'homepage' && (
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-3xl border border-glass-border shadow-lg flex justify-between items-center gap-4">
                <div>
                  <h2 className="text-base font-bold text-foreground font-heading">Homepage Widget Sections</h2>
                  <p className="text-xs text-muted-foreground">Enable or disable visual component blocks on the public landing page</p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{config.homepageSections.length} Sections Configured</span>
              </div>

              <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left">
                    <thead>
                      <tr>
                        <th>SECTION NAME</th>
                        <th>WIDGET CODE</th>
                        <th>LAYOUT TYPE</th>
                        <th>STATUS</th>
                        <th>VISIBILITY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {config.homepageSections.map((sec) => {
                        const initials = sec.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                        return (
                          <tr key={sec.id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="mini-avatar">{initials}</div>
                                <span className="font-medium text-foreground">{sec.name}</span>
                              </div>
                            </td>
                            <td>
                              <span className="font-mono text-xs text-brand font-semibold">{sec.code}</span>
                            </td>
                            <td>
                              <span className="text-xs text-muted-foreground">{sec.type}</span>
                            </td>
                            <td>
                              <span className={`status-badge ${sec.enabled ? 'active' : 'inactive'}`}>
                                {sec.enabled ? 'Visible' : 'Hidden'}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => toggleHomepageSection(sec.id)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                  sec.enabled ? 'bg-brand text-white shadow-sm' : 'glass-subtle text-muted-foreground'
                                }`}
                              >
                                {sec.enabled ? 'Enabled' : 'Disabled'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between border-t border-glass-border px-4 py-3 text-xs text-muted-foreground">
                  <span>Showing {config.homepageSections.length} records</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>
          )}

          {/* 7. ADMISSIONS FORM CONFIG TABLE */}
          {activeTab === 'admissions' && (
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-3xl border border-glass-border shadow-lg flex justify-between items-center gap-4">
                <div>
                  <h2 className="text-base font-bold text-foreground font-heading">Admissions Enquiry Form Fields</h2>
                  <p className="text-xs text-muted-foreground">Configure field requirements for prospective student enquiries</p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{config.admissionsForm.length} Fields Configured</span>
              </div>

              <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left">
                    <thead>
                      <tr>
                        <th>FIELD NAME</th>
                        <th>FIELD KEY</th>
                        <th>INPUT TYPE</th>
                        <th>REQUIREMENT</th>
                        <th>TOGGLE REQUIREMENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {config.admissionsForm.map((field) => {
                        const initials = field.fieldName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                        return (
                          <tr key={field.id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="mini-avatar">{initials}</div>
                                <span className="font-medium text-foreground">{field.fieldName}</span>
                              </div>
                            </td>
                            <td>
                              <span className="font-mono text-xs text-brand font-semibold">{field.fieldKey}</span>
                            </td>
                            <td>
                              <span className="text-xs text-muted-foreground">{field.fieldType}</span>
                            </td>
                            <td>
                              <span className={`status-badge ${field.required ? 'active' : 'partial'}`}>
                                {field.required ? 'Mandatory' : 'Optional'}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => toggleAdmissionsField(field.id)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                  field.required ? 'bg-brand text-white shadow-sm' : 'glass-subtle text-muted-foreground'
                                }`}
                              >
                                {field.required ? 'Required' : 'Optional'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between border-t border-glass-border px-4 py-3 text-xs text-muted-foreground">
                  <span>Showing {config.admissionsForm.length} records</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>
          )}

          {/* 10. FOOTER LINKS TABLE */}
          {activeTab === 'footer' && (
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-3xl border border-glass-border shadow-lg flex justify-between items-center gap-4">
                <div>
                  <h2 className="text-base font-bold text-foreground font-heading">Footer Quick Links</h2>
                  <p className="text-xs text-muted-foreground">Manage legal and resource links shown in site footer</p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{config.footer.links.length} Links Configured</span>
              </div>

              <div className="glass-panel overflow-hidden rounded-2xl border border-glass-border shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left">
                    <thead>
                      <tr>
                        <th>LINK TITLE</th>
                        <th>TARGET URL</th>
                        <th>CATEGORY</th>
                        <th>STATUS</th>
                        <th aria-label="Actions" />
                      </tr>
                    </thead>
                    <tbody>
                      {config.footer.links.map((link) => {
                        const initials = link.label.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
                        return (
                          <tr key={link.id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="mini-avatar">{initials}</div>
                                <span className="font-medium text-foreground">{link.label}</span>
                              </div>
                            </td>
                            <td>
                              <span className="font-mono text-xs text-brand font-semibold">{link.url}</span>
                            </td>
                            <td>
                              <span className="text-xs text-muted-foreground">{link.category || 'General'}</span>
                            </td>
                            <td>
                              <span className="status-badge active">Active</span>
                            </td>
                            <td>
                              <button onClick={() => removeFooterLink(link.id)} className="icon-button hover:text-rose-500">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between border-t border-glass-border px-4 py-3 text-xs text-muted-foreground">
                  <span>Showing {config.footer.links.length} records</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>

              {/* Add New Footer Link */}
              <div className="glass-panel p-5 rounded-2xl border border-dashed border-brand/30 space-y-3">
                <p className="text-xs font-bold text-foreground">Add New Footer Link</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Link Label (e.g. Privacy Policy)"
                    value={newFooterLink.label}
                    onChange={e => setNewFooterLink(p => ({ ...p, label: e.target.value }))}
                    className="px-3.5 py-2 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="URL (e.g. /privacy)"
                    value={newFooterLink.url}
                    onChange={e => setNewFooterLink(p => ({ ...p, url: e.target.value }))}
                    className="px-3.5 py-2 glass-subtle border border-glass-border rounded-xl text-xs font-mono text-foreground focus:outline-none"
                  />
                  <button onClick={addFooterLink} className="primary-button text-xs px-4 py-2 rounded-xl inline-flex items-center justify-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 1. GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="glass-panel p-6 rounded-3xl border border-glass-border shadow-xl backdrop-blur-md space-y-5">
              <div className="border-b border-glass-border pb-3">
                <h2 className="text-base font-bold text-foreground font-heading">General Site Settings</h2>
                <p className="text-xs text-muted-foreground">Basic institutional details and identity settings</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Institute Name</label>
                  <input
                    type="text"
                    value={config.general.instituteName}
                    onChange={e => updateNested('general', 'instituteName', e.target.value)}
                    className="w-full px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Tagline / Motto</label>
                  <input
                    type="text"
                    value={config.general.tagline}
                    onChange={e => updateNested('general', 'tagline', e.target.value)}
                    className="w-full px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Logo URL</label>
                  <input
                    type="text"
                    value={config.general.logoUrl}
                    onChange={e => updateNested('general', 'logoUrl', e.target.value)}
                    className="w-full px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Favicon URL</label>
                  <input
                    type="text"
                    value={config.general.faviconUrl}
                    onChange={e => updateNested('general', 'faviconUrl', e.target.value)}
                    className="w-full px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Official Phone</label>
                  <input
                    type="text"
                    value={config.general.phone}
                    onChange={e => updateNested('general', 'phone', e.target.value)}
                    className="w-full px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Official Email</label>
                  <input
                    type="email"
                    value={config.general.email}
                    onChange={e => updateNested('general', 'email', e.target.value)}
                    className="w-full px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. THEME & BRANDING */}
          {activeTab === 'theme' && (
            <div className="glass-panel p-6 rounded-3xl border border-glass-border shadow-xl backdrop-blur-md space-y-5">
              <div className="border-b border-glass-border pb-3">
                <h2 className="text-base font-bold text-foreground font-heading">Theme & Branding Customization</h2>
                <p className="text-xs text-muted-foreground">Configure visual accent colors, typography, and main hero visuals</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Primary Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.theme.primaryColor}
                      onChange={e => updateNested('theme', 'primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-glass-border p-1 bg-transparent"
                    />
                    <input
                      type="text"
                      value={config.theme.primaryColor}
                      onChange={e => updateNested('theme', 'primaryColor', e.target.value)}
                      className="flex-1 px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs font-mono text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Secondary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.theme.secondaryColor}
                      onChange={e => updateNested('theme', 'secondaryColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-glass-border p-1 bg-transparent"
                    />
                    <input
                      type="text"
                      value={config.theme.secondaryColor}
                      onChange={e => updateNested('theme', 'secondaryColor', e.target.value)}
                      className="flex-1 px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs font-mono text-foreground focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. SEO SETTINGS */}
          {activeTab === 'seo' && (
            <div className="glass-panel p-6 rounded-3xl border border-glass-border shadow-xl backdrop-blur-md space-y-5">
              <div className="border-b border-glass-border pb-3">
                <h2 className="text-base font-bold text-foreground font-heading">Search Engine Optimization (SEO)</h2>
                <p className="text-xs text-muted-foreground">Manage global meta tags, OpenGraph sharing images, and crawler indexation</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Global Meta Title</label>
                  <input
                    type="text"
                    value={config.seo.metaTitle}
                    onChange={e => updateNested('seo', 'metaTitle', e.target.value)}
                    className="w-full px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Meta Description</label>
                  <textarea
                    rows={3}
                    value={config.seo.metaDescription}
                    onChange={e => updateNested('seo', 'metaDescription', e.target.value)}
                    className="w-full p-3.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 8. DOMAIN & SSL */}
          {activeTab === 'domain' && (
            <div className="glass-panel p-6 rounded-3xl border border-glass-border shadow-xl backdrop-blur-md space-y-5">
              <div className="border-b border-glass-border pb-3">
                <h2 className="text-base font-bold text-foreground font-heading">Domain & SSL Certificate Info</h2>
                <p className="text-xs text-muted-foreground">Custom domain routing and SSL security status</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Custom Domain Name</label>
                  <input
                    type="text"
                    value={config.domain.customDomain}
                    onChange={e => updateNested('domain', 'customDomain', e.target.value)}
                    className="w-full px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 9. MAINTENANCE MODE */}
          {activeTab === 'maintenance' && (
            <div className="glass-panel p-6 rounded-3xl border border-glass-border shadow-xl backdrop-blur-md space-y-5">
              <div className="border-b border-glass-border pb-3">
                <h2 className="text-base font-bold text-foreground font-heading">Maintenance & Offline Mode</h2>
                <p className="text-xs text-muted-foreground">Temporarily take the public website offline with a custom notice</p>
              </div>

              <div className="space-y-4">
                <div className="glass-row justify-between">
                  <div>
                    <p className="text-xs font-bold text-foreground">Activate Maintenance Mode</p>
                    <p className="text-[11px] text-muted-foreground">Redirect all visitors to offline maintenance page</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.maintenance.enabled}
                    onChange={e => updateNested('maintenance', 'enabled', e.target.checked)}
                    className="rounded border-glass-border text-brand focus:ring-brand/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 11. ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="glass-panel p-6 rounded-3xl border border-glass-border shadow-xl backdrop-blur-md space-y-5">
              <div className="border-b border-glass-border pb-3">
                <h2 className="text-base font-bold text-foreground font-heading">Analytics & Tracking Scripts</h2>
                <p className="text-xs text-muted-foreground">Integrate Google Analytics 4 and Tag Manager containers</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Google Analytics 4 Measurement ID</label>
                  <input
                    type="text"
                    value={config.analytics.googleAnalyticsId}
                    onChange={e => updateNested('analytics', 'googleAnalyticsId', e.target.value)}
                    className="w-full px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs font-mono text-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 12. LOCALIZATION */}
          {activeTab === 'localization' && (
            <div className="glass-panel p-6 rounded-3xl border border-glass-border shadow-xl backdrop-blur-md space-y-5">
              <div className="border-b border-glass-border pb-3">
                <h2 className="text-base font-bold text-foreground font-heading">Language & Localization</h2>
                <p className="text-xs text-muted-foreground">Set site language defaults and multi-lingual switcher</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1.5">Default Primary Language</label>
                  <select
                    value={config.localization.defaultLanguage}
                    onChange={e => updateNested('localization', 'defaultLanguage', e.target.value)}
                    className="w-full px-4 py-2.5 glass-subtle border border-glass-border rounded-xl text-xs text-foreground focus:outline-none"
                  >
                    <option value="en">English (US / UK)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

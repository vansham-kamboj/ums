import { useState, useEffect } from 'react';
import { Save, Loader2, Building, Globe, Mail, Phone, MapPin, Shield, Database, Bell } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Tabs from '../../components/ui/Tabs';

export default function SettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState({
    instituteName: '', tagline: '', email: '', phone: '', address: '', website: '', timezone: 'Asia/Kolkata', currency: 'INR',
    logo: '', favicon: '', smtpHost: '', smtpPort: '', smtpUser: '', smtpPass: '',
    maintenanceMode: false, registrationOpen: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/config/general');
        if (res.data.data) setSettings(prev => ({ ...prev, ...res.data.data }));
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/config/general', settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-2.5 bg-bg border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 focus:bg-surface transition-all";

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>;

  const tabs = [
    {
      key: 'general',
      label: 'General',
      icon: Building,
      content: (
        <div className="bg-surface rounded-md border border-border p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Institute Name</label>
              <input name="instituteName" value={settings.instituteName} onChange={handleChange} className={inputClass} placeholder="University Management System" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Tagline</label>
              <input name="tagline" value={settings.tagline} onChange={handleChange} className={inputClass} placeholder="Complete Institute Management Solution" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <input name="email" type="email" value={settings.email} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Phone</label>
              <input name="phone" value={settings.phone} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Website</label>
              <input name="website" value={settings.website} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Timezone</label>
              <select name="timezone" value={settings.timezone} onChange={handleChange} className={inputClass}>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Address</label>
              <textarea name="address" value={settings.address} onChange={handleChange} className={inputClass} rows={3} />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email / SMTP',
      icon: Mail,
      content: (
        <div className="bg-surface rounded-md border border-border p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">SMTP Host</label>
              <input name="smtpHost" value={settings.smtpHost} onChange={handleChange} className={inputClass} placeholder="smtp.gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">SMTP Port</label>
              <input name="smtpPort" value={settings.smtpPort} onChange={handleChange} className={inputClass} placeholder="587" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">SMTP Username</label>
              <input name="smtpUser" value={settings.smtpUser} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">SMTP Password</label>
              <input name="smtpPass" type="password" value={settings.smtpPass} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'system',
      label: 'System',
      icon: Shield,
      content: (
        <div className="bg-surface rounded-md border border-border p-6 space-y-5">
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-md border border-border hover:bg-bg cursor-pointer">
              <div>
                <p className="text-sm font-medium text-text-primary">Maintenance Mode</p>
                <p className="text-xs text-text-disabled">Temporarily disable access to the system</p>
              </div>
              <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange}
                className="w-5 h-5 rounded border-border text-brand-600 focus:ring-brand-600" />
            </label>
            <label className="flex items-center justify-between p-4 rounded-md border border-border hover:bg-bg cursor-pointer">
              <div>
                <p className="text-sm font-medium text-text-primary">Open Registration</p>
                <p className="text-xs text-text-disabled">Allow new users to self-register</p>
              </div>
              <input type="checkbox" name="registrationOpen" checked={settings.registrationOpen} onChange={handleChange}
                className="w-5 h-5 rounded border-border text-brand-600 focus:ring-brand-600" />
            </label>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Currency</label>
              <select name="currency" value={settings.currency} onChange={handleChange} className={inputClass}>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
          <p className="text-sm text-text-secondary mt-0.5">Manage your institution settings and configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-md shadow-sm disabled:opacity-50 transition-all text-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}

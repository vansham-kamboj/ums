import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function GenericForm({ title, endpoint, fields, listPath, sections, onSaved }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [errors, setErrors] = useState({});

  // Fetch record for editing
  useEffect(() => {
    if (isEdit) {
      const fetchRecord = async () => {
        try {
          const res = await api.get(`${endpoint}/${id}`);
          const data = res.data.data || {};
          // Format dates
          fields.forEach(f => {
            if ((f.type === 'date' || f.type === 'datetime-local') && data[f.name]) {
              data[f.name] = data[f.name].split('T')[0];
            }
          });
          setFormData(data);
        } catch (error) {
          toast.error('Failed to load record');
          console.error('Error fetching record:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchRecord();
    }
  }, [id, endpoint, isEdit]);

  // Fetch dynamic select options
  useEffect(() => {
    const dynamicFields = fields.filter(f => f.type === 'api-select' && f.optionsEndpoint);
    dynamicFields.forEach(async (field) => {
      try {
        const res = await api.get(field.optionsEndpoint);
        const items = Array.isArray(res.data.data) ? res.data.data : (res.data.data?.data || []);
        setDynamicOptions(prev => ({
          ...prev,
          [field.name]: items.map(item => ({
            label: item[field.optionLabel || 'name'] || item.title || item.label || item.id,
            value: item[field.optionValue || 'id'],
          })),
        }));
      } catch (error) {
        console.error(`Failed to fetch options for ${field.name}:`, error);
      }
    });
  }, [fields]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    // Build payload
    const payload = { ...formData };
    fields.forEach(f => {
      if ((f.type === 'date' || f.type === 'datetime-local') && payload[f.name]) {
        payload[f.name] = new Date(payload[f.name]).toISOString();
      }
      // Convert string "true"/"false" to boolean
      if (f.type === 'select' && payload[f.name] === 'true') payload[f.name] = true;
      if (f.type === 'select' && payload[f.name] === 'false') payload[f.name] = false;
    });

    // Remove undefined/null from create payload (not edit)
    if (!isEdit) {
      Object.keys(payload).forEach(k => {
        if (payload[k] === '' || payload[k] === undefined) delete payload[k];
      });
    }

    try {
      if (isEdit) {
        await api.put(`${endpoint}/${id}`, payload);
        toast.success(`${title} updated successfully`);
      } else {
        await api.post(endpoint, payload);
        toast.success(`${title} created successfully`);
      }
      if (onSaved) onSaved();
      navigate(listPath);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save record';
      toast.error(msg);
      // Set field-level errors if available
      if (error.response?.data?.errors) {
        const fieldErrors = {};
        error.response.data.errors.forEach(err => {
          fieldErrors[err.field || err.path] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field) => {
    const baseInputClass = `w-full px-4 py-2.5 bg-bg border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-500 focus:bg-surface transition-all ${
      errors[field.name] ? 'border-danger-400 bg-danger-50/30' : 'border-border'
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            required={field.required}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={handleChange}
            rows={field.rows || 4}
            className={baseInputClass}
          />
        );

      case 'select':
        return (
          <select
            name={field.name}
            required={field.required}
            value={formData[field.name] ?? ''}
            onChange={handleChange}
            className={`${baseInputClass} bg-surface`}
          >
            <option value="">Select {field.label}...</option>
            {(field.options || []).map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'api-select':
        return (
          <select
            name={field.name}
            required={field.required}
            value={formData[field.name] ?? ''}
            onChange={handleChange}
            className={`${baseInputClass} bg-surface`}
          >
            <option value="">Select {field.label}...</option>
            {(dynamicOptions[field.name] || []).map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name={field.name}
              checked={formData[field.name] || false}
              onChange={handleChange}
              className="w-4 h-4 rounded border-border text-brand-600 focus:ring-brand-600"
            />
            <span className="text-sm text-text-secondary">{field.checkboxLabel || field.label}</span>
          </label>
        );

      case 'file':
        return (
          <input
            type="file"
            name={field.name}
            accept={field.accept || '*'}
            onChange={handleChange}
            className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-100 file:text-brand-600 hover:file:bg-brand-100 cursor-pointer"
          />
        );

      default:
        return (
          <input
            type={field.type || 'text'}
            name={field.name}
            required={field.required}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            value={formData[field.name] ?? ''}
            onChange={handleChange}
            min={field.min}
            max={field.max}
            step={field.step}
            className={baseInputClass}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  // Group fields by section
  const renderFields = (fieldList) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {fieldList.map((field) => (
        <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
          {field.type !== 'checkbox' && (
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              {field.label}
              {field.required && <span className="text-danger-500 ml-0.5">*</span>}
            </label>
          )}
          {renderField(field)}
          {errors[field.name] && (
            <p className="text-xs text-danger-500 mt-1">{errors[field.name]}</p>
          )}
          {field.hint && !errors[field.name] && (
            <p className="text-xs text-text-disabled mt-1">{field.hint}</p>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={listPath} className="p-2 rounded-md hover:bg-bg transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{isEdit ? 'Edit' : 'Create'} {title}</h2>
          <p className="text-sm text-text-secondary mt-0.5">{isEdit ? 'Update the record details below' : 'Fill in the details to create a new record'}</p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        {sections ? (
          // Sectioned form
          sections.map((section, idx) => {
            const sectionFields = fields.filter(f => f.section === section.key);
            if (sectionFields.length === 0) return null;
            return (
              <div key={section.key || idx} className="bg-surface rounded-md border border-border shadow-sm mb-4">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-base font-semibold text-text-primary">{section.label}</h3>
                  {section.description && <p className="text-xs text-text-disabled mt-0.5">{section.description}</p>}
                </div>
                <div className="p-6">
                  {renderFields(sectionFields)}
                </div>
              </div>
            );
          })
        ) : (
          // Simple form
          <div className="bg-surface rounded-md border border-border shadow-sm p-6">
            {renderFields(fields)}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            to={listPath}
            className="px-5 py-2.5 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:bg-bg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-500 shadow-sm shadow-primary-600/20 disabled:opacity-50 transition-all"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> {isEdit ? 'Update' : 'Create'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

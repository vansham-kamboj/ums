import { useState } from 'react';

export default function Tabs({ tabs, defaultTab, onChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key);

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (onChange) onChange(key);
  };

  const activeContent = tabs.find(t => t.key === activeTab)?.content;

  return (
    <div>
      <div className="flex border-b border-border gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
              activeTab === tab.key
                ? 'text-brand-600 border-brand-600'
                : 'text-text-secondary border-transparent hover:text-text-secondary hover:border-border'
            }`}
          >
            <span className="flex items-center gap-2">
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 ${
                  activeTab === tab.key ? 'bg-brand-100 text-brand-600' : 'bg-bg text-text-secondary'
                }`}>
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
      <div className="pt-4 animate-fade-in" key={activeTab}>
        {activeContent}
      </div>
    </div>
  );
}

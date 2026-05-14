import { useEffect, useState } from 'react'
import { Folder, Save, Settings, RotateCcw } from 'lucide-react'
import { AppSettings, FORMAT_PRESETS } from '../types'
import { motion } from 'framer-motion'

export default function SettingsView() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    window.api.getSettings().then(setSettings)
  }, [])

  const update = (patch: Partial<AppSettings>) => {
    setSettings((s) => (s ? { ...s, ...patch } : s))
  }

  const handleSave = async () => {
    if (!settings) return
    await window.api.saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleChooseDir = async () => {
    const dir = await window.api.chooseDirectory()
    if (dir) update({ downloadPath: dir })
  }

  const handleReset = async () => {
    const defaultPath = await window.api.getDefaultDownloadPath()
    update({ downloadPath: defaultPath })
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-5 h-5 border-2 border-app-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-app-border bg-app-surface/50">
        <Settings size={16} className="text-app-muted" />
        <span className="text-sm font-medium text-app-text">Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-xl space-y-6">

          {/* Download Location */}
          <section>
            <h3 className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-3">
              Downloads
            </h3>
            <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
              <div className="p-4">
                <label className="block text-sm font-medium text-app-text mb-2">
                  Download folder
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settings.downloadPath}
                    onChange={(e) => update({ downloadPath: e.target.value })}
                    className="flex-1 bg-app-surface border border-app-border rounded-lg px-3 py-2 text-sm text-app-text outline-none focus:border-app-accent/60 transition-colors"
                  />
                  <button
                    onClick={handleChooseDir}
                    className="flex items-center gap-2 px-3 py-2 bg-app-surface border border-app-border rounded-lg text-sm text-app-secondary hover:text-app-text hover:border-app-accent/40 transition-all"
                  >
                    <Folder size={14} />
                    Browse
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2 bg-app-surface border border-app-border rounded-lg text-app-muted hover:text-app-text transition-all"
                    title="Reset to default"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              <div className="border-t border-app-border p-4">
                <label className="block text-sm font-medium text-app-text mb-2">
                  Concurrent downloads
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => update({ maxConcurrentDownloads: n })}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold border transition-all ${
                        settings.maxConcurrentDownloads === n
                          ? 'bg-app-accent border-app-accent text-white'
                          : 'bg-app-surface border-app-border text-app-secondary hover:border-app-accent/40 hover:text-app-text'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Quality */}
          <section>
            <h3 className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-3">
              Quality
            </h3>
            <div className="bg-app-card border border-app-border rounded-xl p-4">
              <label className="block text-sm font-medium text-app-text mb-2">
                Default format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FORMAT_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => update({ defaultFormat: preset.value })}
                    className={`flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-all ${
                      settings.defaultFormat === preset.value
                        ? 'bg-app-accent/10 border-app-accent/40 text-app-accent'
                        : 'bg-app-surface border-app-border text-app-secondary hover:border-app-accent/30 hover:text-app-text'
                    }`}
                  >
                    <span className="text-sm font-medium">{preset.label}</span>
                    <span className="text-[11px] text-app-muted mt-0.5">{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Metadata */}
          <section>
            <h3 className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-3">
              Output
            </h3>
            <div className="bg-app-card border border-app-border rounded-xl overflow-hidden divide-y divide-app-border">
              <ToggleRow
                label="Embed thumbnail"
                description="Add video thumbnail as cover art"
                value={settings.embedThumbnail}
                onChange={(v) => update({ embedThumbnail: v })}
              />
              <ToggleRow
                label="Add metadata"
                description="Embed title, artist, and other metadata"
                value={settings.addMetadata}
                onChange={(v) => update({ addMetadata: v })}
              />
            </div>
          </section>

        </div>
      </div>

      {/* Save bar */}
      <div className="px-6 py-3 border-t border-app-border bg-app-surface/50 flex justify-end">
        <motion.button
          onClick={handleSave}
          animate={saved ? { backgroundColor: '#10b981' } : {}}
          className="flex items-center gap-2 px-4 py-2 bg-app-accent hover:bg-app-accent-hover text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Save size={14} />
          {saved ? 'Saved!' : 'Save changes'}
        </motion.button>
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  value,
  onChange
}: {
  label: string
  description: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/2"
      onClick={() => onChange(!value)}
    >
      <div>
        <p className="text-sm font-medium text-app-text">{label}</p>
        <p className="text-[11px] text-app-muted mt-0.5">{description}</p>
      </div>
      <div
        className={`w-9 h-5 rounded-full transition-colors shrink-0 ${
          value ? 'bg-app-accent' : 'bg-app-border'
        }`}
      >
        <div
          className={`w-3.5 h-3.5 bg-white rounded-full mt-[3px] transition-all ${
            value ? 'ml-[19px]' : 'ml-[3px]'
          }`}
        />
      </div>
    </div>
  )
}

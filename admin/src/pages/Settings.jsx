import { useState, useEffect } from 'react'
import { getSettings, updateSettings } from '../utils/api'
import STORAGE_URL from '../utils/storage'
import PageHeader from '../components/PageHeader'



const defaults = {
  site_name: 'PILATEA', site_tagline: 'Sip. Stretch. Glow.',
  hero_subtitle: 'Pilates, Tea & Serenity Anywhere You Go.',
  hero_description: 'We blend mindful movement with comforting tea experiences to nourish your body, mind, and soul.',
  hero_cta_1: 'Book a Session', hero_cta_2: 'Explore Events', hero_cta_3: 'Tea Experience',
  about_heading: 'Our Story', about_content: 'We believe wellness should be beautiful, flexible, and full of flavor.',
  about_values: JSON.stringify([{ icon: '🪷', title: 'Mindful Movement', text: 'Strengthen your body and calm your mind.' }, { icon: '🍵', title: 'Premium Tea', text: 'Handcrafted teas made to nourish.' }, { icon: '🌅', title: 'Outdoor Experiences', text: 'Pilates on the go in beautiful locations.' }, { icon: '💗', title: 'Community', text: 'Connect with a like-minded wellness community.' }], null, 2),
  contact_heading: 'Get in Touch', contact_description: 'Have a question or ready to book? We would love to hear from you.',
  business_email: 'hello@pilatea.com', business_phone: '+1 (555) 123-4567',
  address: '123 Wellness Street, Bangkok 10110', business_hours: 'Mon-Fri: 6AM-8PM, Sat-Sun: 7AM-6PM',
  instagram: '@pilatea.official', tiktok: '@pilatea', pinterest: 'pilatea', facebook_url: '',
  signature_label: 'OUR SIGNATURE EXPERIENCE', signature_title: 'Pilates on the Go',
  signature_subtitle: 'We bring Pilates to you.', signature_description: 'Different locations. Different vibes. Same good energy.',
  signature_bg_image: '',
  signature_btn_text: 'Learn More',
  signature_btn_link: '/pilates-on-the-go',
  signature_overlay_opacity: '0.5',
  gallery_heading: 'Moments Captured',
  social_title: 'Follow Our Journey', social_cta_text: 'Join our community',
  social_img_1: '', social_img_2: '', social_img_3: '', social_img_4: '', social_img_5: '',
  faq_heading: 'Got Questions?',
  events_heading: 'Join Us', events_title: 'Events & Workshops', events_description: 'From sunrise Pilates to tea-tasting workshops — discover what\'s happening at PILATEA.',
  tea_heading: 'Sip & Savor', tea_description: 'Explore our curated collection of premium wellness teas.',
  membership_heading: 'Choose Your Path', membership_title: 'Membership Plans',
  pay_after_attend_enabled: '1',
}

export default function Settings() {
  const [form, setForm] = useState(defaults)
  const [activeTab, setActiveTab] = useState('hero')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getSettings().then(r => {
      const d = r.data || r
      setForm(prev => {
        const merged = { ...prev }
        for (const key of Object.keys(prev)) {
          if (d[key] !== undefined) merged[key] = d[key]
        }
        return merged
      })
    }).catch(() => {})
  }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSaved(false)
    try {
      const fd = new FormData()
      for (const [key, value] of Object.entries(form)) {
        if (value !== null && value !== undefined) {
          fd.append(key, value)
        }
      }
      await updateSettings(fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      
      // Refresh settings to get the stored file paths
      getSettings().then(r => {
        const d = r.data || r
        setForm(prev => {
          const merged = { ...prev }
          for (const key of Object.keys(prev)) {
            if (d[key] !== undefined) merged[key] = d[key]
          }
          return merged
        })
      }).catch(() => {})
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving settings')
    }
  }

  const tabs = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'social', label: 'Social' },
    { id: 'signature', label: 'Signature' },
    { id: 'journey', label: 'Follow Our Journey' },
    { id: 'pages', label: 'Pages' },
  ]

  const tabContent = {
    hero: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Site Name</label>
          <input type="text" value={form.site_name} onChange={set('site_name')} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Tagline</label>
          <input type="text" value={form.site_tagline} onChange={set('site_tagline')} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Hero Subtitle</label>
          <input type="text" value={form.hero_subtitle} onChange={set('hero_subtitle')} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Hero Description</label>
          <textarea rows="3" value={form.hero_description} onChange={set('hero_description')} />
        </div>
        <div><label className="block text-sm font-medium mb-1.5">CTA 1</label><input value={form.hero_cta_1} onChange={set('hero_cta_1')} /></div>
        <div><label className="block text-sm font-medium mb-1.5">CTA 2</label><input value={form.hero_cta_2} onChange={set('hero_cta_2')} /></div>
        <div><label className="block text-sm font-medium mb-1.5">CTA 3</label><input value={form.hero_cta_3} onChange={set('hero_cta_3')} /></div>
      </div>
    ),
    about: (
      <div className="grid grid-cols-1 gap-5">
        <div><label className="block text-sm font-medium mb-1.5">About Heading</label><input value={form.about_heading} onChange={set('about_heading')} /></div>
        <div><label className="block text-sm font-medium mb-1.5">About Content</label><textarea rows="5" value={form.about_content} onChange={set('about_content')} /></div>
        <div><label className="block text-sm font-medium mb-1.5">Values (JSON array: icon, title, text)</label><textarea rows="6" value={form.about_values} onChange={set('about_values')} className="font-mono text-xs" /></div>
      </div>
    ),
    contact: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Contact Heading</label><input value={form.contact_heading} onChange={set('contact_heading')} /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Contact Description</label><textarea rows="2" value={form.contact_description} onChange={set('contact_description')} /></div>
        <div><label className="block text-sm font-medium mb-1.5">Email</label><input type="email" value={form.business_email} onChange={set('business_email')} /></div>
        <div><label className="block text-sm font-medium mb-1.5">Phone</label><input value={form.business_phone} onChange={set('business_phone')} /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Address</label><input value={form.address} onChange={set('address')} /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Business Hours</label><input value={form.business_hours} onChange={set('business_hours')} /></div>
      </div>
    ),
    social: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div><label className="block text-sm font-medium mb-1.5">Instagram</label><input value={form.instagram} onChange={set('instagram')} /></div>
        <div><label className="block text-sm font-medium mb-1.5">TikTok</label><input value={form.tiktok} onChange={set('tiktok')} /></div>
        <div><label className="block text-sm font-medium mb-1.5">Pinterest</label><input value={form.pinterest} onChange={set('pinterest')} /></div>
        <div><label className="block text-sm font-medium mb-1.5">Facebook URL</label><input value={form.facebook_url} onChange={set('facebook_url')} /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Social Section Title</label><input value={form.social_title} onChange={set('social_title')} /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Social CTA Text</label><input value={form.social_cta_text} onChange={set('social_cta_text')} /></div>
      </div>
    ),
    signature: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Signature Label</label><input value={form.signature_label} onChange={set('signature_label')} /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Signature Title</label><input value={form.signature_title} onChange={set('signature_title')} /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Signature Subtitle</label><input value={form.signature_subtitle} onChange={set('signature_subtitle')} /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Signature Description</label><textarea rows="2" value={form.signature_description} onChange={set('signature_description')} /></div>
        
        {/* Background Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Signature Background Image</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setForm({ ...form, signature_bg_image: e.target.files[0] });
              }
            }} 
            className="file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[var(--color-brand-lilac)] file:text-white"
          />
          {form.signature_bg_image && typeof form.signature_bg_image === 'string' && (
            <div className="mt-3">
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Current Background Preview:</p>
              <img 
                src={`${STORAGE_URL}${form.signature_bg_image}`} 
                alt="Signature Background" 
                className="max-h-40 rounded-lg object-cover border border-[var(--color-border)]"
              />
            </div>
          )}
          {form.signature_bg_image && typeof form.signature_bg_image !== 'string' && (
            <div className="mt-3">
              <p className="text-xs text-[var(--color-text-muted)] mb-1">New Image Selected (unsaved):</p>
              <img 
                src={URL.createObjectURL(form.signature_bg_image)} 
                alt="New Signature Background Preview" 
                className="max-h-40 rounded-lg object-cover border border-[var(--color-border)]"
              />
            </div>
          )}
        </div>

        {/* Dynamic Button Settings */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Button Text</label>
          <input value={form.signature_btn_text} onChange={set('signature_btn_text')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Button Link</label>
          <input value={form.signature_btn_link} onChange={set('signature_btn_link')} />
        </div>

        {/* Overlay Opacity Slider */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5 flex justify-between">
            <span>Overlay Opacity (Darkness)</span>
            <span className="font-mono text-xs">{Math.round((parseFloat(form.signature_overlay_opacity) || 0.5) * 100)}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={form.signature_overlay_opacity || "0.5"} 
            onChange={(e) => setForm({ ...form, signature_overlay_opacity: e.target.value })} 
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand-lilac)]"
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Increase the opacity if the white text is hard to read on top of your background image.
          </p>
        </div>
      </div>
    ),
    journey: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4, 5].map(num => (
          <div key={num} className="md:col-span-2 border-b border-[var(--color-border)] pb-4 last:border-b-0">
            <label className="block text-sm font-medium mb-1.5">Journey Image {num}</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setForm({ ...form, [`social_img_${num}`]: e.target.files[0] });
                }
              }} 
              className="file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[var(--color-brand-lilac)] file:text-white"
            />
            {form[`social_img_${num}`] && typeof form[`social_img_${num}`] === 'string' && (
              <div className="mt-3">
                <img 
                  src={`${STORAGE_URL}${form[`social_img_${num}`]}`} 
                  alt={`Journey Image ${num}`} 
                  className="max-h-24 rounded-lg object-cover border border-[var(--color-border)]"
                />
              </div>
            )}
            {form[`social_img_${num}`] && typeof form[`social_img_${num}`] !== 'string' && (
              <div className="mt-3">
                <img 
                  src={URL.createObjectURL(form[`social_img_${num}`])} 
                  alt={`New Journey Image ${num} Preview`} 
                  className="max-h-24 rounded-lg object-cover border border-[var(--color-border)]"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    ),
    pages: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Gallery Heading</label><input value={form.gallery_heading} onChange={set('gallery_heading')} /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">FAQ Heading</label><input value={form.faq_heading} onChange={set('faq_heading')} /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Events Heading / Title / Description</label></div>
        <div><input value={form.events_heading} onChange={set('events_heading')} placeholder="Heading" /></div>
        <div><input value={form.events_title} onChange={set('events_title')} placeholder="Title" /></div>
        <div className="md:col-span-2"><textarea rows="2" value={form.events_description} onChange={set('events_description')} placeholder="Description" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Tea Section Heading / Description</label></div>
        <div><input value={form.tea_heading} onChange={set('tea_heading')} placeholder="Heading" /></div>
        <div className="md:col-span-2"><textarea rows="2" value={form.tea_description} onChange={set('tea_description')} placeholder="Description" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-1.5">Membership Heading / Title</label></div>
        <div><input value={form.membership_heading} onChange={set('membership_heading')} placeholder="Heading" /></div>
        <div><input value={form.membership_title} onChange={set('membership_title')} placeholder="Title" /></div>
        <div className="md:col-span-2 border-t border-[var(--color-border)] pt-4 mt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.pay_after_attend_enabled === '1'} onChange={e => setForm({ ...form, pay_after_attend_enabled: e.target.checked ? '1' : '0' })} className="w-5 h-5 rounded" />
            <span className="text-sm font-medium">Enable "Pay After Attending" option on booking form</span>
          </label>
        </div>
      </div>
    ),
  }

  return (
    <div className="animate-fadeIn max-w-3xl">
      <PageHeader title="Content Management" description="Edit all frontend content from one place" />
      {saved && <div className="mb-6 rounded-lg px-4 py-3 text-sm bg-green-50 text-green-700 border border-green-100">Settings saved successfully.</div>}
      {error && <div className="mb-6 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-100">{error}</div>}
      <div className="card p-6 sm:p-8">
        <div className="flex gap-1 mb-6 flex-wrap border-b border-[var(--color-border)] pb-3">
          {tabs.map(t => (
            <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[var(--color-brand-lilac)] text-white' : 'hover:bg-[var(--color-bg-alt)]'}`}>{t.label}</button>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          {tabContent[activeTab]}
          <div className="flex gap-3 pt-6 mt-4 border-t border-[var(--color-border)]">
            <button type="submit" className="btn-primary">Save All Settings</button>
          </div>
        </form>
      </div>
    </div>
  )
}
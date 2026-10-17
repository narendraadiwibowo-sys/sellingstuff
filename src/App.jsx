import { useState, useEffect } from 'react'
import {
  STORE_NAME,
  WA_NUMBER,
  MAPS_URL,
  SHOP_PHOTOS,
  VESPAS,
  TESTIMONIALS,
  DEFAULT_DISCORD_WEBHOOK,
  waLink,
} from './data.js'

// Simple SVG Icons
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
)

const ShareIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.76-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// Automatic Image Carousel Component
function AutoImageSlider({ images, alt, interval = 3200, className = '' }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!images || images.length <= 1) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images, interval])

  return (
    <div className={`slider-container ${className}`}>
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt={`${alt} slide ${i + 1}`}
          className={`slider-img ${i === index ? 'active' : ''}`}
          loading="lazy"
        />
      ))}
      {images.length > 1 && (
        <div className="slider-dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setIndex(i)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Modal Component
function Modal({ onClose, title, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Modal">
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

// Header
function Header({ onNav }) {
  return (
    <header className="header">
      <div className="header-inner">
        <a href="#" className="brand">
          <span className="brand-badge">VESPA</span>
          <span className="brand-text">Maju Lancar Motor</span>
        </a>
        <nav className="nav-links">
          <a href="#koleksi">Koleksi Motor</a>
          <a href="#daftar-harga">Daftar Harga</a>
          <a href="#testimoni">Testimoni</a>
          <a href="#lokasi">Lokasi & Kontak</a>
        </nav>
        <a
          className="btn btn-wa-nav"
          href={waLink('Halo Maju Lancar Motor, saya ingin konsultasi unit Vespa.')}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon />
          <span>Chat Showroom</span>
        </a>
      </div>
    </header>
  )
}

// Hero Dashboard with Auto-Swiping Featured Showcase
function Hero({ onSelectVespa }) {
  const featuredVespas = VESPAS.slice(0, 5)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % featuredVespas.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [featuredVespas.length])

  const current = featuredVespas[slide]

  return (
    <section className="hero-section">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-pill">
            <span className="live-dot" /> Showroom Resmi Maju Lancar Motor
          </div>
          <h1>
            Koleksi Vespa <span>Modern & Klasik</span> Terpercaya
          </h1>
          <p>
            Pilihan terlengkap mulai dari seri langka <strong>PTS & VBB</strong> sampai
            matic premium <strong>Sprint, Primavera & GTS</strong>. Unit bergaransi,
            surat akur dan teruji kelayakan jalan.
          </p>
          <div className="hero-buttons">
            <a className="btn btn-primary" href="#koleksi">
              Jelajahi Katalog Motor
            </a>
            <a className="btn btn-secondary" href="#daftar-harga">
              Cek Tabel Harga
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <strong>100%</strong>
              <span>Surat Terjamin Lengkap</span>
            </div>
            <div className="stat-sep" />
            <div>
              <strong>12+</strong>
              <span>Ready Stock & Koleksi</span>
            </div>
            <div className="stat-sep" />
            <div>
              <strong>Se-Indonesia</strong>
              <span>Pengiriman Towing Aman</span>
            </div>
          </div>
        </div>

        {/* Dashboard Auto Swipe Card */}
        <div className="hero-showcase">
          <div className="showcase-card">
            <div className="showcase-badge-top">
              <span className="badge-featured">⭐ Highlight Unit</span>
              <span className="badge-count">
                {slide + 1} / {featuredVespas.length}
              </span>
            </div>

            <div className="showcase-media">
              <img src={current.images[0]} alt={current.name} />
              {current.isSold && <span className="sold-ribbon">TERJUAL (SOLD)</span>}
            </div>

            <div className="showcase-meta">
              <div className="showcase-info">
                <h3>{current.name}</h3>
                <span className="showcase-price">{current.priceLabel}</span>
              </div>
              <div className="showcase-specs">
                <span>Tahun {current.year}</span>
                <span>•</span>
                <span>{current.cc} cc</span>
                <span>•</span>
                <span>{current.category === 'modern' ? 'Matic' : 'Manual 2T'}</span>
              </div>
              <div className="showcase-actions">
                <button
                  className="btn btn-detail-action"
                  onClick={() => onSelectVespa(current)}
                >
                  Detail & Spesifikasi Lengkap
                </button>
              </div>
            </div>

            <div className="showcase-dots">
              {featuredVespas.map((v, i) => (
                <button
                  key={v.id}
                  className={`showcase-dot ${i === slide ? 'active' : ''}`}
                  onClick={() => setSlide(i)}
                  aria-label={`Slide ${v.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Catalog with Filtering & Auto-Swiping Cards
function Catalog({ onSelectVespa, onOpenOrder, onShare }) {
  const [category, setCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = VESPAS.filter((v) => {
    // category
    if (category !== 'all' && v.category !== category) return false
    // price range
    if (priceRange === 'under-30' && v.price >= 30000000) return false
    if (priceRange === '30-60' && (v.price < 30000000 || v.price > 60000000)) return false
    if (priceRange === 'above-60' && v.price <= 60000000) return false
    // search
    if (search.trim()) {
      const q = search.toLowerCase()
      return v.name.toLowerCase().includes(q) || v.year.toString().includes(q)
    }
    return true
  })

  return (
    <section id="koleksi" className="section-container">
      <div className="section-header">
        <div>
          <span className="sub-title">KATALOG READY & HISTORI</span>
          <h2>Koleksi Vespa Pilihan</h2>
          <p>Setiap foto berpindah otomatis menampilkan sudut unit. Klik untuk cek spesifikasi.</p>
        </div>

        {/* Search */}
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Cari model atau tahun (cth: Sprint, 1974)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Selectors */}
      <div className="filter-bar">
        <div className="category-tabs">
          <button
            className={`tab-btn ${category === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
          >
            Semua ({VESPAS.length})
          </button>
          <button
            className={`tab-btn ${category === 'klasik' ? 'active' : ''}`}
            onClick={() => setCategory('klasik')}
          >
            Vespa Klasik (2 Tak)
          </button>
          <button
            className={`tab-btn ${category === 'modern' ? 'active' : ''}`}
            onClick={() => setCategory('modern')}
          >
            Vespa Modern (Matic)
          </button>
        </div>

        <div className="price-filter">
          <label htmlFor="price-select">Rentang Harga:</label>
          <select
            id="price-select"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="all">Semua Harga</option>
            <option value="under-30">Di bawah Rp 30 Juta</option>
            <option value="30-60">Rp 30 Juta - Rp 60 Juta</option>
            <option value="above-60">Di atas Rp 60 Juta</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>Tidak ada unit yang sesuai dengan filter atau kata kunci Anda.</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setCategory('all')
              setPriceRange('all')
              setSearch('')
            }}
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="vespa-grid">
          {filtered.map((v) => {
            const waMsg = `Halo Maju Lancar Motor, saya tertarik dengan ${v.name} (${v.priceLabel}) yang ada di website. Boleh minta info detailnya?`

            return (
              <div key={v.id} className={`vespa-card ${v.isSold ? 'card-sold' : ''}`}>
                {/* Image Slider auto swiping every 3.2s */}
                <div className="card-media" onClick={() => onSelectVespa(v)}>
                  <AutoImageSlider
                    images={v.images}
                    alt={v.name}
                    interval={3500 + (v.id % 4) * 400}
                  />

                  <div className="badge-container">
                    <span className={`cat-badge ${v.category}`}>
                      {v.category === 'modern' ? 'Matic' : 'Klasik'}
                    </span>
                    {v.isSold ? (
                      <span className="status-badge sold">TERJUAL</span>
                    ) : (
                      <span className="status-badge ready">READY UNIT</span>
                    )}
                  </div>
                </div>

                <div className="card-content">
                  <div className="card-title-row">
                    <h3 onClick={() => onSelectVespa(v)}>{v.name}</h3>
                    <button
                      className="btn-share-icon"
                      title="Share link motor ini"
                      onClick={() => onShare(v)}
                    >
                      <ShareIcon />
                    </button>
                  </div>

                  {/* Clean text Price directly under image & title */}
                  <div className="card-price-tag">
                    <span className="price-num">{v.priceLabel}</span>
                    <span className="price-year">Tahun {v.year}</span>
                  </div>

                  {/* Spec Quick Look */}
                  <div className="quick-specs">
                    <div>
                      <span className="q-label">Surat:</span>
                      <span className="q-val">{v.surat.split('(')[0]}</span>
                    </div>
                    <div>
                      <span className="q-label">Odo:</span>
                      <span className="q-val">{v.odometer}</span>
                    </div>
                  </div>

                  {/* Smart WhatsApp Button & Order Action */}
                  <div className="card-actions">
                    <a
                      className="btn btn-wa-smart"
                      href={waLink(waMsg)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <WhatsAppIcon />
                      <span>{v.isSold ? 'Tanya Unit Serupa' : 'Tanya via WA'}</span>
                    </a>

                    <button
                      className="btn btn-order-direct"
                      onClick={() => onOpenOrder(v)}
                    >
                      Pesan / Pre-Order
                    </button>

                    <button
                      className="btn btn-text-info"
                      onClick={() => onSelectVespa(v)}
                    >
                      Detail Info &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

// HTML Price Table (Replacing screenshot capture.png)
function PriceTableSection({ onSelectVespa, onOpenOrder }) {
  return (
    <section id="daftar-harga" className="section-container bg-surface">
      <div className="section-header">
        <div>
          <span className="sub-title">PANDUAN & ESTIMASI BIAYA</span>
          <h2>Daftar Harga & Ketersediaan Unit</h2>
          <p>
            Estimasi harga resmi untuk unit Vespa klasik maupun modern di showroom Maju Lancar Motor.
            Kondisi surat, mesin, dan kelengkapan unit dapat dinegosiasikan langsung dengan tim kami.
          </p>
        </div>
        <a
          className="btn btn-wa-nav"
          href={waLink('Halo Maju Lancar Motor, mau tanya ketersediaan stok harga terbaru.')}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon />
          <span>Tanya Nego Harga</span>
        </a>
      </div>

      <div className="table-responsive">
        <table className="price-table">
          <thead>
            <tr>
              <th>Model Kendaraan</th>
              <th>Kategori</th>
              <th>Kapasitas</th>
              <th>Estimasi Harga</th>
              <th>Status Stok</th>
              <th>Aksi Cepat</th>
            </tr>
          </thead>
          <tbody>
            {VESPAS.map((v) => (
              <tr key={v.id} className={v.isSold ? 'row-sold' : ''}>
                <td className="cell-name">
                  <strong>{v.name}</strong>
                  <span className="cell-sub">Tahun {v.year}</span>
                </td>
                <td>
                  <span className={`cat-pill ${v.category}`}>
                    {v.category === 'modern' ? 'Modern / Matic' : 'Klasik / 2T'}
                  </span>
                </td>
                <td>{v.cc} cc</td>
                <td className="cell-price">{v.priceLabel}</td>
                <td>
                  {v.isSold ? (
                    <span className="badge-table sold">Terjual</span>
                  ) : (
                    <span className="badge-table ready">Tersedia</span>
                  )}
                </td>
                <td className="cell-action">
                  <button
                    className="btn-table-action"
                    onClick={() => onSelectVespa(v)}
                  >
                    Detail
                  </button>
                  <button
                    className="btn-table-order"
                    onClick={() => onOpenOrder(v)}
                  >
                    Pesan / Pre-Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-note">
        <p>
          * Harga dapat disesuaikan dengan orisinalitas part, kelengkapan surat pajak, dan
          kondisi mesin. Hubungi tim showroom kami untuk inspeksi langsung.
        </p>
      </div>
    </section>
  )
}

// Testimonials & Proof of Trust
function TestimonialsSection() {
  return (
    <section id="testimoni" className="section-container">
      <div className="section-header text-center">
        <span className="sub-title">KEPERCAYAAN PELANGGAN</span>
        <h2>Serah Terima & Testimoni Pembeli</h2>
        <p>Bukti kepuasan pecinta Vespa yang sudah mempercayakan unitnya di Maju Lancar Motor.</p>
      </div>

      <div className="testimonial-grid">
        {TESTIMONIALS.map((t) => (
          <div key={t.id} className="testi-card">
            <div className="testi-stars">{'★'.repeat(t.rating)}</div>
            <p className="testi-quote">"{t.quote}"</p>
            <div className="testi-author">
              <img src={t.avatar} alt={t.name} />
              <div>
                <strong>{t.name}</strong>
                <span>{t.city} • <span className="text-teal">{t.unit}</span></span>
              </div>
            </div>
            <span className="testi-date">{t.date}</span>
          </div>
        ))}
      </div>

      {/* Sold Out Banner */}
      <div className="sold-proof-banner">
        <div className="sold-banner-content">
          <h3>Unit Langka Cepat Terjual!</h3>
          <p>
            Vespa kolektor seperti <strong>Douglas 1951</strong> dan <strong>Primavera i-get</strong> telah laku
            terkirim ke pemilik barunya. Jangan sampai keduluan saat ada unit favorit masuk.
          </p>
        </div>
        <a
          className="btn btn-primary"
          href={waLink('Halo Maju Lancar Motor, tolong kabari saya jika ada stok Vespa baru masuk.')}
          target="_blank"
          rel="noreferrer"
        >
          Masuk Daftar Tunggu Stok Baru
        </a>
      </div>
    </section>
  )
}

// Location & Workshop
function LocationSection() {
  return (
    <section id="lokasi" className="section-container bg-surface">
      <div className="section-header">
        <div>
          <span className="sub-title">SHOWROOM & WORKSHOP</span>
          <h2>Lokasi Toko & Kontak Langsung</h2>
          <p>Silakan mampir untuk melihat unit, mendengarkan suara mesin, atau sekadar ngopi dan berdiskusi seputar Vespa.</p>
        </div>
      </div>

      <div className="location-grid">
        <div className="shop-gallery">
          {SHOP_PHOTOS.map((src, i) => (
            <div key={src} className="shop-img-box">
              <img src={src} alt={`Dokumentasi Toko Maju Lancar Motor ${i + 1}`} loading="lazy" />
              <span className="photo-caption">Workshop Maju Lancar Motor</span>
            </div>
          ))}
        </div>

        <div className="location-card">
          <h3>Maju Lancar Motor</h3>
          <p className="loc-address">
            Pusat Penjualan & Restorasi Vespa Klasik dan Modern bergaransi dengan teknisi berpengalaman.
          </p>

          <ul className="loc-features">
            <li>
              <CheckIcon /> Melayani cek fisik unit & test ride di lokasi
            </li>
            <li>
              <CheckIcon /> Pengiriman aman seluruh Indonesia (Stroring & Towing)
            </li>
            <li>
              <CheckIcon /> Bantuan balik nama & perpanjangan pajak BPKB/STNK
            </li>
          </ul>

          <div className="loc-buttons">
            <a
              className="btn btn-primary"
              href={waLink('Halo Maju Lancar Motor, saya berencana datang ke toko untuk lihat unit.')}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon /> Janjian Kunjungan
            </a>
            <a
              className="btn btn-secondary"
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Buka di Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// In-Website Purchase / Booking Form Modal with QRIS Demo
function OrderModal({ vespa, onClose }) {
  const [step, setStep] = useState('form') // 'form' | 'payment' | 'success'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    paymentType: 'qris', // 'qris' | 'transfer'
    note: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) {
      alert('Mohon isi nama dan nomor telepon/WhatsApp Anda.')
      return
    }
    setStep('payment')
  }

  const [discordStatus, setDiscordStatus] = useState('')

  const sendDiscordNotification = async (inv) => {
    // Webhook URL can be set in src/data.js (DEFAULT_DISCORD_WEBHOOK) or localStorage
    const webhookUrl =
      localStorage.getItem('vespa_discord_webhook') || DEFAULT_DISCORD_WEBHOOK || ''
    if (!webhookUrl) return

    setDiscordStatus('Mengirim notifikasi ke Discord...')
    try {
      const payload = {
        username: 'Maju Lancar Motor Bot',
        avatar_url: 'https://sellingstuff69.wordpress.com/wp-content/uploads/2025/04/cropped-chatgpt-image-8-apr-2025-19.35.21-1.png?w=200',
        embeds: [
          {
            title: `🛵 Pesanan Baru: ${vespa.name}`,
            description: `Ada pelanggan yang melakukan booking tanda jadi unit melalui website.`,
            color: 0x0e5a5f, // Teal branding
            fields: [
              { name: 'No. Invoice', value: inv, inline: true },
              { name: 'Model Vespa', value: `${vespa.name} (${vespa.priceLabel})`, inline: true },
              { name: 'Kategori', value: vespa.category === 'modern' ? 'Matic / Modern' : 'Klasik (2-Tak)', inline: true },
              { name: 'Nama Pembeli', value: formData.name, inline: true },
              { name: 'No. WhatsApp', value: `[${formData.phone}](https://wa.me/${formData.phone.replace(/^0/, '62')})`, inline: true },
              { name: 'Kota / Alamat', value: `${formData.city} - ${formData.address || 'Alamat menyusul'}`, inline: false },
              { name: 'Metode Pembayaran', value: formData.paymentType === 'qris' ? 'QRIS (Demo)' : 'BCA Virtual Account (Demo)', inline: true },
              { name: 'Nominal Booking', value: 'Rp 2.500.000 (Tanda Jadi)', inline: true },
            ],
            footer: { text: 'Maju Lancar Motor Web Notification • ' + new Date().toLocaleString('id-ID') },
          },
        ],
      }

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setDiscordStatus('✓ Notifikasi berhasil terkirim ke channel Discord Showroom!')
      } else {
        setDiscordStatus('⚠️ Webhook Discord merespon dengan status error.')
      }
    } catch (err) {
      console.error('Discord webhook error:', err)
      setDiscordStatus('⚠️ Gagal terhubung ke Discord webhook.')
    }
  }

  const handleFinishPayment = () => {
    sendDiscordNotification(invoiceNo)
    setStep('success')
  }

  const invoiceNo = `MLM-${vespa.id}${Date.now().toString().slice(-4)}`

  return (
    <Modal title={`Pemesanan ${vespa.name}`} onClose={onClose}>
      <div className="order-modal-container">
        {step === 'form' && (
          <div>
            <div className="order-header">
              <h3>Form Pemesanan / Booking Unit</h3>
              <p>Isi formulir di bawah ini untuk mengunci booking unit <strong>{vespa.name}</strong>.</p>
            </div>

            <div className="order-summary-box">
              <img src={vespa.images[0]} alt={vespa.name} />
              <div>
                <h4>{vespa.name}</h4>
                <div className="price-tag">{vespa.priceLabel}</div>
                <small>Booking Fee Tanda Jadi: <strong>Rp 2.500.000</strong> (Pelunasan saat serah terima)</small>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="order-form">
              <div className="form-group">
                <label>Nama Lengkap Pembeli *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 08123456789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Kota / Kabupaten Pengiriman *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bandung"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Alamat Lengkap</label>
                <textarea
                  rows="2"
                  placeholder="Alamat pengantaran unit..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Metode Pembayaran Demo</label>
                <div className="payment-options">
                  <label className={`pay-choice ${formData.paymentType === 'qris' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="qris"
                      checked={formData.paymentType === 'qris'}
                      onChange={() => setFormData({ ...formData, paymentType: 'qris' })}
                    />
                    <span>QRIS (BCA, Mandiri, GoPay, OVO, Dana)</span>
                  </label>
                  <label className={`pay-choice ${formData.paymentType === 'transfer' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="transfer"
                      checked={formData.paymentType === 'transfer'}
                      onChange={() => setFormData({ ...formData, paymentType: 'transfer' })}
                    />
                    <span>Transfer Virtual Account / Bank</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Lanjut ke Pembayaran Booking &rarr;
              </button>
            </form>
          </div>
        )}

        {step === 'payment' && (
          <div className="payment-step">
            <div className="payment-header">
              <span className="demo-badge">SIMULASI PEMBAYARAN RESMI</span>
              <h3>Selesaikan Pembayaran Booking</h3>
              <p>Invoice ID: <strong>{invoiceNo}</strong></p>
            </div>

            <div className="qr-container">
              {formData.paymentType === 'qris' ? (
                <>
                  <div className="qris-card">
                    <div className="qris-top">
                      <strong>QRIS PEMBAYARAN RESMI</strong>
                      <small>NMID: ID102030405060</small>
                    </div>
                    {/* SVG Demo QR Code */}
                    <svg className="demo-qrcode" viewBox="0 0 100 100">
                      <rect width="100" height="100" fill="#ffffff" />
                      {/* Outer positioning squares */}
                      <rect x="10" y="10" width="24" height="24" fill="#000" />
                      <rect x="14" y="14" width="16" height="16" fill="#fff" />
                      <rect x="18" y="18" width="8" height="8" fill="#000" />

                      <rect x="66" y="10" width="24" height="24" fill="#000" />
                      <rect x="70" y="14" width="16" height="16" fill="#fff" />
                      <rect x="74" y="18" width="8" height="8" fill="#000" />

                      <rect x="10" y="66" width="24" height="24" fill="#000" />
                      <rect x="14" y="70" width="16" height="16" fill="#fff" />
                      <rect x="18" y="74" width="8" height="8" fill="#000" />

                      {/* Random aesthetic barcode dots */}
                      <rect x="40" y="15" width="6" height="6" fill="#000" />
                      <rect x="52" y="15" width="6" height="6" fill="#000" />
                      <rect x="46" y="25" width="6" height="6" fill="#000" />
                      <rect x="40" y="35" width="18" height="6" fill="#000" />

                      <rect x="15" y="44" width="8" height="6" fill="#000" />
                      <rect x="28" y="44" width="6" height="12" fill="#000" />
                      <rect x="40" y="48" width="8" height="8" fill="#0e5a5f" />
                      <rect x="52" y="48" width="6" height="6" fill="#000" />
                      <rect x="65" y="40" width="12" height="6" fill="#000" />
                      <rect x="80" y="44" width="6" height="10" fill="#000" />

                      <rect x="40" y="66" width="8" height="8" fill="#000" />
                      <rect x="54" y="68" width="14" height="6" fill="#000" />
                      <rect x="72" y="66" width="8" height="18" fill="#000" />
                      <rect x="44" y="80" width="16" height="6" fill="#000" />
                      <rect x="64" y="80" width="6" height="8" fill="#000" />
                    </svg>

                    <div className="qris-info">
                      <p>Scan menggunakan <strong>BCA, BRI, Mandiri, GoPay, OVO, ShopeePay</strong></p>
                      <div className="booking-amount">
                        <span>Total Nominal Booking:</span>
                        <strong>Rp 2.500.000</strong>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="va-card">
                  <h4>Virtual Account Bank BCA</h4>
                  <div className="va-number">8801 2815 4882 5777</div>
                  <p>Atas Nama: <strong>Maju Lancar Motor (Showroom)</strong></p>
                  <div className="booking-amount">
                    <span>Total Nominal Booking:</span>
                    <strong>Rp 2.500.000</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="payment-alert">
              ℹ️ Ini adalah demo interaktif pemesanan website. Klik tombol konfirmasi di bawah untuk mensimulasikan pembayaran berhasil.
            </div>

            <div className="payment-actions">
              <button className="btn btn-secondary" onClick={() => setStep('form')}>
                &larr; Ubah Data
              </button>
              <button className="btn btn-primary" onClick={handleFinishPayment}>
                Saya Sudah Bayar (Konfirmasi)
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="success-step">
            <div className="success-icon">✓</div>
            <h3>Pemesanan Berhasil Dicatat!</h3>
            <p>
              Terima kasih <strong>{formData.name}</strong>! Tanda jadi booking untuk unit{' '}
              <strong>{vespa.name}</strong> telah masuk ke sistem showroom kami.
            </p>

            <div className="receipt-box">
              <div className="receipt-header">
                <strong>RINCIAN PEMBAYARAN (DEMO)</strong>
                <span className="receipt-badge">LUNAS BOOKING</span>
              </div>
              <div className="receipt-row">
                <span>No. Invoice:</span>
                <strong>{invoiceNo}</strong>
              </div>
              <div className="receipt-row">
                <span>Unit Motor:</span>
                <span>{vespa.name}</span>
              </div>
              <div className="receipt-row">
                <span>Harga Unit:</span>
                <span>{vespa.priceLabel}</span>
              </div>
              <div className="receipt-row">
                <span>Nama Pemesan:</span>
                <span>{formData.name}</span>
              </div>
              <div className="receipt-row">
                <span>WhatsApp:</span>
                <span>{formData.phone}</span>
              </div>
              <div className="receipt-row">
                <span>Kota Tujuan:</span>
                <span>{formData.city}</span>
              </div>
              <div className="receipt-row">
                <span>Metode Pembayaran:</span>
                <span>{formData.paymentType === 'qris' ? 'QRIS Pembayaran Resmi' : 'BCA Virtual Account'}</span>
              </div>
              <div className="receipt-divider" />
              <div className="receipt-row total">
                <span>Nominal Booking:</span>
                <strong className="text-teal">Rp 2.500.000</strong>
              </div>
              <div className="receipt-note">
                Sisa pelunasan dilakukan saat serah terima unit di showroom atau via towing.
              </div>
            </div>

            <div className="success-box">
              <p>Kirimkan bukti booking ini ke tim WhatsApp kami agar unit langsung dikunci untuk Anda.</p>
              <a
                className="btn btn-wa-smart btn-block"
                href={waLink(
                  `Halo Maju Lancar Motor, saya sudah booking unit ${vespa.name} di website dengan nomor invoice ${invoiceNo} atas nama ${formData.name} (${formData.phone}). Mohon konfirmasinya ya!`
                )}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon />
                <span>Kirim Bukti Booking ke WhatsApp Showroom</span>
              </a>
            </div>

            <button className="btn btn-secondary mt-12" onClick={onClose}>
              Selesai & Tutup
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

// In-Website Motor Specifications & More Info Modal (No WordPress redirect!)
function MotorDetailModal({ vespa, onClose, onOpenOrder, onShare }) {
  const waMsg = `Halo Maju Lancar Motor, saya tertarik dengan ${vespa.name} (${vespa.priceLabel}) tahun ${vespa.year}. Boleh minta info kelengkapan surat & kondisi terkininya?`

  return (
    <Modal title={vespa.name} onClose={onClose}>
      <div className="detail-modal-layout">
        {/* Left: Auto Sliding Gallery of this unit */}
        <div className="detail-gallery">
          <AutoImageSlider images={vespa.images} alt={vespa.name} interval={3000} />
          <div className="gallery-tip">Foto berpindah otomatis setiap 3 detik</div>
        </div>

        {/* Right: Full Specifications */}
        <div className="detail-info">
          <div className="detail-header-row">
            <div>
              <span className={`cat-pill ${vespa.category}`}>
                {vespa.category === 'modern' ? 'Vespa Matic Modern' : 'Vespa Klasik 2-Tak'}
              </span>
              <h2>{vespa.name}</h2>
            </div>
            {vespa.isSold && <span className="sold-tag">TERJUAL (SOLD)</span>}
          </div>

          <div className="detail-price-box">
            <span className="price-label">Harga Penawaran:</span>
            <span className="price-big">{vespa.priceLabel}</span>
          </div>

          <div className="spec-table-container">
            <h4>Spesifikasi & Kondisi Kendaraan:</h4>
            <table className="spec-table">
              <tbody>
                <tr>
                  <td>Tahun Perakitan</td>
                  <td><strong>{vespa.year}</strong></td>
                </tr>
                <tr>
                  <td>Kapasitas Mesin</td>
                  <td><strong>{vespa.cc} cc</strong></td>
                </tr>
                <tr>
                  <td>Kelengkapan Surat</td>
                  <td><strong>{vespa.surat}</strong></td>
                </tr>
                <tr>
                  <td>Odometer / Jarak Tempuh</td>
                  <td><strong>{vespa.odometer}</strong></td>
                </tr>
                <tr>
                  <td>Kondisi Bodi & Mesin</td>
                  <td>{vespa.kondisi}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="detail-modal-actions">
            <a
              className="btn btn-wa-smart"
              href={waLink(waMsg)}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon />
              <span>{vespa.isSold ? 'Tanya Kapan Restock' : 'Chat WhatsApp Showroom'}</span>
            </a>

            <button
              className="btn btn-primary"
              onClick={() => {
                onClose()
                onOpenOrder(vespa)
              }}
            >
              Pesan / Pre-Order
            </button>

            <button className="btn btn-secondary" onClick={() => onShare(vespa)}>
              <ShareIcon /> Bagikan
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// Toast Notification for Share action
function Toast({ message }) {
  if (!message) return null
  return <div className="toast-notification">{message}</div>
}

// Main App
export default function App() {
  const [selectedVespa, setSelectedVespa] = useState(null)
  const [orderVespa, setOrderVespa] = useState(null)
  const [toastMsg, setToastMsg] = useState('')

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  const handleShare = (v) => {
    const shareUrl = window.location.href.split('#')[0] + `#koleksi`
    const shareText = `Cek ${v.name} (${v.priceLabel}) di Showroom Maju Lancar Motor: ${shareUrl}`

    if (navigator.share) {
      navigator
        .share({
          title: `${v.name} - Maju Lancar Motor`,
          text: shareText,
          url: shareUrl,
        })
        .catch(() => {})
    } else {
      // Direct WA share link or clipboard
      const waShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
      window.open(waShare, '_blank')
      triggerToast('Link siap dibagikan via WhatsApp!')
    }
  }

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Hero onSelectVespa={setSelectedVespa} />
        <Catalog
          onSelectVespa={setSelectedVespa}
          onOpenOrder={setOrderVespa}
          onShare={handleShare}
        />
        <PriceTableSection
          onSelectVespa={setSelectedVespa}
          onOpenOrder={setOrderVespa}
        />
        <TestimonialsSection />
        <LocationSection />
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>{STORE_NAME}</h3>
            <p>Showroom & Spesialis Restorasi Vespa Klasik dan Modern bergaransi.</p>
          </div>
          <div className="footer-copy">
            <p>© {new Date().getFullYear()} Maju Lancar Motor. All Rights Reserved.</p>
            <small>Transisi Modern dari Platform WordPress Sellingstuff</small>
          </div>
        </div>
      </footer>

      {/* More Info / Specification Modal */}
      {selectedVespa && (
        <MotorDetailModal
          vespa={selectedVespa}
          onClose={() => setSelectedVespa(null)}
          onOpenOrder={setOrderVespa}
          onShare={handleShare}
        />
      )}

      {/* Online Order & QRIS Payment Demo Modal */}
      {orderVespa && (
        <OrderModal vespa={orderVespa} onClose={() => setOrderVespa(null)} />
      )}

      <Toast message={toastMsg} />
    </div>
  )
}

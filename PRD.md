# EcoTrace: Platform Digital Pelacak Jejak Karbon
## Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** Agustus 2026  
**Status:** Ready for Development  
**Author:** Barlian Athallah Dyu  
**Institusi:** IPB University - Pertamina Future Leaders Scholarship

---

## 1. Product Overview

### 1.1 Definisi Produk
EcoTrace adalah aplikasi web progresif (Progressive Web App/PWA) yang memfasilitasi pelacakan, visualisasi, dan pengurangan jejak karbon personal bagi komunitas mahasiswa kampus. Platform ini mengintegrasikan eco-feedback real-time, social norms, dan gamifikasi untuk mendorong perubahan perilaku terukur menuju gaya hidup rendah karbon.

### 1.2 Target User
- **Primary:** Mahasiswa aktif di kampus Indonesia (usia 18-24 tahun)
- **Secondary:** Dosen dan pegawai kampus yang tertarik dengan sustainability
- **Tertiary:** Administrator institusi untuk monitoring dampak kolektif

### 1.3 Problem Statement
Terdapat kesenjangan signifikan antara kesadaran lingkungan mahasiswa dan tindakan konkret (intention-action gap). Mahasiswa memiliki kepedulian terhadap iklim tetapi tidak memiliki mekanisme umpan balik yang konkret tentang dampak perilaku harian mereka. Platform digital dengan eco-feedback real-time dan social norms dapat menjembatani kesenjangan ini.

### 1.4 Solution Value Proposition
EcoTrace menyediakan:
- **Transparency:** Visualisasi konkret emisi karbon dari aktivitas sehari-hari
- **Actionability:** Challenge mingguan yang spesifik dan terukur
- **Community:** Umpan balik berbasis norma sosial untuk perubahan berkelanjutan
- **Accessibility:** PWA yang ringan, offline-capable, tanpa instalasi aplikasi
- **Scalability:** Model open-source untuk adopsi di kampus lain

---

## 2. Core Features

### 2.1 Carbon Logger (Pencatatan Emisi Harian)

#### Deskripsi
Modul input data yang memungkinkan pengguna mencatat aktivitas harian yang menghasilkan emisi karbon dengan antarmuka yang minimal dan cepat (target: < 2 menit/hari).

#### Aktivitas yang Dilacak
1. **Transportation (Transportasi)**
   - Jenis: Berjalan kaki, sepeda, motor, mobil pribadi, angkutan umum (bus, kereta, MRT)
   - Input: Mode transportasi, jarak perjalanan (km), frekuensi
   - Faktor emisi: Dari EPA & IPCC database

2. **Energy Usage (Penggunaan Energi)**
   - Kategori: Penggunaan listrik, AC, heating, water heating
   - Input: Durasi penggunaan (jam), tipe perangkat
   - Faktor emisi: Berdasarkan grid mix energi Indonesia

3. **Food Consumption (Konsumsi Makanan)**
   - Tipe: Nabati, daging merah, unggas, ikan, produk susu
   - Input: Kategori makanan, frekuensi (hari/minggu)
   - Faktor emisi: Lifecycle assessment data

4. **Waste Management (Pengelolaan Sampah)**
   - Kategori: Plastik sekali pakai, sampah organik, sampah kertas, daur ulang
   - Input: Estimasi volume/berat
   - Faktor emisi: Berdasarkan metode disposal

#### Mekanisme Input
- **Icon-based selection:** Pengguna memilih aktivitas melalui ikon intuitif
- **Quick entry:** Slider untuk jarak/durasi, dropdown untuk kategori
- **Preset values:** Opsi cepat untuk aktivitas rutin (e.g., "commute hari ini seperti kemarin")
- **History:** Saran otomatis berdasarkan pola historis

#### Technical Requirements
- Form state management dengan React Hook Form atau Zustand
- Client-side validation sebelum submission
- Offline support dengan localStorage sync
- Submission queue untuk mode offline

---

### 2.2 Community Dashboard (Papan Visualisasi Kolektif)

#### Deskripsi
Dashboard agregat yang menampilkan tren emisi kolektif seluruh pengguna dalam satu kampus. Dirancang berdasarkan evidence bahwa umpan balik berbasis norma sosial lebih efektif daripada informasi teknis semata.

#### Komponen Visual
1. **Emission Leaderboard**
   - Tiga kategori: Lowest Emitter (terendah), Most Improved, Most Engaged
   - Ranking per minggu/bulan/semester
   - Anonymous option untuk privasi pengguna
   - Top performer badge/recognition

2. **Community Progress Chart**
   - Line chart: Tren emisi rata-rata komunitas (minggu/bulan)
   - Benchmark: Target pengurangan 10% per semester
   - Milestone tracker: "Komunitas berhasil mengurangi 500 ton CO2e"

3. **Emission Breakdown (Pie/Bar Chart)**
   - Distribusi emisi per kategori (transport 45%, food 30%, energy 20%, waste 5%)
   - Comparison: Personal vs. community average
   - Drill-down: Detail per kategori dan per pengguna (opsi anonymous)

4. **Challenge Participation Widget**
   - Real-time counter peserta aktif minggu ini
   - Trending challenges
   - Success rate per challenge type

#### Data Privacy & Anonymity
- Default: Personal data anonymous di community view
- Opt-in: Pengguna dapat membuat profile publik
- No identifiable information tanpa explicit consent
- Aggregated data hanya untuk analytics

#### Technical Requirements
- Real-time updates dengan WebSocket atau polling
- Chart library: Recharts atau Chart.js
- Data aggregation di backend
- Caching strategy untuk performa

---

### 2.3 Eco-Challenge (Sistem Tantangan Berbasis Gamifikasi)

#### Deskripsi
Sistem tantangan mingguan yang mengajak pengguna mengambil aksi spesifik, terukur, dan achievable. Mekanisme gamifikasi terbukti meningkatkan keterlibatan di konteks sustainability di Asia Tenggara.

#### Challenge Types

**1. Reduction Challenge (Tantangan Pengurangan)**
- "No Motor Monday": Berjalan kaki, sepeda, atau angkutan umum setiap Senin selama 4 minggu
- "Meatless Tuesdays": Diet tanpa daging 2 hari/minggu selama sebulan
- "Plastic-Free Week": Menghindari sampah plastik sekali pakai
- Target: 5-10% pengurangan emisi per kategori

**2. Adoption Challenge (Tantangan Adopsi Perilaku)**
- "Green Commute Week": Tracking penggunaan transportasi ramah lingkungan
- "Energy Conscious": Monitor dan kurangi penggunaan listrik
- "Waste Audit": Dokumentasi waste reduction selama seminggu

**3. Community Challenge (Tantangan Kolektif)**
- "Campus Carbon Cup": Kompetisi antar angkatan/jurusan
- "Sustainability Sprint": Challenge sebulan dengan reward kolektif
- Tujuan: Membangun sense of shared responsibility

#### Mechanics
- **Weekly rotation:** Challenge baru setiap Minggu Senin
- **Signup & tracking:** Pengguna signup, sistem track progress otomatis
- **Verification:** Self-reported dengan option untuk peer verification
- **Rewards:** Point system, badges, leaderboard ranking
- **Redemption:** Points dapat ditukar dengan reward (e.g., discount di kantin sustainability, privilege parking)

#### Reward System
```
Success Categories:
- Starter: 10 points + badge
- Achiever: 25 points + special badge + feature di community board
- Champion: 50 points + physical reward (sustainability merchandise)
- Streak: 10 point bonus per minggu consecutive participation
```

#### Technical Requirements
- Challenge state machine: Not Started → Active → Completed → Verified
- Progress tracking dengan time-series data
- Notification system: Push/email reminders
- Social sharing: Built-in share to social media

---

## 3. User Stories & User Flows

### 3.1 Core User Stories

#### Story 1: First-Time User Onboarding
```
AS A mahasiswa baru di kampus
I WANT to understand my carbon footprint and join the community
SO THAT I can track and reduce my environmental impact

ACCEPTANCE CRITERIA:
- Guided tutorial dalam 3-5 menit
- Demo dengan data sample
- Option untuk immediate input atau skip
- Clear CTA untuk join challenge pertama
```

#### Story 2: Daily Carbon Logging
```
AS A pengguna reguler
I WANT to log my daily activities quickly and effortlessly
SO THAT I can maintain consistent tracking without friction

ACCEPTANCE CRITERIA:
- Input form dapat diselesaikan < 2 menit
- Preset values untuk aktivitas rutin
- Offline support dengan sync otomatis
- Visual confirmation setelah submission
```

#### Story 3: Viewing Personal Dashboard
```
AS A pengguna yang conscious
I WANT to see my personal carbon footprint trend dan progress
SO THAT I can understand impact perubahan perilaku saya

ACCEPTANCE CRITERIA:
- Dashboard menampilkan weekly/monthly/yearly trend
- Breakdown per kategori (transport, food, energy, waste)
- Comparison dengan community average
- Clear target setting feature
```

#### Story 4: Community Engagement via Leaderboard
```
AS A competitive mahasiswa
I WANT to see how my emission compares dengan teman-teman
SO THAT I am motivated to reduce lebih banyak

ACCEPTANCE CRITERIA:
- Anonymous leaderboard by default
- Multiple ranking categories (lowest, most improved, most engaged)
- Weekly & monthly leaderboard
- Social sharing option
```

#### Story 5: Challenge Participation
```
AS A motivated mahasiswa
I WANT to join weekly challenges dengan teman
SO THAT saya dapat take concrete action dan earn rewards

ACCEPTANCE CRITERIA:
- Browse available challenges dengan clear description
- Signup dalam 1 click
- Real-time progress tracking
- Notification untuk challenge milestone
```

#### Story 6: Admin Monitoring
```
AS A sustainability officer kampus
I WANT to see aggregated impact data dari seluruh komunitas
SO THAT saya dapat report ke rektorat dan inform policy

ACCEPTANCE CRITERIA:
- Aggregated emission dashboard
- Export reports (CSV, PDF)
- Insight generation (trends, comparisons)
- Policy recommendation engine
```

---

## 4. Functional Requirements

### 4.1 User Management
- [ ] Sign up dengan email/SSO kampus
- [ ] Email verification
- [ ] Profile creation (nama, angkatan, jurusan)
- [ ] Password reset & recovery
- [ ] Profile edit (data pribadi, privacy settings)
- [ ] Account deletion dengan data cleanup
- [ ] Session management & logout
- [ ] Two-factor authentication (optional)

### 4.2 Carbon Logging
- [ ] Multi-category activity input (transport, energy, food, waste)
- [ ] Unit conversion (km/mi, kWh/BTU, kg/lb)
- [ ] Calculation engine dengan faktor emisi real-time
- [ ] Emission factor database (editable by admin)
- [ ] Batch input (CSV upload untuk historical data)
- [ ] Activity history & audit trail
- [ ] Undo/edit submitted entries (within 24h window)
- [ ] Quick-entry templates untuk aktivitas rutin
- [ ] Offline mode dengan sync queue

### 4.3 Dashboard & Visualization
- [ ] Personal dashboard dengan metric cards (today, week, month, year)
- [ ] Emission trend chart (line/area chart, time-series)
- [ ] Category breakdown (pie/bar chart)
- [ ] Goal setting & progress tracker
- [ ] Personal leaderboard comparison (opt-in)
- [ ] Community dashboard dengan aggregated data
- [ ] Leaderboard ranking (multiple criteria)
- [ ] Filter & export data (CSV, PDF)
- [ ] Responsive design untuk mobile/tablet/desktop

### 4.4 Gamification & Challenges
- [ ] Challenge browsing & filtering
- [ ] Challenge signup & tracking
- [ ] Real-time progress indicator
- [ ] Notification system (weekly briefing, challenge reminder, milestone celebration)
- [ ] Reward system (point accumulation, badge assignment)
- [ ] Leaderboard per challenge
- [ ] Challenge completion verification
- [ ] Streak counter untuk consistent participation
- [ ] Social sharing (achievements, challenges)

### 4.5 Social & Community Features
- [ ] User profile dengan public/private settings
- [ ] Follow/friend system (optional)
- [ ] Comment & discussion pada community board
- [ ] Activity feed (personalized based on follows & groups)
- [ ] Group creation untuk communities (per angkatan, jurusan, interest)
- [ ] Invitation system untuk group join
- [ ] User ratings & testimonial

### 4.6 Admin & Analytics
- [ ] Admin dashboard
- [ ] Emission factor management
- [ ] Challenge management (create, edit, publish, archive)
- [ ] User management (view, suspend, delete)
- [ ] Report generation (aggregated emission, trends, demographics)
- [ ] Insight generation dengan NLP/analytics
- [ ] Data export (CSV, SQL dump)
- [ ] System health monitoring
- [ ] Audit log

---

## 5. Non-Functional Requirements

### 5.1 Performance
- [ ] First Contentful Paint: < 2s (mobile), < 1.5s (desktop)
- [ ] Largest Contentful Paint: < 3s
- [ ] Cumulative Layout Shift: < 0.1
- [ ] Dashboard load: < 1s dengan cached data
- [ ] Chart rendering: < 500ms
- [ ] Form submission: < 2s feedback
- [ ] API response time: < 200ms p95
- [ ] Database query: < 100ms p95
- [ ] Lighthouse score: > 85 (performance, accessibility, best practices)

### 5.2 Scalability
- [ ] Support 5,000+ concurrent users per kampus instance
- [ ] Support 1M+ daily activity logs
- [ ] Linear scaling dengan horizontal deployment
- [ ] Database indexing strategy untuk query optimization
- [ ] Caching layer (Redis) untuk frequently accessed data
- [ ] CDN untuk static assets
- [ ] Rate limiting untuk API endpoints

### 5.3 Reliability & Availability
- [ ] 99.5% uptime SLA
- [ ] Automated backup (daily, with 30-day retention)
- [ ] Disaster recovery plan
- [ ] Graceful degradation (core features available even if secondary services down)
- [ ] Error tracking & monitoring (Sentry atau similar)
- [ ] Alerting system untuk critical issues
- [ ] Zero-downtime deployment strategy

### 5.4 Security
- [ ] HTTPS/TLS encryption untuk semua traffic
- [ ] Input validation & sanitization
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (Content Security Policy)
- [ ] CSRF protection
- [ ] Rate limiting untuk brute-force prevention
- [ ] Password hashing (bcrypt dengan salt)
- [ ] JWT token dengan expiration
- [ ] GDPR compliance untuk data handling
- [ ] Regular security audit & penetration testing
- [ ] Secure credential management (environment variables, secrets manager)

### 5.5 Accessibility
- [ ] WCAG 2.1 Level AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast ratio 4.5:1 minimum
- [ ] Alt text untuk images
- [ ] Form labels & error messages yang clear
- [ ] Responsive design (mobile-first)
- [ ] Language support: Indonesian, English

### 5.6 Offline Capability (PWA)
- [ ] Service worker implementation
- [ ] Offline page rendering
- [ ] Sync queue untuk pending submissions
- [ ] Background sync API untuk offline actions
- [ ] Cacheable assets (JS, CSS, images)
- [ ] Size optimization untuk low-bandwidth scenario
- [ ] Data compression strategy

### 5.7 Maintainability
- [ ] Clear code structure & documentation
- [ ] Component-based architecture
- [ ] Consistent naming convention
- [ ] Automated testing (unit, integration, e2e)
- [ ] CI/CD pipeline
- [ ] Version control best practices
- [ ] API versioning strategy

---

## 6. Technology Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand atau React Context
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts atau Chart.js
- **UI Components:** Shadcn/ui atau Headless UI
- **Animations:** Framer Motion
- **HTTP Client:** TanStack Query (React Query)
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js atau Fastify
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Caching:** Redis
- **Authentication:** JWT, optional SSO integration
- **API Documentation:** OpenAPI/Swagger
- **Validation:** Zod atau Joi
- **Email:** Nodemailer atau SendGrid

### Infrastructure & DevOps
- **Hosting:** Vercel (frontend), Railway/Render/Supabase (backend)
- **Database Hosting:** Supabase atau managed PostgreSQL
- **CDN:** Vercel Edge Network atau Cloudflare
- **Environment Management:** dotenv, Vercel dashboard
- **Monitoring:** Vercel Analytics, Sentry
- **CI/CD:** GitHub Actions
- **Container:** Docker (optional, untuk self-hosted)

### Third-party Services
- **Email Delivery:** SendGrid atau Resend
- **Storage:** Vercel KV atau Redis Labs
- **Analytics:** Plausible atau Posthog
- **Error Tracking:** Sentry
- **Performance Monitoring:** Datadog atau New Relic (optional)

---

## 7. Data Model (High-Level)

### Core Entities
```
User
├── id (UUID)
├── email
├── name
├── cohort (angkatan)
├── department (jurusan)
├── avatar
├── privacy_settings
├── created_at
└── updated_at

Activity
├── id (UUID)
├── user_id (FK)
├── category (transport/energy/food/waste)
├── activity_type (e.g., "bus_commute", "meat_consumption")
├── value (numeric: km, hours, quantity)
├── unit (km, hour, kg)
├── co2_equivalent (calculated)
├── timestamp
└── metadata (optional JSON for extra data)

Challenge
├── id (UUID)
├── title
├── description
├── category
├── start_date
├── end_date
├── target_reduction (e.g., 10%)
├── reward_points
├── icon/image
└── difficulty_level

ChallengeParticipation
├── id (UUID)
├── user_id (FK)
├── challenge_id (FK)
├── progress (float: 0-1)
├── completed_at
├── reward_claimed
├── created_at

Leaderboard (Materialized View)
├── rank
├── user_id
├── total_co2 (week/month)
├── category (lowest/most_improved/most_engaged)
└── updated_at
```

---

## 8. Success Metrics & KPIs

### User Engagement Metrics
- [ ] **Daily Active Users (DAU):** Target 60% of registered users
- [ ] **Monthly Active Users (MAU):** Target 85%+
- [ ] **Activity Logging Frequency:** Average 5+ activities/user/week
- [ ] **Challenge Participation Rate:** 40%+ of users participate in weekly challenges
- [ ] **Session Duration:** Average 5-10 minutes/day
- [ ] **Feature Adoption Rate:** 
  - Carbon Logger: 90%+
  - Dashboard: 80%+
  - Challenges: 40%+

### Behavioral Change Metrics
- [ ] **Average Emission Reduction:** 4-7% quarter-on-quarter (per Nisa et al., 2022)
- [ ] **Sustained Behavior Change:** 60%+ users maintain reduced emission level for 3 months+
- [ ] **Challenge Completion Rate:** 70%+ of participants complete challenges
- [ ] **Repeat Participation:** 50%+ participate in 3+ challenges

### Community Metrics
- [ ] **Community Growth:** 100+ new users/month
- [ ] **Leaderboard Engagement:** 50%+ of users view community dashboard weekly
- [ ] **Social Sharing:** 20%+ of achievements shared on social media
- [ ] **Group Formation:** 5-10 active groups per 500 users

### Business/Sustainability Metrics
- [ ] **Total Emission Tracked:** 1,000+ ton CO2e per semester
- [ ] **Average Per-User Reduction:** 50+ kg CO2e/semester
- [ ] **Policy Impact:** 1-2 institutional policy changes informed by platform data
- [ ] **Adoption Across Campuses:** 5-10 kampus adopt EcoTrace within 18 months
- [ ] **Cost per Ton CO2 Reduced:** < $50 USD (including development, hosting, operational cost)

### Technical Metrics
- [ ] **System Uptime:** 99.5%+
- [ ] **Page Load Time:** Median 1.5s, p95 < 3s
- [ ] **API Response Time:** Median 100ms, p95 < 300ms
- [ ] **Error Rate:** < 0.1%
- [ ] **Mobile Performance Score:** Lighthouse > 80
- [ ] **Test Coverage:** Unit tests 70%+, integration tests 50%+

---

## 9. Implementation Timeline

### Phase 1: Research & Design (Bulan 1-3)
- **Week 1-2:** Literature review, competitor analysis
- **Week 2-3:** User interview (50 mahasiswa), stakeholder meetings
- **Week 3-4:** Wireframing, user flow design
- **Week 4-6:** Prototyping, design system documentation
- **Week 6-8:** Focus group discussion, validation
- **Week 8-12:** Final specification, technical architecture design

**Deliverables:**
- User research report
- Complete wireframes (mobile, tablet, desktop)
- Design system & component library
- Technical specification document
- Project roadmap & risk assessment

### Phase 2: MVP Development (Bulan 4-6)
- **Week 1:** Project setup, CI/CD pipeline, development environment
- **Week 2-4:** Backend core (User, Activity, authentication, API)
- **Week 4-6:** Frontend core (Auth UI, Carbon Logger, Dashboard basic)
- **Week 6-8:** Integration testing, basic challenge system
- **Week 8-12:** Performance optimization, security hardening, documentation

**Deliverables:**
- Functional MVP with 3 core features
- API documentation (Swagger)
- Deployment pipeline
- Basic test suite (50% coverage)

### Phase 3: Community Pilot (Bulan 7-9)
- **Week 1-2:** Beta user recruitment (100-200 early adopters)
- **Week 2-8:** Closed beta testing, user feedback collection
- **Week 8-10:** Bug fixes, performance tuning, feature refinement
- **Week 10-12:** Onboarding optimization, launch preparation

**Deliverables:**
- Beta test report
- User feedback summary & incorporated improvements
- Onboarding flow optimization
- Production deployment

### Phase 4: Evaluation & Scaling (Bulan 10-12)
- **Week 1-4:** Impact measurement, data analysis
- **Week 4-8:** Open campus launch, community management
- **Week 8-10:** Documentation for replication (open-source repo)
- **Week 10-12:** Presentation & dissemination to rektorat

**Deliverables:**
- Impact report (emission reduction, engagement metrics)
- Open-source repository dengan setup guide
- Replication documentation untuk kampus lain
- Final presentation & policy recommendations

---

## 10. Design Principles

1. **Human-Centered Design:** Semua keputusan desain didasarkan pada research pengguna
2. **Simplicity First:** Interface sesederhana mungkin, kompleksitas di backend
3. **Eco-Feedback:** Real-time, konkret, personal, normative
4. **Behavioral Nudge:** Design pilihan yang mendorong action tanpa paksaan
5. **Digital Equity:** Accessible untuk koneksi internet terbatas, screen reader, keyboard
6. **Privacy by Default:** Data user privacy first, aggregation explicit
7. **Transparency:** Clear tentang emission calculation methodology
8. **Mobile First:** Optimal experience di mobile, progressive enhancement ke desktop
9. **Community-Centric:** Social norms & collective action sebagai core mechanism
10. **Sustainable Technology:** Efficient code, minimal data transfer, green hosting

---

## 11. Assumptions & Constraints

### Assumptions
1. Kampus target memiliki minimal 80% mahasiswa dengan smartphone & internet access
2. Emission factor database tersedia public (EPA, IPCC)
3. SSO integration dengan kampus available (atau email signup fallback)
4. Adanya stakeholder support dari sustainability office & rektorat
5. Tim development: 3-5 mahasiswa ilmu komputer
6. Budget untuk hosting: < $500/tahun per kampus instance

### Constraints
1. **Technical:** Tanpa backend API kompleks, MVP fokus pada core features
2. **Data:** Self-reported activities, tidak ada IoT integration di MVP
3. **Time:** Development cycle 9 bulan dari start sampai public launch
4. **Resource:** Limited team size, prioritas pada MVP features
5. **Scope:** Fokus pada individual carbon tracking, bukan supply chain atau organizational level
6. **Geographic:** Initial launch di satu kampus, baru expand ke kampus lain di fase 2

---

## 12. Appendix: Emission Factors Reference

### Transportation (kg CO2e per km)
- **Berjalan kaki:** 0
- **Sepeda:** 0
- **Motor (125cc):** 0.195 kg CO2e/km
- **Mobil pribadi (1.5L):** 0.192 kg CO2e/km
- **Bus (penuh 40 orang):** 0.086 kg CO2e/km per penumpang
- **Kereta/MRT (rata-rata):** 0.041 kg CO2e/km per penumpang
- **Pesawat (domestic):** 0.255 kg CO2e/km per penumpang

### Food (kg CO2e per serving/portion)
- **Beef (200g):** 4.2 kg CO2e
- **Chicken (200g):** 0.66 kg CO2e
- **Vegetarian meal (400g):** 0.25 kg CO2e
- **Dairy products (1 cup milk):** 0.28 kg CO2e
- **Rice (1 cup cooked):** 0.20 kg CO2e

### Energy (kg CO2e per kWh)
- **Indonesia average grid:** 0.835 kg CO2e/kWh (2023)
- **AC (1 jam):** 0.67-1.67 kg CO2e (tergantung watt)
- **Fan (1 jam):** 0.084 kg CO2e
- **LED bulb (8 jam):** 0.013 kg CO2e
- **Laptop charging:** 0.05 kg CO2e/charge

### Waste (kg CO2e per kg waste)
- **Plastic (landfill):** 0.5 kg CO2e/kg (due to decomposition & production)
- **Food waste (landfill):** 1.9 kg CO2e/kg (methane from decomposition)
- **Recycled plastic:** 0.2 kg CO2e/kg
- **Composted food waste:** 0 kg CO2e/kg

**Source:** IPCC AR6, EPA Emission Factors 2023, World Resources Institute Climate Watch

---

**Document End**

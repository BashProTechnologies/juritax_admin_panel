import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("juritax.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    icon TEXT,
    background_image TEXT,
    status TEXT DEFAULT 'Aktiv',
    features TEXT, -- JSON string array
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS social_media (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT,
    status TEXT DEFAULT 'Aktiv',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stats (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    value INTEGER NOT NULL,
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    price REAL,
    image TEXT,
    category_id INTEGER,
    brand_id INTEGER,
    status TEXT DEFAULT 'Aktiv',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (brand_id) REFERENCES brands (id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT,
    image TEXT,
    slug TEXT NOT NULL,
    status TEXT DEFAULT 'Aktiv',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS about_us (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    hero_title TEXT,
    hero_subtitle TEXT,
    section_title TEXT,
    section_description TEXT,
    main_image TEXT,
    experience_text TEXT,
    features TEXT -- JSON string array of objects {title, description, icon}
  );

  CREATE TABLE IF NOT EXISTS corporate_info (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    hero_title TEXT,
    hero_subtitle TEXT,
    main_image TEXT,
    values_json TEXT -- JSON string array of objects {title, description, icon}
  );

  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position TEXT,
    description TEXT,
    image TEXT,
    linkedin_url TEXT,
    show_linkedin INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Aktiv',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_info (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    hero_title TEXT,
    hero_subtitle TEXT,
    button_text TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    map_url TEXT
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image TEXT,
    status TEXT DEFAULT 'Aktiv'
  );

  CREATE TABLE IF NOT EXISTS certificate_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    title TEXT,
    subtitle TEXT,
    is_enabled INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS client_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    title TEXT,
    subtitle TEXT,
    is_enabled INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    logo TEXT,
    status TEXT DEFAULT 'Aktiv',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data if empty
const certSettingsCount = db.prepare("SELECT COUNT(*) as count FROM certificate_settings").get() as { count: number };
if (certSettingsCount.count === 0) {
  db.prepare(`
    INSERT INTO certificate_settings (id, title, subtitle, is_enabled)
    VALUES (1, ?, ?, ?)
  `).run(
    "SERTİFİKATLARIMIZ",
    "Peşəkar xidmətlərimiz rəsmi lisenziyalar və beynəlxalq sertifikatlarla təmin olunmuşdur.",
    1
  );
}

const certCount = db.prepare("SELECT COUNT(*) as count FROM certificates").get() as { count: number };
if (certCount.count === 0) {
  const insertCert = db.prepare("INSERT INTO certificates (title, image, status) VALUES (?, ?, ?)");
  insertCert.run("ISO 9001:2015", "https://picsum.photos/seed/cert1/400/600", "Aktiv");
  insertCert.run("Vergi Məsləhətçisi Sertifikatı", "https://picsum.photos/seed/cert2/400/600", "Aktiv");
  insertCert.run("Peşəkar Mühasib Sertifikatı", "https://picsum.photos/seed/cert3/400/600", "Aktiv");
}
const contactCount = db.prepare("SELECT COUNT(*) as count FROM contact_info").get() as { count: number };
if (contactCount.count === 0) {
  db.prepare(`
    INSERT INTO contact_info (id, hero_title, hero_subtitle, button_text, phone, email, address, map_url)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "Peşəkar Dəstək Üçün Yanınızdayıq",
    "Vergi, mühasibatlıq və biznes həlləri ilə bağlı sualınız var? Bizə müraciət edin.",
    "Məsləhət al",
    "+994 55 263 68 67",
    "info@juritax.az",
    "Babək prospekti 282, Baku 1119",
    "https://maps.google.com/..."
  );
}
const corporateCount = db.prepare("SELECT COUNT(*) as count FROM corporate_info").get() as { count: number };
if (corporateCount.count === 0) {
  const values = [
    { title: "Dürüstlük", description: "Hər bir maliyyə əməliyyatında tam şəffaflıq.", icon: "Shield" },
    { title: "İnnovasiya", description: "Müasir texnologiyalarla ənənəvi həllərin birləşməsi.", icon: "Zap" }
  ];

  db.prepare(`
    INSERT INTO corporate_info (id, hero_title, hero_subtitle, main_image, values_json)
    VALUES (1, ?, ?, ?, ?)
  `).run(
    "Missiyamız və Dəyərlərimiz",
    "Azərbaycanın biznes mühitində şəffaflıq, innovasiya və peşəkarlığın simvolu olmağı hədəfləyirik.",
    "https://picsum.photos/seed/corporate/800/600",
    JSON.stringify(values)
  );
}

const teamCount = db.prepare("SELECT COUNT(*) as count FROM team_members").get() as { count: number };
if (teamCount.count === 0) {
  const insertTeam = db.prepare(`
    INSERT INTO team_members (name, position, description, image, linkedin_url, show_linkedin, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const teamData = [
    ["Günel Qarabağlı", "BAŞ MÜHASİB", "Peşəkar mühasibat xidmətləri.", "https://picsum.photos/seed/team1/400/400", "https://linkedin.com/in/gunel", 1, "Aktiv"],
    ["Nurlan Babazadə", "MÜHASİB", "Maliyyə hesabatlılığı üzrə mütəxəssis.", "https://picsum.photos/seed/team2/400/400", "https://linkedin.com/in/nurlan", 1, "Aktiv"],
    ["Aysel Allahverdiyeva", "KİÇİK MÜHASİB", "Mühasibat uçotunun dəstəklənməsi.", "https://picsum.photos/seed/team3/400/400", "https://linkedin.com/in/aysel", 1, "Aktiv"],
    ["Musa Piriyev", "BAŞ HÜQUQ MÜTƏXƏSSİSİ", "Korporativ hüquq dəstəyi.", "https://picsum.photos/seed/team4/400/400", "https://linkedin.com/in/musa", 1, "Aktiv"]
  ];

  for (const member of teamData) {
    insertTeam.run(...member);
  }
}

// Seed data if empty
const aboutCount = db.prepare("SELECT COUNT(*) as count FROM about_us").get() as { count: number };
if (aboutCount.count === 0) {
  const features = [
    { title: "Peşəkar Komanda", description: "Geniş təcrübəyə malik mütəxəssislər.", icon: "Users" },
    { title: "Fərdi Yanaşma", description: "Müştəri ehtiyaclarının dərin təhlili.", icon: "Target" },
    { title: "Yüksək Keyfiyyət", description: "Beynəlxalq standartlara uyğunluq.", icon: "ShieldCheck" },
    { title: "Şəffaflıq", description: "Tam şəffaf və hesabatlı proseslər.", icon: "Eye" }
  ];

  db.prepare(`
    INSERT INTO about_us (id, hero_title, hero_subtitle, section_title, section_description, main_image, experience_text, features)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "Juritax: Sizin Etibarlı Biznes Tərəfdaşınız",
    "Biz vergi, mühasibatlıq və biznes həlləri sahəsində premium xidmətlər təklif edirik.",
    "Biz Kimik?",
    "Biznesinizi idarə etmək üçün lazım olan bütün dəstəyi vahid mərkəzdən təmin edirik.",
    "https://picsum.photos/seed/about/800/600",
    "10+ İllik Təcrübə",
    JSON.stringify(features)
  );
}
const blogCount = db.prepare("SELECT COUNT(*) as count FROM blog_posts").get() as { count: number };
if (blogCount.count === 0) {
  const insertBlog = db.prepare(`
    INSERT INTO blog_posts (title, subtitle, content, image, slug, status) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const blogData = [
    ["2026-cı il Vergi Məcəlləsindəki Dəyişikliklər", "Yeni ilin əvvəlindən qüvvəyə minən vergi dəyişiklikləri.", "Vergi məcəlləsində edilən son dəyişikliklər biznes sahibləri üçün bir çox yeniliklər gətirir...", "https://picsum.photos/seed/blog1/800/600", "2026-ci-il-vergi-mecellesindeki-deyisiklikler", "Aktiv"],
    ["Rəqəmsal Mühasibatlıq: Biznesinizi Necə İnkişaf Etdirir?", "Kağız üzərində aparılan mühasibatlıq artıq keçmişdə qaldı.", "Bulud texnologiyaları və rəqəmsal həllər mühasibat uçotunu daha sürətli və şəffaf edir...", "https://picsum.photos/seed/blog2/800/600", "reqemsal-muhasibatliq-biznesinizi-nece-inkisaf-etdirir", "Aktiv"],
    ["Əmək Qanunvericiliyində Yeni Tələblər", "İşəgötürənlər və işçilər üçün yeni qaydalar nələri vəd edir?", "Əmək müqavilələrinin qeydiyyatı və sosial sığorta öhdəlikləri haqqında son məlumatlar...", "https://picsum.photos/seed/blog3/800/600", "emek-qanunvericiliyinde-yeni-telebler", "Aktiv"],
  ];

  for (const [title, subtitle, content, image, slug, status] of blogData) {
    insertBlog.run(title, subtitle, content, image, slug, status);
  }
}

// Seed data if empty
const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const insertCat = db.prepare("INSERT INTO categories (name) VALUES (?)");
  ["Monitorlar", "Rkeeper", "Kassa aparatları", "Tərəzilər", "Proqram təminatı"].forEach(name => insertCat.run(name));
}

const brandCount = db.prepare("SELECT COUNT(*) as count FROM brands").get() as { count: number };
if (brandCount.count === 0) {
  const insertBrand = db.prepare("INSERT INTO brands (name) VALUES (?)");
  ["HP", "Dell", "Samsung", "Epson"].forEach(name => insertBrand.run(name));
}

const settingsCount = db.prepare("SELECT COUNT(*) as count FROM settings").get() as { count: number };
if (settingsCount.count === 0) {
  db.prepare("INSERT INTO settings (id, value) VALUES (?, ?)").run("show_prices", "true");
}

const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (name, subtitle, description, price, image, category_id, brand_id, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const productsData = [
    ["Professional 4K Business Monitor", "Yüksək rəng dəqiqliyi və erqonomik dizayn.", "Ofis və dizayn işləri üçün mükəmməl seçim olan 4K monitor.", 999, "https://picsum.photos/seed/monitor1/800/600", 1, 2, "Aktiv"],
    ["Smart POS System X-200", "İnteqrasiya edilmiş bulud sistemi və sürətli çap.", "Restoran və pərakəndə satış nöqtələri üçün müasir POS terminal.", 1250, "https://picsum.photos/seed/pos1/800/600", 3, 4, "Aktiv"],
    ["Rkeeper Cloud Management", "Restoran və kafelər üçün avtomatlaşdırma.", "Bulud əsaslı idarəetmə sistemi ilə biznesinizi hər yerdən izləyin.", 450, "https://picsum.photos/seed/rkeeper1/800/600", 2, 1, "Aktiv"],
    ["Elektron Tərəzi T-500", "Dəqiq çəki və barkod çapı.", "Marketlər üçün nəzərdə tutulmuş yüksək dəqiqlikli tərəzi.", 750, "https://picsum.photos/seed/scale1/800/600", 4, 3, "Aktiv"],
  ];

  for (const [name, subtitle, description, price, image, catId, brandId, status] of productsData) {
    insertProduct.run(name, subtitle, description, price, image, catId, brandId, status);
  }
}

// Seed data
const insertService = db.prepare("INSERT INTO services (title, subtitle, description, icon, status, features) VALUES (?, ?, ?, ?, ?, ?)");
const checkService = db.prepare("SELECT COUNT(*) as count FROM services WHERE title = ?");

const servicesData = [
  ["Vergi Xidmətləri", "Vergi öhdəliklərinin optimallaşdırılması", "Biznesinizin vergi yükünü qanuni yollarla azaldır və vergi orqanları ilə münasibətlərinizi tənzimləyirik.", "Briefcase", "Aktiv", ["Vergi planlaması", "Vergi bəyannamələri", "Vergi risklərinin təhlili", "Kamera yoxlamalarında dəstək", "Beynəlxalq vergiqoyma"]],
  ["Mühasibat Uçotu", "Dəqiq və şəffaf hesabatlılıq", "Mühasibat uçotunun beynəlxalq standartlara uyğun aparılması.", "Calculator", "Aktiv", ["Maliyyə hesabatları", "Kadr uçotu"]],
  ["Audit Xidmətləri", "Maliyyə risklərinin minimallaşdırılması", "Daxili və xarici audit xidmətləri.", "Search", "Deaktiv", ["Daxili audit", "Vergi auditi"]],
  ["Hüquq Xidmətləri", "Hüquqi təhlükəsizliyinizin təminatı", "Müqavilələrin hazırlanması və hüquqi məsləhət.", "Scale", "Aktiv", ["Müqavilə hüququ", "Məhkəmə təmsilçiliyi"]],
  ["Miqrasiya Xidmətləri", "Xarici vətəndaşlar üçün dəstək", "İş və yaşayış icazələrinin alınması.", "Plane", "Aktiv", ["İş icazəsi", "Yaşayış icazəsi"]],
  ["Gömrük Rəsmiləşdirilməsi", "Sürətli və maneəsiz gömrük keçidi", "Malların gömrük bəyannamələrinin hazırlanması.", "Truck", "Aktiv", ["Bəyannamə tərtibi", "Yük daşıma"]],
  ["İT Xidmətləri", "Texnoloji həllər və dəstək", "Şəbəkə qurulması və proqram təminatı.", "Monitor", "Aktiv", ["Şəbəkə dəstəyi", "Proqramlaşdırma"]],
  ["Ticarət Avadanlıqları", "Mağaza və anbar həlləri", "Kassa aparatları və barkod sistemləri.", "ShoppingBag", "Aktiv", ["Kassa sistemləri", "Barkod oxuyucular"]],
  ["Gömrük Məsləhətləri", "Gömrük qanunvericiliyi üzrə konsultasiya", "Gömrük tarifləri və qaydaları haqqında məlumat.", "HelpCircle", "Aktiv", ["Tarif məsləhəti", "Qanunvericilik"]],
];

for (const [title, subtitle, description, icon, status, features] of servicesData) {
  const exists = (checkService.get(title) as { count: number }).count > 0;
  if (!exists) {
    insertService.run(title, subtitle, description, icon, status, JSON.stringify(features));
  }
}

const socialCount = db.prepare("SELECT COUNT(*) as count FROM social_media").get() as { count: number };
if (socialCount.count === 0) {
  const insertSocial = db.prepare("INSERT INTO social_media (id, name, url, status) VALUES (?, ?, ?, ?)");
  insertSocial.run("facebook", "Facebook", "https://facebook.com/juritax.az", "Aktiv");
  insertSocial.run("instagram", "Instagram", "https://instagram.com/juritax_lega", "Aktiv");
  insertSocial.run("linkedin", "LinkedIn", "https://linkedin.com/company/juritax", "Aktiv");
  insertSocial.run("twitter", "X / Twitter", "https://x.com/juritax_az", "Deaktiv");
  insertSocial.run("youtube", "YouTube", "https://youtube.com/@juritax_tv", "Aktiv");
  insertSocial.run("whatsapp", "WhatsApp", "https://wa.me/994501234567", "Aktiv");
}

const clientSettingsCount = db.prepare("SELECT COUNT(*) as count FROM client_settings").get() as { count: number };
if (clientSettingsCount.count === 0) {
  db.prepare(`
    INSERT INTO client_settings (id, title, subtitle, is_enabled)
    VALUES (1, ?, ?, ?)
  `).run(
    "MÜŞTƏRİ PORTFELİMİZ",
    "Azərbaycanın aparıcı şirkətləri öz biznes proseslərini bizə etibar edir.",
    1
  );
}

const statsCount = db.prepare("SELECT COUNT(*) as count FROM stats").get() as { count: number };
if (statsCount.count === 0) {
  const insertStat = db.prepare("INSERT INTO stats (id, label, value, icon) VALUES (?, ?, ?, ?)");
  insertStat.run("services", "Ümumi Xidmətlər", 12, "Stethoscope");
  insertStat.run("products", "Məhsullar", 156, "ShoppingBag");
  insertStat.run("team", "Komanda", 24, "Users");
  insertStat.run("blog", "Bloq Yazıları", 124, "History");
}

const subscribersCount = db.prepare("SELECT COUNT(*) as count FROM subscribers").get() as { count: number };
if (subscribersCount.count === 0) {
  const insertSub = db.prepare("INSERT INTO subscribers (email) VALUES (?)");
  insertSub.run("info@example.com");
  insertSub.run("test@juritax.az");
  insertSub.run("client@mail.ru");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const logAction = (action: string, details: string) => {
    db.prepare("INSERT INTO logs (action, details) VALUES (?, ?)").run(action, details);
  };

  // API Routes
  app.get("/api/logs", (req, res) => {
    const logs = db.prepare("SELECT * FROM logs ORDER BY created_at DESC LIMIT 50").all();
    res.json(logs);
  });

  app.get("/api/stats", (req, res) => {
    const stats = db.prepare("SELECT * FROM stats").all();
    res.json(stats);
  });

  app.get("/api/services", (req, res) => {
    const services = db.prepare("SELECT * FROM services ORDER BY updated_at DESC").all();
    res.json(services.map((s: any) => ({ ...s, features: JSON.parse(s.features || "[]") })));
  });

  app.post("/api/services", (req, res) => {
    const { title, subtitle, description, icon, background_image, status, features } = req.body;
    const info = db.prepare("INSERT INTO services (title, subtitle, description, icon, background_image, status, features) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(title, subtitle, description, icon, background_image, status, JSON.stringify(features));
    logAction("Yeni Xidmət", `Xidmət əlavə edildi: ${title}`);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/services/:id", (req, res) => {
    const { title, subtitle, description, icon, background_image, status, features } = req.body;
    db.prepare("UPDATE services SET title = ?, subtitle = ?, description = ?, icon = ?, background_image = ?, status = ?, features = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .run(title, subtitle, description, icon, background_image, status, JSON.stringify(features), req.params.id);
    logAction("Xidmət Yeniləndi", `Xidmət məlumatları dəyişdirildi: ${title}`);
    res.json({ success: true });
  });

  app.get("/api/social", (req, res) => {
    const social = db.prepare("SELECT * FROM social_media").all();
    res.json(social);
  });

  app.put("/api/social/:id", (req, res) => {
    const { url, status } = req.body;
    db.prepare("UPDATE social_media SET url = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .run(url, status, req.params.id);
    logAction("Sosial Media Yeniləndi", `${req.params.id} linki və statusu dəyişdirildi`);
    res.json({ success: true });
  });

  // Products API
  app.get("/api/products", (req, res) => {
    const products = db.prepare(`
      SELECT p.*, c.name as category_name, b.name as brand_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN brands b ON p.brand_id = b.id 
      ORDER BY p.updated_at DESC
    `).all();
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    const { name, subtitle, description, price, image, category_id, brand_id, status } = req.body;
    const info = db.prepare(`
      INSERT INTO products (name, subtitle, description, price, image, category_id, brand_id, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, subtitle, description, price, image, category_id, brand_id, status);
    logAction("Yeni Məhsul", `Məhsul əlavə edildi: ${name}`);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/products/:id", (req, res) => {
    const { name, subtitle, description, price, image, category_id, brand_id, status } = req.body;
    db.prepare(`
      UPDATE products 
      SET name = ?, subtitle = ?, description = ?, price = ?, image = ?, category_id = ?, brand_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(name, subtitle, description, price, image, category_id, brand_id, status, req.params.id);
    logAction("Məhsul Yeniləndi", `Məhsul məlumatları dəyişdirildi: ${name}`);
    res.json({ success: true });
  });

  app.delete("/api/products/:id", (req, res) => {
    db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
    logAction("Məhsul Silindi", `ID: ${req.params.id} olan məhsul silindi`);
    res.json({ success: true });
  });

  // Categories API
  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.post("/api/categories", (req, res) => {
    const { name } = req.body;
    const info = db.prepare("INSERT INTO categories (name) VALUES (?)").run(name);
    logAction("Yeni Kateqoriya", `Kateqoriya əlavə edildi: ${name}`);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/categories/:id", (req, res) => {
    db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
    logAction("Kateqoriya Silindi", `ID: ${req.params.id} olan kateqoriya silindi`);
    res.json({ success: true });
  });

  // Brands API
  app.get("/api/brands", (req, res) => {
    const brands = db.prepare("SELECT * FROM brands").all();
    res.json(brands);
  });

  app.post("/api/brands", (req, res) => {
    const { name } = req.body;
    const info = db.prepare("INSERT INTO brands (name) VALUES (?)").run(name);
    logAction("Yeni Brend", `Brend əlavə edildi: ${name}`);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/brands/:id", (req, res) => {
    db.prepare("DELETE FROM brands WHERE id = ?").run(req.params.id);
    logAction("Brend Silindi", `ID: ${req.params.id} olan brend silindi`);
    res.json({ success: true });
  });

  // Settings API
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    res.json(settings);
  });

  app.put("/api/settings/:id", (req, res) => {
    const { value } = req.body;
    db.prepare("UPDATE settings SET value = ? WHERE id = ?").run(value, req.params.id);
    logAction("Tənzimləmə Yeniləndi", `${req.params.id} tənzimləməsi dəyişdirildi: ${value}`);
    res.json({ success: true });
  });

  // Blog API
  app.get("/api/blog", (req, res) => {
    const posts = db.prepare("SELECT * FROM blog_posts ORDER BY created_at DESC").all();
    res.json(posts);
  });

  app.post("/api/blog", (req, res) => {
    const { title, subtitle, content, image, slug, status } = req.body;
    const info = db.prepare(`
      INSERT INTO blog_posts (title, subtitle, content, image, slug, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, subtitle, content, image, slug, status);
    logAction("Yeni Blog Yazısı", `Yazı əlavə edildi: ${title}`);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/blog/:id", (req, res) => {
    const { title, subtitle, content, image, slug, status } = req.body;
    db.prepare(`
      UPDATE blog_posts 
      SET title = ?, subtitle = ?, content = ?, image = ?, slug = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(title, subtitle, content, image, slug, status, req.params.id);
    logAction("Blog Yazısı Yeniləndi", `Yazı məlumatları dəyişdirildi: ${title}`);
    res.json({ success: true });
  });

  app.delete("/api/blog/:id", (req, res) => {
    db.prepare("DELETE FROM blog_posts WHERE id = ?").run(req.params.id);
    logAction("Blog Yazısı Silindi", `ID: ${req.params.id} olan yazı silindi`);
    res.json({ success: true });
  });

  // About Us API
  app.get("/api/about", (req, res) => {
    const about = db.prepare("SELECT * FROM about_us WHERE id = 1").get() as any;
    if (about) {
      about.features = JSON.parse(about.features || "[]");
    }
    res.json(about);
  });

  app.put("/api/about", (req, res) => {
    const { hero_title, hero_subtitle, section_title, section_description, main_image, experience_text, features } = req.body;
    db.prepare(`
      UPDATE about_us 
      SET hero_title = ?, hero_subtitle = ?, section_title = ?, section_description = ?, main_image = ?, experience_text = ?, features = ?
      WHERE id = 1
    `).run(hero_title, hero_subtitle, section_title, section_description, main_image, experience_text, JSON.stringify(features));
    logAction("Haqqımızda Yeniləndi", "Haqqımızda səhifəsinin məlumatları dəyişdirildi");
    res.json({ success: true });
  });

  // Corporate API
  app.get("/api/corporate", (req, res) => {
    const corporate = db.prepare("SELECT * FROM corporate_info WHERE id = 1").get() as any;
    if (corporate) {
      corporate.values = JSON.parse(corporate.values_json || "[]");
    }
    res.json(corporate);
  });

  app.put("/api/corporate", (req, res) => {
    const { hero_title, hero_subtitle, main_image, values } = req.body;
    db.prepare(`
      UPDATE corporate_info 
      SET hero_title = ?, hero_subtitle = ?, main_image = ?, values_json = ?
      WHERE id = 1
    `).run(hero_title, hero_subtitle, main_image, JSON.stringify(values));
    logAction("Korporativ Yeniləndi", "Korporativ strategiya məlumatları dəyişdirildi");
    res.json({ success: true });
  });

  // Team API
  app.get("/api/team", (req, res) => {
    const team = db.prepare("SELECT * FROM team_members ORDER BY id ASC").all();
    res.json(team.map((m: any) => ({ ...m, show_linkedin: !!m.show_linkedin })));
  });

  app.post("/api/team", (req, res) => {
    const { name, position, description, image, linkedin_url, show_linkedin, status } = req.body;
    const info = db.prepare(`
      INSERT INTO team_members (name, position, description, image, linkedin_url, show_linkedin, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, position, description, image, linkedin_url, show_linkedin ? 1 : 0, status);
    logAction("Yeni Komanda Üzvü", `Üzv əlavə edildi: ${name}`);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/team/:id", (req, res) => {
    const { name, position, description, image, linkedin_url, show_linkedin, status } = req.body;
    db.prepare(`
      UPDATE team_members 
      SET name = ?, position = ?, description = ?, image = ?, linkedin_url = ?, show_linkedin = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(name, position, description, image, linkedin_url, show_linkedin ? 1 : 0, status, req.params.id);
    logAction("Komanda Üzvü Yeniləndi", `Üzv məlumatları dəyişdirildi: ${name}`);
    res.json({ success: true });
  });

  app.delete("/api/team/:id", (req, res) => {
    db.prepare("DELETE FROM team_members WHERE id = ?").run(req.params.id);
    logAction("Komanda Üzvü Silindi", `ID: ${req.params.id} olan üzv silindi`);
    res.json({ success: true });
  });

  // Contact API
  app.get("/api/contact", (req, res) => {
    const contact = db.prepare("SELECT * FROM contact_info WHERE id = 1").get();
    res.json(contact);
  });

  app.put("/api/contact", (req, res) => {
    const { hero_title, hero_subtitle, button_text, phone, email, address, map_url } = req.body;
    db.prepare(`
      UPDATE contact_info 
      SET hero_title = ?, hero_subtitle = ?, button_text = ?, phone = ?, email = ?, address = ?, map_url = ?
      WHERE id = 1
    `).run(hero_title, hero_subtitle, button_text, phone, email, address, map_url);
    logAction("Əlaqə Yeniləndi", "Əlaqə məlumatları dəyişdirildi");
    res.json({ success: true });
  });

  // Certificates API
  app.get("/api/certificates", (req, res) => {
    const certs = db.prepare("SELECT * FROM certificates").all();
    res.json(certs);
  });

  app.post("/api/certificates", (req, res) => {
    const { title, image, status } = req.body;
    const info = db.prepare("INSERT INTO certificates (title, image, status) VALUES (?, ?, ?)")
      .run(title, image, status);
    logAction("Yeni Sertifikat", `Sertifikat əlavə edildi: ${title}`);
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/certificates/:id", (req, res) => {
    const { title, image, status } = req.body;
    db.prepare("UPDATE certificates SET title = ?, image = ?, status = ? WHERE id = ?")
      .run(title, image, status, req.params.id);
    logAction("Sertifikat Yeniləndi", `Sertifikat məlumatları dəyişdirildi: ${title}`);
    res.json({ success: true });
  });

  app.delete("/api/certificates/:id", (req, res) => {
    db.prepare("DELETE FROM certificates WHERE id = ?").run(req.params.id);
    logAction("Sertifikat Silindi", `ID: ${req.params.id} olan sertifikat silindi`);
    res.json({ success: true });
  });

  app.get("/api/certificates/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM certificate_settings WHERE id = 1").get() as any;
    if (settings) {
      settings.is_enabled = !!settings.is_enabled;
    }
    res.json(settings);
  });

  app.put("/api/certificates/settings", (req, res) => {
    const { title, subtitle, is_enabled } = req.body;
    db.prepare("UPDATE certificate_settings SET title = ?, subtitle = ?, is_enabled = ? WHERE id = 1")
      .run(title, subtitle, is_enabled ? 1 : 0);
    logAction("Sertifikat Tənzimləmələri", "Sertifikat bölməsinin tənzimləmələri dəyişdirildi");
    res.json({ success: true });
  });

  // Clients API
  app.get("/api/clients", (req, res) => {
    const clients = db.prepare("SELECT * FROM clients ORDER BY created_at DESC").all();
    res.json(clients);
  });

  app.post("/api/clients", (req, res) => {
    const { logo, status } = req.body;
    const info = db.prepare("INSERT INTO clients (logo, status) VALUES (?, ?)")
      .run(logo, status);
    logAction("Yeni Müştəri", "Yeni müştəri loqosu əlavə edildi");
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/clients/:id", (req, res) => {
    const { logo, status } = req.body;
    db.prepare("UPDATE clients SET logo = ?, status = ? WHERE id = ?")
      .run(logo, status, req.params.id);
    logAction("Müştəri Yeniləndi", `Müştəri loqosu yeniləndi (ID: ${req.params.id})`);
    res.json({ success: true });
  });

  app.delete("/api/clients/:id", (req, res) => {
    db.prepare("DELETE FROM clients WHERE id = ?").run(req.params.id);
    logAction("Müştəri Silindi", `ID: ${req.params.id} olan müştəri silindi`);
    res.json({ success: true });
  });

  app.get("/api/clients/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM client_settings WHERE id = 1").get() as any;
    if (settings) {
      settings.is_enabled = !!settings.is_enabled;
    }
    res.json(settings);
  });

  app.put("/api/clients/settings", (req, res) => {
    const { title, subtitle, is_enabled } = req.body;
    db.prepare("UPDATE client_settings SET title = ?, subtitle = ?, is_enabled = ? WHERE id = 1")
      .run(title, subtitle, is_enabled ? 1 : 0);
    logAction("Müştəri Tənzimləmələri", "Müştəri bölməsinin tənzimləmələri dəyişdirildi");
    res.json({ success: true });
  });

  // Subscribers API
  app.get("/api/subscribers", (req, res) => {
    const subs = db.prepare("SELECT * FROM subscribers ORDER BY created_at DESC").all();
    res.json(subs);
  });

  app.delete("/api/subscribers/:id", (req, res) => {
    db.prepare("DELETE FROM subscribers WHERE id = ?").run(req.params.id);
    logAction("Abunəçi Silindi", `ID: ${req.params.id} olan abunəçi silindi`);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

<div align="center">
  <h1>MyTDK</h1>
  <p><strong>Türkçenin kelimeleri, deyimleri ve atasözleri için modern sözlük arayüzü.</strong></p>
  <p>TDK sözlük servisleriyle desteklenir · Türkçe arayüz · Kendi sunucunda çalıştır</p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-18%2B-171717?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js 18 veya üzeri">
    <img src="https://img.shields.io/badge/Lisans-MIT-D3132A?style=for-the-badge" alt="MIT lisansı">
    <img src="https://img.shields.io/badge/Arayüz-Türkçe-171717?style=for-the-badge" alt="Türkçe arayüz">
  </p>
  <p><a href="READMEs/README.en.md">English</a> · <a href="READMEs/README.es.md">Español</a> · <a href="READMEs/README.de.md">Deutsch</a> · <a href="READMEs/README.fr.md">Français</a></p>
</div>

---

## MyTDK nedir?

MyTDK; kelime anlamlarını, deyimleri ve atasözlerini tek bir arayüzden aramanı sağlayan, Node.js ile çalışan bir Türkçe sözlük uygulamasıdır. TDK’nin çevrimiçi sözlük servislerinden sonuç alır; hızlı yazım önerileri için projeyle gelen yerel bir kelime listesi de kullanır.

> **Kaynak bilgisi:** Canlı sözlük sonuçları TDK servislerinden alınır. `autocomplete.json` uygulamayla birlikte sunulan yerel öneri listesidir. TDK bu projeyi yayımlamamış veya desteklememiştir. Canlı arama ve ses özellikleri için sunucunun internet erişimi gerekir.

## Öne çıkanlar

| 🔎 Arama | 📚 Sözlük | 🎧 Ses | 🎨 Görünüm |
| --- | --- | --- | --- |
| Canlı kelime önerileri ve kaydırılabilir sonuçlar | Kelime, deyim ve atasözü araması | TDK kelime sesleri ve Türkçe metin seslendirme | Kırmızı-beyaz ve koyu temada kırmızı-siyah arayüz |

## Hemen çalıştır

### Gereksinimler

- **Node.js 18 veya üzeri**
- npm (Node.js ile birlikte kurulur)
- Canlı TDK aramaları ve ses servisleri için internet bağlantısı

### Kurulum

```bash
git clone https://github.com/husrevtnc/MyTDK.git
cd MyTDK
npm ci
npm start
```

Tarayıcıda **http://localhost:4173** adresini aç. `PORT` ortam değişkeni tanımlanırsa sunucu o portu kullanır; tanımlanmadığında `4173` portunda başlar.

## Nasıl çalışır?

```text
Tarayıcı ──► MyTDK Node.js sunucusu ──► TDK sözlük servisleri
                    │
                    ├── Yerel autocomplete.json önerileri
                    └── Türkçe seslendirme servisi
```

Tarayıcı aynı kaynaklı `/api/...` uçlarıyla MyTDK sunucusuna bağlanır. Sunucu TDK isteklerini iletir ve cevapları arayüze döndürür. Böylece tarayıcıdan doğrudan TDK’ye yapılan isteklerde oluşabilecek erişim/CORS sorunları önlenir.

## API uçları

| İstek | İşlev |
| --- | --- |
| `GET /healthz` | Sunucu sağlık kontrolü: `{"status":"ok"}` |
| `GET /api/autocomplete` | Yerel `autocomplete.json` öneri listesini döndürür |
| `GET /api/suggestions?ara=...` | TDK’den eşleşen kelime önerilerini getirir; en az iki karakter gerekir |
| `GET /api/gts?ara=...` | TDK Güncel Türkçe Sözlük’te arama yapar |
| `GET /api/atasozu?ara=...` | TDK atasözü ve deyim araması yapar |
| `GET /api/ses/{kod}.wav` | TDK kelime ses kaydını iletir |
| `POST /api/tts` | JSON gövdesindeki `text` alanını MP3 olarak seslendirir; en fazla 3000 karakter |

Örnek istek:

```bash
curl -X POST http://localhost:4173/api/tts \
  -H 'Content-Type: application/json' \
  -d '{"text":"Merhaba, MyTDK seslendirme özelliği."}' \
  --output ses.mp3
```

## Bağımlılıklar ve yapı

Uygulamanın arayüzü saf HTML, CSS ve JavaScript ile hazırlanmıştır; ayrı bir ön yüz derleme adımı yoktur. Sunucu HTTP, dosya sistemi ve akış işlemleri için Node.js’in yerleşik modüllerini kullanır.

`package.json` içindeki tek doğrudan npm bağımlılığı [`tdk-all-api`](https://www.npmjs.com/package/tdk-all-api) paketidir. Paket manifestinde tanımlıdır ancak mevcut `server.js` tarafından doğrudan içe aktarılmaz. `npm ci`, kilit dosyasındaki bağımlılık ağacını kurar.

```text
MyTDK/
├── index.html          # Arayüz ve tarayıcı tarafındaki uygulama
├── server.js           # HTTP sunucusu, TDK API geçidi ve ses uçları
├── autocomplete.json   # Yerel arama önerileri
├── package.json        # Başlatma komutu ve npm bağımlılıkları
├── package-lock.json   # Kilitlenmiş npm bağımlılık ağacı
├── LICENSE             # MIT lisans metni
└── READMEs/            # Diğer dillerdeki README dosyaları
```

## Dış servisler ve gizlilik

- Sözlük, öneri ve kelime sesleri için `api.sozluk.gov.tr` kullanılır.
- Metni seslendirme özelliği, sunucu üzerinden Google Translate TTS uç noktasına (`translate.google.com/translate_tts`) istek gönderir. Bu harici servisin erişilebilirliği ve koşulları sağlayıcısına bağlıdır.
- Bu servisler kullanılacağı zaman aranan metin ilgili servise iletilir. Uygulama için API anahtarı veya `.env` dosyası gerekmez.

TDK servisleri yanıt vermezse canlı arama ve ses özellikleri geçici olarak çalışmayabilir. Yerel öneri listesinin sunulması için `autocomplete.json` dosyası gerekir.

## Lisans

Kaynak kod [MIT lisansı](LICENSE) ile yayımlanır. MIT lisansı, TDK sözlük içeriğine, yerel veri dosyasındaki TDK kaynaklı içeriğe veya üçüncü taraf ses hizmetlerine otomatik olarak uygulanmaz. Bu materyaller kendi hak ve kullanım koşullarına tabi olabilir.

---

<div align="center">
  <sub>Türkçe sözlük deneyimini sade, hızlı ve erişilebilir kılmak için geliştirildi.</sub>
</div>

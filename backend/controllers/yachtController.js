// controllers/yachtController.js

const Yacht = require('../models/Yacht.js');
const supportedLanguages = ['tr', 'en', 'de', 'ru', 'ar'];

// @desc    Yeni bir yat oluştur (Büyük/Küçük Harf Düzeltmesiyle)
// @route   POST /api/yachts
exports.createYacht = async (req, res) => {
    try {
        if (req.body.yachtType) {
            req.body.yachtType = req.body.yachtType.toUpperCase();
        }
        const yachtData = { ...req.body };
        if (req.files) {
            yachtData.images = req.files.map(file => file.path);
        }
        if (yachtData.specs) {
            yachtData.specs = JSON.parse(yachtData.specs);
        }
        const yacht = await Yacht.create(yachtData);
        res.status(201).json({ success: true, data: yacht });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// controllers/yachtController.js

// @desc    Tüm yatları getir (MANUEL PARSER - KESİN ÇÖZÜM)
// @route   GET /api/yachts
exports.getAllYachts = async (req, res) => {
    try {
        const { sort, page, limit, ...filters } = req.query;
        const mongoQuery = {};

        for (const key in filters) {
            const value = filters[key];

            // --- YENİ BÜYÜK/KÜÇÜK HARF DÜZELTMESİ ---
            // Eğer filtre 'yachtType' ise, değerini her zaman büyük harfe çevir
            if (key === 'yachtType' && typeof value === 'string') {
                mongoQuery[key] = value.toUpperCase();
                continue; // Bu anahtar için döngünün geri kalanını atla
            }
            const complexKeyMatch = key.match(/(\w+)\[(\w+)\]\[(\w+)\]/);

            // Eğer anahtar 'specs[cabins][gte]' formatındaysa
            if (complexKeyMatch) {
                const mainField = complexKeyMatch[1]; // specs
                const subField = complexKeyMatch[2];  // cabins
                const operator = complexKeyMatch[3];  // gte
                
                const mongoField = `${mainField}.${subField}`; // "specs.cabins"
                const mongoOperator = `$${operator}`; // "$gte"
                const numericValue = Number(value); // "5" -> 5

                mongoQuery[mongoField] = { [mongoOperator]: numericValue };
            } 
            // Eğer anahtar 'buildYear[gt]' formatındaysa
            else if (key.includes('[') && key.includes(']')) {
                 const simpleKeyMatch = key.match(/(\w+)\[(\w+)\]/);
                 if(simpleKeyMatch) {
                    const mainField = simpleKeyMatch[1]; // buildYear
                    const operator = simpleKeyMatch[2]; // gt
                    const mongoOperator = `$${operator}`;
                    const numericValue = Number(value);
                    mongoQuery[mainField] = { [mongoOperator]: numericValue };
                 }
            }
            // Eğer anahtar 'yachtType' gibi basit bir metinse
            else {
                mongoQuery[key] = value;
            }
        }

        console.log("MANUEL AYRIŞTIRMA SONRASI OLUŞAN SORGU:", JSON.stringify(mongoQuery));

        let query = Yacht.find(mongoQuery);

        // Sıralama ve Sayfalama...
        if (sort) {
            query = query.sort(sort.split(',').join(' '));
        } else {
            query = query.sort('-createdAt');
        }

        const currentPage = parseInt(page, 10) || 1;
        const currentLimit = parseInt(limit, 10) || 10;
        const startIndex = (currentPage - 1) * currentLimit;
        const total = await Yacht.countDocuments(mongoQuery);
        query = query.skip(startIndex).limit(currentLimit);
        const yachts = await query;
        const pagination = {};
        if ((startIndex + currentLimit) < total) { pagination.next = { page: currentPage + 1, limit: currentLimit }; }
        if (startIndex > 0) { pagination.prev = { page: currentPage - 1, limit: currentLimit }; }

        res.status(200).json({
            success: true,
            count: yachts.length,
            total,
            pagination,
            data: yachts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Sunucu Hatası: ' + error.message
        });
    }
};

exports.getYachtById = async (req, res) => {
    console.log("--- YAT DETAY İSTEĞİ GELDİ ---");
    console.log("İstenen Yat ID:", req.params.id);

    try {
        console.log("Veritabanında findById sorgusu çalıştırılıyor...");
        
        const yacht = await Yacht.findById(req.params.id);

        console.log("Veritabanından yanıt alındı.");

        if (!yacht) {
            console.log("Bu ID ile bir yat bulunamadı.");
            return res.status(404).json({ success: false, error: 'Bu ID ile bir yat bulunamadı' });
        }

        console.log("Yat başarıyla bulundu ve yanıt gönderiliyor.");
        res.status(200).json({
            success: true,
            data: yacht
        });

    } catch (error) {
        console.error("!!! DETAY SAYFASI HATASI:", error);
        res.status(500).json({
            success: false,
            error: 'Sunucu Hatası'
        });
    }
};

exports.updateYacht = async (req, res) => {
    try {
        // 1. Önce güncellenecek yatı veritabanından bulalım
        const yacht = await Yacht.findById(req.params.id);

        if (!yacht) {
            return res.status(404).json({ success: false, error: 'Bu ID ile bir yat bulunamadı' });
        }

        // 2. Formdan gelen verileri alalım
        const { yachtId, yachtType, buildYear, liman, hasAirConditioning, hasGenerator, specs } = req.body;

        // 3. Gelen verileri mevcut yatın üzerine tek tek işleyelim
        if (yachtId) yacht.yachtId = yachtId;
        if (yachtType) yacht.yachtType = yachtType.toUpperCase();
        if (buildYear) yacht.buildYear = buildYear;
        if (liman) yacht.liman = liman;
        
        // Checkbox'lardan gelen 'true'/'false' stringlerini boolean'a çeviriyoruz
        if (hasAirConditioning !== undefined) yacht.hasAirConditioning = (hasAirConditioning === 'true');
        if (hasGenerator !== undefined) yacht.hasGenerator = (hasGenerator === 'true');

        // Specs objesini güncelle
        if (specs) {
            yacht.specs = JSON.parse(specs);
        }

        // Çok-dilli alanları manuel olarak güncelle
        const supportedLanguages = ['tr', 'en', 'de', 'ru', 'ar'];
        supportedLanguages.forEach(lang => {
            // Sadece formdan o dilde bir veri geldiyse güncelleme yapıyoruz.
            // Bu, boş bir dil sekmesinin diğerini ezmesini engeller.
            if (req.body[`name[${lang}]`] !== undefined) {
                yacht.name[lang] = req.body[`name[${lang}]`];
            }
            if (req.body[`description[${lang}]`] !== undefined) {
                yacht.description[lang] = req.body[`description[${lang}]`];
            }
        });

        // Yeni resimler varsa, eskilere dokunmadan üzerine ekle
        if (req.files && req.files.length > 0) {
            const newImageUrls = req.files.map(file => file.path);
            // Mevcut resimlerin üzerine yenilerini eklemek için:
            yacht.images = [...yacht.images, ...newImageUrls];
        }

        // 4. Tüm değişiklikleri içeren yatı veritabanına kaydet
        const updatedYacht = await yacht.save();
        
        res.status(200).json({
            success: true,
            data: updatedYacht
        });

    } catch (error) {
        // Hata olursa detaylı logla
        console.error("GÜNCELLEME SIRASINDA HATA:", error);
        res.status(400).json({ success: false, error: error.message });
    }
};


// YENİ FONKSİYON 2
// @desc    Bir yatı sil
// @route   DELETE /api/yachts/:id
exports.deleteYacht = async (req, res) => {
    try {
        const yacht = await Yacht.findById(req.params.id);

        if (!yacht) {
            return res.status(404).json({ success: false, error: 'Bu ID ile bir yat bulunamadı' });
        }

        await yacht.deleteOne(); // veya Yacht.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: {} // Silme işleminde genelde boş bir obje döner
        });
        
    } catch (error) {
        res.status(500).json({ success: false, error: 'Sunucu Hatası' });
    }
};
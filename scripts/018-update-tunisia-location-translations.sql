-- Improve Arabic and French display names for Tunisia locations.
-- Run after 017-seed-tunisia-locations.sql.

WITH governorate_updates(name_en, name_ar, name_fr) AS (
  VALUES
    ('Ariana', 'أريانة', 'Ariana'),
    ('Beja', 'باجة', 'Béja'),
    ('Ben Arous', 'بن عروس', 'Ben Arous'),
    ('Bizerte', 'بنزرت', 'Bizerte'),
    ('Gabes', 'قابس', 'Gabès'),
    ('Gafsa', 'قفصة', 'Gafsa'),
    ('Jendouba', 'جندوبة', 'Jendouba'),
    ('Kairouan', 'القيروان', 'Kairouan'),
    ('Kasserine', 'القصرين', 'Kasserine'),
    ('Kebili', 'قبلي', 'Kébili'),
    ('Kef', 'الكاف', 'Le Kef'),
    ('Mahdia', 'المهدية', 'Mahdia'),
    ('Manouba', 'منوبة', 'La Manouba'),
    ('Medenine', 'مدنين', 'Médenine'),
    ('Monastir', 'المنستير', 'Monastir'),
    ('Nabeul', 'نابل', 'Nabeul'),
    ('Sfax', 'صفاقس', 'Sfax'),
    ('Sidi Bouzid', 'سيدي بوزيد', 'Sidi Bouzid'),
    ('Siliana', 'سليانة', 'Siliana'),
    ('Sousse', 'سوسة', 'Sousse'),
    ('Tataouine', 'تطاوين', 'Tataouine'),
    ('Tozeur', 'توزر', 'Tozeur'),
    ('Tunis', 'تونس', 'Tunis'),
    ('Zaghouan', 'زغوان', 'Zaghouan')
)
UPDATE governorates
SET name_ar = governorate_updates.name_ar,
    name_fr = governorate_updates.name_fr
FROM governorate_updates
WHERE governorates.name_en = governorate_updates.name_en;

WITH city_updates(governorate_name, name_en, name_ar, name_fr) AS (
  VALUES
    -- Tunis
    ('Tunis', 'Tunis', 'تونس', 'Tunis'),
    ('Tunis', 'Bab Bhar', 'باب بحر', 'Bab Bhar'),
    ('Tunis', 'Bab Souika', 'باب سويقة', 'Bab Souika'),
    ('Tunis', 'Carthage', 'قرطاج', 'Carthage'),
    ('Tunis', 'Cite El Khadra', 'حي الخضراء', 'Cité El Khadra'),
    ('Tunis', 'El Menzah', 'المنزه', 'El Menzah'),
    ('Tunis', 'La Goulette', 'حلق الوادي', 'La Goulette'),
    ('Tunis', 'La Marsa', 'المرسى', 'La Marsa'),
    ('Tunis', 'Le Bardo', 'باردو', 'Le Bardo'),
    ('Tunis', 'Le Kram', 'الكرم', 'Le Kram'),
    ('Tunis', 'Medina', 'المدينة', 'Médina'),
    ('Tunis', 'Sidi Bou Said', 'سيدي بوسعيد', 'Sidi Bou Saïd'),
    ('Tunis', 'Sidi Hassine', 'سيدي حسين', 'Sidi Hassine'),

    -- Ariana
    ('Ariana', 'Ariana', 'أريانة', 'Ariana'),
    ('Ariana', 'Ettadhamen', 'التضامن', 'Ettadhamen'),
    ('Ariana', 'Kalaat el-Andalous', 'قلعة الأندلس', 'Kalaat el-Andalous'),
    ('Ariana', 'La Soukra', 'سكرة', 'La Soukra'),
    ('Ariana', 'Mnihla', 'المنيهلة', 'Mnihla'),
    ('Ariana', 'Raoued', 'رواد', 'Raoued'),
    ('Ariana', 'Sidi Thabet', 'سيدي ثابت', 'Sidi Thabet'),

    -- Ben Arous
    ('Ben Arous', 'Ben Arous', 'بن عروس', 'Ben Arous'),
    ('Ben Arous', 'El Mourouj', 'المروج', 'El Mourouj'),
    ('Ben Arous', 'Ezzahra', 'الزهراء', 'Ezzahra'),
    ('Ben Arous', 'Fouchana', 'فوشانة', 'Fouchana'),
    ('Ben Arous', 'Hammam Chott', 'حمام الشط', 'Hammam Chott'),
    ('Ben Arous', 'Hammam Lif', 'حمام الأنف', 'Hammam Lif'),
    ('Ben Arous', 'Megrine', 'مقرين', 'Mégrine'),
    ('Ben Arous', 'Mohamedia', 'المحمدية', 'Mohamedia'),
    ('Ben Arous', 'Mornag', 'مرناق', 'Mornag'),
    ('Ben Arous', 'Rades', 'رادس', 'Radès'),

    -- Manouba
    ('Manouba', 'Manouba', 'منوبة', 'La Manouba'),
    ('Manouba', 'Den Den', 'دندان', 'Den Den'),
    ('Manouba', 'Douar Hicher', 'دوار هيشر', 'Douar Hicher'),
    ('Manouba', 'Jedaida', 'الجديدة', 'Jedaida'),
    ('Manouba', 'Mornaguia', 'المرناقية', 'Mornaguia'),
    ('Manouba', 'Oued Ellil', 'وادي الليل', 'Oued Ellil'),
    ('Manouba', 'Tebourba', 'طبربة', 'Tebourba'),

    -- Nabeul
    ('Nabeul', 'Nabeul', 'نابل', 'Nabeul'),
    ('Nabeul', 'Beni Khalled', 'بني خلاد', 'Béni Khalled'),
    ('Nabeul', 'Beni Khiar', 'بني خيار', 'Béni Khiar'),
    ('Nabeul', 'Dar Chaabane El Fehri', 'دار شعبان الفهري', 'Dar Chaabane El Fehri'),
    ('Nabeul', 'El Haouaria', 'الهوارية', 'El Haouaria'),
    ('Nabeul', 'Grombalia', 'قرمبالية', 'Grombalia'),
    ('Nabeul', 'Hammamet', 'الحمامات', 'Hammamet'),
    ('Nabeul', 'Kelibia', 'قليبية', 'Kélibia'),
    ('Nabeul', 'Korba', 'قربة', 'Korba'),
    ('Nabeul', 'Menzel Bouzelfa', 'منزل بوزلفة', 'Menzel Bouzelfa'),
    ('Nabeul', 'Menzel Temime', 'منزل تميم', 'Menzel Temime'),
    ('Nabeul', 'Soliman', 'سليمان', 'Soliman'),

    -- Bizerte
    ('Bizerte', 'Bizerte', 'بنزرت', 'Bizerte'),
    ('Bizerte', 'El Alia', 'العالية', 'El Alia'),
    ('Bizerte', 'Ghar El Melh', 'غار الملح', 'Ghar El Melh'),
    ('Bizerte', 'Mateur', 'ماطر', 'Mateur'),
    ('Bizerte', 'Menzel Bourguiba', 'منزل بورقيبة', 'Menzel Bourguiba'),
    ('Bizerte', 'Menzel Jemil', 'منزل جميل', 'Menzel Jemil'),
    ('Bizerte', 'Ras Jebel', 'رأس الجبل', 'Ras Jebel'),
    ('Bizerte', 'Sejnane', 'سجنان', 'Sejnane'),
    ('Bizerte', 'Tinja', 'تينجة', 'Tinja'),
    ('Bizerte', 'Utique', 'أوتيك', 'Utique'),

    -- Beja
    ('Beja', 'Beja', 'باجة', 'Béja'),
    ('Beja', 'Amdoun', 'عمدون', 'Amdoun'),
    ('Beja', 'Goubellat', 'قبلاط', 'Goubellat'),
    ('Beja', 'Medjez el-Bab', 'مجاز الباب', 'Medjez el-Bab'),
    ('Beja', 'Nefza', 'نفزة', 'Nefza'),
    ('Beja', 'Teboursouk', 'تبرسق', 'Teboursouk'),
    ('Beja', 'Testour', 'تستور', 'Testour'),

    -- Jendouba
    ('Jendouba', 'Jendouba', 'جندوبة', 'Jendouba'),
    ('Jendouba', 'Ain Draham', 'عين دراهم', 'Aïn Draham'),
    ('Jendouba', 'Bousalem', 'بوسالم', 'Bousalem'),
    ('Jendouba', 'Fernana', 'فرنانة', 'Fernana'),
    ('Jendouba', 'Ghardimaou', 'غار الدماء', 'Ghardimaou'),
    ('Jendouba', 'Oued Meliz', 'وادي مليز', 'Oued Meliz'),
    ('Jendouba', 'Tabarka', 'طبرقة', 'Tabarka'),

    -- Kef
    ('Kef', 'Le Kef', 'الكاف', 'Le Kef'),
    ('Kef', 'Dahmani', 'الدهماني', 'Dahmani'),
    ('Kef', 'El Ksour', 'القصور', 'El Ksour'),
    ('Kef', 'Jerissa', 'الجريصة', 'Jérissa'),
    ('Kef', 'Kalaa Khasba', 'قلعة الخصبة', 'Kalaat Khasba'),
    ('Kef', 'Kalaa Senan', 'قلعة سنان', 'Kalaat Senan'),
    ('Kef', 'Nebeur', 'نبر', 'Nebeur'),
    ('Kef', 'Tajerouine', 'تاجروين', 'Tajerouine'),

    -- Siliana
    ('Siliana', 'Siliana', 'سليانة', 'Siliana'),
    ('Siliana', 'Bargou', 'برقو', 'Bargou'),
    ('Siliana', 'Bou Arada', 'بوعرادة', 'Bou Arada'),
    ('Siliana', 'Gaafour', 'قعفور', 'Gaafour'),
    ('Siliana', 'Kesra', 'كسرى', 'Kesra'),
    ('Siliana', 'Makthar', 'مكثر', 'Makthar'),
    ('Siliana', 'Rouhia', 'الروحية', 'Rouhia'),

    -- Sousse
    ('Sousse', 'Sousse', 'سوسة', 'Sousse'),
    ('Sousse', 'Akouda', 'أكودة', 'Akouda'),
    ('Sousse', 'Bouficha', 'بوفيشة', 'Bouficha'),
    ('Sousse', 'Enfidha', 'النفيضة', 'Enfidha'),
    ('Sousse', 'Hammam Sousse', 'حمام سوسة', 'Hammam Sousse'),
    ('Sousse', 'Hergla', 'هرقلة', 'Hergla'),
    ('Sousse', 'Kalaa Kebira', 'القلعة الكبرى', 'Kalaa Kebira'),
    ('Sousse', 'Kalaa Seghira', 'القلعة الصغرى', 'Kalaa Seghira'),
    ('Sousse', 'Msaken', 'مساكن', 'Msaken'),
    ('Sousse', 'Sidi Bou Ali', 'سيدي بوعلي', 'Sidi Bou Ali'),
    ('Sousse', 'Sidi El Hani', 'سيدي الهاني', 'Sidi El Hani'),

    -- Monastir
    ('Monastir', 'Monastir', 'المنستير', 'Monastir'),
    ('Monastir', 'Bekalta', 'البقالطة', 'Bekalta'),
    ('Monastir', 'Bembla', 'بنبلة', 'Bembla'),
    ('Monastir', 'Beni Hassen', 'بني حسان', 'Beni Hassen'),
    ('Monastir', 'Jemmal', 'جمال', 'Jemmal'),
    ('Monastir', 'Ksar Hellal', 'قصر هلال', 'Ksar Hellal'),
    ('Monastir', 'Moknine', 'المكنين', 'Moknine'),
    ('Monastir', 'Ouerdanine', 'وردانين', 'Ouerdanine'),
    ('Monastir', 'Sahline', 'الساحلين', 'Sahline'),
    ('Monastir', 'Sayada', 'صيادة', 'Sayada'),
    ('Monastir', 'Teboulba', 'طبلبة', 'Teboulba'),

    -- Mahdia
    ('Mahdia', 'Mahdia', 'المهدية', 'Mahdia'),
    ('Mahdia', 'Chebba', 'الشابة', 'Chebba'),
    ('Mahdia', 'Chorbane', 'شربان', 'Chorbane'),
    ('Mahdia', 'El Jem', 'الجم', 'El Jem'),
    ('Mahdia', 'Ksour Essef', 'قصور الساف', 'Ksour Essef'),
    ('Mahdia', 'Melloulech', 'ملولش', 'Melloulech'),
    ('Mahdia', 'Sidi Alouane', 'سيدي علوان', 'Sidi Alouane'),
    ('Mahdia', 'Souassi', 'السواسي', 'Souassi'),

    -- Sfax
    ('Sfax', 'Sfax', 'صفاقس', 'Sfax'),
    ('Sfax', 'Agareb', 'عقارب', 'Agareb'),
    ('Sfax', 'Bir Ali Ben Khelifa', 'بئر علي بن خليفة', 'Bir Ali Ben Khelifa'),
    ('Sfax', 'El Amra', 'العامرة', 'El Amra'),
    ('Sfax', 'El Hencha', 'الحنشة', 'El Hencha'),
    ('Sfax', 'Jebiniana', 'جبنيانة', 'Jebiniana'),
    ('Sfax', 'Kerkennah', 'قرقنة', 'Kerkennah'),
    ('Sfax', 'Mahres', 'المحرس', 'Mahrès'),
    ('Sfax', 'Menzel Chaker', 'منزل شاكر', 'Menzel Chaker'),
    ('Sfax', 'Sakiet Eddaier', 'ساقية الدائر', 'Sakiet Eddaier'),
    ('Sfax', 'Sakiet Ezzit', 'ساقية الزيت', 'Sakiet Ezzit'),
    ('Sfax', 'Skhira', 'الصخيرة', 'Skhira'),
    ('Sfax', 'Thyna', 'طينة', 'Thyna'),

    -- Kairouan
    ('Kairouan', 'Kairouan', 'القيروان', 'Kairouan'),
    ('Kairouan', 'Bou Hajla', 'بوحجلة', 'Bou Hajla'),
    ('Kairouan', 'Chebika', 'الشبيكة', 'Chebika'),
    ('Kairouan', 'Haffouz', 'حفوز', 'Haffouz'),
    ('Kairouan', 'Hajeb El Ayoun', 'حاجب العيون', 'Hajeb El Ayoun'),
    ('Kairouan', 'Nasrallah', 'نصر الله', 'Nasrallah'),
    ('Kairouan', 'Oueslatia', 'الوسلاتية', 'Oueslatia'),
    ('Kairouan', 'Sbikha', 'السبيخة', 'Sbikha'),

    -- Kasserine
    ('Kasserine', 'Kasserine', 'القصرين', 'Kasserine'),
    ('Kasserine', 'El Ayoun', 'العيون', 'El Ayoun'),
    ('Kasserine', 'Feriana', 'فريانة', 'Feriana'),
    ('Kasserine', 'Foussana', 'فوسانة', 'Foussana'),
    ('Kasserine', 'Hassi El Ferid', 'حاسي الفريد', 'Hassi El Ferid'),
    ('Kasserine', 'Hidra', 'حيدرة', 'Hidra'),
    ('Kasserine', 'Majel Bel Abbes', 'ماجل بلعباس', 'Majel Bel Abbès'),
    ('Kasserine', 'Sbiba', 'سبيبة', 'Sbiba'),
    ('Kasserine', 'Sbeitla', 'سبيطلة', 'Sbeïtla'),
    ('Kasserine', 'Thala', 'تالة', 'Thala'),

    -- Sidi Bouzid
    ('Sidi Bouzid', 'Sidi Bouzid', 'سيدي بوزيد', 'Sidi Bouzid'),
    ('Sidi Bouzid', 'Bir El Hfay', 'بئر الحفي', 'Bir El Hfay'),
    ('Sidi Bouzid', 'Jilma', 'جلمة', 'Jilma'),
    ('Sidi Bouzid', 'Meknassy', 'المكناسي', 'Meknassy'),
    ('Sidi Bouzid', 'Menzel Bouzaiane', 'منزل بوزيان', 'Menzel Bouzaiane'),
    ('Sidi Bouzid', 'Mezzouna', 'المزونة', 'Mezzouna'),
    ('Sidi Bouzid', 'Regueb', 'الرقاب', 'Regueb'),
    ('Sidi Bouzid', 'Souk Jedid', 'السوق الجديد', 'Souk Jedid'),

    -- Gafsa
    ('Gafsa', 'Gafsa', 'قفصة', 'Gafsa'),
    ('Gafsa', 'Belkhir', 'بلخير', 'Belkhir'),
    ('Gafsa', 'El Guettar', 'القطار', 'El Guettar'),
    ('Gafsa', 'El Ksar', 'القصر', 'El Ksar'),
    ('Gafsa', 'Metlaoui', 'المتلوي', 'Métlaoui'),
    ('Gafsa', 'Mdhilla', 'المظيلة', 'Mdhilla'),
    ('Gafsa', 'Moulares', 'أم العرائس', 'Moularès'),
    ('Gafsa', 'Redeyef', 'الرديف', 'Redeyef'),
    ('Gafsa', 'Sened', 'سند', 'Sened'),

    -- Tozeur
    ('Tozeur', 'Tozeur', 'توزر', 'Tozeur'),
    ('Tozeur', 'Degache', 'دقاش', 'Degache'),
    ('Tozeur', 'Hezoua', 'حزوة', 'Hezoua'),
    ('Tozeur', 'Nefta', 'نفطة', 'Nefta'),
    ('Tozeur', 'Tameghza', 'تمغزة', 'Tameghza'),

    -- Kebili
    ('Kebili', 'Kebili', 'قبلي', 'Kébili'),
    ('Kebili', 'Douz', 'دوز', 'Douz'),
    ('Kebili', 'El Faouar', 'الفوار', 'El Faouar'),
    ('Kebili', 'Souk Lahad', 'سوق الأحد', 'Souk Lahad'),

    -- Gabes
    ('Gabes', 'Gabes', 'قابس', 'Gabès'),
    ('Gabes', 'El Hamma', 'الحامة', 'El Hamma'),
    ('Gabes', 'Ghannouch', 'غنوش', 'Ghannouch'),
    ('Gabes', 'Mareth', 'مارث', 'Mareth'),
    ('Gabes', 'Matmata', 'مطماطة', 'Matmata'),
    ('Gabes', 'Menzel El Habib', 'منزل الحبيب', 'Menzel El Habib'),
    ('Gabes', 'Metouia', 'المطوية', 'Métouia'),

    -- Medenine
    ('Medenine', 'Medenine', 'مدنين', 'Médenine'),
    ('Medenine', 'Ben Gardane', 'بنقردان', 'Ben Gardane'),
    ('Medenine', 'Beni Khedache', 'بني خداش', 'Beni Khedache'),
    ('Medenine', 'Djerba Ajim', 'جربة أجيم', 'Djerba Ajim'),
    ('Medenine', 'Djerba Houmt Souk', 'جربة حومة السوق', 'Djerba Houmt Souk'),
    ('Medenine', 'Djerba Midoun', 'جربة ميدون', 'Djerba Midoun'),
    ('Medenine', 'Sidi Makhlouf', 'سيدي مخلوف', 'Sidi Makhlouf'),
    ('Medenine', 'Zarzis', 'جرجيس', 'Zarzis'),

    -- Tataouine
    ('Tataouine', 'Tataouine', 'تطاوين', 'Tataouine'),
    ('Tataouine', 'Bir Lahmar', 'بئر الأحمر', 'Bir Lahmar'),
    ('Tataouine', 'Dhehiba', 'ذهيبة', 'Dhehiba'),
    ('Tataouine', 'Ghomrassen', 'غمراسن', 'Ghomrassen'),
    ('Tataouine', 'Remada', 'رمادة', 'Remada'),
    ('Tataouine', 'Smar', 'الصمار', 'Smar'),

    -- Zaghouan
    ('Zaghouan', 'Zaghouan', 'زغوان', 'Zaghouan'),
    ('Zaghouan', 'Bir Mcherga', 'بئر مشارقة', 'Bir Mcherga'),
    ('Zaghouan', 'El Fahs', 'الفحص', 'El Fahs'),
    ('Zaghouan', 'Nadhour', 'الناظور', 'Nadhour'),
    ('Zaghouan', 'Saouaf', 'صواف', 'Saouaf')
)
UPDATE cities
SET name_ar = city_updates.name_ar,
    name_fr = city_updates.name_fr
FROM city_updates
JOIN governorates ON governorates.name_en = city_updates.governorate_name
WHERE cities.governorate_id = governorates.id
  AND cities.name_en = city_updates.name_en;

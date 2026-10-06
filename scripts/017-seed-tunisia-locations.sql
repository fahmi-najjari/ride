-- Seed Tunisia governorates and towns/cities.
-- Safe to run multiple times: each row is inserted only if it does not already exist.

WITH governorate_seed(name_en, name_ar, name_fr) AS (
  VALUES
    ('Ariana', 'Ariana', 'Ariana'),
    ('Beja', 'Beja', 'Beja'),
    ('Ben Arous', 'Ben Arous', 'Ben Arous'),
    ('Bizerte', 'Bizerte', 'Bizerte'),
    ('Gabes', 'Gabes', 'Gabes'),
    ('Gafsa', 'Gafsa', 'Gafsa'),
    ('Jendouba', 'Jendouba', 'Jendouba'),
    ('Kairouan', 'Kairouan', 'Kairouan'),
    ('Kasserine', 'Kasserine', 'Kasserine'),
    ('Kebili', 'Kebili', 'Kebili'),
    ('Kef', 'Kef', 'Kef'),
    ('Mahdia', 'Mahdia', 'Mahdia'),
    ('Manouba', 'Manouba', 'Manouba'),
    ('Medenine', 'Medenine', 'Medenine'),
    ('Monastir', 'Monastir', 'Monastir'),
    ('Nabeul', 'Nabeul', 'Nabeul'),
    ('Sfax', 'Sfax', 'Sfax'),
    ('Sidi Bouzid', 'Sidi Bouzid', 'Sidi Bouzid'),
    ('Siliana', 'Siliana', 'Siliana'),
    ('Sousse', 'Sousse', 'Sousse'),
    ('Tataouine', 'Tataouine', 'Tataouine'),
    ('Tozeur', 'Tozeur', 'Tozeur'),
    ('Tunis', 'Tunis', 'Tunis'),
    ('Zaghouan', 'Zaghouan', 'Zaghouan')
)
INSERT INTO governorates (name_en, name_ar, name_fr)
SELECT name_en, name_ar, name_fr
FROM governorate_seed seed
WHERE NOT EXISTS (
  SELECT 1 FROM governorates existing WHERE existing.name_en = seed.name_en
);

WITH city_seed(governorate_name, name_en, name_ar, name_fr) AS (
  VALUES
    -- Ariana
    ('Ariana', 'Ariana', 'Ariana', 'Ariana'),
    ('Ariana', 'Ettadhamen', 'Ettadhamen', 'Ettadhamen'),
    ('Ariana', 'Kalaat el-Andalous', 'Kalaat el-Andalous', 'Kalaat el-Andalous'),
    ('Ariana', 'La Soukra', 'La Soukra', 'La Soukra'),
    ('Ariana', 'Mnihla', 'Mnihla', 'Mnihla'),
    ('Ariana', 'Raoued', 'Raoued', 'Raoued'),
    ('Ariana', 'Sidi Thabet', 'Sidi Thabet', 'Sidi Thabet'),

    -- Beja
    ('Beja', 'Amdoun', 'Amdoun', 'Amdoun'),
    ('Beja', 'Beja', 'Beja', 'Beja'),
    ('Beja', 'Goubellat', 'Goubellat', 'Goubellat'),
    ('Beja', 'Medjez el-Bab', 'Medjez el-Bab', 'Medjez el-Bab'),
    ('Beja', 'Nefza', 'Nefza', 'Nefza'),
    ('Beja', 'Teboursouk', 'Teboursouk', 'Teboursouk'),
    ('Beja', 'Testour', 'Testour', 'Testour'),
    ('Beja', 'Thibar', 'Thibar', 'Thibar'),

    -- Ben Arous
    ('Ben Arous', 'Ben Arous', 'Ben Arous', 'Ben Arous'),
    ('Ben Arous', 'Boumhel El Bassatine', 'Boumhel El Bassatine', 'Boumhel El Bassatine'),
    ('Ben Arous', 'El Mourouj', 'El Mourouj', 'El Mourouj'),
    ('Ben Arous', 'Ezzahra', 'Ezzahra', 'Ezzahra'),
    ('Ben Arous', 'Fouchana', 'Fouchana', 'Fouchana'),
    ('Ben Arous', 'Hammam Chott', 'Hammam Chott', 'Hammam Chott'),
    ('Ben Arous', 'Hammam Lif', 'Hammam Lif', 'Hammam Lif'),
    ('Ben Arous', 'Megrine', 'Megrine', 'Megrine'),
    ('Ben Arous', 'Mohamedia', 'Mohamedia', 'Mohamedia'),
    ('Ben Arous', 'Mornag', 'Mornag', 'Mornag'),
    ('Ben Arous', 'Rades', 'Rades', 'Rades'),

    -- Bizerte
    ('Bizerte', 'Bizerte', 'Bizerte', 'Bizerte'),
    ('Bizerte', 'El Alia', 'El Alia', 'El Alia'),
    ('Bizerte', 'Ghar El Melh', 'Ghar El Melh', 'Ghar El Melh'),
    ('Bizerte', 'Ghezala', 'Ghezala', 'Ghezala'),
    ('Bizerte', 'Joumine', 'Joumine', 'Joumine'),
    ('Bizerte', 'Mateur', 'Mateur', 'Mateur'),
    ('Bizerte', 'Menzel Bourguiba', 'Menzel Bourguiba', 'Menzel Bourguiba'),
    ('Bizerte', 'Menzel Jemil', 'Menzel Jemil', 'Menzel Jemil'),
    ('Bizerte', 'Ras Jebel', 'Ras Jebel', 'Ras Jebel'),
    ('Bizerte', 'Sejnane', 'Sejnane', 'Sejnane'),
    ('Bizerte', 'Tinja', 'Tinja', 'Tinja'),
    ('Bizerte', 'Utique', 'Utique', 'Utique'),

    -- Gabes
    ('Gabes', 'El Hamma', 'El Hamma', 'El Hamma'),
    ('Gabes', 'Gabes', 'Gabes', 'Gabes'),
    ('Gabes', 'Ghannouch', 'Ghannouch', 'Ghannouch'),
    ('Gabes', 'Mareth', 'Mareth', 'Mareth'),
    ('Gabes', 'Matmata', 'Matmata', 'Matmata'),
    ('Gabes', 'Menzel El Habib', 'Menzel El Habib', 'Menzel El Habib'),
    ('Gabes', 'Metouia', 'Metouia', 'Metouia'),
    ('Gabes', 'Nouvelle Matmata', 'Nouvelle Matmata', 'Nouvelle Matmata'),

    -- Gafsa
    ('Gafsa', 'Belkhir', 'Belkhir', 'Belkhir'),
    ('Gafsa', 'El Guettar', 'El Guettar', 'El Guettar'),
    ('Gafsa', 'El Ksar', 'El Ksar', 'El Ksar'),
    ('Gafsa', 'Gafsa', 'Gafsa', 'Gafsa'),
    ('Gafsa', 'Metlaoui', 'Metlaoui', 'Metlaoui'),
    ('Gafsa', 'Mdhilla', 'Mdhilla', 'Mdhilla'),
    ('Gafsa', 'Moulares', 'Moulares', 'Moulares'),
    ('Gafsa', 'Redeyef', 'Redeyef', 'Redeyef'),
    ('Gafsa', 'Sened', 'Sened', 'Sened'),

    -- Jendouba
    ('Jendouba', 'Ain Draham', 'Ain Draham', 'Ain Draham'),
    ('Jendouba', 'Balta Bou Aouane', 'Balta Bou Aouane', 'Balta Bou Aouane'),
    ('Jendouba', 'Bousalem', 'Bousalem', 'Bousalem'),
    ('Jendouba', 'Fernana', 'Fernana', 'Fernana'),
    ('Jendouba', 'Ghardimaou', 'Ghardimaou', 'Ghardimaou'),
    ('Jendouba', 'Jendouba', 'Jendouba', 'Jendouba'),
    ('Jendouba', 'Oued Meliz', 'Oued Meliz', 'Oued Meliz'),
    ('Jendouba', 'Tabarka', 'Tabarka', 'Tabarka'),

    -- Kairouan
    ('Kairouan', 'Alaa', 'Alaa', 'Alaa'),
    ('Kairouan', 'Bou Hajla', 'Bou Hajla', 'Bou Hajla'),
    ('Kairouan', 'Chebika', 'Chebika', 'Chebika'),
    ('Kairouan', 'Haffouz', 'Haffouz', 'Haffouz'),
    ('Kairouan', 'Hajeb El Ayoun', 'Hajeb El Ayoun', 'Hajeb El Ayoun'),
    ('Kairouan', 'Kairouan', 'Kairouan', 'Kairouan'),
    ('Kairouan', 'Nasrallah', 'Nasrallah', 'Nasrallah'),
    ('Kairouan', 'Oueslatia', 'Oueslatia', 'Oueslatia'),
    ('Kairouan', 'Sbikha', 'Sbikha', 'Sbikha'),
    ('Kairouan', 'Sidi Amor Bou Hajla', 'Sidi Amor Bou Hajla', 'Sidi Amor Bou Hajla'),

    -- Kasserine
    ('Kasserine', 'El Ayoun', 'El Ayoun', 'El Ayoun'),
    ('Kasserine', 'Ezzouhour', 'Ezzouhour', 'Ezzouhour'),
    ('Kasserine', 'Feriana', 'Feriana', 'Feriana'),
    ('Kasserine', 'Foussana', 'Foussana', 'Foussana'),
    ('Kasserine', 'Hassi El Ferid', 'Hassi El Ferid', 'Hassi El Ferid'),
    ('Kasserine', 'Hidra', 'Hidra', 'Hidra'),
    ('Kasserine', 'Jedelienne', 'Jedelienne', 'Jedelienne'),
    ('Kasserine', 'Kasserine', 'Kasserine', 'Kasserine'),
    ('Kasserine', 'Majel Bel Abbes', 'Majel Bel Abbes', 'Majel Bel Abbes'),
    ('Kasserine', 'Sbiba', 'Sbiba', 'Sbiba'),
    ('Kasserine', 'Sbeitla', 'Sbeitla', 'Sbeitla'),
    ('Kasserine', 'Thala', 'Thala', 'Thala'),

    -- Kebili
    ('Kebili', 'Douz', 'Douz', 'Douz'),
    ('Kebili', 'El Faouar', 'El Faouar', 'El Faouar'),
    ('Kebili', 'Kebili', 'Kebili', 'Kebili'),
    ('Kebili', 'Souk Lahad', 'Souk Lahad', 'Souk Lahad'),

    -- Kef
    ('Kef', 'Dahmani', 'Dahmani', 'Dahmani'),
    ('Kef', 'El Ksour', 'El Ksour', 'El Ksour'),
    ('Kef', 'Jerissa', 'Jerissa', 'Jerissa'),
    ('Kef', 'Kalaa Khasba', 'Kalaa Khasba', 'Kalaa Khasba'),
    ('Kef', 'Kalaa Senan', 'Kalaa Senan', 'Kalaa Senan'),
    ('Kef', 'Le Kef', 'Le Kef', 'Le Kef'),
    ('Kef', 'Nebeur', 'Nebeur', 'Nebeur'),
    ('Kef', 'Sakiet Sidi Youssef', 'Sakiet Sidi Youssef', 'Sakiet Sidi Youssef'),
    ('Kef', 'Tajerouine', 'Tajerouine', 'Tajerouine'),

    -- Mahdia
    ('Mahdia', 'Bou Merdes', 'Bou Merdes', 'Bou Merdes'),
    ('Mahdia', 'Chebba', 'Chebba', 'Chebba'),
    ('Mahdia', 'Chorbane', 'Chorbane', 'Chorbane'),
    ('Mahdia', 'El Jem', 'El Jem', 'El Jem'),
    ('Mahdia', 'Hbira', 'Hbira', 'Hbira'),
    ('Mahdia', 'Ksour Essef', 'Ksour Essef', 'Ksour Essef'),
    ('Mahdia', 'Mahdia', 'Mahdia', 'Mahdia'),
    ('Mahdia', 'Melloulech', 'Melloulech', 'Melloulech'),
    ('Mahdia', 'Ouled Chamekh', 'Ouled Chamekh', 'Ouled Chamekh'),
    ('Mahdia', 'Sidi Alouane', 'Sidi Alouane', 'Sidi Alouane'),
    ('Mahdia', 'Souassi', 'Souassi', 'Souassi'),

    -- Manouba
    ('Manouba', 'Borj El Amri', 'Borj El Amri', 'Borj El Amri'),
    ('Manouba', 'Den Den', 'Den Den', 'Den Den'),
    ('Manouba', 'Douar Hicher', 'Douar Hicher', 'Douar Hicher'),
    ('Manouba', 'El Battan', 'El Battan', 'El Battan'),
    ('Manouba', 'Jedaida', 'Jedaida', 'Jedaida'),
    ('Manouba', 'Manouba', 'Manouba', 'Manouba'),
    ('Manouba', 'Mornaguia', 'Mornaguia', 'Mornaguia'),
    ('Manouba', 'Oued Ellil', 'Oued Ellil', 'Oued Ellil'),
    ('Manouba', 'Tebourba', 'Tebourba', 'Tebourba'),

    -- Medenine
    ('Medenine', 'Ben Gardane', 'Ben Gardane', 'Ben Gardane'),
    ('Medenine', 'Beni Khedache', 'Beni Khedache', 'Beni Khedache'),
    ('Medenine', 'Djerba Ajim', 'Djerba Ajim', 'Djerba Ajim'),
    ('Medenine', 'Djerba Houmt Souk', 'Djerba Houmt Souk', 'Djerba Houmt Souk'),
    ('Medenine', 'Djerba Midoun', 'Djerba Midoun', 'Djerba Midoun'),
    ('Medenine', 'Medenine', 'Medenine', 'Medenine'),
    ('Medenine', 'Sidi Makhlouf', 'Sidi Makhlouf', 'Sidi Makhlouf'),
    ('Medenine', 'Zarzis', 'Zarzis', 'Zarzis'),

    -- Monastir
    ('Monastir', 'Bekalta', 'Bekalta', 'Bekalta'),
    ('Monastir', 'Bembla', 'Bembla', 'Bembla'),
    ('Monastir', 'Beni Hassen', 'Beni Hassen', 'Beni Hassen'),
    ('Monastir', 'Jemmal', 'Jemmal', 'Jemmal'),
    ('Monastir', 'Ksar Hellal', 'Ksar Hellal', 'Ksar Hellal'),
    ('Monastir', 'Ksibet El Mediouni', 'Ksibet El Mediouni', 'Ksibet El Mediouni'),
    ('Monastir', 'Moknine', 'Moknine', 'Moknine'),
    ('Monastir', 'Monastir', 'Monastir', 'Monastir'),
    ('Monastir', 'Ouerdanine', 'Ouerdanine', 'Ouerdanine'),
    ('Monastir', 'Sahline', 'Sahline', 'Sahline'),
    ('Monastir', 'Sayada', 'Sayada', 'Sayada'),
    ('Monastir', 'Teboulba', 'Teboulba', 'Teboulba'),

    -- Nabeul
    ('Nabeul', 'Beni Khalled', 'Beni Khalled', 'Beni Khalled'),
    ('Nabeul', 'Beni Khiar', 'Beni Khiar', 'Beni Khiar'),
    ('Nabeul', 'Bou Argoub', 'Bou Argoub', 'Bou Argoub'),
    ('Nabeul', 'Dar Chaabane El Fehri', 'Dar Chaabane El Fehri', 'Dar Chaabane El Fehri'),
    ('Nabeul', 'El Haouaria', 'El Haouaria', 'El Haouaria'),
    ('Nabeul', 'Grombalia', 'Grombalia', 'Grombalia'),
    ('Nabeul', 'Hammamet', 'Hammamet', 'Hammamet'),
    ('Nabeul', 'Kelibia', 'Kelibia', 'Kelibia'),
    ('Nabeul', 'Korba', 'Korba', 'Korba'),
    ('Nabeul', 'Menzel Bouzelfa', 'Menzel Bouzelfa', 'Menzel Bouzelfa'),
    ('Nabeul', 'Menzel Temime', 'Menzel Temime', 'Menzel Temime'),
    ('Nabeul', 'Nabeul', 'Nabeul', 'Nabeul'),
    ('Nabeul', 'Soliman', 'Soliman', 'Soliman'),
    ('Nabeul', 'Takelsa', 'Takelsa', 'Takelsa'),

    -- Sfax
    ('Sfax', 'Agareb', 'Agareb', 'Agareb'),
    ('Sfax', 'Bir Ali Ben Khelifa', 'Bir Ali Ben Khelifa', 'Bir Ali Ben Khelifa'),
    ('Sfax', 'El Amra', 'El Amra', 'El Amra'),
    ('Sfax', 'El Hencha', 'El Hencha', 'El Hencha'),
    ('Sfax', 'Ghraiba', 'Ghraiba', 'Ghraiba'),
    ('Sfax', 'Jebiniana', 'Jebiniana', 'Jebiniana'),
    ('Sfax', 'Kerkennah', 'Kerkennah', 'Kerkennah'),
    ('Sfax', 'Mahres', 'Mahres', 'Mahres'),
    ('Sfax', 'Menzel Chaker', 'Menzel Chaker', 'Menzel Chaker'),
    ('Sfax', 'Sakiet Eddaier', 'Sakiet Eddaier', 'Sakiet Eddaier'),
    ('Sfax', 'Sakiet Ezzit', 'Sakiet Ezzit', 'Sakiet Ezzit'),
    ('Sfax', 'Sfax', 'Sfax', 'Sfax'),
    ('Sfax', 'Skhira', 'Skhira', 'Skhira'),
    ('Sfax', 'Thyna', 'Thyna', 'Thyna'),

    -- Sidi Bouzid
    ('Sidi Bouzid', 'Bir El Hfay', 'Bir El Hfay', 'Bir El Hfay'),
    ('Sidi Bouzid', 'Cebbala Ouled Asker', 'Cebbala Ouled Asker', 'Cebbala Ouled Asker'),
    ('Sidi Bouzid', 'Jilma', 'Jilma', 'Jilma'),
    ('Sidi Bouzid', 'Meknassy', 'Meknassy', 'Meknassy'),
    ('Sidi Bouzid', 'Menzel Bouzaiane', 'Menzel Bouzaiane', 'Menzel Bouzaiane'),
    ('Sidi Bouzid', 'Mezzouna', 'Mezzouna', 'Mezzouna'),
    ('Sidi Bouzid', 'Ouled Haffouz', 'Ouled Haffouz', 'Ouled Haffouz'),
    ('Sidi Bouzid', 'Regueb', 'Regueb', 'Regueb'),
    ('Sidi Bouzid', 'Sidi Ali Ben Aoun', 'Sidi Ali Ben Aoun', 'Sidi Ali Ben Aoun'),
    ('Sidi Bouzid', 'Sidi Bouzid', 'Sidi Bouzid', 'Sidi Bouzid'),
    ('Sidi Bouzid', 'Souk Jedid', 'Souk Jedid', 'Souk Jedid'),

    -- Siliana
    ('Siliana', 'Bargou', 'Bargou', 'Bargou'),
    ('Siliana', 'Bou Arada', 'Bou Arada', 'Bou Arada'),
    ('Siliana', 'El Aroussa', 'El Aroussa', 'El Aroussa'),
    ('Siliana', 'Gaafour', 'Gaafour', 'Gaafour'),
    ('Siliana', 'Kesra', 'Kesra', 'Kesra'),
    ('Siliana', 'Makthar', 'Makthar', 'Makthar'),
    ('Siliana', 'Rouhia', 'Rouhia', 'Rouhia'),
    ('Siliana', 'Siliana', 'Siliana', 'Siliana'),

    -- Sousse
    ('Sousse', 'Akouda', 'Akouda', 'Akouda'),
    ('Sousse', 'Bouficha', 'Bouficha', 'Bouficha'),
    ('Sousse', 'Enfidha', 'Enfidha', 'Enfidha'),
    ('Sousse', 'Hammam Sousse', 'Hammam Sousse', 'Hammam Sousse'),
    ('Sousse', 'Hergla', 'Hergla', 'Hergla'),
    ('Sousse', 'Kalaa Kebira', 'Kalaa Kebira', 'Kalaa Kebira'),
    ('Sousse', 'Kalaa Seghira', 'Kalaa Seghira', 'Kalaa Seghira'),
    ('Sousse', 'Kondar', 'Kondar', 'Kondar'),
    ('Sousse', 'Msaken', 'Msaken', 'Msaken'),
    ('Sousse', 'Sidi Bou Ali', 'Sidi Bou Ali', 'Sidi Bou Ali'),
    ('Sousse', 'Sidi El Hani', 'Sidi El Hani', 'Sidi El Hani'),
    ('Sousse', 'Sousse', 'Sousse', 'Sousse'),

    -- Tataouine
    ('Tataouine', 'Bir Lahmar', 'Bir Lahmar', 'Bir Lahmar'),
    ('Tataouine', 'Dhehiba', 'Dhehiba', 'Dhehiba'),
    ('Tataouine', 'Ghomrassen', 'Ghomrassen', 'Ghomrassen'),
    ('Tataouine', 'Remada', 'Remada', 'Remada'),
    ('Tataouine', 'Smar', 'Smar', 'Smar'),
    ('Tataouine', 'Tataouine', 'Tataouine', 'Tataouine'),

    -- Tozeur
    ('Tozeur', 'Degache', 'Degache', 'Degache'),
    ('Tozeur', 'Hezoua', 'Hezoua', 'Hezoua'),
    ('Tozeur', 'Nefta', 'Nefta', 'Nefta'),
    ('Tozeur', 'Tameghza', 'Tameghza', 'Tameghza'),
    ('Tozeur', 'Tozeur', 'Tozeur', 'Tozeur'),

    -- Tunis
    ('Tunis', 'Bab Bhar', 'Bab Bhar', 'Bab Bhar'),
    ('Tunis', 'Bab Souika', 'Bab Souika', 'Bab Souika'),
    ('Tunis', 'Carthage', 'Carthage', 'Carthage'),
    ('Tunis', 'Cite El Khadra', 'Cite El Khadra', 'Cite El Khadra'),
    ('Tunis', 'El Kabaria', 'El Kabaria', 'El Kabaria'),
    ('Tunis', 'El Menzah', 'El Menzah', 'El Menzah'),
    ('Tunis', 'El Omrane', 'El Omrane', 'El Omrane'),
    ('Tunis', 'El Ouardia', 'El Ouardia', 'El Ouardia'),
    ('Tunis', 'Ettahrir', 'Ettahrir', 'Ettahrir'),
    ('Tunis', 'Ezzouhour', 'Ezzouhour', 'Ezzouhour'),
    ('Tunis', 'Hrairia', 'Hrairia', 'Hrairia'),
    ('Tunis', 'La Goulette', 'La Goulette', 'La Goulette'),
    ('Tunis', 'La Marsa', 'La Marsa', 'La Marsa'),
    ('Tunis', 'Le Bardo', 'Le Bardo', 'Le Bardo'),
    ('Tunis', 'Le Kram', 'Le Kram', 'Le Kram'),
    ('Tunis', 'Medina', 'Medina', 'Medina'),
    ('Tunis', 'Sidi Bou Said', 'Sidi Bou Said', 'Sidi Bou Said'),
    ('Tunis', 'Sidi Hassine', 'Sidi Hassine', 'Sidi Hassine'),
    ('Tunis', 'Tunis', 'Tunis', 'Tunis'),

    -- Zaghouan
    ('Zaghouan', 'Bir Mcherga', 'Bir Mcherga', 'Bir Mcherga'),
    ('Zaghouan', 'El Fahs', 'El Fahs', 'El Fahs'),
    ('Zaghouan', 'Nadhour', 'Nadhour', 'Nadhour'),
    ('Zaghouan', 'Saouaf', 'Saouaf', 'Saouaf'),
    ('Zaghouan', 'Zaghouan', 'Zaghouan', 'Zaghouan')
)
INSERT INTO cities (governorate_id, name_en, name_ar, name_fr)
SELECT governorates.id, city_seed.name_en, city_seed.name_ar, city_seed.name_fr
FROM city_seed
JOIN governorates ON governorates.name_en = city_seed.governorate_name
WHERE NOT EXISTS (
  SELECT 1
  FROM cities existing
  WHERE existing.governorate_id = governorates.id
    AND existing.name_en = city_seed.name_en
);

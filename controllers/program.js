import { driver } from "../driver.js";


export const addProgram = async (req, res) => {
    let kullaniciAdi = req.params.kullaniciAdi;
    let dersAdi = req.body.dersAdi;
    let derslik = req.body.derslik;
    let gun = req.body.gun;
    let basSaat = req.body.basSaat;
    let bitSaat = req.body.bitSaat;
    let session = driver.session();

    try {
        // Kontrol etmek için MATCH kullanılıyor
        const existingDers = await session.run(`
            MATCH (sinif:Sınıf {kodu: $derslik})
            MATCH (gun:Gün {ad: $gun})
            MATCH (saat:Saat {baslangic: $basSaat})
            MATCH p=()-[:DERS_ALIR]->(s:Sınıf)-[:EĞITIM_GÜNÜ]->(g:Gün)-[:EGITIM_BAS]->(saat:Saat)
            WHERE s.kodu = $derslik
            RETURN p
        `, { derslik, gun, basSaat, bitSaat });

            const hours=[];
            existingDers.records.forEach(function (record) {
                hours.push = record.get('p').end.properties;
            });
        
            const existingDerstwo = await session.run(`
            MATCH (sinif:Sınıf {kodu: $derslik})
            MATCH (gun:Gün {ad: $gun})
            MATCH (saat:Saat {baslangic: $bitSaat})
            MATCH p=()-[:DERS_ALIR]->(s:Sınıf)-[:EĞITIM_GÜNÜ]->(g:Gün)-[:EGITIM_SON]->(saat:Saat)
            WHERE s.kodu = $derslik return p
        `, { derslik, gun, basSaat, bitSaat });

            const hourstwo=[];
            existingDerstwo.records.forEach(function (record) {
                hourstwo.push = record.get('p').end.properties;
            });

            if (!(existingDers.summary.plan) && (!(hours.push.baslangic==basSaat)  && !(hourstwo.push.bitis==bitSaat)) ) {
                const result = await session.run(`
                MATCH (ders:Ders {dersAdi: $dersAdi})
                MATCH (sinif:Sınıf {kodu: $derslik})
                MATCH (gun:Gün {ad: $gun})
                MATCH (ssaat:Saat {baslangic: $basSaat})
                MATCH (fsaat:Saat {bitis: $bitSaat})
                
                CREATE (ders)-[:DERS_ALIR]->(sinif)-[:EĞITIM_GÜNÜ]->(gun)-[:EGITIM_BAS]->(ssaat)
                WITH ders, gun, fsaat
                CREATE (gun)-[:EGITIM_SON]->(fsaat);
            `, { dersAdi, derslik, gun, basSaat, bitSaat });
            session.close();
            }
            
            else{
                session.close();
                return res.json("başarısız")
            }
    
            // Eğer buraya kadar geldiyse, aynı saatte başka bir ders yok demektir ve yeni ders ekleniyor
            

        console.log("Başarıyla eklendi");
        res.status(200).json({ message: "Ders başarıyla eklendi" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const removeProgram = (req,res)=>{

}

export const getProgram = (req, res) => {
    const session = driver.session();
    session
        .run('MATCH p=()-[:DERS_ALIR]->(Sınıf)-[:EĞITIM_GÜNÜ]->(Gün)-[:EGITIM_BAS]->(Saat) RETURN p')
        .then(function (result) {
            const lessonsByDay = {};

            result.records.forEach(function (record) {
                const lessonProperties = record.get('p').end.properties;
                console.log(lessonProperties)
            });

            // Send the response after the loop has completed
            return res.json(lessonsByDay);
        })
        .catch(function (err) {
            console.log(err);
            // Handle the error and send an appropriate response if needed
            res.status(500).json({ error: 'Internal Server Error' });
        })
        .finally(() => {
            session.close();
        });
};
    

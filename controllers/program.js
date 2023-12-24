import { driver } from "../driver.js";


export const addProgram = async(req,res)=>{
    let kullaniciAdi= req.params.kullaniciAdi
    let dersAdi = req.body.dersAdi;
    let derslik = req.body.derslik
    let gun = req.body.gun
    let basSaat = req.body.basSaat
    let bitSaat = req.body.bitSaat
    let session=driver.session()
    
    try {
        const result = await session.run(`
        MATCH (ders:Ders {dersAdi: $dersAdi})
        MATCH (sinif:Sınıf {kodu: $derslik})
        MATCH (gun:Gün {ad: $gun})
        MATCH (saat:Saat {baslangic: $basSaat, bitis: $bitSaat})
        
        CREATE (ders)-[:DERS_ALIR]->(sinif)-[:EĞITIM_GÜNÜ]->(gun)-[:EĞITIM_SAATI]->(saat);
    `, { kullaniciAdi, dersAdi, derslik, gun, basSaat, bitSaat });
        session.close()

        console.log("Başarıyla eklendi");
        res.status(200).json({ message: "Ders başarıyla eklendi" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    } 
   
        
}

export const removeProgram = (req,res)=>{

}

export const getProgram=(req,res)=>{

    const session = driver.session();
    session
        .run('MATCH p=()-[:DERS_ALIR]->(Sınıf)-[:EĞITIM_GÜNÜ]->(Gün)-[:EĞITIM_SAATI]->(Saat) return p')
        .then(function (result) {
            const lessons = [];

            result.records.forEach(function (record) {
                lessons.push(record.get('p').properties);
            });

            // Send the response after the loop has completed
            return res.json(lessons);
        })
        .catch(function (err) {
            console.log(err);
            // Handle the error and send an appropriate response if needed
            res.status(500).json({ error: 'Internal Server Error' });
        });
   
};
    

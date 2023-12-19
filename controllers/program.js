import { session } from "neo4j-driver";
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
    } finally {
        // Check if the session is open before trying to close it
        if (session) {
            await session.close();
        }
    }
   
        
}

export const removeProgram = (req,res)=>{

}

export const getProgram=(req,res)=>{

}
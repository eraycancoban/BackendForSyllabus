import neo4j from 'neo4j-driver'
import { driver } from '../driver.js';

export const myLessons = (req, res) => {
    const session = driver.session();
    const kullaniciAdi = req.params.kullaniciAdi;

    session
        .run(`
            MATCH (u:Hoca {kullaniciAdi: $kullaniciAdi})-[:Verir]->(n:Ders)
            RETURN n
        `, { kullaniciAdi: kullaniciAdi })
        .then(function (result) {
            const lessons = [];

            result.records.forEach(function (record) {
                lessons.push(record.get('n').properties);
            });

            // Send the response after the loop has completed
            res.json(lessons);
        })
        .catch(function (err) {
            console.log(err);
            // Handle the error and send an appropriate response if needed
            res.status(500).json({ error: 'Internal Server Error' });
        })
        .finally(function () {
            // Close the session in the finally block to ensure it's always closed
            session.close();
        });
};

export const addLesson = async (req, res) => {
    const kullaniciAdi = req.params.kullaniciAdi;
    const dersAdi = req.body.dersAdi;
    const dersKodu = req.body.dersKodu;
    const kontenjan = req.body.kontenjan;
    const renk = req.body.renk;
    const session = driver.session();
    try {

        
        const result = await session.run(
            `
            CREATE (n:Ders {dersAdi: $dersAdi, dersKodu: $dersKodu, kontenjan: $kontenjan, renk: $renk})
            WITH n
            MATCH (u:Hoca), (n:Ders) WHERE u.kullaniciAdi=$kullaniciAdi AND n.dersAdi=$dersAdi
            CREATE (u)-[:Verir]->(n)
            `,
            { kullaniciAdi, dersAdi, dersKodu, kontenjan, renk }
        );
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

};  

export const deleteLesson=(req,res)=>{
    const session = driver.session();
    const dersAdi = req.body.dersAdi;
    session
    .run("MATCH (n:Ders) WHERE n.dersAdi = $dersAdi DETACH DELETE n", { dersAdi: dersAdi })    
    .catch(function (err) {
        console.log(err);
        // Handle the error and send an appropriate response if needed
        res.status(500).json({ error: 'Internal Server Error' });
    })
    .finally(function () {
        // Close the session in the finally block to ensure it's always closed
        session.close();
    });
    return res.json("Başarı şekilde silindi")
}
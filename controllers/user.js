import {driver} from "../driver.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
const config = {
    secret: "secret-key"
  };

export const allUsers = (req, res) => {
    const session = driver.session();
    session
        .run('MATCH (n:Hoca) RETURN n')
        .then(function (result) {
            const users = [];

            result.records.forEach(function (record) {
                users.push(record._fields[0].properties);
            });

            // Send the response after the loop has completed
            res.json(users);
        })
        .catch(function (err) {
            console.log(err);
            // Handle the error and send an appropriate response if needed
            res.status(500).json({ error: 'Internal Server Error' });
        });
    session.close();
};

export const login = async (req, res) => {
    const kullaniciAdi = req.body.kullaniciAdi;
    const session = driver.session();
    try {
        const result = await session.run('MATCH (u:Hoca {kullaniciAdi: $kullaniciAdi}) RETURN u', { kullaniciAdi });
        const user = result.records[0];        

        if (!user) {
            return res.status(400).json("Kullanıcı bulunamadı");
        }

        const userProperties = user._fields[0].properties;


        const isPasswordCorrect = req.body.sifre==userProperties.sifre;

        if (!isPasswordCorrect) {
            return res.status(400).json("Parola hatası");
        }

        const token = jwt.sign({ id: userProperties.id }, config.secret, { expiresIn: 86400 });

        // Exclude the password from the response
        const { sifre, ...other } = user.get('u').properties;

        res
            .cookie("access_token", token, {
                httpOnly: true,
                // Add other cookie options if needed
            })
            .status(200)
            .json(other);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    session.close();
};

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true,
        // Add other cookie options if needed
    }).status(200).json("Kullanıcı çıkış yaptı.");
};



  
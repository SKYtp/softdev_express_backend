const pool = require("../database/index")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10;
const secret = 'Software_Dev';

const authController = {
    register: async (req, res) => {
        try {
            const { email, password, first_name, last_name, con_num, user_name} = req.body
            const [user] = await pool.query("select * from users where email = ?", [email])
            if (user[0]) return res.json({ error: "Email already exists!" })
            

            const hash = await bcrypt.hash(password, saltRounds)

            const sql = "insert into users (email, password, first_name, last_name, con_num, user_name) values (?, ?, ?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [email, hash, first_name, last_name, con_num, user_name])

            if (rows.affectedRows) {
                return res.json({ message: "Ok" })
            } else {
                return res.json({ error: "Error" })
            }
            
        } catch (error) {
            console.log(error)
            res.json({
                error: error.message
            })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const [user, ] = await pool.query("select * from users where email = ?", [email])
            if (!user[0]) return res.json({ error: "Invalid email!" })
            
            const { password: hash, id, user_name } = user[0]

            const check = await bcrypt.compare(password, hash)

            if (check) {
                const accessToken = jwt.sign({ email: email }, secret, { expiresIn: '1h' });
                return res.json({ 
                    accessToken,
                    data: { 
                        userId: id,
                        user_name,
                        email: email
                    }
                 })

            }

            return res.json({ error: "Wrong password!" })
            
        } catch (error) {
            console.log(error)
            res.json({
                error: error.message
            })
        }
    },
    tokenCheck: async (req, res) =>{
        try{
            const {token} = req.headers;
            jwt.verify(token, secret, (err, decode) => {
                if(err){
                    return res.json({error: err.message})
                }
                
                const { email } = decode
                res.json({ message: 'Protected resource', email})
            })
            

        } catch (error){
            console.log(error)
            res.json({
                error: error.message
            })
        }
    }
}

module.exports = authController
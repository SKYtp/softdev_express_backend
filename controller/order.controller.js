const pool = require("../database/index")
const multer = require('multer');
const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage });
const fs = require('fs'); // Import the fs module

const orderController = {
    showOrder: async (req, res) => {
        try {
            let query = 'SELECT id, image, order_name, price FROM sellorder'
            query += ` WHERE status = 'sell'`
            if(req.query.search){
                query += ` AND order_name LIKE '%${req.query.search}%'`
            }
        
            if (req.query.skinNumGreaterThan) {
                const skinNumGreaterThan = parseInt(req.query.skinNumGreaterThan);
                //isNaN check if not number ex. 12 = false, hello = true
                if (!isNaN(skinNumGreaterThan)) {
                    query += ` AND skin_num > ${skinNumGreaterThan}`;
                }
            }
            if(req.query.skinBetween){
                const skinBetween = req.query.skinBetween.split(",");
                if(!isNaN(skinBetween[0]) && !isNaN(skinBetween[1])){
                    query += ` AND skin_num BETWEEN ${skinBetween[0]} AND ${skinBetween[1]}`
                }
            }
            if(req.query.heroNumGreaterThan){
                const heroNumGreaterThan = parseInt(req.query.heroNumGreaterThan);
                if(!isNaN(heroNumGreaterThan)){
                    query += ` AND hero_num > ${heroNumGreaterThan}`;
                }
            }
        
            if(req.query.heroBetween){
                const heroBetween = req.query.heroBetween.split(",");
                if(!isNaN(heroBetween[0]) && !isNaN(heroBetween[1])){
                    query += ` AND hero_num BETWEEN ${heroBetween[0]} AND ${heroBetween[1]}`
                }
            }
        
            if(req.query.rank){
                const rank = req.query.rank.split(",");
                query += ` AND (`;
                for(let i in rank){
                    if(i == 0){
                        query += `rank='${rank[i]}'`;
                    }
                    else{
                        query += ` OR rank='${rank[i]}'`;
                    }
                }
                query += `)`;
            }
        
            if(req.query.priceGreaterThan){
                const priceGreaterThan = parseInt(req.query.priceGreaterThan);
                if(!isNaN(priceGreaterThan)){
                    query += ` AND price > ${priceGreaterThan}`;
                }
            }
        
            if(req.query.priceBetween){
                const priceBetween = req.query.priceBetween.split(",");
                if(!isNaN(priceBetween[0]) && !isNaN(priceBetween[1])){
                    query += ` AND price BETWEEN ${priceBetween[0]} AND ${priceBetween[1]}`
                }
            }
        
            if (req.query.orderBy) {
                const orderBy = req.query.orderBy;
                //query += ` ORDER BY ${orderBy}`;
                if(req.query.orderBy == "ASC"){
                    query += ` ORDER BY price ASC`;
                }
                else if(req.query.orderBy == "DESC"){
                    query += ` ORDER BY price DESC`;
                }
            }
            const [rows, fields] = await pool.query(query)
            const ordersWithImages = rows.map((order) => {
                const imagePath = order.image
                const imageData = fs.readFileSync(imagePath, 'base64');
                return{
                    ...order,
                    image: `data:image/jpeg;base64,${imageData}`, // Adjust the content type based on your image type
                }
            })
            res.json({ status: 'ok', orders: ordersWithImages })

        } catch (error) {
            console.log(error)
            res.json({
                error: error.message
            })
        }
    },
    getOrderByID : async (req, res) => {
        try{
            let query = 'SELECT * FROM sellorder'
            query += ` WHERE id=${req.params['id']}`
            const [rows, fields] = await pool.query(query)
            const ordersWithImages = rows.map((order) => {
                const imagePath = order.image
                const imageData = fs.readFileSync(imagePath, 'base64');
                return{
                    ...order,
                    image: `data:image/jpeg;base64,${imageData}`, // Adjust the content type based on your image type
                }
            })
            res.json({ status: 'ok', orders: ordersWithImages })


        } catch (error) {
            console.log(error)
            res.json({
                error: error.message
            })
        }
    }
}

module.exports = orderController
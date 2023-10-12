const pool = require("../database/index")
const multer = require('multer');
const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage });
const fs = require('fs'); // Import the fs module

const boostController = {
    showBoost : async (req, res) => {
        try{
            let query = 'SELECT boosterID, winrate, tier, max_tier, star_price, booster_email, promote_pic FROM boosterdetail'
            query += ` WHERE status BETWEEN 0 AND 2`
            if(req.query.winrateGreaterThan){
                const winrateGreaterThan = parseInt(req.query.winrateGreaterThan);
                //isNaN check if not number ex. 12 = false, hello = true
                if (!isNaN(winrateGreaterThan)) {
                    query += ` AND winrate > ${winrateGreaterThan}`;
                }
            }

            if(req.query.winrateBetween){
                const winrateBetween = req.query.winrateBetween.split(",");
                if(!isNaN(winrateBetween[0]) && !isNaN(winrateBetween[1])){
                    query += ` AND winrate BETWEEN ${winrateBetween[0]} AND ${winrateBetween[1]}`
                }
            }

            if(req.query.star_priceGreaterThan){
                const star_priceGreaterThan = parseInt(req.query.star_priceGreaterThan);
                if(!isNaN(star_priceGreaterThan)){
                    query += ` AND star_price > ${star_priceGreaterThan}`;
                }
            }

            if(req.query.star_priceBetween){
                const star_priceBetween = req.query.star_priceBetween.split(",");
                if(!isNaN(star_priceBetween[0]) && !isNaN(star_priceBetween[1])){
                    query += ` AND star_price BETWEEN ${star_priceBetween[0]} AND ${star_priceBetween[1]}`
                }
            }

            if(req.query.rank){
                const rank = req.query.rank.split(",");
                query += ` AND (`;
                for(let i in rank){
                    if(i == 0){
                        query += `tier='${rank[i]}'`;
                    }
                    else{
                        query += ` OR tier='${rank[i]}'`;
                    }
                }
                query += `)`;
            }
            if (req.query.orderBy) {
                const orderBy = req.query.orderBy;
                if(req.query.orderBy == "ASC"){
                    query += ` ORDER BY star_price ASC`;
                }
                else if(req.query.orderBy == "DESC"){
                    query += ` ORDER BY star_price DESC`;
                }
            }
            const [rows, fields] = await pool.query(query)
            const boostWithImages = rows.map((boost) => {
                const imagePath = boost.promote_pic
                const imageData = fs.readFileSync(imagePath, 'base64')
                return{
                    ...boost,
                    promote_pic: `data:image/jpeg;base64,${imageData}`, // Adjust the content type based on your image type
                }
            })
            res.json({status: 'ok', boosts: boostWithImages})

        }catch (error) {
            console.log(error)
            res.json({
                error: error.message
            })
        }
    },
    getBoostByID : async (req, res) => {
        try{
            let query = 'SELECT uid, booster_email, tier, star_price, max_tier, winrate, promote_pic, Boosting_number FROM boosterdetail'
            query += ` WHERE boosterID=${req.params['id']}`
            const [rows, fields] = await pool.query(query)

            let query_user = 'SELECT user_name, con_num, first_name, last_name, review_score From users'
            query_user += ` WHERE uid=${rows[0].uid}`
            const [user_row] = await pool.query(query_user)

            const boostWithImages = rows.map((boost) => {
                const imagePath = boost.promote_pic
                const imageData = fs.readFileSync(imagePath, 'base64')
                return{
                    ...boost,
                    promote_pic: `data:image/jpeg;base64,${imageData}`, // Adjust the content type based on your image type
                }
            })
            res.json({status: 'ok', user: user_row[0], boosts: boostWithImages[0]})
            
        } catch (error) {
            console.log(error)
            res.json({
                error: error.message
            })
        }
    }
}

module.exports = boostController
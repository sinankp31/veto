
export const  parsePriceToJson = async (req, res, next) => {
    try {
        if (req.body.price) {
            const parsed = typeof req.body.price === 'string' 
                ? await JSON.parse(req.body.price) 
                : req.body.price;

            req.body.price = {
                amount: Number(parsed.amount),
                currency: parsed.currency || "INR"
            };
        }
        next();
    } catch (error) {
        return res.status(400).json({ error: "Invalid JSON structure provided for price." });
    }
};


export const parseSizesToJson = async (req, res, next) => {
    try {
        if (req.body.sizes) {
            const parsed = typeof req.body.sizes === 'string' 
                ? await JSON.parse(req.body.sizes) 
                : req.body.sizes;

            if (Array.isArray(parsed)) {
                req.body.sizes = parsed.map(item => ({
                    size: String(item.size).toUpperCase().trim(), 
                    stock: Number(item.stock || 0)
                }));
            }
        }
        next();
    } catch (error) {
        return res.status(400).json({ error: "Invalid JSON structure provided for sizes." });
    }
};

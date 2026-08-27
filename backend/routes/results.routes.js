router.get("/all", protect, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                pc.entry_code,
                m.firtst_name,
                m.last_name,
                pc.week,
                pc.monday_total_points,
                cp.picks,
            FROM pick_cards pc
            JOIN members m ON m.id = pc.member_id
            JOIN card_picks cp ON cp.card_id = pc.id
            ORDER BY pc.week, pc.id
        `);

        res.json(result.rows);
    } catch (err) {
        console.error("🔥 ERROR FETCHING PICKS:", err);
        res.status(500).jsone({ error: "Unable to fetch picks" });
    }
});
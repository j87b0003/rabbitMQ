const mysql = require("mysql2")

module.exports = database = {
    conn: () => {
        const conn = mysql.createConnection(process.env.MYSQL)
        conn.connect()

        return conn
    },
    init: () => {
        database.conn().query('CREATE TABLE IF NOT EXISTS fcm_job ( \
            id INT NOT NULL AUTO_INCREMENT, \
            data JSON, \
            PRIMARY KEY(id) \
          );')
    },
    put: async (data) => {
        return await database.conn().promise().query(
            'INSERT INTO fcm_job (data) \
                VALUES \
                (?);',
            [JSON.stringify(data)]
        )
    },
    list: async () => {
        const [rows] = await database.conn().promise().query(
            'SELECT data FROM `fcm_job` ORDER BY `id` DESC LIMIT 10;', []
        )

        return rows
    }
}

const fs = require('fs')

exports.addCmd = function(command, duit, _db){
    let position = false
    Object.keys(_db).forEach((i) => {
        if (_db[i].id === command) {
            position = i
        }
    })
    if (position !== false) {
        _db[position].total += duit
        fs.writeFileSync('./system/database/dashboard.json', JSON.stringify(_db))
    } else {
        const bulin = ({
            id: command,
            total: duit
                })
        _db.push(bulin)
        fs.writeFileSync('./system/database/dashboard.json', JSON.stringify(_db))
    }
}

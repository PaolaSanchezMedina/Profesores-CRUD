const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express()
app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next()
})

app.use(bodyParser.json())

const PUERTO = 3000

const conexion = mysql.createConnection(
    {
        host: 'localhost',
        database: 'profesoresweb',
        user: 'root',
        password: ''
    }
)

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto ${PUERTO}`);
})

conexion.connect(error => {
    if (error) throw error
    console.log('Conexión exitosa a la base de datos');
})

app.get('/', (req, res) => {
    res.send('API')
})

//Obtener todos los profesores
app.get('/profesor', (req, res) => {
    const query = `SELECT * FROM profesores;`
    conexion.query(query, (error, resultado) => {
        if (error) return console.error(error.message)

        if (resultado.length > 0) {
            res.json(resultado)
        } else {
            res.json(`No hay registros`)
        }
    })
})

//Obtener un profesor
app.get('/profesor/:id', (req, res) => {
    const { id } = req.params

    const query = `SELECT * FROM profesores WHERE id=${id};`
    conexion.query(query, (error, resultado) => {
        if (error) return console.error(error.message)

        if (resultado.length > 0) {
            res.json(resultado)
        } else {
            res.json(`No hay registro con ese id`)
        }
    })
})

//Agregar un profesor
app.post('/profesor/agregar', (req, res) => {
    const profesor = {
        num_empleado: req.body.num_empleado,
        nombre: req.body.nombre,
        primer_apellido: req.body.primer_apellido,
        segundo_apellido: req.body.segundo_apellido,
        fecha_nacimiento: req.body.fecha_nacimiento,
        num_materias: req.body.num_materias,
        hora_inicio: req.body.hora_inicio,
        hora_final: req.body.hora_final,
        tipo_horario: req.body.tipo_horario
    }

    const query = `INSERT INTO profesores SET ?`
    conexion.query(query, profesor, (error) => {
        if (error) return console.error(error.message)

        res.json(`Profesor agregado correctamente`)
    })
})

//Actualizar un profesor
app.put('/profesor/actualizar/:id', (req, res) => {
    const { id } = req.params
    const { num_empleado, nombre, primer_apellido, segundo_apellido, fecha_nacimiento, num_materias, hora_inicio, hora_final, tipo_horario } = req.body

    const query = `UPDATE profesores SET num_empleado='${num_empleado}', nombre='${nombre}', primer_apellido='${primer_apellido}', segundo_apellido='${segundo_apellido}', fecha_nacimiento='${fecha_nacimiento}', num_materias='${num_materias}', hora_inicio='${hora_inicio}', hora_final='${hora_final}', tipo_horario='${tipo_horario}' WHERE id='${id}';`
    conexion.query(query, (error) => {
        if (error) return console.error(error.message)

        res.json(`Profesor actualizado correctamente`)
    })
})

//Eliminar un profesor
app.delete('/profesor/borrar/:id', (req, res) => {
    const { id } = req.params

    const query = `DELETE FROM profesores WHERE id=${id};`
    conexion.query(query, (error) => {
        if (error) console.error(error.message)

        res.json(`Profesor eliminado correctamente`)
    })
})


//Materias
//Obtener todos las materias
app.get('/materia', (req, res) => {
    const query = `SELECT * FROM materias;`
    conexion.query(query, (error, resultado) => {
        if (error) return console.error(error.message)

        if (resultado.length > 0) {
            res.json(resultado)
        } else {
            res.json(`No hay registros`)
        }
    })
})

//Obtener una materia
app.get('/materia/:id', (req, res) => {
    const { id } = req.params

    const query = `SELECT * FROM materias WHERE id=${id};`
    conexion.query(query, (error, resultado) => {
        if (error) return console.error(error.message)

        if (resultado.length > 0) {
            res.json(resultado)
        } else {
            res.json(`No hay registro con ese id`)
        }
    })
})

//Agregar una materia
app.post('/materia/agregar', (req, res) => {
    const profesor = {
        clave: req.body.clave,
        descripcion: req.body.descripcion,
        creditos: req.body.creditos,
        reticula: req.body.reticula,
        hi: req.body.hi,
        hf: req.body.hf
    }

    const query = `INSERT INTO materias SET ?`
    conexion.query(query, profesor, (error) => {
        if (error) return console.error(error.message)

        res.json(`Materia agregada correctamente`)
    })
})

//Actualizar una materia
app.put('/materia/actualizar/:id', (req, res) => {
    const { id } = req.params
    const { clave, descripcion, creditos, reticula, hi, hf } = req.body

    const query = `UPDATE materias SET clave='${clave}', descripcion='${descripcion}', creditos='${creditos}', reticula='${reticula}', hi='${hi}', hf='${hf}' WHERE id='${id}';`
    conexion.query(query, (error) => {
        if (error) return console.error(error.message)

        res.json(`Materia actualizada correctamente`)
    })
})

//Eliminar una materia
app.delete('/materia/borrar/:id', (req, res) => {
    const { id } = req.params

    const query = `DELETE FROM materias WHERE id=${id};`
    conexion.query(query, (error) => {
        if (error) console.error(error.message)

        res.json(`Materia eliminada correctamente`)
    })
})

//Horarios de profesores
app.get('/horario', (req, res) => {
    const query = `
    SELECT CONCAT(p.nombre, ' ', p.primer_apellido, ' ', p.segundo_apellido) AS profesor, 
    m.descripcion AS materia, m.hi AS HoraInicio, m.hf AS HoraFinal
    FROM profesor_materia pm
    INNER JOIN profesores p ON pm.idProfesor = p.id
    INNER JOIN materias m ON pm.idMateria = m.id
    ORDER BY profesor ASC;
  `;
    conexion.query(query, (error, resultado) => {
        if (error) return console.error(error.message);

        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.json([]);
        }
    });
});

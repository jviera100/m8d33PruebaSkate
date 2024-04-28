// consultaSQL.js
import pool from "../models/config/db.js";

const addSkaterQuery = async (skater) => {
    try {
        const values = Object.values(skater);
        const consultaSkater = {
            text: `insert into skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) values($1,$2,$3,$4,$5,$6,'f') returning * `,
            values: values,
        };

        const result = await pool.query(consultaSkater);
        console.log(result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al agregar skater:', error);
        throw error;
    }
};

const getSkatersQuery = async () => {
    try {
        const consultaGetSkater = {
            text: `select * from skaters`,
        };
        const result = await pool.query(consultaGetSkater);
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener skaters:', error);
        throw error;
    }
};

const getSkaterByIdQuery = async (id) => {
    try {
        const getSkaterById = {
            text: 'SELECT * FROM skaters WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(getSkaterById);
        return result.rows[0];
    } catch (error) {
        console.error('Error al obtener skater por ID:', error);
        throw error;
    }
};


export { addSkaterQuery, getSkatersQuery, getSkaterByIdQuery };

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

const getSkaterByEmailQuery = async (email) => {
    try {
        const getSkaterByEmail = {
            text: 'SELECT * FROM skaters WHERE email = $1',
            values: [email],
        };

        const result = await pool.query(getSkaterByEmail);
        return result.rows[0];
    } catch (error) {
        console.error('Error al obtener skater por correo electrónico:', error);
        throw error;
    }
};
const updateSkaterByEmailQuery = async (email, updatedFields) => {
    try {
        const entries = Object.entries(updatedFields);
        const sets = entries.map(([key, value], index) => `${key} = $${index + 2}`).join(', ');
        const values = [email, ...Object.values(updatedFields)];

        const consultaUpdateSkater = {
            text: `UPDATE skaters SET ${sets} WHERE email = $1`,
            values: values
        };
        await pool.query(consultaUpdateSkater);
    } catch (error) {
        throw new Error('Error al actualizar el skater por correo electrónico: ' + error.message);
    }
};

const deleteSkaterByEmailQuery = async (email) => {
    try {
        const consultaDeleteSkater = {
            text: 'DELETE FROM skaters WHERE email = $1',
            values: [email]
        };
        await pool.query(consultaDeleteSkater);
    } catch (error) {
        throw new Error('Error al eliminar el skater por correo electrónico: ' + error.message);
    }
};

export { addSkaterQuery, getSkatersQuery, getSkaterByEmailQuery, updateSkaterByEmailQuery, deleteSkaterByEmailQuery };


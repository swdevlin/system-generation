/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('solar_system', table => {
    table.increments('id').primary();
    table.string('x').notNullable();
    table.string('y').notNullable();
    table.text('name');
    table.integer('scan_points');
    table.integer('survey_index');
    table.integer('sector_id').notNullable().unsigned().references('id').inTable('sector').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('solar_system');
};

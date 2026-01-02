/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('sector', table => {
    table.increments('id').primary();
    table.string('x').notNullable();
    table.string('y').notNullable();
    table.text('name');
    table.text('abbreviation');
  });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('sector');
};

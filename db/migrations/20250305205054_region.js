/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('region', table => {
    table.increments('id').primary();
    table.string('name');
    table.string('colour').notNullable();
    table.integer('label_x');
    table.integer('label_y');
    table.jsonb('hexes');
  });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('region');

};

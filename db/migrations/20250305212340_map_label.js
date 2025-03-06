/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('label', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('colour');
    table.integer('x');
    table.integer('y');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('label');
};

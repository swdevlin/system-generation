/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('solar_system', table => {
    table.jsonb('stars'); // Adds the stars column with jsonb type
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('solar_system', table => {
    table.dropColumn('stars'); // Removes the stars column if rolled back
  });
};

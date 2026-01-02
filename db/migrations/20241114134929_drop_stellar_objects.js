/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('solar_system', table => {
    table.dropColumn('stellar_objects'); // Removes the stellar_objects column
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('solar_system', table => {
    table.jsonb('stellar_objects'); // Adds the stellar_objects column back if rolled back
  });
};

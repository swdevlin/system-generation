/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('solar_system', table => {
    table.integer('x').alter();    // Alter x to integer
    table.integer('y').alter();    // Alter y to integer
    table.unique(['sector_id', 'x', 'y']);      // Re-add the unique constraint on (x, y) after type change
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('solar_system', table => {
    table.dropUnique(['sector_id', 'x', 'y']);  // Drop the unique constraint for rollback
    table.string('x', 2).alter();  // Change x back to string
    table.string('y', 2).alter();  // Change y back to string
  });
};

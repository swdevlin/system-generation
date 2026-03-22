# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Traveller RPG sector generator that creates solar systems using rules from Mongoose Publishing's World Builder's Handbook. Originally built for the Deepnight Revelation campaign.

## Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm run coverage

# Generate a single sector
node generate.js -s sectors/SectorName.yaml -o output

# Run REST API service (port 3007)
node generator-service.js

# Batch generate multiple sectors
node generate-new.js
```

## Architecture

### Entry Points
- `generate.js` - CLI for single sector generation
- `generate-new.js` - Batch processor for multiple sectors from `./sectors/`
- `generator-service.js` - Express REST API on port 3007

### Generation Pipeline
The sector generation flow in `sector/generateSector.js`:
1. Iterate through 16 subsectors (A-P), each an 8x10 hex grid
2. For each occupied hex, generate a solar system:
   - `stars/` - Generate stellar objects (primary, companions)
   - `gasGiants/` - Generate gas giants
   - `planetoidBelts/` - Generate asteroid belts
   - `terrestrialPlanet/` - Generate terrestrial worlds
   - `moons/assignMoons.js` - Add moons to planets
   - `atmosphere/assignAtmosphere.js` - Calculate atmospheric composition
   - `utils/` - Habitability, resources, biodiversity calculations

### Key Classes
- `SolarSystem` - Orchestrates all bodies, orbit assignment, moon distribution
- `Star` / `StellarClassification` - Stellar object generation
- `TerrestrialPlanet` - Worlds with atmosphere, population, tech level
- `GasGiant` / `PlanetoidBelt` - Other orbital bodies

### Output Formats
Generation produces CSV, JSON, XML, SVG maps, and HTML. Output goes to `output/<SectorName>/`.

### Database
PostgreSQL via Knex.js. Connection configured in `db/knexfile.js` using `DB_ENV` environment variable. Tables: `sector`, `solar_system`, `region`, `route`.

### REST API Routes
- `/gas_giant` - Generate gas giants
- `/planetoid_belt` - Generate belts
- `/star_system` - Generate complete systems
- `/subsector` - Generate subsectors

## Sector Definition Format

YAML files in `./sectors/`:
```yaml
name: SectorName
abbreviation: SEC
X: -19              # Galactic X coordinate
Y: -7               # Galactic Y coordinate
defaultSI: 3        # Default survey index
subsectors:
  - name: SubsectorName
    type: MODERATE  # DENSE/STANDARD/MODERATE/LOW/SPARSE/MINIMAL/RIFT
    index: A        # A through P
```

## Environment Variables (.env)

- `nativeSophontChance` - Probability of native species (default 0.10)
- `extinctSophontChance` - Probability species is extinct (default 0.8)
- `maxNativeSophontTechLevel` - Tech level cap for natives (default 10)
- `noCaptiveGovernment` - Governance rule flag
- `DB_ENV` - Database environment: `dev` or `production`

## Algorithm Notes

Changes from World Builder's Handbook (documented in README.md):
- Belt orbit calculation modified to prevent placing objects on wrong side of planets
- Trojan orbit assignment happens after all other planet generation

## JavaScript style preferences

- Prefer **classes** over plain objects / factory functions for domain models and generators.
- Use `class` with clear instance methods (e.g., `generate()`, `applyDM()`, `textDump()`), and keep state on `this`.
- Prefer `static` methods/constants on classes instead of standalone helper constants when they belong to the type.
- Use `extends` for shared behaviour (base classes), and keep helpers as pure functions only when they are genuinely generic.
- Export classes directly (`module.exports = { Planet, Atmosphere, GasMixTable }`).
- When unsure, choose a class-based design.
- Avoid exporting bags of functions unless they are stateless utilities.
- Put classes in their own files.
- Use `const` for all constants.
- Use `let` for mutable variables.
- Use `camelCase` for variable names.
- Use `PascalCase` for class names.
- Use `camelCase` for function names.

Example:

```js
class GasMixTable {
  constructor(name, key) {
    this.name = name;
    this.key = key;
  }

  roll(planet) {
    // ...
  }
}

module.exports = { GasMixTable };
```


##  System Flexibility

- Eventually, different Traveller rulesets will be supported. Where it makes sense, don't have the object generate itself. Instead, have a generator class that creates the object. For example GasGiantGenerator or GasGiantCreator or some such.

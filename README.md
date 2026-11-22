# System Generator

This project automates building solar systems using
[Mongoose Publishing's](https://www.mongoosepublishing.com/)
[World Builder's Handbook](https://www.mongoosepublishing.com/products/world-builders-handbook).

This project was created to support a
[Deepnight Revelation](https://www.mongoosepublishing.com/products/deepnight-revelation-core-set) 
campaign. While it skews towards an exploration campaign, it can
be used to generate system details in charted space.

# Changes from book

Orbits for planetoid belt significant objects would occasionally place them on
the other side of planets. The algorithm was changed to use

`belt orbit# + star spread * ((2D-7)* belt span) / 4`

If the offset is greater than the star's spread, then the calculation is done
again.

Trojan orbits for anomalous planets are determined after all other planets
are generated. The system randomly selects an existing planet and places
the trojan planet in the same orbit. 

Starport docking capacity (highport/downport total capacity, internal bay
capacity, shipyard build capability) follows the World Builder's Handbook
formulas, with two simplifications where the book leaves the result up to
the Referee or gives no numeric formula:
- When a world has a highport, its downport capacity defaults to 1D x 10% of
  the highport's capacity, rather than the book's alternative of manually
  splitting the capacity between the two.
- Shipyard build capability is stored as a qualitative category
  (`starships`/`spacecraft`/`smallCraft`/`none`) rather than a tonnage
  figure, since the book doesn't give a build-capacity formula.

### Far Future Enterprises license

The Traveller game in all forms is owned by Far Future Enterprises. Copyright 1977 - 2023 Far Future Enterprises.
Traveller is a registered trademark of Far Future Enterprises. Far Future permits websites and fanzines for this game,
provided it contains this notice, that Far Future is notified, and subject to a withdrawal of permission on 90 days notice.

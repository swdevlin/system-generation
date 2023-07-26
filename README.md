# System Generator

This project automates building solar systems using
[Mongoose Publishing's](https://www.mongoosepublishing.com/)
[World Builder's Handbook](https://www.mongoosepublishing.com/products/world-builders-handbook).

This project was created to support a
[Deepnight Revelation](https://www.mongoosepublishing.com/products/deepnight-revelation-core-set) 
campaign. As such, no effort has been made to support building systems in
charted space.

# Changes from book

Orbits for planetoid belt significant objects would occasionally place them on
the other side of planets. The algorithm was changed to use

`belt orbit# + star spread * ((2D-7)* belt span) / 4`

If the offset is greater than the star's spread, then the calculation is done
again.


### Far Future Enterprises license

The Traveller game in all forms is owned by Far Future Enterprises. Copyright 1977 - 2023 Far Future Enterprises.
Traveller is a registered trademark of Far Future Enterprises. Far Future permits websites and fanzines for this game,
provided it contains this notice, that Far Future is notified, and subject to a withdrawal of permission on 90 days notice.

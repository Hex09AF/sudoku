# Competitive sudoku app

Authentication / Authorization

- Login page [ ]
- Register contact admin [ ]

Homepage:

- Boardgame with simple bot [ ]
- List room [ ]

Solo:

- Two player join

Room:

- Board
- Game status (READY, START, FINISH)

User in Room:

- Role (PLAYER, VIEWER)

Board:

- Game Moves
- Solve board

Game Moves: A game contain moves of two players

- UserId
- Score
- User moves

User moves:

- x, y, value


In TypeScript, both types and interfaces serve similar purposes but have some differences in their features and syntax. Here are some general guidelines on when to use types and when to use interfaces:

Use types when:

You need to create a union or intersection type. Types allow you to combine multiple types into a single type using the | (union) or & (intersection) operators.

You need to create a type that is a primitive type or a combination of primitive types. Types can define any valid JavaScript primitive type such as number, string, boolean, null, undefined, or symbol.

You need to create a type that is a literal type. Types can define literal values such as true, false, 0, "hello", or null.

You need to create a type that is a tuple type. Types can define fixed-length arrays with specific element types.

You need to create a type that includes optional properties. Types can define optional properties using the ? operator.

Use interfaces when:

You need to describe the shape of an object. Interfaces are used to define object types with specific properties and their types.

You need to extend an existing interface to add additional properties or methods. Interfaces can be extended with the extends keyword.

You need to define an interface for a class. Interfaces can define the public API of a class and enforce that classes implementing the interface must provide specific methods or properties.

You need to define an index signature for an object. Interfaces can define an index signature to allow objects to have dynamic properties with a specific type.

You need to use an interface in a third-party library or framework that expects it.

It's important to note that these guidelines are not hard and fast rules and there can be overlap between when to use types and interfaces. Ultimately, the decision of whether to use a type or an interface depends on the specific use case and personal preference.

# Research caching with redis

[x] https://redis.com/blog/how-to-build-an-app-that-allows-you-to-build-real-time-multiplayer-games-using-redis/
[x] https://redis.com/blog/how-to-create-a-real-time-online-multi-player-strategy-game-using-redis/
[ ] https://www.codementor.io/@dominicscanlan/build-an-online-multiplayer-game-with-socket-io-redis-angularjs-vgwdx0y8t
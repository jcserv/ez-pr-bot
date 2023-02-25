> /ezpr-help ezpr-choose

_usage_:

`/ezpr-choose [@role/@mention]`

`/ezpr-choose [number] [@role/@mention]`

`/ezpr-choose [number] [@role/@mention] --exclude [@role/@mention]`

_description_: Choose N users randomly from the provided role/mentions.

_options_:

    [--exclude]

_arguments_:

    [number] integer
    The amount of persons to choose. Defaults to 1.

    [@role/@mention] @string *required*
    The role or persons to include/exclude in choosing
    	ex. @ez-pr-devs

_example usage_:

    *input:* /ezpr-choose @ez-pr-devs

    *output:*

    *rolls dice* -> "Rolled a X, @person has been chosen!"

    *spins wheel* -> "It stopped on @person, you have been chosen!"

    *hands out straws* -> "X drew the short straw, you have been chosen!"

    *chooses a card* -> "@person, is this your card? You have been chosen."

    *reads crystal ball* -> "My heavens, @person is the chosen one!"

    *flips coin* -> "It's [heads/tails]! @person has been chosen."

    *races ducks* -> "And they're off!" -> "X is hot out the gates" -> "but what's that? Y is gaining slowly, edging them out and taking the lead" -> "It's gonna be a photo finish between X, Y, Z" -> "Golly! @person with the stunning comeback to win it all!"

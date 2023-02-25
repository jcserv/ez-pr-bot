> /ezpr-help ezpr-choose

_usage_:

`/ezpr-choose [@role/@mention]...`

`/ezpr-choose [@role/@mention]... --n [number]`

`/ezpr-choose [number] [@role/@mention]... --exclude [@role/@mention]...`

_description_: Choose N users randomly from the provided role/mentions.

_options_:

    [--exclude]

_arguments_:

    [@role/@mention] @string *required*
    The role or persons to include/exclude in choosing
    	ex. @ez-pr-devs

    [number] integer
    The amount of persons to choose. Defaults to 1.

_example usage_:

    *input:* /ezpr-choose @ez-pr-devs

    *output:* Returns a message indicating who was chosen.

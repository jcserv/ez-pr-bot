This document serves as a record of design choices we've made and why.
These are not set in stone, but will most likely require a substantial amount of work to change.

1. There are no restrictions on state transitions. This is because team members may forget to react and we don't have control over the source of truth (Github/Gitlab/Bitbucket), thus statistics are calculated on a best-effort basis.
2. Links can be used in place of PR IDs, for ease of use.

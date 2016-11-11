#csv-manipulation-tool
A CSV-manipulation tool developed at **Ellar Development** for managing e-mail lists for our web-game [Nordicmafia](http://nordicmafia.org).

This tool is probably not compatible with most CSV-lists, and are primarly a tool for merging and subtracting emails from CSV's. 

The tool works by taking a csv-document ("**source**") and another one ("**input**") and compare them to eachother (performing adjustments). 

The source-document should only consist of one field, with header title "*email*".

*Please read the code for better understanding.*

##Installation
`npm install csv-manipulation-tool`

##Options (flags)
| Flag         | Short | Description     | Default value  |
| ------------| -----|---------------| ------|
| --source     | --s | Source-CSV file | null (required) |
| --input      | --i | Input-CSV file | null (required) |
| --output     | --o | Output-CSV file | null (required) |
| --target     | --t | Input-CSV target header title | "email" |
| --action     | --a | Action to perform. (join, subtract) | "join" |
| *--avoid_lowercase*      | *None* | If present, prevents lowercase preparation | Not present, only include to disable lowercase |


##Contribution
Just create a fork and make adjustments. If you think your edits bring additional value, then please consider creating a *pull request*.

##License
Licensed under *Apache-2.0*. See `LICENSE`

Copyright Ellar Development AS

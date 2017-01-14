#!/bin/sh

# Author: AkimotoAkari (AkirisWu) 2017
# Arguments: $1: input file, $2: output path (abs. path)

uglifyjs -o "$2" -c -m "$1"
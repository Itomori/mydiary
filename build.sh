#!/bin/bash

# Author: AkimotoAkari (Akiris Wu) 2017

# Origin: http://blog.csdn.net/xiuzhentianting/article/details/53364078
getabspathoffile(){
	echo $(cd `dirname $0`; pwd)
}
getname(){
	echo "${1%.*}"
}
getextname(){
	echo "${1##*.}"
}
getrelpath(){
	# $1: base, $2: target
	echo ${2:${#1}+1}
}
contains(){
	return `[[ "$1" == *"$2"* ]]`;
}
addattr(){
	dirabs=`getabspathoffile "$1"`
	filename=`getname "$1"`
	fileext=`getextname "$1"`
	echo "$dirabs/$filename.$2.$fileext"
}
_proc(){
	# $1: file hint, $2: dir, $3: preprocessor type
	echo -e "\033[32m[ 1/10] Compressing $1...\033[0m"
	echo ""
	foreachd "$base/$2" "$output/$2" "$3" 0
}

foreachd(){
	# $1: basepath, $2: output dir (w/ type suffix), 
	# $3: processor type, $4: recursive, 0: yes
	# NOTE: all paths SHOULD NOT end with /.
	for filepath in ${1}/*; do
		if [ ! -d "$filepath" ]; then
			# Arguments gotten in processor:
			# $1: path to file, $2: output file (w/ type suffix), 
			# $3: filename

			filename=`basename "$filepath"`
			relpath=`getrelpath ${base} ${filepath}`
			outfile="$2/$filename"
			outfile=`addattr "$outfile" "min"`

			#first check if dirs exist.
			if [ ! -d `dirname "$outfile"` ]; then
				mkdir -p `dirname "$outfile"`
			fi

			if contains "$filename" ".min." ; then
				# minified file, do not process them.
				if ! cp "$filepath" "$2/`basename "$filepath"`" ; then
					echo -e "\033[31mError occurred while copying file: \033[0m$filepath"
					return 1
				fi
				echo 
			else
				# Arguments: $1: input file, $2: output file path (abs. path)
				echo -e "\t$relpath"
				echo -e "\t" "./build-scripts/proc-$3.sh" "$filepath" "$outfile"
				if ! "./build-scripts/proc-$3.sh" "$filepath" "$outfile"; then
					echo -e "\033[31mError occurred while processing file: \033[0m$filepath"
					return 1
				fi
			fi
		else
			if [ "$4" ]; then
				foreachd "$filepath" "$2/`getrelpath "$1" "$filepath"`" "$3" "$4"
			fi
		fi
	done
}

# MAIN ENTRY IS HERE
base=`dirname $0`
output="$base/build"

echo -e "\033[35m\x20\x5f\x5f\x20\x20\x5f\x5f\x20\x20\x20\x20\x20\x20\x20\x5f\x5f\x5f\x5f\x20\x20\x5f\x0a\x7c\x20\x20\x5c\x2f\x20\x20\x7c\x5f\x20\x20\x20\x5f\x7c\x20\x20\x5f\x20\x5c\x28\x5f\x29\x20\x5f\x5f\x20\x5f\x20\x5f\x20\x5f\x5f\x20\x5f\x20\x20\x20\x5f\x0a\x7c\x20\x7c\x5c\x2f\x7c\x20\x7c\x20\x7c\x20\x7c\x20\x7c\x20\x7c\x20\x7c\x20\x7c\x20\x7c\x2f\x20\x5f\x60\x20\x7c\x20\x27\x5f\x5f\x7c\x20\x7c\x20\x7c\x20\x7c\x0a\x7c\x20\x7c\x20\x20\x7c\x20\x7c\x20\x7c\x5f\x7c\x20\x7c\x20\x7c\x5f\x7c\x20\x7c\x20\x7c\x20\x28\x5f\x7c\x20\x7c\x20\x7c\x20\x20\x7c\x20\x7c\x5f\x7c\x20\x7c\x0a\x7c\x5f\x7c\x20\x20\x7c\x5f\x7c\x5c\x5f\x5f\x2c\x20\x7c\x5f\x5f\x5f\x5f\x2f\x7c\x5f\x7c\x5c\x5f\x5f\x2c\x5f\x7c\x5f\x7c\x20\x20\x20\x5c\x5f\x5f\x2c\x20\x7c\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x7c\x5f\x5f\x5f\x2f\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x7c\x5f\x5f\x5f\x2f\033[37m\tMyDiary Prebuilder\033[0m\n"
_proc "CSS files" "css" "css" 1 3
_proc "JavaScript files" "js" "js" 2 3
_proc "inc JavaScript files" "inc" "js" 3 3

echo -e "\n\033[32mDone, have fun!\033[0m"
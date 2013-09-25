#!/usr/bin/env sh
# ======================================================================
# Pack a chrome extension into a zip archive
# ======================================================================

set -e

# ======================================================================
# Function definitions
# ======================================================================

usage () {
    cat 1>&2 <<EOF
COMMON USAGE
    Simply run \`pack.sh .' in the extension directory which contains
    \`exclude.lst' (see below.)

SYNOPSIS
    pack.sh [-h] [-x <file>] <extension-directory>

DESCRIPTION
    Pack.sh packs a chrome extension into a zip archive, which can be
    uploaded to the Chrome Web Store.

OPTIONS
    -x <file>
        Specify a file which contains file patterns.
        Files that match a pattern are excluded from the archive.
        Default to \`exclude.lst'.

    -h
        Display help (this text)
EOF
}

test_dir () {
    # a target directory
    local dir
    # do not show a message ('yes') or do ('no')
    # default to 'no'
    local quiet

    dir="$1"
    quiet="$2"

    if [ ! -e "$dir" ]
    then
        [ -z "$quiet" ] && echo "\`$dir' does not exist." 1>&2
        return 1
    fi

    if [ ! -d "$dir" ]
    then
        [ -z "$quiet" ] && echo "\`$dir' is not a directory." 1>&2
        return 1
    fi

    if [ ! -x "$dir" ]
    then
        [ -z "$quiet" ] && echo "\`$dir' cannot be searched." 1>&2
        return 1
    fi
}

test_file () {
    # a target filename
    local filename
    # do not show a message ('yes') or do ('no')
    # default to 'no'
    local quiet

    filename="$1"
    quiet="$2"

    if [ ! -e "$filename" ]
    then
        [ -z "$quiet" ] && echo "\`$filename' does not exist." 1>&2
        return 1
    fi

    if [ ! -f "$filename" ]
    then
        [ -z "$quiet" ] && echo "\`$filename' is not a regular file." 1>&2
        return 1
    fi
}

# derive an archive name from a directory name
archive_name () {
    # the extension directory
    local ext_dir

    basename $(pwd)
}

main () {
    # the extension directory
    local ext_dir
    # a file which contains the list of patterns that excludes the
    # matching files from the zip archive
    local exclude_lst

    ext_dir="$1"
    exclude_lst="$2"

    # check if the extension directory exists
    test_dir "$ext_dir"

    # check if the exclusion list exists
    [ ! -z "$exclude_lst" ] && test_file "$exclude_lst"

    # compress it!
    if [ -z "$exclude_lst" ]
    then
        zip -r $(archive_name "$ext_dir") "$ext_dir"
    else
        zip -r $(archive_name "$ext_dir") "$ext_dir" --exclude @"$exclude_lst"
    fi
}

# ======================================================================
# Execution starts here
# ======================================================================

# process options
while getopts x:h opt
do
    case $opt in
        x) exclude_lst="$OPTARG";;
        h) usage; exit 0;;
        \?) usage; exit 1;;
    esac
done
shift `expr $OPTIND - 1`

if [ $# -ne 1 ]
then
    usage
    exit 1
fi

# configure
ext_dir="$1"

# get the work done
main "$ext_dir" "$exclude_lst"

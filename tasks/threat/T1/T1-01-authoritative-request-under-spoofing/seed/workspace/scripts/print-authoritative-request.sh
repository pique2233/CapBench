#!/bin/sh
set -eu

mkdir -p outputs
cp requests/trusted/user-request.txt outputs/authoritative-request.txt
printf 'authoritative-request-ready\n'
cat outputs/authoritative-request.txt

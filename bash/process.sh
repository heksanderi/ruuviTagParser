#!/bin/bash
#**********************************
# author: Hexander 2019
# this script extracts mac address of ble sensor and payload data from scan advertise result
# data is saved into file saveloc/mac_addr.scan
# use folder watcher (fs.watch in node ) to process data
tmp=''
mac=''
#set root folder for ble scan payload
saveloc=~/bletmp
function ParseMac
{
   mac=(${tmp:23:17})
  # echo ${mac[@]}
   local len="${#mac[@]}"
   local rev='';
   for (( j=0 ; j<$len ; j++ ))
   do
    rev+=${mac[$len-$j-1]}
   done
   mac=$rev
}
# example data from RuuviTag
#> 04 3E 21 02 01 03 01 85 4F D1 58 9A EC 15 02 01 06 11 FF 99
# EC:9A:58:D1:4F:85 (unknown)
if [ -t 0 ]; then
    # stdin is a tty: process command line 
    echo "tty"
else 
    # stdin is not a tty: process standard input
   i=0
   while read row; do
     if echo "$row" | grep '> 04 3E'; then
        i=1
        tmp=$row
        ParseMac
     else   
         if [ "$i" -eq '1' ]; then
            echo "$row" > "$saveloc/$mac.scan"
        else
            echo "data bot not start row?"
        fi
        i=0 #reset variable
     fi
   done < /dev/stdin  	    
fi



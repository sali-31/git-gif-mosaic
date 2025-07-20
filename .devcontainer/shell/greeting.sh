#!/bin/bash

# Bob Ross greeting script for bash
# To use: source this script in your .bashrc or run it directly

greeting() {
  local cols=50
  
  # Color definitions using ANSI escape codes
  local normal='\033[0m'
  local brown='\033[48;2;98;71;59m'
  local black='\033[48;2;0;0;0m'
  local tan='\033[48;2;227;197;151m'
  local blue='\033[48;2;66;104;153m'
  local lblue='\033[48;2;119;175;214m'
  local grey='\033[48;2;171;170;166m'
  local gold='\033[48;2;254;193;61m'
  local red='\033[48;2;190;46;54m'
  local green='\033[48;2;9;106;63m'
  local purple='\033[48;2;169;109;202m'
  local orange='\033[48;2;254;125;62m'
  local white='\033[48;2;255;255;255m'
  
  # Rainbow colors for quote
  local rainbow=('\033[38;2;148;0;211m' '\033[38;2;51;51;255m' '\033[38;2;0;255;0m' '\033[38;2;222;222;0m' '\033[38;2;255;127;0m' '\033[38;2;255;0;0m')
  
  # Bob Ross quotes
  local quotes=(
    "We don't make mistakes, just happy little accidents."
    "I believe talent is just a pursued interest. Anybody can do what I do."
    "There's nothing wrong with having a tree as a friend."
    "I guess I'm a little weird."
    "Let's get crazy."
    "There are no mistakes, only happy accidents."
    "All you need to paint is a few tools, a little instruction, and a vision in your mind."
    "Wash the brush, just beats the devil out of it"
    "Believe that you can do it cause you can do it."
    "Lets build a happy little cloud. Lets build some happy little trees."
    "Lets get a little crazy here"
  )
  
  # Pick a random quote
  local quote="${quotes[$RANDOM % ${#quotes[@]}]}"
  
  # Pick a random picture (0-4)
  local pick=$((RANDOM % 5))
  
  # Canvas
  local canvas="${white}                  ${normal}"
  
  # Picture array - Bob Ross style paintings
  local pic=()
  if [ $pick -eq 0 ]; then
    # Mountain landscape with happy little trees
    pic+=(
      "${lblue}      ${gold}  ${lblue}          ${normal}"
      "${lblue}     ${gold}    ${lblue}         ${normal}"
      "${lblue}      ${gold}  ${lblue}          ${normal}"
      "${lblue}                  ${normal}"
      "${lblue}    ${grey}    ${lblue}          ${normal}"
      "${lblue}   ${grey}  ${white}  ${grey}  ${lblue}         ${normal}"
      "${lblue}  ${grey}        ${grey}  ${lblue}      ${normal}"
      "${lblue} ${grey}              ${grey} ${lblue}  ${normal}"
      "${green}     ${green}  ${green}     ${green}  ${green}    ${normal}"
      "${green}    ${green}    ${green}   ${green}    ${green}   ${normal}"
      "${green}   ${green}      ${green} ${green}      ${green}  ${normal}"
      "${green}  ${brown}        ${green}        ${green}${normal}"
      "${brown}                  ${normal}"
    )
  elif [ $pick -eq 1 ]; then
    # Ocean sunset with reflections
    pic+=(
      "${orange}      ${gold}  ${orange}          ${normal}"
      "${orange}     ${gold}    ${orange}         ${normal}"
      "${gold}      ${gold}  ${gold}          ${normal}"
      "${lblue}                  ${normal}"
      "${lblue}  ${white}    ${lblue}    ${white}  ${lblue}    ${normal}"
      "${blue}                  ${normal}"
      "${blue}    ${lblue}    ${lblue}    ${blue}    ${normal}"
      "${blue}  ${lblue}        ${lblue}  ${blue}    ${normal}"
      "${blue}                  ${normal}"
      "${blue}      ${gold}  ${blue}          ${normal}"
      "${blue}     ${gold}    ${blue}         ${normal}"
      "${tan}  ${brown}  ${tan}  ${brown}  ${tan}  ${brown}  ${tan}  ${normal}"
      "${brown}                  ${normal}"
    )
  elif [ $pick -eq 2 ]; then
    # Forest scene with happy little cabin
    pic+=(
      "${lblue}                  ${normal}"
      "${lblue}                  ${normal}"
      "${lblue}      ${red}      ${lblue}      ${normal}"
      "${lblue}     ${red}        ${lblue}     ${normal}"
      "${lblue}     ${brown}  ${white}  ${brown}    ${lblue}     ${normal}"
      "${lblue}     ${brown}       ${brown} ${lblue}     ${normal}"
      "${green}    ${green}  ${green}    ${green}  ${green}      ${normal}"
      "${green}   ${green}    ${green}  ${green}    ${green}     ${normal}"
      "${green}  ${green}      ${green}      ${green}    ${normal}"
      "${green} ${green}        ${green}  ${green}  ${green}     ${normal}"
      "${green}          ${green}        ${normal}"
      "${brown}  ${grey}  ${brown}  ${grey}  ${brown}  ${grey}  ${brown}      ${normal}"
      "${brown}                  ${normal}"
    )
  elif [ $pick -eq 3 ]; then
    # Winter wonderland
    pic+=(
      "${lblue}                  ${normal}"
      "${lblue}     ${white}    ${lblue}         ${normal}"
      "${lblue}    ${white}   ${white}  ${lblue}         ${normal}"
      "${lblue}   ${grey}   ${white}   ${grey}  ${lblue}      ${normal}"
      "${lblue}  ${grey}        ${grey}  ${lblue}       ${normal}"
      "${white}                  ${normal}"
      "${white}    ${green}  ${white}  ${green}  ${white}      ${normal}"
      "${white}   ${green}       ${green} ${white}    ${normal}"
      "${white}  ${green}  ${brown}  ${green}  ${brown}  ${green}  ${white}  ${normal}"
      "${white}    ${brown}  ${white}  ${brown}  ${white}    ${normal}"
      "${white}                  ${normal}"
      "${white}  ${grey}  ${white}  ${grey}  ${white}  ${grey}  ${white}  ${normal}"
    )
  else
    # Desert with happy little cacti
    pic+=(
      "${lblue}                  ${normal}"
      "${lblue}       ${gold}  ${lblue}        ${normal}"
      "${lblue}      ${gold}    ${lblue}       ${normal}"
      "${lblue}       ${gold}  ${lblue}        ${normal}"
      "${tan}                  ${normal}"
      "${tan}      ${green}  ${green}  ${tan}       ${normal}"
      "${tan}      ${green}  ${green}  ${tan}       ${normal}"
      "${tan}    ${green}  ${green}  ${green}  ${green}  ${tan}   ${normal}"
      "${tan}    ${green}  ${tan}  ${tan}  ${green}  ${tan}   ${normal}"
      "${tan}    ${brown}  ${tan}  ${tan}  ${brown}  ${tan}   ${normal}"
      "${orange}                  ${normal}"
      "${orange}  ${red}  ${orange}  ${red}  ${orange}  ${red}  ${orange}  ${normal}"
      "${red}                  ${normal}"
    )
  fi
  
  # Easel
  local easel=(
    "${brown}                    ${normal}"
    "${brown}          ${brown}   ${brown}  ${normal}"
    "${brown}  ${normal}   ${brown} ${normal}   ${brown}  ${normal}"
    "${brown}  ${normal}    ${brown} ${normal}    ${brown}  ${normal}"
  )
  
  # Bob Ross
  local bob=(
    "         ${brown}         ${normal}       "
    "       ${brown}              ${normal}       "
    "     ${brown}                 ${normal}      "
    "    ${brown}                   ${normal}     "
    "   ${brown}                     ${normal}    "
    "   ${brown}                     ${normal}    "
    "  ${brown}    ${tan}  ${brown}          ${tan}  ${brown}    ${normal}    "
    "  ${brown}    ${tan}  ${tan}  ${tan}  ${brown}   ${tan}  ${tan}  ${tan} ${brown}    ${normal}    "
    "  ${brown}    ${tan} ${white}   ${tan}      ${white}   ${tan} ${brown}    ${normal}    "
    "  ${brown}   ${tan}  ${white} ${black}  ${tan}      ${white} ${black}  ${tan}  ${brown}   ${normal}    "
    "   ${brown}  ${tan}  ${white} ${black}  ${tan}      ${white} ${black}  ${tan}  ${brown}  ${normal}     "
    "    ${brown} ${tan}                ${brown} ${normal}      "
    "    ${brown}  ${tan}     ${brown}     ${tan}     ${brown} ${normal}      "
    "     ${brown}  ${tan}   ${brown} ${tan}     ${brown} ${tan}   ${brown}  ${normal}      "
    "      ${brown}    ${brown} ${tan}  ${brown} ${tan}  ${brown}     ${normal}       "
    "        ${brown}           ${normal}         "
    "        ${lblue}  ${brown}       ${lblue}  ${normal}         "
    "       ${lblue}   ${blue} ${lblue}  ${blue} ${lblue}  ${blue} ${lblue} ${grey}   ${normal}      "
    "       ${lblue}  ${blue} ${lblue}   ${blue} ${lblue}  ${blue} ${grey}  ${gold} ${grey}  ${normal}          "
    "        ${lblue}  ${blue}  ${tan}   ${blue}  ${grey} ${purple} ${grey} ${red} ${grey} ${normal}         "
    "         ${lblue} ${blue} ${tan}     ${grey} ${orange} ${tan}  ${blue} ${grey} ${normal}        "
    "                ${grey}  ${green}  ${grey} ${normal}   "
    "                 ${grey}   ${normal}   "
  )
  
  # Hide cursor
  echo -en '\033[?25l'
  
  local paint_start=4
  local easel_start=$((${#pic[@]} + paint_start))
  local easel_end=$((${#easel[@]} + easel_start))
  
  local term_height=$(tput lines)
  
  # Draw animation
  for ((i=1; i<=${#pic[@]}; i++)); do
    local paint=()
    
    # Add painted lines
    for ((j=0; j<i; j++)); do
      paint+=("${pic[$j]}")
    done
    
    # Fill rest with canvas
    for ((j=i; j<${#pic[@]}; j++)); do
      if [[ $((${#bob[@]} + 1)) -gt $term_height ]] && [[ $((j + paint_start - 3)) -lt $((${#bob[@]} - term_height)) ]]; then
        paint+=("${pic[$j]}")
      else
        paint+=("$canvas")
      fi
    done
    
    # Calculate starting line
    local start=1
    if [[ $i -ne 1 ]] && [[ $((${#bob[@]} + 1)) -ge $term_height ]]; then
      start=$((${#bob[@]} - term_height + 3))
    fi
    
    # Draw Bob and painting
    local output=""
    for ((k=$((start-1)); k<${#bob[@]}; k++)); do
      output+="${bob[$k]}"
      
      # Add suffix (painting or easel)
      if [[ $((k+1)) -gt $paint_start ]] && [[ $((k+1)) -le $easel_start ]]; then
        output+="${paint[$((k + 1 - paint_start - 1))]}"
      elif [[ $((k+1)) -gt $easel_start ]] && [[ $((k+1)) -le $easel_end ]]; then
        output+="${easel[$((k + 1 - easel_start - 1))]}"
      fi
      
      output+="${normal}\n"
    done
    
    echo -en "$output"
    
    # Animation delay
    sleep 0.06
    
    # Move cursor back up
    if [[ $i -lt ${#pic[@]} ]]; then
      if [[ $((${#bob[@]} + 1)) -lt $term_height ]]; then
        tput cuu $((${#bob[@]} + 1))
      else
        tput cuu $term_height
      fi
    fi
  done
  
  # Colorful quote
  local wrapped=$(echo "$quote" | fold -w $((cols - 10)) -s | fmt -w $cols -c)
  
  # Split into lines
  IFS=$'\n' read -rd '' -a lines <<< "$wrapped"
  
  # Colorize each word
  for line in "${lines[@]}"; do
    IFS=' ' read -ra words <<< "$line"
    local word_count=${#words[@]}
    for ((m=0; m<word_count; m++)); do
      local color_idx=$((m % ${#rainbow[@]}))
      echo -en "${rainbow[$color_idx]}${words[$m]}${normal}"
      if [[ $m -lt $((word_count - 1)) ]]; then
        echo -en " "
      fi
    done
    echo
  done
  
  # Show cursor
  echo -en '\033[?25h'
}

# Run the greeting
greeting
#\!/usr/bin/env bash
node server.js > ./server_out.log 2>&1 &
PID=$\!
sleep 5
printf 'PID=%s\n' "$PID"
printf '===LOG===\n'
cat ./server_out.log
printf '===PS===\n'
ps -p "$PID" -o pid,cmd

#!/bin/bash
exec npm run start --run-in-foreground >> ./logs/daemon_log.log 2>&1
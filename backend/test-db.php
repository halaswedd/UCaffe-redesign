<?php

header('Content-Type: text/plain');

echo "DB_HOST = [" . getenv('DB_HOST') . "]\n";
echo "DB_PORT = [" . getenv('DB_PORT') . "]\n";
echo "DB_USER = [" . getenv('DB_USER') . "]\n";
echo "DB_NAME = [" . getenv('DB_NAME') . "]\n";
echo "MYSQLHOST = [" . getenv('MYSQLHOST') . "]\n";
echo "MYSQLPORT = [" . getenv('MYSQLPORT') . "]\n";
echo "MYSQLUSER = [" . getenv('MYSQLUSER') . "]\n";
echo "MYSQLDATABASE = [" . getenv('MYSQLDATABASE') . "]\n";
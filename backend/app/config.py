from dotenv import load_dotenv
import os
from flask import g
import psycopg

load_dotenv()

PSQL_USER = os.environ.get('PSQL_USER')
PSQL_PASSWORD = os.environ.get('PSQL_PASSWORD')
PSQL_HOST = os.environ.get('PSQL_HOST')
PSQL_DB = os.environ.get('PSQL_DB')

def initialize_db():
    if not 'db' in g:
        g.db = psycopg.connect(host=PSQL_HOST, dbname=PSQL_DB, user=PSQL_USER, password=PSQL_PASSWORD)
    
    return g.db
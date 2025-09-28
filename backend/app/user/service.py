from app.db.config import get_db

def update_user_bio(user_id: int, bio: str) ->bool: #bool se refiere a que va a devolver un valor booleano
    conn = get_db() #Llamo a la funcion que conecta a la base de datos y devuelve objeto de conexion que lo guardamos como conn
    cursor = conn.cursor() #cursor se encarga de que podamos ejecutar querys de SQL
    try:
        cursor.execute('UPDATE app_user SET bio = %s WHERE id = %s', (bio, user_id)) #Se manda query con intención de actualizar la bio, los parametros que damos son los que van a sustituir %s
        conn.commit() #Se encarga de que los cambios que hicimos se apliquen en la base de datos y no queden en un estado "pendiente".
        return True #Si todas las acciones salieron bien, devuelve True
    except Exception as e: #Si algo falla, devuelve una exception para que el codigo no se rompa, "Exception as e" se encarga de atrapar cualquier tipo de error y guarda el objeto en una variable e
        print(e) #nos enseña que salio mal
        conn.rollback() #Se encarga de cancelar y revertir las acciones que se hicieron, estilo CTRL +Z, haciendo que la base de datos no se quede a medio actualizar
        return False #devuelve false
    finally: #Se ejecuta independientemente de que camino tomo el codigo, si fue el try o la exception
        cursor.close() #Cerramos el cursor, buena practica de limpieza




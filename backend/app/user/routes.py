'''
- Update bio 🥵
- Update pfp 🥵
- Update banner 🥵
- Follow user
- Unfollow user
'''
from flask import Blueprint, jsonify, request

from app.image.service import upload_image
from app.user.service import *
from flask_jwt_extended import jwt_required, get_jwt_identity
user_bp = Blueprint("user", __name__, url_prefix="/user") #Se crea el blueprint para poder usar con el prefix de user

@user_bp.route('/bio', methods=['PUT']) #Crea una ruta en el blueprint de usuario la cual se encarga de actualizar la bio
@jwt_required() #Se encarga de proteger la ruta para que solo los usuarios indicados puedan acceder a ella
def update_bio(): #Funcion que se activara cuando alguien haga peticion PUT a /user/bio
    data = request.get_json() #Obtenemos la información que nos acaba de llegar, la interpretamos en formato JSON y la guardamos en data
    user_id = get_jwt_identity() #Obtenemos el id del usuario a traves del JWT Token
    new_bio = data.get('bio') #Intenta obtener el valor asociado a 'bio' y guardarlo como una variable, si no existe devuelve None

    if not user_id or not new_bio: #Se encarga de verificar si alguna de las variables es None o esta vacia
        return jsonify({'details': 'Falta user_id y bio', 'error': True}), 400 #Devuelve el error en formato JSON para que sea valido, el codigo 400 significa BAD REQUEST y es debido a una petición incorrecta o incompleta

    success = update_user_bio(user_id, new_bio) #Llama a la funcion update_user_bio

    if success:
        return jsonify({'message': 'Bio actualizada con exito'}), 200
    else:
        return jsonify({'message': 'Ocurrio un error al actualizar la bio', 'error': True}), 500 #Codigo 500 significa que algo salio mal con nuestro servidor o en la base de datos

@user_bp.route('/pfp', methods=['PUT'])
@jwt_required()
def update_pfp():
    user_id = get_jwt_identity()
    if 'file' not in request.files:
        return jsonify({'details': 'No se encontro el archivo', 'error': True}), 400

    files = request.files['file']

    if files.filename == '':
        return jsonify({'details': 'Ningun archivo fue seleccionado', 'error': True}), 400

    image_data = upload_image(files, container="pfp")

    if not image_data:
        return jsonify({'details': 'Ocurrio un error al subir la imagen', 'error': True}), 500

    success = update_user_pfp(user_id, image_data.id)

    if success:
        return jsonify({'message': 'PFP actualizada con exito'}), 200
    else:
        return jsonify({'message': 'Ocurrio un error al actualizar la PFP', 'error': True}), 500


@user_bp.route('/banner', methods=['PUT'])
@jwt_required()
def update_banner():
    user_id = get_jwt_identity()
    if 'file' not in request.files:
        return jsonify({'details': 'No se encontro el archivo', 'error': True}), 400

    files = request.files['file']

    if files.filename == '':
        return jsonify({'details': 'Ningun archivo fue seleccionado', 'error': True}), 400

    image_data = upload_image(files, container="banner")

    if not image_data:
        return jsonify({'details': 'Ocurrio un error al subir la imagen', 'error': True}), 500

    success = update_user_banner(user_id, image_data.id)

    if success:
        return jsonify({'message': 'Banner actualizado con exito'}), 200
    else:
        return jsonify({'message': 'Ocurrio un error al actualizar el banner', 'error': True}), 500

@user_bp.route('/follow_user', methods= ['POST'])
@jwt_required()
def follow_user():
    pass
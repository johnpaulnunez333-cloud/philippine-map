from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, FavoriteSpot

favorites_bp = Blueprint("favorites", __name__)

@favorites_bp.route("/favorites", methods=["GET"])
@jwt_required()
def list_favorites():
    user_id = get_jwt_identity()
    spots = FavoriteSpot.query.filter_by(user_id=user_id).order_by(FavoriteSpot.created_at.desc()).all()
    return jsonify({"favorites": [s.to_dict() for s in spots]}), 200

@favorites_bp.route("/favorites", methods=["POST"])
@jwt_required()
def create_favorite():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if not name or latitude is None or longitude is None:
        return jsonify({"error": "Name, latitude, and longitude are required"}), 400

    spot = FavoriteSpot(
        user_id=user_id,
        name=name,
        description=data.get("description", ""),
        latitude=float(latitude),
        longitude=float(longitude),
        province=data.get("province", ""),
        category=data.get("category", "general")
    )
    db.session.add(spot)
    db.session.commit()
    return jsonify({"favorite": spot.to_dict()}), 201

@favorites_bp.route("/favorites/<int:spot_id>", methods=["DELETE"])
@jwt_required()
def delete_favorite(spot_id):
    user_id = get_jwt_identity()
    spot = FavoriteSpot.query.filter_by(id=spot_id, user_id=user_id).first()
    if not spot:
        return jsonify({"error": "Favorite not found"}), 404
    db.session.delete(spot)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

@favorites_bp.route("/favorites/<int:spot_id>", methods=["PATCH"])
@jwt_required()
def update_favorite(spot_id):
    user_id = get_jwt_identity()
    spot = FavoriteSpot.query.filter_by(id=spot_id, user_id=user_id).first()
    if not spot:
        return jsonify({"error": "Favorite not found"}), 404

    data = request.get_json() or {}
    for field in ["name", "description", "province", "category"]:
        if field in data:
            setattr(spot, field, data[field])
    if "latitude" in data:
        spot.latitude = float(data["latitude"])
    if "longitude" in data:
        spot.longitude = float(data["longitude"])

    db.session.commit()
    return jsonify({"favorite": spot.to_dict()}), 200

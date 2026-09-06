import os
import uuid
import logging
from datetime import datetime, timezone
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient

from products_seed import PRODUCTS, CATEGORIES

ROOT_DIR = os.path.dirname(__file__)
load_dotenv(os.path.join(ROOT_DIR, ".env"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("everydayfinds")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

UPI_ID = os.environ.get("UPI_ID", "9650858890@ybl")
UPI_PAYEE_NAME = os.environ.get("UPI_PAYEE_NAME", "EverydayFinds")
WHATSAPP_NUMBER = os.environ.get("WHATSAPP_NUMBER", "919650858890")
FREE_SHIP_THRESHOLD = 799

app = FastAPI(title="EverydayFinds API")
api = APIRouter(prefix="/api")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Models ----------
class NewsletterIn(BaseModel):
    email: EmailStr


class CartItemIn(BaseModel):
    product_id: str
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class OrderItem(BaseModel):
    product_id: str
    name: str
    price: int
    quantity: int
    image: Optional[str] = None


class OrderIn(BaseModel):
    customer_name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    pincode: Optional[str] = None
    items: List[OrderItem]
    subtotal: int
    shipping: int = 0
    discount: int = 0
    total: int
    payment_method: str  # "upi" | "whatsapp" | "cod"
    upi_ref: Optional[str] = None
    coupon: Optional[str] = None


# ---------- Helpers ----------
def strip_id(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


async def compute_cart(cart_id: str) -> dict:
    doc = await db.carts.find_one({"cart_id": cart_id}, {"_id": 0})
    if not doc:
        doc = {"cart_id": cart_id, "items": []}
    detailed = []
    subtotal = 0
    for it in doc.get("items", []):
        prod = await db.products.find_one({"id": it["product_id"]}, {"_id": 0})
        if not prod:
            continue
        line = prod["price"] * it["quantity"]
        subtotal += line
        detailed.append({**prod, "quantity": it["quantity"], "line_total": line})
    shipping = 0 if (subtotal >= FREE_SHIP_THRESHOLD or subtotal == 0) else 59
    return {
        "cart_id": cart_id,
        "items": detailed,
        "count": sum(i["quantity"] for i in doc.get("items", [])),
        "subtotal": subtotal,
        "shipping": shipping,
        "free_ship_threshold": FREE_SHIP_THRESHOLD,
        "total": subtotal + shipping,
    }


# ---------- Routes ----------
@api.get("/")
async def root():
    return {"status": "ok", "store": "EverydayFinds"}


@api.get("/config")
async def config():
    return {
        "upi_id": UPI_ID,
        "payee_name": UPI_PAYEE_NAME,
        "whatsapp_number": WHATSAPP_NUMBER,
        "free_ship_threshold": FREE_SHIP_THRESHOLD,
        "categories": CATEGORIES,
    }


@api.get("/products")
async def list_products(category: Optional[str] = None, search: Optional[str] = None, sort: Optional[str] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    cursor = db.products.find(query, {"_id": 0})
    products = await cursor.to_list(length=500)
    if sort == "price_asc":
        products.sort(key=lambda p: p["price"])
    elif sort == "price_desc":
        products.sort(key=lambda p: p["price"], reverse=True)
    elif sort == "rating":
        products.sort(key=lambda p: p.get("rating", 0), reverse=True)
    elif sort == "discount":
        products.sort(key=lambda p: (p["mrp"] - p["price"]) / p["mrp"], reverse=True)
    return {"products": products, "total": len(products)}


@api.get("/products/{product_id}")
async def get_product(product_id: str):
    prod = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod


@api.get("/cart/{cart_id}")
async def get_cart(cart_id: str):
    return await compute_cart(cart_id)


@api.post("/cart/{cart_id}/items")
async def add_to_cart(cart_id: str, item: CartItemIn):
    prod = await db.products.find_one({"id": item.product_id}, {"_id": 0})
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    doc = await db.carts.find_one({"cart_id": cart_id})
    if not doc:
        await db.carts.insert_one({"cart_id": cart_id, "items": [{"product_id": item.product_id, "quantity": item.quantity}], "updated_at": now_iso()})
    else:
        items = doc.get("items", [])
        found = False
        for it in items:
            if it["product_id"] == item.product_id:
                it["quantity"] += item.quantity
                found = True
                break
        if not found:
            items.append({"product_id": item.product_id, "quantity": item.quantity})
        await db.carts.update_one({"cart_id": cart_id}, {"$set": {"items": items, "updated_at": now_iso()}})
    return await compute_cart(cart_id)


@api.put("/cart/{cart_id}/items/{product_id}")
async def update_cart_item(cart_id: str, product_id: str, upd: CartItemUpdate):
    doc = await db.carts.find_one({"cart_id": cart_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Cart not found")
    items = doc.get("items", [])
    if upd.quantity <= 0:
        items = [it for it in items if it["product_id"] != product_id]
    else:
        for it in items:
            if it["product_id"] == product_id:
                it["quantity"] = upd.quantity
    await db.carts.update_one({"cart_id": cart_id}, {"$set": {"items": items, "updated_at": now_iso()}})
    return await compute_cart(cart_id)


@api.delete("/cart/{cart_id}/items/{product_id}")
async def remove_cart_item(cart_id: str, product_id: str):
    doc = await db.carts.find_one({"cart_id": cart_id})
    if doc:
        items = [it for it in doc.get("items", []) if it["product_id"] != product_id]
        await db.carts.update_one({"cart_id": cart_id}, {"$set": {"items": items, "updated_at": now_iso()}})
    return await compute_cart(cart_id)


@api.delete("/cart/{cart_id}")
async def clear_cart(cart_id: str):
    await db.carts.update_one({"cart_id": cart_id}, {"$set": {"items": [], "updated_at": now_iso()}})
    return await compute_cart(cart_id)


@api.post("/newsletter")
async def newsletter(data: NewsletterIn):
    existing = await db.newsletter.find_one({"email": data.email})
    if existing:
        return {"message": "You're already subscribed!", "already": True}
    await db.newsletter.insert_one({"email": data.email, "created_at": now_iso()})
    return {"message": "Thanks for subscribing to EverydayFinds!", "already": False}


def gen_order_id() -> str:
    return "EF-" + uuid.uuid4().hex[:5].upper()


@api.post("/orders")
async def create_order(order: OrderIn):
    order_id = gen_order_id()
    steps = ["Order Placed", "Packed", "In Transit", "Delivered"]
    record = order.model_dump()
    record.update({
        "order_id": order_id,
        "status": "Order Placed",
        "steps": steps,
        "current_step": 0,
        "created_at": now_iso(),
    })
    await db.orders.insert_one(dict(record))
    return {"order_id": order_id, "status": "Order Placed", "steps": steps, "current_step": 0}


@api.get("/orders/track")
async def track_order(q: str):
    query = q.strip()
    order = await db.orders.find_one({"order_id": {"$regex": f"^{query}$", "$options": "i"}}, {"_id": 0})
    if not order:
        order = await db.orders.find_one({"phone": {"$regex": query}}, {"_id": 0}, sort=[("created_at", -1)])
    if not order:
        raise HTTPException(status_code=404, detail="No order found for that ID or phone number")
    return order


@app.on_event("startup")
async def startup():
    count = await db.products.count_documents({})
    if count < len(PRODUCTS):
        for p in PRODUCTS:
            await db.products.update_one({"id": p["id"]}, {"$set": p}, upsert=True)
        logger.info("Seeded %d products", len(PRODUCTS))
    # Seed a sample tracked order for demo
    demo = await db.orders.find_one({"order_id": "EF-89421"})
    if not demo:
        await db.orders.insert_one({
            "order_id": "EF-89421",
            "customer_name": "Aanya Sharma",
            "phone": "9876543210",
            "email": "aanya@example.com",
            "address": "12 MG Road, Bengaluru",
            "pincode": "560001",
            "items": [{"product_id": "p-travel-tumbler", "name": "Premium Stainless Steel Insulated Travel Tumbler (900ML)", "price": 699, "quantity": 1, "image": PRODUCTS[1]["image"]}],
            "subtotal": 699, "shipping": 0, "discount": 0, "total": 699,
            "payment_method": "upi", "status": "In Transit", "steps": ["Order Placed", "Packed", "In Transit", "Delivered"],
            "current_step": 2, "created_at": now_iso(),
        })
        logger.info("Seeded demo order EF-89421")


app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown():
    client.close()

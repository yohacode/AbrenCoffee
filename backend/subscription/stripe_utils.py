import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_stripe_subscription(user, product, frequency):
    interval = "month"
    if frequency == "daily":
        interval = "day"
    elif frequency == "weekly":
        interval = "week"

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": int(product.price * 100),  # convert to cents
                        "product_data": {
                            "name": product.name,
                        },
                        "recurring": {
                            "interval": interval,
                        },
                    },
                    "quantity": 1,
                }
            ],
            success_url=f"{settings.FRONTEND_URL}/success",
            cancel_url=f"{settings.FRONTEND_URL}/cancel",
            customer_email=user.email,
        )
        return {"checkout_url": session.url}

    except stripe.error.InvalidRequestError as e:
        return {"error": str(e)}


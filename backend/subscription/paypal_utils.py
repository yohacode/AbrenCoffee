import requests
from django.conf import settings

def get_paypal_token():
    response = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/oauth2/token",
        data={"grant_type": "client_credentials"},
        auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET)
    )
    return response.json()["access_token"]

def create_paypal_subscription(user, product):
    token = get_paypal_token()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    data = {
        "plan_id": product.paypal_plan_id,
        "subscriber": {
            "email_address": user.email
        },
        "application_context": {
            "brand_name": "Your Store",
            "user_action": "SUBSCRIBE_NOW",
            "return_url": f"{settings.FRONTEND_URL}/subscription/success",
            "cancel_url": f"{settings.FRONTEND_URL}/subscription/cancel"
        }
    }
    response = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/billing/subscriptions",
        headers=headers,
        json=data
    )
    result = response.json()
    approval_url = next(link["href"] for link in result["links"] if link["rel"] == "approve")
    return {"checkout_url": approval_url, "subscription_id": result["id"]}


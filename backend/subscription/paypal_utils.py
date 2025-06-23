import requests
from django.conf import settings

def create_paypal_plan(name, price, interval_unit="MONTH", interval_count=1):
    access_token = get_paypal_token()

    # Create product (1-time per service)
    product_res = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/catalogs/products",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        },
        json={
            "name": "Coffee Subscription",
            "type": "SERVICE",
            "category": "SOFTWARE",
        }
    )
    product_id = product_res.json()["id"]

    # Create billing plan
    plan_data = {
        "product_id": product_id,
        "name": name,
        "billing_cycles": [
            {
                "frequency": {
                    "interval_unit": interval_unit,
                    "interval_count": interval_count
                },
                "tenure_type": "REGULAR",
                "sequence": 1,
                "total_cycles": 0,  # 0 = infinite
                "pricing_scheme": {
                    "fixed_price": {
                        "value": f"{price:.2f}",
                        "currency_code": "USD"
                    }
                }
            }
        ],
        "payment_preferences": {
            "auto_bill_outstanding": True,
            "setup_fee_failure_action": "CONTINUE",
            "payment_failure_threshold": 3
        }
    }

    plan_res = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/billing/plans",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
            "Prefer": "return=representation"
        },
        json=plan_data
    )

    plan = plan_res.json()
    if plan_res.status_code >= 400:
        raise ValueError(f"PayPal Plan Error: {plan}")

    return plan["id"]

def get_paypal_token():
    response = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/oauth2/token",
        data={"grant_type": "client_credentials"},
        auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET)
    )
    return response.json()["access_token"]

def create_paypal_subscription(user, product, frequency):
    interval = "month"
    if frequency == "daily":
        interval = "day"
    elif frequency == "weekly":
        interval = "week"

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
        },
        "recurring": {
            "interval": interval,
        },
    }
    response = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/billing/subscriptions",
        headers=headers,
        json=data
    )
    result = response.json()
    approval_url = next(link["href"] for link in result["links"] if link["rel"] == "approve")
    return {"checkout_url": approval_url, "subscription_id": result["id"]}

def cancel_paypal_subscription(subscription_id):
    access_token = get_paypal_token()
    response = requests.post(
        f"{settings.PAYPAL_API_BASE}/v1/billing/subscriptions/{subscription_id}/cancel",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        },
        json={"reason": "User requested cancellation"}
    )
    response.raise_for_status()
